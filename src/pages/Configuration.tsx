import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const About = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const sqlScript = `-- Create the necessary tables for the application

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS links_user_id_idx ON public.links(user_id);
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON public.categories(user_id);

-- Set up Row Level Security policies
CREATE POLICY "Users can view their own links"
    ON public.links FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
    ON public.links FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
    ON public.links FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
    ON public.links FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      toast({
        title: "Success",
        description: "SQL script copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy SQL script",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <div className="mr-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-calm" />
              <Link to="/" className="font-bold text-xl">
                Hootlink
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-6">Configuration</h1>
        <div className="prose max-w-none">
          <p className="text-muted-foreground mb-4">
            This is a test application. Follow the instructions below to set up
            your Supabase project.
          </p>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              1. Create a Supabase project
            </h2>
            <p className="mb-4">First, create a new project on Supabase:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Go to{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://supabase.com
                </a>
              </li>
              <li>Sign up or log in to your account</li>
              <li>Click "New Project"</li>
              <li>Choose a name and password for your database</li>
              <li>Select a region close to your users</li>
              <li>Click "Create new project"</li>
            </ol>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Get your project credentials
            </h2>
            <p className="mb-4">After creating your project, you'll need:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Project URL (found in Project Settings &gt; Data API)</li>
              <li>API Key (found in Project Settings &gt; DataAPI)</li>
            </ul>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. Create database tables
            </h2>
            <p className="mb-4">
              To create the required tables, follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Go to your Supabase project dashboard</li>
              <li>Click on "SQL Editor" in the left sidebar</li>
              <li>Click "New Query" to create a new SQL script</li>
              <li>Copy and paste the following SQL script into the editor</li>
              <li>Click "Run" to execute the script</li>
            </ol>
            <p className="text-sm text-muted-foreground mb-4">
              Note: Make sure you're in the correct database before running the
              script.
            </p>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mt-2 font-mono text-sm">
                <code className="block whitespace-pre">
                  {`-- Create the necessary tables for the application

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS links_user_id_idx ON public.links(user_id);
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON public.categories(user_id);

-- Set up Row Level Security policies
CREATE POLICY "Users can view their own links"
    ON public.links FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
    ON public.links FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
    ON public.links FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
    ON public.links FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);`}
                </code>
              </pre>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Configure authentication
            </h2>
            <p className="mb-4">In your Supabase project:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Go to Authentication &gt; Providers</li>
              <li>
                Enable the authentication methods you want to use (Email,
                Google, etc.)
              </li>
              <li>Configure the email templates if needed</li>
            </ol>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              5. Start using the application
            </h2>
            <p className="mb-4">
              After completing these steps, you can start using the application
              by:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Entering your Supabase project URL and API key in the
                application settings
              </li>
              <li>Creating a new user account</li>
              <li>Logging in with your credentials</li>
            </ol>
          </div>
        </div>
        <div className="mt-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
