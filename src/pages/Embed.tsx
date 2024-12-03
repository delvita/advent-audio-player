import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';

const Embed = () => {
  const [searchParams] = useSearchParams();
  const [activeChapter, setActiveChapter] = useState<any>();
  
  // Get settings from URL params
  const bg = searchParams.get('bg') || '#ffffff';
  const text = searchParams.get('text') || '#000000';
  const primary = searchParams.get('primary') || '#9b87f5';
  const secondary = searchParams.get('secondary') || '#7E69AB';
  const listHeight = searchParams.get('height') || '600';
  const sortAsc = searchParams.get('sortAsc') === 'true';
  const showFirst = searchParams.get('showFirst') === 'true';

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['feed-items'],
    queryFn: getFeedItems
  });

  useEffect(() => {
    if (chapters.length > 0) {
      // Set initial chapter based on settings
      const initialChapter = showFirst ? chapters[chapters.length - 1] : chapters[0];
      setActiveChapter(initialChapter);
    }
  }, [chapters, showFirst]);

  const sortedChapters = [...chapters];
  if (sortAsc) {
    sortedChapters.reverse();
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{
      '--player-bg': bg,
      '--player-text': text,
      '--player-primary': primary,
      '--player-secondary': secondary,
    } as React.CSSProperties}>
      {activeChapter && (
        <AudioPlayer
          src={activeChapter.audioSrc}
          title={activeChapter.title}
          image={activeChapter.image}
        />
      )}
      <ChapterList
        chapters={sortedChapters}
        onChapterSelect={setActiveChapter}
        activeChapter={activeChapter}
        maxHeight={parseInt(listHeight)}
      />
    </div>
  );
};

export default Embed;