import { Chapter } from '@/components/ChapterList';

export const getFeedItems = async (): Promise<Chapter[]> => {
  try {
    // Use RSS2JSON service to convert RSS to JSON
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        'https://wirfamilien.ch/tag/advent/feed'
      )}`
    );
    
    const data = await response.json();
    
    if (!data.items) {
      console.error('No items found in feed');
      return [];
    }

    return data.items.map(item => {
      // Extract audio source from content
      const audioMatch = item.content?.match(/<audio[^>]*src="([^"]*)"[^>]*>/);
      const audioSrc = audioMatch ? audioMatch[1] : '';
      
      return {
        title: item.title || '',
        audioSrc,
        image: item.thumbnail || item.enclosure?.link
      };
    }).filter(item => item.audioSrc);
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
};