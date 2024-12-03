import { Chapter } from '@/components/ChapterList';

export const getFeedItems = async (context?: { queryKey: string[] }): Promise<Chapter[]> => {
  try {
    const feedUrl = context?.queryKey?.[1] || 'https://wirfamilien.ch/tag/advent/feed';
    const proxyUrl = `https://mf1.ch/crosproxy/?${feedUrl}`;
    
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      console.error('XML parsing error:', xmlDoc.getElementsByTagName('parsererror')[0].textContent);
      return [];
    }

    const items = xmlDoc.querySelectorAll('item');
    console.log(`Found ${items.length} items in feed`);

    return Array.from(items).map(item => {
      // Get title
      const title = item.querySelector('title')?.textContent || '';
      
      // Get enclosure (audio) URL
      const enclosure = item.querySelector('enclosure');
      const audioSrc = enclosure?.getAttribute('url') || '';
      
      // Get publication date
      const publishDate = item.querySelector('pubDate')?.textContent || '';
      
      // Get image from content or media:content
      let image = '';
      const content = item.querySelector('content\\:encoded')?.textContent || 
                     item.querySelector('description')?.textContent || '';
      
      // Try to find image in content
      const imgMatch = content.match(/<img[^>]*src="([^"]*)"[^>]*>/);
      if (imgMatch) {
        image = imgMatch[1];
      }
      
      // If no image in content, try media:content
      if (!image) {
        const mediaContent = item.querySelector('media\\:content, media\\:thumbnail');
        image = mediaContent?.getAttribute('url') || '';
      }

      return {
        title,
        audioSrc,
        image,
        publishDate
      };
    }).filter(item => item.audioSrc);
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
};