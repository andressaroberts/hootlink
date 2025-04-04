import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  LinkItem,
  EmailConfig,
  LinkFilter,
  UserLimits,
  APP_LIMITS,
  TAG_SUGGESTIONS,
} from "@/types";
import { toast } from "sonner";
import { supabaseService } from "@/services/SupabaseService";
import { metadataService } from "@/services/MetadataService";

interface SupabaseConfig {
  isConnected: boolean;
  apiKey?: string;
  apiUrl?: string;
}

interface LinkContextType {
  links: LinkItem[];
  addLink: (url: string, tags?: string[]) => Promise<void>;
  editLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  emailConfig: EmailConfig;
  updateEmailConfig: (config: EmailConfig) => void;
  filter: LinkFilter;
  setFilter: (filter: LinkFilter) => void;
  tags: string[];
  addTag: (tag: string) => void;
  selectedTags: string[];
  toggleTagSelection: (tag: string) => void;
  isLoading: boolean;
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  userLimits: UserLimits;
  canAddMoreLinks: boolean;
  canAddMoreTags: boolean;
  suggestTags: (url: string) => string[];
  isDuplicateLink: (url: string) => boolean;
  validateUrl: (url: string) => boolean;
  validateTag: (tag: string) => { isValid: boolean; message?: string };
  canShareLink: (id: string) => boolean;
  shareLink: (id: string) => Promise<string | null>;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  paginatedLinks: LinkItem[];
  totalPages: number;
}

const defaultEmailConfig: EmailConfig = {
  enabled: false,
  frequency: "weekly",
  email: "",
};

const defaultSupabaseConfig: SupabaseConfig = {
  isConnected: false,
};

