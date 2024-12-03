import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { Chapter } from '@/components/ChapterList';
import { useState, useEffect } from 'react';

interface PlayerPreviewProps {
  chapters: Chapter[];
  showFirstPost: boolean;
  listHeight: string;
}

export const PlayerPreview = ({ chapters, showFirstPost, listHeight }: PlayerPreviewProps) => {
  const initialChapter = showFirstPost && chapters.length > 0 
    ? chapters[chapters.length - 1] 
    : chapters[0];

  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(initialChapter);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    const newInitialChapter = showFirstPost && chapters.length > 0 
      ? chapters[chapters.length - 1] 
      : chapters[0];
    setActiveChapter(newInitialChapter);
  }, [chapters, showFirstPost]);

  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setShouldAutoPlay(true);
  };

  if (!chapters.length) {
    return <div className="p-4">No chapters available</div>;
  }

  return (
    <div className="w-full h-full">
      {activeChapter && (
        <AudioPlayer
          src={activeChapter.audioSrc}
          title={activeChapter.title}
          image={activeChapter.image}
          autoPlay={shouldAutoPlay}
        />
      )}
      <div className="mt-2.5">
        <ChapterList
          chapters={chapters}
          onChapterSelect={handleChapterSelect}
          activeChapter={activeChapter}
          maxHeight={parseInt(listHeight)}
        />
      </div>
    </div>
  );
};