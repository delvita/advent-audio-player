import type { Chapter } from '@/components/ChapterList';

interface CustomFeed {
  items: Array<{
    title: string;
    enclosure?: {
      url: string;
    };
    content?: string;
    pubDate?: string;
    'media:content'?: {
      $: {
        url: string;
      };
    };
  }>;
}

interface CustomItem {
  title: string;
  enclosure?: {
    url: string;
  };
  content?: string;
  pubDate?: string;
  'media:content'?: {
    $: {
      url: string;
    };
  };
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const extractImageUrl = (content: string): string | undefined => {
  const imgMatch = content?.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
};

async function fetchAndParseRSS(url: string): Promise<CustomFeed> {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml; q=0.1',
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  
  const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
    const enclosureUrl = item.querySelector('enclosure')?.getAttribute('url');
    const mediaContent = item.querySelector('media\\:content, content')?.getAttribute('url');
    
    return {
      title: item.querySelector('title')?.textContent || 'Untitled',
      enclosure: enclosureUrl ? { url: enclosureUrl } : undefined,
      content: item.querySelector('content\\:encoded, description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent,
      'media:content': mediaContent ? { $: { url: mediaContent } } : undefined
    };
  });

  return { items };
}

export const getFeedItems = async ({ 
  queryKey 
}: { 
  queryKey: readonly [string, string] 
}): Promise<Chapter[]> => {
  const [_, feedUrl] = queryKey;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const feed = await fetchAndParseRSS(feedUrl);
      
      if (!feed?.items?.length) {
        throw new Error('No items found in feed');
      }

      return feed.items.map(item => ({
        title: item.title || 'Untitled',
        audioSrc: item.enclosure?.url || '',
        image: item['media:content']?.$.url || (item.content ? extractImageUrl(item.content) : undefined),
        publishDate: item.pubDate,
      }));
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      if (attempt < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
        continue;
      }
    }
  }

  throw lastError || new Error('Failed to fetch feed after multiple attempts');
};