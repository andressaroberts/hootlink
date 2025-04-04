import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { supabaseService } from "@/services/SupabaseService";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  // Check if Supabase is initialized
  useEffect(() => {
    const isInitialized = supabaseService.isInitialized();
    setSupabaseConfigured(isInitialized);

    if (!isInitialized) {
      toast({
        title: "Notice",
        description:
          "Supabase is not configured. Please log in first to set up your credentials.",
      });
    }
  }, [toast]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (!supabaseConfigured) {
      toast({
        title: "Error",
        description:
          "Supabase not configured. Please log in first to set up your credentials.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Call the SupabaseService to handle signup
      const success = await supabaseService.signup(email, password, name);
      if (success) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        navigate("/app"); // Redirect to the app dashboard
      } else {
        toast({
          title: "Error",
          description:
            "Failed to create account. Email might already be in use.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "An error occurred during signup",
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
              <Button id="login-from-signup" variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign up to start saving your links
            </p>
            {!supabaseConfigured && (
              <div className="mt-2 p-2 bg-amber-50 text-amber-800 rounded-md text-xs">
                Note: Supabase is not configured. You'll need to configure it
                first from the login page.
              </div>
            )}
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters
              </p>
            </div>
            <Button
              id="signup-submit"
              className="w-full"
              type="submit"
              disabled={isLoading || !supabaseConfigured}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            {!supabaseConfigured && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Configure supabase first
              </Button>
            )}
          </form>
          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </div>
      </main>
      <Footer pageContext={"signup"} />
    </div>
  );
};

export default Signup;
