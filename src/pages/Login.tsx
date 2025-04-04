import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Lock } from "lucide-react";
import { supabaseService } from "@/services/SupabaseService";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("supabase_api_key") || ""
  );
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem("supabase_api_url") || ""
  );
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if Supabase is initialized
  useEffect(() => {
    const isInitialized = supabaseService.isInitialized();
    setShowSupabaseConfig(!isInitialized);
  }, []);

  const handleSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey || !apiUrl) {
      toast({
        title: "Error",
        description: "Please provide both Supabase API key and URL",
        variant: "destructive",
      });
      return;
    }

    const success = supabaseService.storeCredentials(apiKey, apiUrl);

    if (success) {
      toast({
        title: "Success",
        description: "Supabase configured successfully",
      });
      setShowSupabaseConfig(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to configure Supabase",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!supabaseService.isInitialized()) {
      toast({
        title: "Error",
        description:
          "Supabase not configured. Please enter your API keys first.",
        variant: "destructive",
      });
      setShowSupabaseConfig(true);
      return;
    }

    setIsLoading(true);
    try {
      // Call the SupabaseService to handle login
      const success = await supabaseService.login(email, password);
      if (success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        // Get the attempted location from state or default to /app
        const from =
          (location.state as LocationState)?.from?.pathname || "/app";
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <div className="mr-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-calm" />
              <span className="font-bold text-xl">Hootlink</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button id="signup-from-login" variant="ghost">
                <Link to="/signup">Sign up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {showSupabaseConfig ? (
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <Lock className="h-6 w-6 mx-auto text-primary mb-2" />
              <h1 className="text-2xl font-bold">Configure Supabase</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your Supabase credentials to connect
              </p>
            </div>
            <form onSubmit={handleSupabaseConfig} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">Supabase URL</Label>
                <Input
                  id="supabase-url"
                  type="text"
                  placeholder="https://yourproject.supabase.co"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">Supabase API Key</Label>
                <Input
                  id="supabase-key"
                  type="password"
                  placeholder="Your secret API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use your anon key for development or service_role key for
                  production
                </p>
              </div>
              <Button id="config-submit" className="w-full" type="submit">
                Configure Supabase
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowSupabaseConfig(false)}
              >
                Skip for now
              </Button>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Login to Hootlink</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your credentials to access your account
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                id="login-submit"
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowSupabaseConfig(true)}
              >
                Configure Supabase
              </Button>
            </form>
            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer pageContext={"login"} />
    </div>
  );
};

export default Login;
