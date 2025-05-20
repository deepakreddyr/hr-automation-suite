
import { useEffect, useState } from "react";
import { Mail, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  matchScore: number;
}

interface ShortlistedCandidatesProps {
  candidates?: Candidate[];
}

const fetchShortlistedCandidates = async () => {
  try {
    const response = await fetch("http://localhost:5000/shortlisted", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shortlisted candidates");
    }

    const data = await response.json();
    return data.candidates.map((candidate: any, index: number) => ({
      id: candidate.id || String(index + 1),
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      experience: candidate.experience || "Not specified",
      matchScore: candidate.match_score || candidate.matchScore,
    }));
  } catch (error) {
    console.error("Error fetching shortlisted candidates:", error);
    throw error;
  }
};

const ShortlistedCandidates = ({ candidates = [] }: ShortlistedCandidatesProps) => {
  const { toast } = useToast();
  const [displayCandidates, setDisplayCandidates] = useState<Candidate[]>([]);
  
  // Demo data as fallback
  const demoData: Candidate[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 123-4567",
      experience: "5 years",
      matchScore: 92,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@example.com",
      phone: "+1 (555) 234-5678",
      experience: "3 years",
      matchScore: 88,
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      email: "emma.r@example.com",
      phone: "+1 (555) 345-6789",
      experience: "4 years",
      matchScore: 76,
    },
  ];

  // Use React Query to fetch data
  const { data: apiCandidates, isLoading, error } = useQuery({
    queryKey: ["shortlistedCandidates"],
    queryFn: fetchShortlistedCandidates,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Prioritize passed candidates, then API data, then demo data
    if (candidates.length > 0) {
      setDisplayCandidates(candidates);
    } else if (apiCandidates && apiCandidates.length > 0) {
      setDisplayCandidates(apiCandidates);
    } else {
      setDisplayCandidates(demoData);
    }
  }, [candidates, apiCandidates]);

  // Show loading toast when fetching data
  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Loading candidates",
        description: "Fetching shortlisted candidates from the server...",
      });
    }
    
    if (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Failed to fetch candidates",
        description: "Using demo data instead. Please check your server connection.",
        variant: "destructive",
      });
    }
  }, [isLoading, error, toast]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 px-2 py-1 rounded-md";
    if (score >= 80) return "text-teal-600 bg-teal-50 px-2 py-1 rounded-md";
    return "text-amber-600 bg-amber-50 px-2 py-1 rounded-md";
  };

  const handleCallSelected = () => {
    toast({
      title: "Calling candidates",
      description: "Initiating calls to selected candidates...",
    });
    // Here you would implement the actual call functionality
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Shortlisted Candidates</h2>
        <p className="text-muted-foreground">
          {displayCandidates.length} candidates have been shortlisted based on your criteria.
        </p>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-4 border-hr-600 border-t-transparent rounded-full mb-2"></div>
                    <p className="text-muted-foreground">Loading candidates...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : displayCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No candidates found</p>
                </TableCell>
              </TableRow>
            ) : (
              displayCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.phone}</TableCell>
                  <TableCell>{candidate.experience}</TableCell>
                  <TableCell>
                    <span className={getScoreColor(candidate.matchScore)}>
                      {candidate.matchScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" title="Call candidate">
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Email candidate">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline">Back</Button>
        <Button 
          className="bg-hr-600 hover:bg-hr-700"
          onClick={handleCallSelected}
        >
          Call Selected Candidates
        </Button>
      </div>
    </div>
  );
};

export default ShortlistedCandidates;
