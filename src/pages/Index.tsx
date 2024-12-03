import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList, { Chapter } from '@/components/ChapterList';
import { getFeedItems } from '@/services/feedService';

const Index = () => {
  const [activeChapter, setActiveChapter] = useState<Chapter>();

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['feed-items', 'https://wirfamilien.ch/tag/advent/feed'],
    queryFn: getFeedItems
  });

  useEffect(() => {
    if (chapters.length > 0 && !activeChapter) {
      setActiveChapter(chapters[0]);
    }
  }, [chapters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {activeChapter && (
          <AudioPlayer
            src={activeChapter.audioSrc}
            title={activeChapter.title}
            image={activeChapter.image}
            autoPlay={false}
          />
        )}
        <ChapterList
          chapters={chapters}
          onChapterSelect={setActiveChapter}
          activeChapter={activeChapter}
        />
      </div>
    </div>
  );
};

export default Index;