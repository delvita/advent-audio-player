import type { Chapter } from '@/components/ChapterList';
import type { FeedItem, ParsedFeed, FeedError } from '@/types/feed';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const TIMEOUT = 10000; // 10 seconds timeout

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const createFeedError = (message: string, type: FeedError['type'], originalError?: unknown): FeedError => {
  const error = new Error(message) as FeedError;
  error.type = type;
  error.originalError = originalError;
  return error;
};

const extractImageUrl = (content: string): string | undefined => {
  const imgMatch = content?.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
};

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw createFeedError('Request timed out', 'TIMEOUT');
    }
    throw error;
  }
}

async function fetchAndParseRSS(url: string): Promise<ParsedFeed> {
  try {
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw createFeedError(
        `HTTP error! status: ${response.status}`,
        'NETWORK'
      );
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw createFeedError(
        `XML parsing error: ${parseError.textContent}`,
        'PARSE'
      );
    }
    
    const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
      title: item.querySelector('title')?.textContent || 'Untitled',
      enclosure: (() => {
        const enclosure = item.querySelector('enclosure');
        return enclosure?.getAttribute('url') ? { url: enclosure.getAttribute('url')! } : undefined;
      })(),
      content: item.querySelector('content\\:encoded, description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || undefined,
      'media:content': (() => {
        const media = item.querySelector('media\\:content, content');
        return media?.getAttribute('url') ? { $: { url: media.getAttribute('url')! } } : undefined;
      })()
    }));

    return { items };
  } catch (error) {
    if ((error as FeedError).type) {
      throw error;
    }
    throw createFeedError(
      'An unexpected error occurred while fetching the feed',
      'UNKNOWN',
      error
    );
  }
}

export const getFeedItems = async ({ 
  queryKey 
}: { 
  queryKey: readonly [string, string] 
}): Promise<Chapter[]> => {
  const [_, feedUrl] = queryKey;
  let lastError: FeedError | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const proxyUrl = `https://mf1.ch/crosproxy/?${feedUrl}`;
      console.log(`Attempt ${attempt + 1}: Fetching feed from ${proxyUrl}`);
      
      const feed = await fetchAndParseRSS(proxyUrl);
      
      if (!feed?.items?.length) {
        console.warn('No items found in feed');
        return [];
      }

      return feed.items.map(item => ({
        title: item.title || 'Untitled',
        audioSrc: item.enclosure?.url || '',
        image: item['media:content']?.$.url || (item.content ? extractImageUrl(item.content) : undefined),
        publishDate: item.pubDate,
      }));
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error instanceof Error ? createFeedError(error.message, 'UNKNOWN', error) : createFeedError('Unknown error occurred', 'UNKNOWN');
      
      if (attempt < MAX_RETRIES - 1) {
        const backoffDelay = RETRY_DELAY * Math.pow(2, attempt);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await delay(backoffDelay);
        continue;
      }
    }
  }

  console.error('All retry attempts failed');
  throw lastError || createFeedError('Failed to fetch feed after multiple attempts', 'UNKNOWN');
};