const defaultUserLimits: UserLimits = {
  maxLinks: APP_LIMITS.MAX_LINKS_PER_USER,
  maxTags: APP_LIMITS.MAX_TAGS_PER_USER,
  isAdmin: false,
};

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider = ({ children }: { children: ReactNode }) => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [emailConfig, setEmailConfig] =
    useState<EmailConfig>(defaultEmailConfig);
  const [filter, setFilter] = useState<LinkFilter>("unread");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(
    defaultSupabaseConfig
  );
  const [userLimits, setUserLimits] = useState<UserLimits>(defaultUserLimits);

  useEffect(() => {
    const loadInitialData = async () => {
      // Initialize Supabase
      const storedApiKey = localStorage.getItem("supabase_api_key");
      const storedApiUrl = localStorage.getItem("supabase_api_url");

      if (storedApiKey && storedApiUrl) {
        const isInitialized = supabaseService.init(storedApiKey, storedApiUrl);
        if (isInitialized) {
          setSupabaseConfig((prev) => ({ ...prev, isConnected: true }));

          // Load links from Supabase
          const links = await supabaseService.getLinks();
          if (links.length > 0) {
            setLinks(links);
          }
        }
      }

      // Load tags
      setTags(["article", "video", "twitter", "tutorial"]);

      // Set admin status
      const isAdmin = false;
      if (isAdmin) {
        setUserLimits({
          maxLinks: 9999,
          maxTags: 9999,
          isAdmin: true,
        });
      }

      // Apply data retention
      const now = new Date();
      const retentionDate = new Date(
        now.setDate(now.getDate() - APP_LIMITS.DATA_RETENTION_DAYS)
      );

      if (!userLimits.isAdmin) {
        setLinks((prevLinks) =>
          prevLinks.filter((link) => new Date(link.dateAdded) > retentionDate)
        );
      }
    };

    loadInitialData();
  }, []);

  const canAddMoreLinks =
    links.length < userLimits.maxLinks || userLimits.isAdmin;

  const canAddMoreTags = tags.length < userLimits.maxTags || userLimits.isAdmin;

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;

    try {
      const parsedUrl = new URL(url);
      return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch (e) {
      return false;
    }
  };

  const isDuplicateLink = (url: string): boolean => {
    return links.some((link) => link.url.toLowerCase() === url.toLowerCase());
  };

  const validateTag = (tag: string): { isValid: boolean; message?: string } => {
    if (!tag.trim()) {
      return { isValid: false, message: "Tag cannot be empty" };
    }

    if (tag.length > APP_LIMITS.MAX_TAG_LENGTH) {
      return {
        isValid: false,
        message: `Tag must be ${APP_LIMITS.MAX_TAG_LENGTH} characters or less`,
      };
    }

    return { isValid: true };
  };

  const suggestTags = (url: string): string[] => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace("www.", "");
      const path = parsedUrl.pathname.toLowerCase();
      let suggestedTags: string[] = [];

      for (const [domain, domainTags] of Object.entries(TAG_SUGGESTIONS)) {
        if (hostname.includes(domain)) {
          suggestedTags = [
            ...suggestedTags,
            ...domainTags.filter((tag) => !tags.includes(tag)),
          ];
        }
      }

      const pathKeywords = {
        careers: ["job", "careers"],
        jobs: ["job", "careers"],
        apply: ["job", "careers"],
        news: ["news", "article"],
        blog: ["blog", "article"],
        article: ["article"],
        video: ["video"],
        photo: ["image"],
        gallery: ["image"],
        docs: ["document"],
        learn: ["education", "tutorial"],
        course: ["education", "tutorial"],
        shop: ["shopping", "ecommerce"],
        store: ["shopping", "ecommerce"],
        product: ["shopping", "ecommerce"],
      };

      for (const [keyword, keywordTags] of Object.entries(pathKeywords)) {
        if (path.includes(keyword)) {
          suggestedTags = [
            ...suggestedTags,
            ...keywordTags.filter(
              (tag) => !tags.includes(tag) && !suggestedTags.includes(tag)
            ),
          ];
        }
      }

      if (suggestedTags.length === 0 && !tags.includes("website")) {
        suggestedTags = ["website"];
      }

      return suggestedTags.slice(0, 5);
    } catch (e) {
      return [];
    }
  };

  const extractMetadata = async (url: string): Promise<Partial<LinkItem>> => {
    setIsLoading(true);
    try {
      const metadata = await metadataService.extractMetadata(url);
      return {
        title: metadata.title.substring(0, APP_LIMITS.LINK_TITLE_MAX_LENGTH),
        description: metadata.description.substring(
          0,
          APP_LIMITS.LINK_DESCRIPTION_MAX_LENGTH
        ),
        thumbnail: metadata.thumbnail,
      };
    } catch (error) {
      console.error("Error extracting metadata:", error);
      toast.error("Failed to extract metadata from link");
      return {
        title: url.substring(0, APP_LIMITS.LINK_TITLE_MAX_LENGTH),
        description: "",
        thumbnail: "/placeholder.svg",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = async (url: string, tags: string[] = []) => {
    try {
      // Validar URL
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      // Verificar duplicatas
      if (links.some((link) => link.url === url)) {
        toast.error("This link already exists");
        return;
      }

      // Obter usuário atual
      const currentUser = await supabaseService.getCurrentUser();
      if (!currentUser) {
        toast.error("You must be logged in to add links");
        return;
      }

      // Extrair metadados
      const metadata = await extractMetadata(url);

      // Criar novo link
      const newLink: LinkItem = {
        id: Date.now().toString(),
        url,
        title: metadata.title,
        description: metadata.description,
        thumbnail: metadata.thumbnail,
        isRead: false,
        dateAdded: new Date(),
        tags,
        userId: currentUser.id,
        shareId: null,
      };

      // Se Supabase estiver conectado, salvar lá primeiro
      if (supabaseConfig.isConnected) {
        const success = await supabaseService.addLink(newLink);

        if (!success) {
          toast.error("Failed to save link to Supabase");
          return;
        }

        // Buscar os links atualizados do Supabase
        const updatedLinks = await supabaseService.getLinks();
        if (updatedLinks) {
          setLinks(updatedLinks);
        }
      } else {
        // Se não estiver conectado ao Supabase, apenas atualizar o estado local
        setLinks((prev) => [...prev, newLink]);
      }

      toast.success("Link added successfully");
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link");
    }
  };

  const editLink = async (id: string, updates: Partial<LinkItem>) => {
    // Update local state first
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );

    // If Supabase is connected, update there as well
    if (supabaseConfig.isConnected) {
      const success = await supabaseService.updateLink(id, updates);
      if (!success) {
        // If Supabase update fails, revert local state
        const updatedLinks = await supabaseService.getLinks();
        if (updatedLinks) {
          setLinks(updatedLinks);
        }
        toast.error("Failed to update link in Supabase");
        return;
      }
    }

    toast.success("Link updated");
  };

  const deleteLink = async (id: string) => {
    try {
      // Primeiro, remover do estado local
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));

      // Depois, tentar deletar do Supabase
      const success = await supabaseService.deleteLink(id);

      if (!success) {
        // Se falhar, restaurar o link no estado local
        console.error(
          "Failed to delete link from Supabase, restoring local state"
        );
        const deletedLink = links.find((link) => link.id === id);
        if (deletedLink) {
          setLinks((prev) => [...prev, deletedLink]);
        }
        toast.error("Failed to delete link");
      } else {
        toast.success("Link deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      // Em caso de erro, restaurar o link no estado local
      const deletedLink = links.find((link) => link.id === id);
      if (deletedLink) {
        setLinks((prev) => [...prev, deletedLink]);
      }
      toast.error("Failed to delete link");
    }
  };

  const markAsRead = (id: string) => {
    editLink(id, { isRead: true, dateRead: new Date() });
  };

  const markAsUnread = (id: string) => {
    editLink(id, { isRead: false, dateRead: undefined });
  };

  const updateEmailConfig = (config: EmailConfig) => {
    setEmailConfig(config);

    if (supabaseConfig.isConnected) {
      console.log("Would update email config in Supabase:", config);
    }

    toast.success("Email preferences updated");
  };

  const addTag = (tag: string) => {
    const validation = validateTag(tag);

    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    if (tags.length >= userLimits.maxTags && !userLimits.isAdmin) {
      toast.error(
        `You've reached the maximum limit of ${userLimits.maxTags} tags`
      );
      return;
    }

    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);

      if (supabaseConfig.isConnected) {
        console.log("Would add tag to Supabase:", tag);
      }
    }
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const updateSupabaseConfig = (config: Partial<SupabaseConfig>) => {
    setSupabaseConfig((prev) => ({ ...prev, ...config }));

    if (config.isConnected) {
      toast.success("Connected to Supabase");
    }
  };

  const canShareLink = (id: string): boolean => {
    const link = links.find((l) => l.id === id);
    return !!link;
  };

  const shareLink = async (id: string): Promise<string | null> => {
    try {
      const link = links.find((l) => l.id === id);

      if (!link) {
        toast.error("Link not found");
        return null;
      }

      if (!link.shareId) {
        const shareId = `share_${Math.random().toString(36).substring(2, 15)}`;

        editLink(id, { shareId });

        if (supabaseConfig.isConnected) {
          console.log("Would update share ID in Supabase:", id, shareId);
        }
      }

      const updatedLink = links.find((l) => l.id === id);
      const shareUrl = `${window.location.origin}/shared/${
        updatedLink?.shareId || ""
      }`;

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard");

      return shareUrl;
    } catch (error) {
      toast.error("Failed to share link");
      return null;
    }
  };

  const paginatedLinks = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return links.slice(startIndex, endIndex);
  }, [links, currentPage]);

  const totalPages = Math.ceil(links.length / itemsPerPage);

  return (
    <LinkContext.Provider
      value={{
        links,
        addLink,
        editLink,
        deleteLink,
        markAsRead,
        markAsUnread,
        emailConfig,
        updateEmailConfig,
        filter,
        setFilter,
        tags,
        addTag,
        selectedTags,
        toggleTagSelection,
        isLoading,
        supabaseConfig,
        updateSupabaseConfig,
        userLimits,
        canAddMoreLinks,
        canAddMoreTags,
        suggestTags,
        isDuplicateLink,
        validateUrl,
        validateTag,
        canShareLink,
        shareLink,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        paginatedLinks,
        totalPages,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
};

export const useLinks = () => {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error("useLinks must be used within a LinkProvider");
  }
  return context;
};
