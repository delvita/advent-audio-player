export interface FeedItem {
  title: string;
  audioUrl?: string;
  imageUrl?: string;
  publishDate?: string;
  content?: string;
}

export interface FeedError extends Error {
  type: 'NETWORK' | 'PARSE' | 'TIMEOUT' | 'UNKNOWN';
  originalError?: unknown;
}

export interface FeedResponse {
  items: FeedItem[];
  error?: FeedError;
}