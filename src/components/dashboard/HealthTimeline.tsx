// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface HealthRecord {
  id: string;
  record_type: string;
  title: string;
  description: string | null;
  record_date: string;
  created_at: string;
}

export const HealthTimeline = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // @ts-ignore - Types will regenerate after migration
      const { data, error } = await supabase
        .from("health_records")
        .select("*")
        .eq("user_id", user.id)
        .order("record_date", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast({
        title: "Error",
        description: "Failed to load health timeline",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Activity className="h-8 w-8 animate-pulse text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Health Timeline</CardTitle>
          <CardDescription>
            A chronological view of all your health records and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No health records yet</p>
            <p className="text-sm mb-4">Upload your first medical record to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Timeline</CardTitle>
        <CardDescription>
          {records.length} {records.length === 1 ? "record" : "records"} in your health history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold mb-1">{record.title}</h4>
                {record.description && (
                  <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(record.record_date), "MMM d, yyyy")}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {record.record_type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
