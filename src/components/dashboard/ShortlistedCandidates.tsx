
import { Mail, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const ShortlistedCandidates = ({ candidates = [] }: ShortlistedCandidatesProps) => {
  // Demo data if no candidates are provided
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

  const displayCandidates = candidates.length > 0 ? candidates : demoData;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 px-2 py-1 rounded-md";
    if (score >= 80) return "text-teal-600 bg-teal-50 px-2 py-1 rounded-md";
    return "text-amber-600 bg-amber-50 px-2 py-1 rounded-md";
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
            {displayCandidates.map((candidate) => (
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
                    <Button variant="outline" size="icon">
                      <PhoneCall className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline">Back</Button>
        <Button className="bg-hr-600 hover:bg-hr-700">Call Selected Candidates</Button>
      </div>
    </div>
  );
};

export default ShortlistedCandidates;
