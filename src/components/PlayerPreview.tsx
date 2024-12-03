import { useState, useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Chapter, PlayerPreviewProps } from '@/types/player';
import type { PlayerCSSProperties } from '@/types/styles';

export const PlayerPreview = ({ 
  chapters = [], 
  showFirstPost, 
  listHeight,
  style 
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
    <div className="w-full h-full" style={style}>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </div>
  );
};

export default PlayerPreview;
