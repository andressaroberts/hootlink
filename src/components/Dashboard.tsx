import React from "react";
import { useLinks } from "@/contexts/LinkContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { differenceInDays } from "date-fns";
import { LinkIcon, Calendar, Clock, BookOpen } from "lucide-react";
import { Pagination } from "./Pagination";

export const Dashboard = () => {
  const {
    links,
    paginatedLinks,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
  } = useLinks();

  // Total saved links
  const totalLinks = links.length;

  // Total read links
  const readLinks = links.filter((link) => link.isRead).length;

  // Links read today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const linksReadToday = links.filter(
    (link) => link.isRead && new Date(link.dateRead as Date) >= today
  ).length;

  // Oldest unread link (in days)
  const unreadLinks = links.filter((link) => !link.isRead);
  let oldestUnreadDays = 0;

  if (unreadLinks.length > 0) {
    const oldestLink = unreadLinks.reduce((oldest, current) =>
      new Date(oldest.dateAdded) < new Date(current.dateAdded)
        ? oldest
        : current
    );

    oldestUnreadDays = differenceInDays(
      new Date(),
      new Date(oldestLink.dateAdded)
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLinks}</div>
            <p className="text-xs text-muted-foreground">Saved links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Read links</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readLinks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((readLinks / (totalLinks || 1)) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Read today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linksReadToday}</div>
            <p className="text-xs text-muted-foreground">Links read today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Oldest unread</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{oldestUnreadDays}</div>
            <p className="text-xs text-muted-foreground">Days since added</p>
          </CardContent>
        </Card>
      </div>

      {totalPages > 1 && (
        <Pagination
          totalItems={totalLinks}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
