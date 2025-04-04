import React from "react";
import { useLinks } from "@/contexts/LinkContext";
import { LinkCard } from "./LinkCard";
import { LinkFilter } from "@/types";
import { Inbox } from "lucide-react";

export const LinkList = () => {
  const { links, paginatedLinks, filter, selectedTags } = useLinks();

  const filteredLinks = paginatedLinks.filter((link) => {
    // Filter by read/unread status
    const statusMatch =
      filter === "all" ||
      (filter === "read" && link.isRead) ||
      (filter === "unread" && !link.isRead);

    // Filter by selected tags
    const tagMatch =
      selectedTags.length === 0 ||
      link.tags.some((tag) => selectedTags.includes(tag));

    return statusMatch && tagMatch;
  });

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-calm-text">
          Your reading list is empty
        </h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Add your first link using the form above. Save articles, videos, and
          tweets to read later.
        </p>
      </div>
    );
  }

  if (filteredLinks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No{" "}
          {filter === "all"
            ? "links"
            : filter === "read"
            ? "read links"
            : "unread links"}{" "}
          found
          {selectedTags.length > 0 ? " with the selected tags" : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredLinks.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
};
