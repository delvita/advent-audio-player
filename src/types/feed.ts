export interface FeedItem {
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

export interface ParsedFeed {
  items: FeedItem[];
}

export interface FeedError extends Error {
  type: 'NETWORK' | 'PARSE' | 'TIMEOUT' | 'UNKNOWN';
  originalError?: unknown;
}