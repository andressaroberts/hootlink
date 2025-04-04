import React, { useState, useEffect } from "react";
import { useLinks } from "@/contexts/LinkContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  X,
  Tag as TagIcon,
  AlertCircle,
  Globe,
  FileText,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { APP_LIMITS } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export const AddLinkForm = () => {
  const {
    addLink,
    tags,
    addTag,
    isLoading,
    canAddMoreLinks,
    suggestTags,
    validateUrl,
    isDuplicateLink,
    validateTag,
  } = useLinks();

  const [url, setUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (validateUrl(url)) {
      const suggestions = suggestTags(url);
      setSuggestedTags(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSuggestedTags([]);
      setShowSuggestions(false);
    }
  }, [url, suggestTags, validateUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL with http:// or https://");
      return;
    }

    if (isDuplicateLink(url)) {
      toast.error("This link has already been added");
      return;
    }

    if (!canAddMoreLinks) {
      toast.error(
        `You've reached the maximum limit of ${APP_LIMITS.MAX_LINKS_PER_USER} links`
      );
      return;
    }

    try {
      await addLink(url, selectedTags);
      setUrl("");
      setSelectedTags([]);
      setIsTagPopoverOpen(false);
      setSuggestedTags([]);
      setShowSuggestions(false);
    } catch (error) {
      toast.error("Failed to add link");
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddTag = () => {
    const validation = validateTag(newTag.trim());

    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    if (newTag.trim() && !tags.includes(newTag.trim())) {
      addTag(newTag.trim());
      setSelectedTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    } else if (tags.includes(newTag.trim())) {
      toggleTag(newTag.trim());
      setNewTag("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSuggestedTagClick = (tag: string) => {
    if (!tags.includes(tag)) {
      addTag(tag);
    }

    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-border">
      <form onSubmit={handleSubmit} id="add-link-form">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="link-url-input"
                  placeholder="Paste URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                  disabled={isLoading || !canAddMoreLinks}
                />
              </div>

              <Popover
                open={isTagPopoverOpen}
                onOpenChange={setIsTagPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    id="tag-selector-button"
                    type="button"
                    variant={selectedTags.length > 0 ? "default" : "outline"}
                    size="icon"
                    className="flex-shrink-0 relative"
                    disabled={isLoading}
                  >
                    <TagIcon className="h-5 w-5" />
                    {selectedTags.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-6" align="end">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">Add tags</h4>
                      <div className="text-xs text-muted-foreground">
                        Max {APP_LIMITS.MAX_TAG_LENGTH} chars
                      </div>
                    </div>

                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                        {selectedTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1.5 px-2 py-1"
                          >
                            {tag}
                            <button
                              id={`remove-tag-${tag}`}
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="rounded-full hover:bg-muted p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Input
                        id="new-tag-input"
                        placeholder="Enter new tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                        maxLength={APP_LIMITS.MAX_TAG_LENGTH}
                      />
                      <Button
                        id="add-tag-button"
                        type="button"
                        size="sm"
                        onClick={handleAddTag}
                        className="shrink-0"
                      >
                        Add
                      </Button>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Available tags
                      </Label>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            id={`select-tag-${tag}`}
                            variant={
                              selectedTags.includes(tag) ? "default" : "outline"
                            }
                            className="cursor-pointer px-3 py-1 transition-colors"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        id="cancel-tags-button"
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTagPopoverOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        id="done-tags-button"
                        type="button"
                        size="sm"
                        onClick={() => setIsTagPopoverOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                id="save-link-button"
                type="submit"
                disabled={isLoading || !url.trim() || !canAddMoreLinks}
              >
                {isLoading ? "Adding..." : "Save"}
              </Button>
            </div>

            {!canAddMoreLinks && (
              <div className="flex items-center text-destructive text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>
                  You've reached the maximum limit of{" "}
                  {APP_LIMITS.MAX_LINKS_PER_USER} links
                </span>
              </div>
            )}

            {showSuggestions && suggestedTags.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Suggested tags:
                </div>
                <div className="flex flex-wrap gap-1">
                  {suggestedTags.map((tag) => (
                    <Badge
                      key={tag}
                      id={`suggested-tag-${tag}`}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => handleSuggestedTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-muted-foreground py-1">
                  Tags:
                </span>
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {tag}
                    <button
                      id={`remove-selected-tag-${tag}`}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
