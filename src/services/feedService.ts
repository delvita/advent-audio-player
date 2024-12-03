import type { Chapter } from '@/components/ChapterList';
import type { FeedItem, FeedError, XMLParseResult } from '@/types/feed';

const TIMEOUT_DURATION = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const createFeedError = (message: string, type: FeedError['type'], originalError?: unknown): FeedError => {
  const error = new Error(message) as FeedError;
  error.type = type;
  error.originalError = originalError;
  return error;
};

const fetchWithTimeout = async (url: string): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    console.log(`Fetching feed from URL: ${url}`);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw createFeedError(
        `HTTP error! status: ${response.status}`,
        'NETWORK'
      );
    }
    
    console.log('Feed fetched successfully');
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error during fetch:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw createFeedError('Request timed out', 'TIMEOUT');
    }
    throw error;
  }
};

const parseXMLSafely = (text: string): XMLParseResult => {
  try {
    console.log('Attempting to parse XML');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML parsing error:', parseError.textContent);
      return {
        success: false,
        error: parseError.textContent || 'Unknown XML parsing error'
      };
    }

    console.log('XML parsed successfully');
    return {
      success: true,
      document: xmlDoc
    };
  } catch (error) {
    console.error('Error during XML parsing:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error'
    };
  }
};

const extractImageUrl = (content: string): string | undefined => {
  const imgMatch = content?.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
};

const parseFeedItem = (item: Element): FeedItem => {
  const title = item.querySelector('title')?.textContent || 'Untitled';
  const audioUrl = item.querySelector('enclosure')?.getAttribute('url') || null;
  const imageUrl = item.querySelector('media\\:content, content')?.getAttribute('url') ||
                  (item.querySelector('content\\:encoded, description')?.textContent && 
                   extractImageUrl(item.querySelector('content\\:encoded, description')?.textContent || ''));
  const publishDate = item.querySelector('pubDate')?.textContent;
  const content = item.querySelector('content\\:encoded, description')?.textContent;

  console.log(`Parsed feed item: ${title}`);
  return { title, audioUrl, imageUrl, publishDate, content };
};

export const getFeedItems = async ({ queryKey }: { queryKey: readonly [string, string] }): Promise<Chapter[]> => {
  let lastError: FeedError | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const [_, feedUrl] = queryKey;
      console.log(`Attempt ${attempt + 1}: Fetching feed from ${feedUrl}`);
      
      const proxyUrl = `https://mf1.ch/crosproxy/?${feedUrl}`;
      const response = await fetchWithTimeout(proxyUrl);
      const text = await response.text();
      const parseResult = parseXMLSafely(text);
      
      if (!parseResult.success || !parseResult.document) {
        throw createFeedError(
          `XML parsing error: ${parseResult.error}`,
          'PARSE'
        );
      }

      const items = Array.from(parseResult.document.querySelectorAll('item'))
        .map(parseFeedItem)
        .filter(item => item.audioUrl);

      console.log(`Successfully processed ${items.length} feed items`);

      return items.map(item => ({
        title: item.title,
        audioSrc: item.audioUrl || '',
        image: item.imageUrl,
        publishDate: item.publishDate
      }));
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error instanceof Error ? 
        createFeedError(error.message, 'UNKNOWN', error) :
        createFeedError('Unknown error occurred', 'UNKNOWN', error);
      
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