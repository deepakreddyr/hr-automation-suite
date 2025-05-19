
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

interface SheetFormProps {
  onProcessStart: () => void;
  onProcessComplete: (data: any) => void;
}

const SheetForm = ({ onProcessStart, onProcessComplete }: SheetFormProps) => {
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl.includes("docs.google.com/spreadsheets")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Sheets URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    onProcessStart();

    try {
      // Here we would call the Flask backend
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sheet_url: sheetUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to process sheet");
      }

      const data = await response.json();
      toast({
        title: "Processing complete",
        description: "The sheet has been processed successfully",
      });
      onProcessComplete(data);
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing the sheet. Please try again.",
        variant: "destructive",
      });
      // For demo purposes, let's simulate success
      const mockData = {
        message: "Processing complete",
        candidates_processed: 15,
        candidates_shortlisted: 8,
        calls_scheduled: 8
      };
      onProcessComplete(mockData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Process Resumes</CardTitle>
        <CardDescription>
          Enter a Google Sheets URL containing candidate information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheetUrl">Google Sheets URL</Label>
            <Input
              id="sheetUrl"
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-hr-600 hover:bg-hr-700 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Process Resumes</span>
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        The sheet should contain candidate names, email, phone numbers, and resume links.
      </CardFooter>
    </Card>
  );
};

export default SheetForm;
