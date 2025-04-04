import React from "react";
import { LinkProvider } from "@/contexts/LinkContext";
import { Header } from "@/components/Header";
import { AddLinkForm } from "@/components/AddLinkForm";
import { LinkList } from "@/components/LinkList";
import { TagFilter } from "@/components/TagFilter";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <LinkProvider>
      <div className="min-h-screen flex flex-col bg-calm-light">
        <Header />
        <main className="flex-1 container mx-auto py-6 px-4 sm:px-6">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-calm-text">My links</h1>
            <Button id="back-to-landing" variant="outline" size="sm">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
          <Dashboard />
          <AddLinkForm />
          <TagFilter />
          <LinkList />
        </main>
        <Footer />
      </div>
    </LinkProvider>
  );
};

export default Index;
