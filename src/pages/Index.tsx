import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList, { Chapter } from '@/components/ChapterList';
import { getFeedItems } from '@/services/feedService';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [activeChapter, setActiveChapter] = useState<Chapter>();
  const { toast } = useToast();

  const { data: chapters = [], isLoading, error } = useQuery({
    queryKey: ['feed-items', 'https://wirfamilien.ch/tag/advent/feed'],
    queryFn: getFeedItems,
    meta: {
      onError: (err: Error) => {
        toast({
          title: 'Error',
          description: 'Failed to load audio chapters',
          variant: 'destructive',
        });
        console.error('Feed loading error:', err);
      }
    }
  });

  useEffect(() => {
    if (chapters.length > 0 && !activeChapter) {
      console.log('Setting initial chapter:', chapters[0]);
      setActiveChapter(chapters[0]);
    }
  }, [chapters, activeChapter]);

  const handleChapterSelect = (chapter: Chapter) => {
    console.log('Selected chapter:', chapter);
    setActiveChapter(chapter);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Failed to load audio chapters</p>
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
          onChapterSelect={handleChapterSelect}
          activeChapter={activeChapter}
        />
      </div>
    </div>
  );
};

export default Index;