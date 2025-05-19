
const API_URL = "http://localhost:5000";

export const api = {
  login: async (email: string, password: string) => {
    // In a real app, this would call the Flask login endpoint
    // For demo, we're using a mock implementation
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  },
  
  processResumes: async (sheetUrl: string) => {
    try {
      const response = await fetch(`${API_URL}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sheet_url: sheetUrl }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to process sheet");
      }
      
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
