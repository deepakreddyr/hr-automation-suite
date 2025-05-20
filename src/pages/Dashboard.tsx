
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SheetForm from "@/components/dashboard/SheetForm";
import ProcessingStats from "@/components/dashboard/ProcessingStats";
import ShortlistedCandidates from "@/components/dashboard/ShortlistedCandidates";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [stats, setStats] = useState({
    candidates_processed: 0,
    candidates_shortlisted: 0,
    calls_scheduled: 0,
  });

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const handleProcessStart = () => {
    setProcessing(true);
    setProcessingComplete(false);
  };

  const handleProcessComplete = (data: any) => {
    // In a real app, this would come from the API response
    setStats({
      candidates_processed: 15,
      candidates_shortlisted: 8,
      calls_scheduled: 8,
    });
    setProcessing(false);
    setProcessingComplete(true);
  };

  return (
    <div className="flex min-h-screen bg-muted/40 flex-col">
      <header className="sticky top-0 z-10 bg-white border-b flex items-center h-16 px-4 md:px-6 shadow-sm">
        <h1 className="text-lg font-semibold mr-auto text-hr-800">HR Automation SaaS</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </header>
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and automate your recruitment process
            </p>
          </div>
        </div>
        <Tabs defaultValue="process" className="space-y-4">
          <TabsList>
            <TabsTrigger value="process">Process Resumes</TabsTrigger>
            <TabsTrigger value="results" disabled={!processingComplete}>Results</TabsTrigger>
          </TabsList>
          <TabsContent value="process" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SheetForm 
                onProcessStart={handleProcessStart}
                onProcessComplete={handleProcessComplete}
              />
              <Card className="col-span-1 md:col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Processing Status</CardTitle>
                  <CardDescription>
                    Real-time status of your resume processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {processing ? (
                    <div className="flex flex-col items-center justify-center h-40">
                      <div className="flex items-center space-x-4">
                        <div className="animate-spin h-8 w-8 border-4 border-hr-600 border-t-transparent rounded-full"></div>
                        <div className="text-hr-700 font-medium">Processing resumes...</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
                        We're analyzing candidate resumes, checking skill matches, and preparing for automated calls.
                        This may take a few minutes.
                      </p>
                    </div>
                  ) : processingComplete ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-4">
                      <div className="rounded-full bg-green-100 p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">Processing Complete</h3>
                        <p className="text-sm text-muted-foreground">Click on the Results tab to view detailed information</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <p className="text-muted-foreground text-center">
                        Enter a Google Sheets URL in the form and click Process Resumes to begin.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="results" className="space-y-6">
            <ProcessingStats stats={stats} />
            <ShortlistedCandidates />
            <Card>
              <CardHeader>
                <CardTitle>Process Summary</CardTitle>
                <CardDescription>
                  Overview of the resume processing results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-hr-700">Processing completed successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Your candidate data has been processed and shortlisted candidates have been
                      added to your shortlist sheet.
                    </p>
                  </div>
                  
                  <div className="rounded-md bg-hr-50 p-4 border border-hr-200">
                    <h4 className="font-medium text-hr-700 mb-2">Next Steps</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Automated calls have been scheduled for shortlisted candidates</li>
                      <li>Check your shortlist sheet for candidate details and scores</li>
                      <li>Review call recordings when they become available</li>
                    </ul>
                  </div>
                  
                  <Button className="bg-hr-600 hover:bg-hr-700 transition-colors mt-4">
                    Download Summary Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
