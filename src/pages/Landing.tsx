import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Tag, Mail } from "lucide-react";
import Footer from "@/components/Footer";

export default function Landing() {
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
              <Button id="login-button" variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button id="signup-button">
                <Link to="/signup">Sign up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-calm-light to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-calm-text">
                    Save now, read later
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Organize your online reading list with Hootlink. Save
                    articles, videos and tweets to read when you have time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    id="get-started-button"
                    size="lg"
                    className="bg-calm hover:bg-calm-dark"
                  >
                    <Link to="/signup">Get started</Link>
                  </Button>
                  <Button id="learn-more-button" size="lg" variant="outline">
                    <Link to="/configuration">Learn more</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Your reading list
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Save links to read later
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="grid gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                            <img
                              src="/placeholder.svg"
                              alt="Article thumbnail"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="grid gap-1">
                            <h4 className="font-semibold">
                              How to build a Next.js app with Supabase
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              Learn how to create a full-stack application using
                              Next.js and Supabase
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-calm-dark border-calm-light bg-calm-accent">
                                tutorial
                              </span>
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-blue-700 border-blue-200 bg-blue-100">
                                coding
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                            <img
                              src="/placeholder.svg"
                              alt="Video thumbnail"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="grid gap-1">
                            <h4 className="font-semibold">
                              The future of web development
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              A comprehensive look at emerging trends in web
                              development
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-purple-700 border-purple-200 bg-purple-100">
                                video
                              </span>
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-green-700 border-green-200 bg-green-100">
                                tech
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-calm-text">
                  Features that make link management easy
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to organize your online reading list
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-calm-accent text-calm-dark mx-auto">
                  <Tag className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Organize with tags</h3>
                <p className="text-gray-600">
                  Categorize your links with custom tags to find them easily
                  later.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-calm-accent text-calm-dark mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01" />
                    <path d="M17 7h.01" />
                    <path d="M7 17h.01" />
                    <path d="M17 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Rich previews</h3>
                <p className="text-gray-600">
                  Automatically extract thumbnails and metadata from your saved
                  links.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-calm-accent text-calm-dark mx-auto">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Email digests</h3>
                <p className="text-gray-600">
                  Receive regular summaries of your saved links via email.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer pageContext={"landing"} />
    </div>
  );
}
