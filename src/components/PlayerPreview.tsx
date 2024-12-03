import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { Chapter } from '@/components/ChapterList';
import { useState, useMemo } from 'react';

interface PlayerPreviewProps {
  chapters: Chapter[];
  initialChapter?: Chapter;
  showFirstPost: boolean;
  listHeight: string;
}

export const PlayerPreview = ({ chapters, initialChapter, showFirstPost, listHeight }: PlayerPreviewProps) => {
  // Berechne das initiale Kapitel mit useMemo statt useCallback
  const defaultChapter = useMemo(() => {
    if (initialChapter) return initialChapter;
    if (chapters.length === 0) return undefined;
    return showFirstPost ? chapters[chapters.length - 1] : chapters[0];
  }, [chapters, initialChapter, showFirstPost]);

  // Initialisiere states
  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(defaultChapter);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // Handle chapter selection
  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setShouldAutoPlay(true);
  };

  return (
    <div>
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