import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => {
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
        <h1 className="text-3xl font-bold mb-6">Privacy policy</h1>
        <div className="prose max-w-none">
          <p className="text-muted-foreground mb-4">
            This is a test application. The following privacy policy is for
            demonstration purposes only.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">
            1. Data collection
          </h2>
          <p>
            This test application uses Supabase for data storage and
            authentication. All data is stored in your own Supabase project.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">
            2. Authentication data
          </h2>
          <p>
            User authentication is handled through Supabase Auth. The
            application does not store any authentication credentials locally.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">3. Data storage</h2>
          <p>
            All data entered into this application is stored in your Supabase
            database. You have full control over this data through your Supabase
            dashboard.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Data security</h2>
          <p>As this is a test application, we recommend:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Do not enter sensitive or personal information</li>
            <li>Use strong passwords for your Supabase account</li>
            <li>Regularly review and manage your data through Supabase</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">
            5. Third-party services
          </h2>
          <p>
            This application uses Supabase as its backend service. Please refer
            to Supabase's privacy policy for information about their data
            handling practices.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">
            6. Changes to privacy policy
          </h2>
          <p>
            This privacy policy may be modified at any time as this is a test
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

export default Privacy;
