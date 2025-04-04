
export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  isRead: boolean;
  dateAdded: Date;
  dateRead?: Date;
  tags: string[];
  userId?: string; // Add userId field to associate links with users
  shareId?: string; // Add shareId field for public sharing
}

export interface EmailConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
  email: string;
}

export type LinkFilter = "all" | "unread" | "read";

export interface UserLimits {
  maxLinks: number;
  maxTags: number;
  isAdmin: boolean;
}

// Constants for application limits
export const APP_LIMITS = {
  MAX_LINKS_PER_USER: 30,
  MAX_TAGS_PER_USER: 15,
  MAX_TAG_LENGTH: 15,
  LINK_TITLE_MAX_LENGTH: 100,
  LINK_DESCRIPTION_MAX_LENGTH: 250,
  DATA_RETENTION_DAYS: 1, // Data retention period in days
};

// Tag suggestion mapping - expanded with more intelligent suggestions
export const TAG_SUGGESTIONS: Record<string, string[]> = {
  "youtube.com": ["video", "youtube"],
  "twitter.com": ["twitter", "social"],
  "x.com": ["twitter", "social"],
  "github.com": ["code", "github"],
  "medium.com": ["article", "blog"],
  "dev.to": ["coding", "article"],
  "linkedin.com": ["professional", "social"],
  "instagram.com": ["image", "social"],
  "docs.google.com": ["document", "google"],
  "careers": ["job", "careers"],
  "jobs": ["job", "careers"],
  "apply": ["job", "careers"],
  "news": ["news", "article"],
  "blog": ["blog", "article"],
  "stackoverflow.com": ["coding", "tech"],
  "facebook.com": ["social", "facebook"],
  "tiktok.com": ["video", "social"],
  "pinterest.com": ["image", "social"],
  "reddit.com": ["social", "forum"],
  "dropbox.com": ["document", "storage"],
  "drive.google.com": ["document", "google"],
  "notion.so": ["document", "notes"],
  "trello.com": ["productivity", "tool"],
  "slack.com": ["communication", "tool"],
  "zoom.us": ["video", "meeting"],
  "meet.google.com": ["video", "meeting", "google"],
  "amazon.com": ["shopping", "ecommerce"],
  "ebay.com": ["shopping", "ecommerce"],
  "etsy.com": ["shopping", "handmade"],
  "coursera.org": ["education", "course"],
  "udemy.com": ["education", "course"],
  "wikipedia.org": ["reference", "information"],
  "nytimes.com": ["news", "article"],
  "cnn.com": ["news", "article"],
  "bbc.com": ["news", "article"],
  "spotify.com": ["music", "audio"],
  "soundcloud.com": ["music", "audio"],
  "behance.net": ["design", "portfolio"],
  "dribbble.com": ["design", "portfolio"],
};

// Add TAG_COLORS as a shared constant to ensure consistency across components
export const TAG_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  article: { bg: 'bg-calm-accent', text: 'text-calm-dark', border: 'border-calm-light' },
  video: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  twitter: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  tutorial: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  youtube: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  social: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  coding: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  github: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  blog: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  professional: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  website: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  document: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  google: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  tech: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200' },
  image: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  job: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  careers: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  news: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  // Default colors will be used for tags not listed here
};
