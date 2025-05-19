
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 animate-gradient relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 bg-hr-300/10 w-96 h-96 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 bg-hr-400/10 w-96 h-96 rounded-full blur-3xl"></div>
      </div>
      
      <div className="mb-8 relative animate-fade-in">
        <h1 className="text-4xl font-bold text-hr-800 text-center">
          HR Automation SaaS
        </h1>
        <p className="text-hr-600 text-center mt-2">
          Streamlining your recruitment process
        </p>
      </div>

      <div className="w-full max-w-md px-4 relative z-10 animate-fade-in">
        <LoginForm onSuccess={() => navigate("/dashboard")} />
      </div>

      <footer className="mt-8 text-center text-sm text-hr-500 relative z-10 animate-fade-in">
        &copy; {new Date().getFullYear()} HR Automation SaaS. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
