import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const About = () => {
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
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center">About</h1>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              This website serves as my QA laboratory for the ongoing
              development of the app.
              <br />
              <br />
              Follow the project and connect:
            </p>

            <div className="flex justify-center space-x-4">
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="h-6 w-6 text-[#0077b5]" />
              </a>
              <a
                href="https://github.com/andressaroberts"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
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
