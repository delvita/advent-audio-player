import AudioPlayer from '@/components/AudioPlayer';
import ChapterList, { Chapter } from '@/components/ChapterList';
import { useState, useEffect } from 'react';

interface PlayerPreviewProps {
  chapters?: Chapter[];
  showFirstPost: boolean;
  listHeight: string;
}

export const PlayerPreview = ({ 
  chapters = [], 
  showFirstPost, 
  listHeight 
}: PlayerPreviewProps) => {
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    if (!Array.isArray(chapters) || chapters.length === 0) {
      setActiveChapter(null);
      return;
    }

    const initialChapter = showFirstPost ? chapters[chapters.length - 1] : chapters[0];
    if (initialChapter) {
      setActiveChapter(initialChapter);
    }
  }, [chapters, showFirstPost]);

  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setShouldAutoPlay(true);
  };

  if (!Array.isArray(chapters) || chapters.length === 0) {
    return <div className="p-4">Keine Kapitel verfügbar</div>;
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

export default PlayerPreview;