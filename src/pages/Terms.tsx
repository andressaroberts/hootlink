import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => {
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
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-muted-foreground mb-4">
            This is a test application. The following terms are for
            demonstration purposes only.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">
            1. Acceptance of terms
          </h2>
          <p>
            By accessing and using this test application, you acknowledge that
            this is a demonstration project and agree to these terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">
            2. Test environment
          </h2>
          <p>
            This application requires specific configuration to function
            properly:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>You must provide your Supabase project URL and API key</li>
            <li>
              Authentication is required - you need to create and use a user
              account through Supabase Authentication
            </li>
            <li>
              The application is provided as-is for testing and demonstration
              purposes
            </li>
            <li>
              No guarantees are made regarding functionality or availability
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">3. Data usage</h2>
          <p>Data management and storage information:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>All data is stored in your Supabase project's database</li>
            <li>
              You are responsible for managing and securing your Supabase data
            </li>
            <li>
              This application does not store any data locally - everything is
              managed through your Supabase instance
            </li>
            <li>
              Please do not enter sensitive or personal information as this is a
              test environment
            </li>
            <li>
              You can manage and delete your data directly through your Supabase
              dashboard
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Disclaimer</h2>
          <p>
            This is a test application and should not be used for production
            purposes. The developers make no warranties about the application's
            functionality or security.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">
            5. Changes to terms
          </h2>
          <p>
            These terms may be modified at any time as this is a test
            environment. Continued use of the application constitutes acceptance
            of any changes.
          </p>
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

export default Terms;
