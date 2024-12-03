import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { Chapter } from '@/components/ChapterList';
import { useState, useEffect } from 'react';

interface PlayerPreviewProps {
  chapters: Chapter[];
  initialChapter?: Chapter;
  showFirstPost: boolean;
  listHeight: string;
}

export const PlayerPreview = ({ chapters, initialChapter, showFirstPost, listHeight }: PlayerPreviewProps) => {
  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(undefined);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    // Wenn ein initialChapter vorhanden ist, nutzen wir dieses
    if (initialChapter) {
      setActiveChapter(initialChapter);
      return;
    }
    
    // Ansonsten wählen wir basierend auf showFirstPost
    if (chapters.length > 0 && !activeChapter) {
      const defaultChapter = showFirstPost ? chapters[chapters.length - 1] : chapters[0];
      setActiveChapter(defaultChapter);
    }
  }, [chapters, showFirstPost, initialChapter]);

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