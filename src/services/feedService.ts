import Parser from 'rss-parser';

export interface FeedItem {
  title: string;
  audioSrc: string;
  image?: string;
}

const parser = new Parser();

export const getFeedItems = async (): Promise<FeedItem[]> => {
  try {
    const feed = await parser.parseURL('https://wirfamilien.ch/tag/advent/feed');
    
    return feed.items.map(item => {
      // Extract audio source from content
      const audioMatch = item.content?.match(/<audio[^>]*src="([^"]*)"[^>]*>/);
      const audioSrc = audioMatch ? audioMatch[1] : '';
      
      // Extract image if available
      const imageMatch = item['media:content'] || item.enclosure;
      const image = imageMatch?.url;

      return {
        title: item.title || '',
        audioSrc,
        image
      };
    }).filter(item => item.audioSrc);
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
};