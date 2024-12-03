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
  console.log('PlayerPreview rendering with props:', { 
    chaptersLength: chapters.length, 
    initialChapter, 
    showFirstPost, 
    listHeight 
  });

  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(initialChapter);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    if (chapters.length === 0) {
      console.log('No chapters available, returning');
      return;
    }

    // Nur setzen wenn kein aktives Kapitel vorhanden ist
    if (!activeChapter) {
      const defaultChapter = initialChapter || (showFirstPost ? chapters[chapters.length - 1] : chapters[0]);
      console.log('Setting default chapter:', defaultChapter);
      setActiveChapter(defaultChapter);
    }
  }, [chapters, showFirstPost, initialChapter]); // activeChapter bewusst ausgelassen

  const handleChapterSelect = (chapter: Chapter) => {
    console.log('Chapter selected:', chapter);
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