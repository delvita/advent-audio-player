import Parser from 'rss-parser';
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

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    item: [['media:content', 'media:content']],
  },
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const extractImageUrl = (content: string): string | undefined => {
  const imgMatch = content?.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
};

export const getFeedItems = async ({ 
  queryKey 
}: { 
  queryKey: readonly [string, string] 
}): Promise<Chapter[]> => {
  const [_, feedUrl] = queryKey;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const feed = await parser.parseURL(feedUrl);
      
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
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      if (attempt < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
        continue;
      }
    }
  }

  throw lastError || new Error('Failed to fetch feed after multiple attempts');
};