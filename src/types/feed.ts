export interface FeedItem {
  title: string;
  audioUrl: string | null;
  imageUrl?: string;
  publishDate?: string;
  content?: string;
}

export type FeedError = Error & {
  type: 'NETWORK' | 'PARSE' | 'TIMEOUT' | 'UNKNOWN';
  originalError?: unknown;
};

export interface XMLParseResult {
  success: boolean;
  document?: Document;
  error?: string;
}