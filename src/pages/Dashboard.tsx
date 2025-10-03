import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Activity, Pill, MessageSquare, FileText } from "lucide-react";
import { HealthTimeline } from "@/components/dashboard/HealthTimeline";
import { RecordsUpload } from "@/components/dashboard/RecordsUpload";
import { MedicationTracker } from "@/components/dashboard/MedicationTracker";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { ProfileDropdown } from "@/components/dashboard/ProfileDropdown";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HealthUnify
            </h1>
          </div>
          <ProfileDropdown user={user} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Your unified health dashboard - all your medical records in one place
          </p>
        </div>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="timeline">
              <FileText className="h-4 w-4 mr-2" />
              Health Timeline
            </TabsTrigger>
            <TabsTrigger value="records">
              <Upload className="h-4 w-4 mr-2" />
              Records
            </TabsTrigger>
            <TabsTrigger value="medications">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="assistant">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          {/* Health Timeline */}
          <TabsContent value="timeline" className="space-y-4">
            <HealthTimeline />
          </TabsContent>

          {/* Health Records */}
          <TabsContent value="records" className="space-y-4">
            <RecordsUpload />
          </TabsContent>

          {/* Medications */}
          <TabsContent value="medications" className="space-y-4">
            <MedicationTracker />
          </TabsContent>

          {/* AI Assistant */}
          <TabsContent value="assistant" className="space-y-4">
            <AIHealthAssistant />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
