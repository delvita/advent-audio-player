import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { Chapter } from '@/components/ChapterList';
import { useState } from 'react';

interface PlayerPreviewProps {
  chapters: Chapter[];
  initialChapter?: Chapter;
  showFirstPost: boolean;
  listHeight: string;
}

export const PlayerPreview = ({ chapters, initialChapter, showFirstPost, listHeight }: PlayerPreviewProps) => {
  const defaultChapter = showFirstPost && chapters.length > 0 
    ? chapters[chapters.length - 1] 
    : chapters[0];

  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(
    initialChapter || defaultChapter
  );
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

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