import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("Starting health chat with", messages.length, "messages");

    // Convert messages to Gemini format
    const systemPrompt = `You are a helpful AI health assistant. You help patients understand their medical records, medications, and health history. 
            
Key responsibilities:
- Summarize medical history in simple, patient-friendly language
- Answer questions about lab results, prescriptions, and medical documents
- Remind patients about follow-up appointments and medication schedules
- Detect gaps in health records (missing vaccinations, duplicate tests)
- NEVER provide medical diagnosis or treatment advice
- Always recommend consulting with healthcare professionals for medical decisions
- Be empathetic, clear, and supportive

Keep answers concise and easy to understand.`;

    // Build Gemini contents array
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Prepend system prompt as first user message
    contents.unshift({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    contents.splice(1, 0, {
      role: "model",
      parts: [{ text: "I understand. I'm ready to assist with health-related questions while being empathetic and clear." }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform Gemini SSE to OpenAI-compatible format
    const stream = response.body;
    if (!stream) {
      throw new Error("No response stream");
    }

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  
                  if (text) {
                    // Convert to OpenAI format
                    const chunk = {
                      choices: [{
                        delta: { content: text },
                        index: 0
                      }]
                    };
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`)
                    );
                  }
                } catch (e) {
                  console.error("Error parsing Gemini response:", e);
                }
              }
            }
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(transformedStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Health chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
