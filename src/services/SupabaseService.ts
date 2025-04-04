import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { LinkItem, EmailConfig } from "@/types";

interface SupabaseLink {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  is_read: boolean;
  date_added: string;
  date_read: string | null;
  user_id: string;
  share_id: string | null;
  link_tags: Array<{
    tag: {
      name: string;
    };
  }>;
}

// This is the structure that will be used when Supabase is connected
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private isConnected: boolean = false;

  // Initialize with supabase config
  init(apiKey?: string, apiUrl?: string) {
    try {
      if (apiKey && apiUrl) {
        this.supabase = createClient(apiUrl, apiKey);
        this.isConnected = true;

        return true;
      }

      // Check if keys are in localStorage for development
      const storedApiKey = localStorage.getItem("supabase_api_key");
      const storedApiUrl = localStorage.getItem("supabase_api_url");

      if (storedApiKey && storedApiUrl) {
        this.supabase = createClient(storedApiUrl, storedApiKey);
        this.isConnected = true;

        return true;
      }

      console.warn("Supabase not initialized, missing API key or URL");
      this.isConnected = false;
      return false;
    } catch (error) {
      console.error("Error initializing Supabase:", error);
      this.isConnected = false;
      return false;
    }
  }

  // Store supabase credentials in localStorage (for development only)
  storeCredentials(apiKey: string, apiUrl: string) {
    localStorage.setItem("supabase_api_key", apiKey);
    localStorage.setItem("supabase_api_url", apiUrl);
    return this.init(apiKey, apiUrl);
  }

  // Clear stored credentials
  clearCredentials() {
    localStorage.removeItem("supabase_api_key");
    localStorage.removeItem("supabase_api_url");
    this.supabase = null;
    this.isConnected = false;
  }

  // Check connection status
  isInitialized() {
    return this.isConnected && this.supabase !== null;
  }

  // AUTH METHODS

  async login(email: string, password: string): Promise<boolean> {
    if (!this.isInitialized()) {
      console.error("Supabase not initialized");
      return false;
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async signup(
    email: string,
    password: string,
    name: string
  ): Promise<boolean> {
    if (!this.isInitialized()) {
      console.error("Supabase not initialized");
      return false;
    }

    try {
      // Register the user
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error.message);
        return false;
      }

      console.log("Signed up user:", data);
      return true;
    } catch (error) {
      console.error("Unexpected signup error:", error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      // Clear all session-related localStorage items
      localStorage.clear();

      // Reset Supabase client state
      this.supabase = null;
      this.isConnected = false;

      // If Supabase is initialized, sign out from Supabase
      if (this.isInitialized()) {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
          console.error("Logout error:", error.message);
          return false;
        }
      }

      console.log("User logged out successfully");
      return true;
    } catch (error) {
      console.error("Unexpected logout error:", error);
      return false;
    }
  }

  async getCurrentUser() {
    if (!this.isInitialized()) {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }

    try {
      const { data, error } = await this.supabase.auth.getUser();

      if (error) {
        console.error("Get user error:", error.message);
        return null;
      }

      return data.user;
    } catch (error) {
      console.error("Unexpected get user error:", error);
      return null;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // LINKS

  async getLinks(): Promise<LinkItem[]> {
    if (!this.isInitialized()) {
      console.error("Supabase not initialized");
      return [];
    }

    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        console.error("No authenticated user found");
        return [];
      }

      // Fetch links for the current user with their tags
      const { data: linksData, error: linksError } = await this.supabase
        .from("links")
        .select(
          `
          id,
          url,
          title,
          description,
          thumbnail,
          is_read,
          date_added,
          date_read,
          user_id,
          share_id,
          link_tags (
            tag:tags (
              name
            )
          )
        `
        )
        .eq("user_id", currentUser.id)
        .order("date_added", { ascending: false });

      if (linksError) {
        console.error("Error fetching links:", linksError);
        return [];
      }

      if (!linksData) {
        console.log("No links found for user");
        return [];
      }

      // Transform the data into LinkItem format
      const links = (linksData as SupabaseLink[]).map((link) => ({
        id: link.id,
        url: link.url,
        title: link.title,
        description: link.description,
        thumbnail: link.thumbnail,
        isRead: link.is_read,
        dateAdded: new Date(link.date_added),
        dateRead: link.date_read ? new Date(link.date_read) : undefined,
        tags: link.link_tags?.map((lt) => lt.tag.name) || [],
        userId: link.user_id,
        shareId: link.share_id,
      }));

      return links;
    } catch (error) {
      return [];
    }
  }

  async addLink(
    link: Omit<LinkItem, "id" | "dateAdded" | "dateRead">
  ): Promise<boolean> {
    if (!this.isInitialized()) return false;

    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        console.error("No authenticated user found");
        return false;
      }

      // Primeiro, verificar se a URL já existe para este usuário
      const { data: existingLinks, error: checkError } = await this.supabase
        .from("links")
        .select("id")
        .eq("url", link.url)
        .eq("user_id", currentUser.id);

      if (checkError) {
        console.error("Error checking for duplicate links:", checkError);
        return false;
      }

      if (existingLinks && existingLinks.length > 0) {
        console.log("Link already exists for this user");
        return false;
      }

      // Inserir o link
      const { data: linkData, error: linkError } = await this.supabase
        .from("links")
        .insert({
          url: link.url,
          title: link.title,
          description: link.description,
          thumbnail: link.thumbnail,
          is_read: link.isRead,
          user_id: currentUser.id,
          share_id: link.shareId,
        })
        .select()
        .single();

      if (linkError) {
        console.error("Error inserting link:", linkError);
        return false;
      }

      if (!linkData) {
        console.error("No data returned after link insertion");
        return false;
      }

      // Processar as tags
      for (const tagName of link.tags) {
        // Verificar se a tag já existe
        const { data: existingTag, error: tagError } = await this.supabase
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .eq("user_id", currentUser.id)
          .single();

        let tagId: string;

        if (tagError && tagError.code !== "PGRST116") {
          // PGRST116 é o código para "no rows returned"
          console.error("Error checking for existing tag:", tagError);
          continue;
        }

        if (existingTag) {
          tagId = existingTag.id;
        } else {
          // Criar nova tag
          const { data: newTag, error: newTagError } = await this.supabase
            .from("tags")
            .insert({
              name: tagName,
              user_id: currentUser.id,
            })
            .select()
            .single();

          if (newTagError) {
            console.error("Error creating new tag:", newTagError);
            continue;
          }

          if (!newTag) {
            console.error("No data returned after tag creation");
            continue;
          }

          tagId = newTag.id;
        }

        // Criar relação link-tag
        const { error: linkTagError } = await this.supabase
          .from("link_tags")
          .insert({
            link_id: linkData.id,
            tag_id: tagId,
          });

        if (linkTagError) {
          console.error("Error creating link-tag relationship:", linkTagError);
          continue;
        }
      }

      return true;
    } catch (error) {
      console.error("Unexpected error adding link:", error);
      return false;
    }
  }

  async updateLink(id: string, updates: Partial<LinkItem>): Promise<boolean> {
    if (!this.isInitialized()) return false;

    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        console.error("No authenticated user found");
        return false;
      }

      // Convert LinkItem updates to Supabase format
      const supabaseUpdates: {
        is_read?: boolean;
        date_read?: string | null;
        title?: string;
        description?: string;
        thumbnail?: string;
        share_id?: string | null;
      } = {
        is_read: updates.isRead,
        date_read: updates.dateRead ? updates.dateRead.toISOString() : null,
        title: updates.title,
        description: updates.description,
        thumbnail: updates.thumbnail,
        share_id: updates.shareId,
      };

      // Remove undefined values
      Object.keys(supabaseUpdates).forEach(
        (key) =>
          supabaseUpdates[key as keyof typeof supabaseUpdates] === undefined &&
          delete supabaseUpdates[key as keyof typeof supabaseUpdates]
      );

      const { error } = await this.supabase
        .from("links")
        .update(supabaseUpdates)
        .eq("id", id)
        .eq("user_id", currentUser.id);

      if (error) {
        console.error("Error updating link:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected error updating link:", error);
      return false;
    }
  }

  async deleteLink(id: string): Promise<boolean> {
    if (!this.isInitialized()) {
      console.error("Supabase not initialized");
      return false;
    }

    try {
      // Primeiro, deletar as relações de tags
      const { error: linkTagError } = await this.supabase
        .from("link_tags")
        .delete()
        .eq("link_id", id);

      if (linkTagError) {
        console.error("Error deleting link-tag relationships:", linkTagError);
        return false;
      }

      // Depois, deletar o link
      const { error: linkError } = await this.supabase
        .from("links")
        .delete()
        .eq("id", id);

      if (linkError) {
        console.error("Error deleting link:", linkError);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async shareLink(id: string): Promise<string | null> {
    if (!this.isInitialized()) return null;

    const shareId = `shared_${id}_${Date.now()}`;

    return shareId;
  }

  // TAGS

  async getTags(): Promise<string[]> {
    if (!this.isInitialized()) return [];

    return [];
  }

  async addTag(tag: string): Promise<boolean> {
    if (!this.isInitialized()) return false;

    return true;
  }

  // EMAIL SETTINGS

  async getEmailConfig(): Promise<EmailConfig | null> {
    if (!this.isInitialized()) return null;

    return null;
  }

  async updateEmailConfig(config: EmailConfig): Promise<boolean> {
    if (!this.isInitialized()) return false;

    return true;
  }

  async extractMetadata(
    url: string
  ): Promise<{ title: string; description: string; thumbnail: string }> {
    if (!this.isInitialized()) {
      return {
        title: url,
        description: "",
        thumbnail: "/placeholder.svg",
      };
    }

    try {
      const { data, error } = await this.supabase.functions.invoke(
        "extract-metadata",
        {
          body: { url },
        }
      );

      if (error) {
        console.error("Error extracting metadata:", error);
        return {
          title: url,
          description: "",
          thumbnail: "/placeholder.svg",
        };
      }

      return {
        title: data.title || url,
        description: data.description || "",
        thumbnail: data.thumbnail || "/placeholder.svg",
      };
    } catch (error) {
      console.error("Unexpected error extracting metadata:", error);
      return {
        title: url,
        description: "",
        thumbnail: "/placeholder.svg",
      };
    }
  }
}

// Create a singleton instance
export const supabaseService = new SupabaseService();

// Export a hook to access the service
export const useSupabase = () => {
  return supabaseService;
};
