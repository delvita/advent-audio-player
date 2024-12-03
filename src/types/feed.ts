export interface FeedItem {
  title: string;
  audioUrl: string | null;
  imageUrl?: string;
  publishDate?: string;
  content?: string;
}

export interface FeedError extends Error {
  type: 'NETWORK' | 'PARSE' | 'TIMEOUT' | 'UNKNOWN';
  originalError?: unknown;
}

export interface XMLParseResult {
  success: boolean;
  error?: string;
  document?: Document;
}