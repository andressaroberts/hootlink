import React, { useState } from "react";
import {
  Check,
  Edit2,
  ExternalLink,
  MoreVertical,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { LinkItem } from "@/types";
import { useLinks } from "@/contexts/LinkContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";

// Define tag color mapping
const tagColors: Record<string, { bg: string; text: string; border: string }> =
  {
    article: {
      bg: "bg-calm-accent",
      text: "text-calm-dark",
      border: "border-calm-light",
    },
    video: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    twitter: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    tutorial: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    // Default colors for other tags
  };

interface LinkCardProps {
  link: LinkItem;
}

export const LinkCard = ({ link }: LinkCardProps) => {
  const {
    editLink,
    deleteLink,
    markAsRead,
    markAsUnread,
    tags: allTags,
  } = useLinks();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: link.title,
    description: link.description,
    tags: [...link.tags],
  });

  // Get color for a tag, or use default if not found
  const getTagColor = (tag: string) => {
    return (
      tagColors[tag] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      }
    );
  };

  const toggleTag = (tag: string) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSaveEdit = () => {
    editLink(link.id, {
      title: editForm.title,
      description: editForm.description,
      tags: editForm.tags,
    });
    setIsEditDialogOpen(false);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    deleteLink(link.id);
  };

  const handleToggleRead = () => {
    if (link.isRead) {
      markAsUnread(link.id);
    } else {
      markAsRead(link.id);
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <div
      className={`link-card bg-white rounded-lg border border-border shadow-sm p-4 ${
        link.isRead ? "bg-calm-light/50" : "bg-white"
      }`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={link.thumbnail || "/placeholder.svg"}
            alt={link.title}
            className="w-24 h-20 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-calm-text truncate pr-6">
                {link.title}
              </h3>
              <a
                href={link.url}
                className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                id={`link-url-${link.id}`}
              >
                {getDomainFromUrl(link.url)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  id={`link-options-${link.id}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  onClick={handleToggleRead}
                  id={`link-toggle-read-${link.id}`}
                >
                  {link.isRead ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Mark as unread
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as read
                    </>
                  )}
                </DropdownMenuItem>

                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setIsDropdownOpen(false);
                  }}
                >
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      id={`link-edit-${link.id}`}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Edit link</DialogTitle>
                      <DialogDescription>
                        Make changes to your saved link
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          id={`edit-title-${link.id}`}
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          id={`edit-description-${link.id}`}
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Add a description..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map((tag) => {
                            const { bg, text, border } = getTagColor(tag);
                            const isSelected = editForm.tags.includes(tag);

                            return (
                              <Badge
                                key={tag}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer ${
                                  isSelected ? bg : "bg-white"
                                } ${
                                  isSelected ? text : "text-muted-foreground"
                                } ${border}`}
                                onClick={() => toggleTag(tag)}
                                id={`edit-tag-${link.id}-${tag}`}
                              >
                                {tag}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        id={`edit-cancel-${link.id}`}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        id={`edit-save-${link.id}`}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDelete}
                  id={`link-delete-${link.id}`}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {link.description || "No description available"}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {link.tags.map((tag) => {
                const { bg, text, border } = getTagColor(tag);
                return (
                  <Badge
                    key={tag}
                    className={`text-xs ${bg} ${text} ${border}`}
                    id={`link-tag-${link.id}-${tag}`}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(link.dateAdded), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
