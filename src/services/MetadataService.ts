import { APP_LIMITS } from "@/types";

interface MetadataResult {
  title: string;
  description: string;
  thumbnail: string;
}

interface CacheEntry {
  data: MetadataResult;
  timestamp: number;
}

export class MetadataService {
  private cache: Map<string, CacheEntry> = new Map();
  private CACHE_DURATION = 1000 * 60 * 60; // 1 hora
  private REQUEST_TIMEOUT = 2500; // Timeout reduzido
  private MAX_CACHE_SIZE = 100; // Limite de entradas no cache

  // Reordenado e atualizado com proxies mais confiáveis
  private PROXY_SERVICES = [
    (url: string) =>
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) =>
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url: string) => `https://cors.sh/${encodeURIComponent(url)}`,
    // Adicionado um proxy alternativo que funciona bem com Twitter/X
    (url: string) =>
      `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
    // Adicionando como último recurso porque tem limites de uso
    (url: string) =>
      `https://cors-anywhere.herokuapp.com/${encodeURIComponent(url)}`,
  ];

  // Mapa de domínios conhecidos para informações padrão (fallback)
  private KNOWN_DOMAINS: Record<string, Partial<MetadataResult>> = {
    "youtube.com": {
      title: "YouTube",
      description: "YouTube - Watch, Listen, Stream",
      thumbnail: "https://www.youtube.com/img/desktop/yt_1200.png",
    },
    "youtu.be": {
      title: "YouTube",
      description: "YouTube - Watch, Listen, Stream",
      thumbnail: "https://www.youtube.com/img/desktop/yt_1200.png",
    },
    "twitter.com": {
      title: "Twitter",
      description: "Twitter - What's happening",
      thumbnail:
        "https://abs.twimg.com/responsive-web/web/icon-default.77d25fda.png",
    },
    "x.com": {
      title: "X (formerly Twitter)",
      description: "X - What's happening",
      thumbnail:
        "https://abs.twimg.com/responsive-web/web/icon-default.77d25fda.png",
    },
    "github.com": {
      thumbnail:
        "https://github.githubassets.com/assets/github-logo-55c5b9a1fe3.png",
    },
    "linkedin.com": {
      thumbnail: "https://static.licdn.com/sc/h/3m4tgpbdz7gbldapvef2lzjhx",
    },
    "postman.com": {
      thumbnail:
        "https://www.postman.com/_ar-assets/images/postman-logo-horizontal-black.svg",
    },
    "medium.com": {
      thumbnail:
        "https://miro.medium.com/max/8978/1*s986xIGqhfsN8U--09_AdA.png",
    },
    "dev.to": {
      thumbnail:
        "https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png",
    },
    "stackoverflow.com": {
      thumbnail:
        "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png",
    },
    "npmjs.com": {
      thumbnail: "https://www.npmjs.com/static/images/logos/npm-logo.png",
    },
  };

  async extractMetadata(url: string): Promise<MetadataResult> {
    // 1. Verificar cache primeiro
    const cached = this.getFromCache(url);
    if (cached) {
      return cached;
    }

    // 2. Verificar domínio conhecido para fallback rápido
    const domain = this.extractDomain(url);
    const knownDomain = this.getKnownDomainInfo(domain);

    try {
      // 3. Aprimorado: analisar a URL para determinar conteúdo do Twitter/X
      if (domain === "twitter.com" || domain === "x.com") {
        // Extrair informações da URL para Twitter/X
        const urlParts = url.split("/");
        const tweetId = urlParts[urlParts.length - 1];
        const username = urlParts.length >= 4 ? urlParts[3] : "";

        // Tentar extrair metadados avançados via proxy
        try {
          const twitterResult = await this.extractTwitterMetadata(
            url,
            knownDomain,
            username
          );
          if (twitterResult) {
            this.setCache(url, twitterResult);
            return twitterResult;
          }
        } catch (err) {
          console.log(`Extração avançada para Twitter falhou: ${err}`);
          // Continua no fluxo normal com fallback
        }

        // Se a extração avançada falhou, criar um resultado melhor que o padrão
        if (username) {
          const twitterFallback = {
            title: `@${username} no ${knownDomain?.title || "Twitter/X"}`,
            description: knownDomain?.description || "Tweet de @" + username,
            thumbnail: knownDomain?.thumbnail || "/placeholder.svg",
          };
          this.setCache(url, twitterFallback);
          return twitterFallback;
        }
      }

      // 4. Estratégia de fallback para proxies
      let html = "";
      let success = false;

      // Tenta por cada proxy na lista até obter sucesso
      for (const proxyService of this.PROXY_SERVICES) {
        if (success) break;

        try {
          const proxyUrl = proxyService(url);
          const response = await this.fetchWithTimeout(proxyUrl);

          if (response.ok) {
            const contentType = response.headers.get("content-type") || "";

            // Se for JSON (como allorigins retorna), processa diferente
            if (contentType.includes("application/json")) {
              const data = await response.json();
              html = data.contents || "";
            } else {
              html = await response.text();
            }

            success = !!html;
          }
        } catch (err) {
          // Continua para o próximo proxy
          console.log(`Proxy falhou, tentando próximo: ${err}`);
        }
      }

      // 5. Se nenhum proxy teve sucesso, usar informações de domínio conhecido ou fallback
      if (!success) {
        return this.createAndCacheFallback(url, knownDomain);
      }

      // 6. Extração com limite de tamanho para não processar páginas enormes
      const truncatedHtml = html.substring(0, 50000); // Limita a 50KB para análise
      const result = this.extractMetadataOptimized(
        truncatedHtml,
        url,
        knownDomain
      );

      // 7. Salva no cache
      this.setCache(url, result);

      return result;
    } catch (error) {
      console.error("Erro ao extrair metadados:", error);
      return this.createAndCacheFallback(url, knownDomain);
    }
  }

  private async extractTwitterMetadata(
    url: string,
    knownDomain?: Partial<MetadataResult>,
    username?: string
  ): Promise<MetadataResult | null> {
    try {
      // Usar os proxies em sequência para Twitter/X
      let html = "";
      let success = false;

      // Tenta cada proxy para Twitter/X
      for (const proxyService of this.PROXY_SERVICES) {
        if (success) break;

        try {
          const proxyUrl = proxyService(url);

          const response = await this.fetchWithTimeout(proxyUrl, {
            mode: "no-cors", // Tentativa com no-cors para contornar problemas de CORS
          });

          if (response.ok) {
            try {
              const contentType = response.headers.get("content-type") || "";

              if (contentType.includes("application/json")) {
                const data = await response.json();
                html = data.contents || "";
              } else {
                html = await response.text();
              }

              success = !!html;
            } catch (e) {
              // Se falhar ao processar, continua para o próximo proxy
              console.log(`Falha ao processar resposta do proxy: ${e}`);
            }
          }
        } catch (err) {
          console.log(`Proxy para Twitter falhou: ${err}`);
        }
      }

      if (!html) {
        // Fallback para quando não conseguimos obter o HTML
        if (username) {
          return {
            title: `@${username} no ${knownDomain?.title || "Twitter/X"}`,
            description: knownDomain?.description || `Tweet de @${username}`,
            thumbnail: knownDomain?.thumbnail || "/placeholder.svg",
          };
        }
        return null;
      }

      // Extrair tags meta específicas do Twitter
      const titleRegex =
        /<meta\s+(?:property|name)=["'](?:og:title)["']\s+content=["']([^"']*)["']/i;
      const descriptionRegex =
        /<meta\s+(?:property|name)=["'](?:og:description)["']\s+content=["']([^"']*)["']/i;
      const imageRegex =
        /<meta\s+(?:property|name)=["'](?:og:image)["']\s+content=["']([^"']*)["']/i;
      const authorRegex =
        /<meta\s+(?:property|name)=["'](?:twitter:creator)["']\s+content=["']([^"']*)["']/i;

      const titleMatch = html.match(titleRegex);
      const descriptionMatch = html.match(descriptionRegex);
      const imageMatch = html.match(imageRegex);
      const authorMatch = html.match(authorRegex);

      // Preparar o título
      let title = "";
      if (authorMatch && authorMatch[1]) {
        title = this.cleanText(authorMatch[1]);
      } else if (titleMatch && titleMatch[1]) {
        title = this.cleanText(titleMatch[1]);
      } else if (username) {
        title = `@${username} no Twitter/X`;
      }

      // Se ainda não temos título, extrair do URL
      if (!title) {
        const urlParts = url.split("/");
        if (urlParts.length >= 4) {
          title = urlParts[3]; // Nome de usuário na posição 3
          title = title.replace(/^@/, ""); // Remove @ inicial se existir
          title = `${title} no Twitter/X`;
        }
      }

      const description = this.cleanText(
        descriptionMatch?.[1] || knownDomain?.description || "Tweet"
      );
      const thumbnail =
        imageMatch?.[1] || knownDomain?.thumbnail || "/placeholder.svg";

      return {
        title: title.substring(0, APP_LIMITS.LINK_TITLE_MAX_LENGTH),
        description: description.substring(
          0,
          APP_LIMITS.LINK_DESCRIPTION_MAX_LENGTH
        ),
        thumbnail,
      };
    } catch (error) {
      console.error("Erro ao extrair metadados do Twitter:", error);
      return null;
    }
  }

  private createAndCacheFallback(
    url: string,
    knownDomain?: Partial<MetadataResult>
  ): MetadataResult {
    // Cria fallback combinando informações do domínio conhecido (se disponível)
    const fallback = {
      title: knownDomain?.title || this.generateTitleFromUrl(url),
      description: knownDomain?.description || "",
      thumbnail: knownDomain?.thumbnail || "/placeholder.svg",
    };

    // Salva o fallback no cache para evitar tentativas repetidas
    this.setCache(url, fallback);

    return fallback;
  }

  private generateTitleFromUrl(url: string): string {
    try {
      // Tenta extrair um título mais amigável da URL
      const urlObj = new URL(url);
      const path = urlObj.pathname.replace(/\/$/, "");
      const lastSegment = path.split("/").pop();

      if (lastSegment) {
        // Caso especial para Twitter/X
        if (
          urlObj.hostname.includes("twitter.com") ||
          urlObj.hostname.includes("x.com")
        ) {
          const pathSegments = path.split("/");
          // Se for um tweet, tenta extrair o nome de usuário
          if (pathSegments.length >= 2) {
            const username = pathSegments[1];
            return `@${username} no Twitter`;
          }
        }

        // Converte kebab-case ou snake_case para palavras
        return lastSegment
          .replace(/[-_]/g, " ")
          .replace(/\.\w+$/, "") // Remove extensão de arquivo
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .substring(0, APP_LIMITS.LINK_TITLE_MAX_LENGTH);
      }

      // Se não tem segmento na URL, usa o hostname
      return urlObj.hostname
        .replace(/^www\./, "")
        .substring(0, APP_LIMITS.LINK_TITLE_MAX_LENGTH);
    } catch {
      return url.substring(0, APP_LIMITS.LINK_TITLE_MAX_LENGTH);
    }
  }

  private extractDomain(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      const domain = hostname.replace(/^www\./, "");
      return domain;
    } catch {
      return "";
    }
  }

  private getKnownDomainInfo(
    domain: string
  ): Partial<MetadataResult> | undefined {
    // Verifica se o domínio ou algum subdomínio corresponde a um domínio conhecido
    for (const [knownDomain, info] of Object.entries(this.KNOWN_DOMAINS)) {
      if (domain.includes(knownDomain)) {
        return info;
      }
    }
    return undefined;
  }

  private extractMetadataOptimized(
    html: string,
    url: string,
    knownDomain?: Partial<MetadataResult>
  ): MetadataResult {
    // Extrai título com uma abordagem mais agressiva
    let title = "";
    const titlePatterns = [
      // OG Title
      /<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']*)["']/i,
      // Twitter Title
      /<meta\s+(?:property|name)=["']twitter:title["']\s+content=["']([^"']*)["']/i,
      // Tag Title
      /<title>([^<]*)<\/title>/i,
      // Título da página (h1)
      /<h1[^>]*>([^<]+)<\/h1>/i,
    ];

    // Tenta cada padrão de título
    for (const pattern of titlePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        title = this.cleanText(match[1]);
        break;
      }
    }

    // Fallback para título do domínio conhecido ou URL
    if (!title) {
      title = knownDomain?.title || this.generateTitleFromUrl(url);
    }

    title = title.substring(0, APP_LIMITS.LINK_TITLE_MAX_LENGTH);

    // Extrai descrição - otimizado para buscar diferentes padrões
    let description = "";
    const descriptionPatterns = [
      // OG Description
      /<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']*)["']/i,
      // Twitter Description
      /<meta\s+(?:property|name)=["']twitter:description["']\s+content=["']([^"']*)["']/i,
      // Meta Description
      /<meta\s+(?:property|name)=["']description["']\s+content=["']([^"']*)["']/i,
      // Primeiro parágrafo significativo
      /<p[^>]*>([^<]{20,})<\/p>/i,
    ];

    // Tenta cada padrão de descrição
    for (const pattern of descriptionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        description = this.cleanText(match[1]);
        break;
      }
    }

    // Fallback para descrição do domínio conhecido
    if (!description) {
      description = knownDomain?.description || "";
    }

    description = description.substring(
      0,
      APP_LIMITS.LINK_DESCRIPTION_MAX_LENGTH
    );

    // Extrai imagem com prioridade para OG e Twitter
    let thumbnail = "";
    const imagePatterns = [
      // OG Image
      /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']*)["']/i,
      // Twitter Image
      /<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']*)["']/i,
      // Primeira imagem do artigo
      /<img[^>]+src=["']([^"']+)["'][^>]*>/i,
    ];

    // Tenta cada padrão de imagem
    for (const pattern of imagePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        thumbnail = this.resolveUrl(match[1], url);
        break;
      }
    }

    // Fallback para thumbnail do domínio conhecido ou placeholder
    if (!thumbnail) {
      thumbnail = knownDomain?.thumbnail || "/placeholder.svg";
    }

    return { title, description, thumbnail };
  }

  private cleanText(text?: string | null): string {
    if (!text) return "";

    // Versão ainda mais otimizada usando replace com função
    return text
      .replace(/&nbsp;|&amp;|&#39;|&quot;|\s+/g, (match) => {
        switch (match) {
          case "&nbsp;":
            return " ";
          case "&amp;":
            return "&";
          case "&#39;":
            return "'";
          case "&quot;":
            return '"';
          default:
            return " ";
        }
      })
      .trim();
  }

  private resolveUrl(src: string | null | undefined, base: string): string {
    if (!src) return "/placeholder.svg";

    // Verificar se já é uma URL completa
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    try {
      return new URL(src, base).href;
    } catch {
      return "/placeholder.svg";
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.REQUEST_TIMEOUT
    );

    const defaultOptions: RequestInit = {
      signal: controller.signal,
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        // Removendo cabeçalhos problemáticos para CORS
        // "Sec-Fetch-Dest": "document",
        // "Sec-Fetch-Mode": "navigate",
        // "Sec-Fetch-Site": "none",
        // "Sec-Fetch-User": "?1",
        // "Upgrade-Insecure-Requests": "1",
        // "Cache-Control": "no-cache",
        // "Pragma": "no-cache",
      },
      mode: "cors", // default mode
      credentials: "omit",
      redirect: "follow",
    };

    // Mesclar opções padrão com opções personalizadas
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getFromCache(url: string): MetadataResult | null {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(url: string, data: MetadataResult) {
    // Remove entradas antigas se o cache estiver cheio
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(url, {
      data,
      timestamp: Date.now(),
    });
  }
}

// Instância única
export const metadataService = new MetadataService();
