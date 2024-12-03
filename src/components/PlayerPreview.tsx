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
  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(undefined);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    const chapterList = Array.isArray(chapters) ? chapters : [];
    
    if (chapterList.length === 0) {
      setActiveChapter(undefined);
      return;
    }

    const initialChapter = showFirstPost ? chapterList[chapterList.length - 1] : chapterList[0];
    if (initialChapter && 'audioSrc' in initialChapter && initialChapter.audioSrc) {
      setActiveChapter(initialChapter);
    }
  }, [chapters, showFirstPost]);

  const handleChapterSelect = (chapter: Chapter) => {
    if (chapter && 'audioSrc' in chapter && chapter.audioSrc) {
      setActiveChapter(chapter);
      setShouldAutoPlay(true);
    }
  };

  const chapterList = Array.isArray(chapters) ? chapters : [];

  if (chapterList.length === 0) {
    return <div className="p-4">Keine Kapitel verfügbar</div>;
  }

  return (
    <div className="w-full h-full">
      {activeChapter && 'audioSrc' in activeChapter && activeChapter.audioSrc && (
        <AudioPlayer
          src={activeChapter.audioSrc}
          title={activeChapter.title}
          image={activeChapter.image}
          autoPlay={shouldAutoPlay}
        />
      )}
      <div className="mt-2.5">
        <ChapterList
          chapters={chapterList}
          onChapterSelect={handleChapterSelect}
          activeChapter={activeChapter}
          maxHeight={parseInt(listHeight)}
        />
      </div>
    </div>
  );
};