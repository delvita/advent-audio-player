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

  // Initialisiere activeChapter direkt mit einem berechneten Wert
  const getInitialChapter = () => {
    if (initialChapter) return initialChapter;
    if (chapters.length === 0) return undefined;
    return showFirstPost ? chapters[chapters.length - 1] : chapters[0];
  };

  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(getInitialChapter());
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // Aktualisiere activeChapter nur wenn sich die relevanten Props ändern
  useEffect(() => {
    const newChapter = getInitialChapter();
    if (!activeChapter && newChapter) {
      console.log('Updating active chapter:', newChapter);
      setActiveChapter(newChapter);
    }
  }, [chapters, showFirstPost, initialChapter]); // activeChapter absichtlich ausgelassen

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