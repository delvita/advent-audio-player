import { Chapter } from '@/components/ChapterList';

export const getFeedItems = async (context?: { queryKey: string[] }): Promise<Chapter[]> => {
  try {
    const feedUrl = context?.queryKey?.[1] || 'https://wirfamilien.ch/tag/advent/feed';
    console.log('Feed URL:', feedUrl);
    
    const proxyUrl = `https://mf1.ch/crosproxy/?${feedUrl}`;
    console.log('Proxy URL:', proxyUrl);
    
    console.log('Fetching feed...');
    const response = await fetch(proxyUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('Raw response text (first 500 chars):', text.substring(0, 500));

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      const parseError = xmlDoc.getElementsByTagName('parsererror')[0].textContent;
      console.error('XML parsing error:', parseError);
      return [];
    }

    const items = xmlDoc.querySelectorAll('item');
    console.log(`Found ${items.length} items in feed`);

    const chapters = Array.from(items).map((item, index) => {
      // Get title
      const title = item.querySelector('title')?.textContent || '';
      console.log(`Item ${index + 1} title:`, title);
      
      // Get enclosure (audio) URL
      const enclosure = item.querySelector('enclosure');
      const audioSrc = enclosure?.getAttribute('url') || '';
      console.log(`Item ${index + 1} audio:`, audioSrc);
      
      // Get publication date
      const publishDate = item.querySelector('pubDate')?.textContent || '';
      console.log(`Item ${index + 1} date:`, publishDate);
      
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
      console.log(`Item ${index + 1} image:`, image);

      return {
        title,
        audioSrc,
        image,
        publishDate
      };
    }).filter(item => {
      if (!item.audioSrc) {
        console.log('Filtering out item without audio:', item.title);
        return false;
      }
      return true;
    });

    console.log('Final processed chapters:', chapters);
    return chapters;
  } catch (error) {
    console.error('Error in getFeedItems:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return [];
  }
};