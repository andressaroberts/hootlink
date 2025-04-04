import React from "react";
import { Archive, BookOpen, LogOut, Settings, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLinks } from "@/contexts/LinkContext";
import { LinkFilter } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EmailSettings } from "./EmailSettings";
import { supabaseService } from "@/services/SupabaseService";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { filter, setFilter } = useLinks();
  const navigate = useNavigate();

  const handleFilterChange = (newFilter: LinkFilter) => {
    setFilter(newFilter);
  };

  const handleLogout = async () => {
    await supabaseService.logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-calm" />
          <h1 className="text-xl font-bold text-calm-text">Hootlink</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <Button
            id="filter-unread"
            variant={filter === "unread" ? "default" : "ghost"}
            onClick={() => handleFilterChange("unread")}
            className="text-sm"
          >
            Unread
          </Button>
          <Button
            id="filter-read"
            variant={filter === "read" ? "default" : "ghost"}
            onClick={() => handleFilterChange("read")}
            className="text-sm"
          >
            <Archive className="mr-1 h-4 w-4" />
            Read
          </Button>
          <Button
            id="filter-all"
            variant={filter === "all" ? "default" : "ghost"}
            onClick={() => handleFilterChange("all")}
            className="text-sm"
          >
            All
          </Button>
        </nav>

        <div className="flex items-center space-x-1">
          <Button
            id="logout-button"
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-sm"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button id="settings-button" variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>Configure your experience</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <EmailSettings />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="md:hidden flex justify-around border-t border-border bg-background py-2">
        <Button
          id="mobile-filter-unread"
          variant={filter === "unread" ? "default" : "ghost"}
          onClick={() => handleFilterChange("unread")}
          className="text-xs h-9"
        >
          Unread
        </Button>
        <Button
          id="mobile-filter-read"
          variant={filter === "read" ? "default" : "ghost"}
          onClick={() => handleFilterChange("read")}
          className="text-xs h-9"
        >
          <Archive className="mr-1 h-3 w-3" />
          Read
        </Button>
        <Button
          id="mobile-filter-all"
          variant={filter === "all" ? "default" : "ghost"}
          onClick={() => handleFilterChange("all")}
          className="text-xs h-9"
        >
          All
        </Button>
      </div>
    </header>
  );
};
