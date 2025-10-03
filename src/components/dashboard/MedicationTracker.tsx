import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, Clock, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  instructions: string | null;
  start_date: string;
  end_date: string | null;
}

export const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    if (!medicationName || !dosage || !frequency || !startDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("medications").insert({
        user_id: user.id,
        medication_name: medicationName,
        dosage,
        frequency,
        instructions: instructions || null,
        start_date: startDate,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Medication added successfully",
      });

      setOpen(false);
      setMedicationName("");
      setDosage("");
      setFrequency("");
      setInstructions("");
      setStartDate("");
      fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("medications").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Medication removed successfully",
      });
      fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Pill className="h-8 w-8 animate-pulse text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Medication Tracker</CardTitle>
            <CardDescription>Manage your prescriptions and medications</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="success">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>Enter the details of your medication</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="med-name">Medication Name *</Label>
                  <Input
                    id="med-name"
                    placeholder="e.g., Aspirin"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Twice daily"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="e.g., Take with food"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddMedication} className="w-full">
                  Add Medication
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No medications added yet</p>
            <p className="text-sm">Click "Add Medication" to track your prescriptions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Pill className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold mb-1">{med.medication_name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{med.dosage}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{med.frequency}</span>
                  </div>
                  {med.instructions && (
                    <p className="text-xs text-muted-foreground mt-2">{med.instructions}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(med.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
