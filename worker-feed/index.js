// Substack RSS Feed Worker
// Fetches and parses Carolyn Hammond's Trusted Loops Substack

const FEED_URL = 'https://carolynhammondart.substack.com/feed';
const CACHE_TTL = 3600; // 1 hour cache

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Only allow GET
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      // Check cache first
      const cache = caches.default;
      const cacheKey = new Request(request.url, request);
      let response = await cache.match(cacheKey);

      if (response) {
        return response;
      }

      // Fetch the RSS feed
      const feedResponse = await fetch(FEED_URL, {
        headers: {
          'User-Agent': 'TrustedLoops-Feed-Fetcher/1.0',
        },
      });

      if (!feedResponse.ok) {
        throw new Error(`Failed to fetch feed: ${feedResponse.status}`);
      }

      const xml = await feedResponse.text();
      
      // Parse the XML
      const posts = parseRSS(xml);

      // Return JSON response
      response = new Response(
        JSON.stringify({
          posts: posts.slice(0, 5), // Latest 5 posts
          fetched: new Date().toISOString(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": `public, max-age=${CACHE_TTL}`,
          },
        }
      );

      // Cache the response
      ctx.waitUntil(cache.put(cacheKey, response.clone()));

      return response;
    } catch (error) {
      console.error("Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch feed" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};

// Simple RSS parser
function parseRSS(xml) {
  const posts = [];
  
  // Match all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    
    // Extract fields
    const title = extractCDATA(item, 'title') || extractTag(item, 'title');
    const description = extractCDATA(item, 'description') || extractTag(item, 'description');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');
    const creator = extractCDATA(item, 'dc:creator') || extractTag(item, 'dc:creator');

    if (title && link) {
      posts.push({
        title: cleanText(title),
        description: cleanText(description),
        link: link,
        pubDate: pubDate,
        date: formatDate(pubDate),
        author: cleanText(creator) || 'Carolyn Hammond',
      });
    }
  }

  return posts;
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function extractCDATA(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
