import { Card, CardContent } from "@/components/ui/card";
import { ColorSettings } from "@/components/ColorSettings";
import { PlayerSettings } from "@/components/PlayerSettings";
import { EmbedCodes } from "@/components/EmbedCodes";
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';
import { useState, useEffect } from 'react';

const Customize = () => {
  const [customColors, setCustomColors] = useState({
    background: '#ffffff',
    text: '#000000',
    primary: '#9b87f5',
    secondary: '#7E69AB'
  });
  
  const [listHeight, setListHeight] = useState('600');
  const [sortAscending, setSortAscending] = useState(false);
  const [showFirstPost, setShowFirstPost] = useState(false);
  const [activeChapter, setActiveChapter] = useState<any>();

  const { data: chapters = [] } = useQuery({
    queryKey: ['feed-items'],
    queryFn: getFeedItems
  });

  useEffect(() => {
    if (chapters.length > 0) {
      const initialChapter = showFirstPost ? chapters[chapters.length - 1] : chapters[0];
      setActiveChapter(initialChapter);
    }
  }, [chapters, showFirstPost]);

  const sortedChapters = [...chapters];
  if (sortAscending) {
    sortedChapters.reverse();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Player Settings</h2>
            <div className="space-y-6">
              <ColorSettings colors={customColors} onChange={setCustomColors} />
              <PlayerSettings
                listHeight={listHeight}
                sortAscending={sortAscending}
                showFirstPost={showFirstPost}
                onHeightChange={setListHeight}
                onSortChange={setSortAscending}
                onFirstPostChange={setShowFirstPost}
              />
              <EmbedCodes
                colors={customColors}
                listHeight={listHeight}
                sortAscending={sortAscending}
                showFirstPost={showFirstPost}
              />
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div style={{
            '--player-bg': customColors.background,
            '--player-text': customColors.text,
            '--player-primary': customColors.primary,
            '--player-secondary': customColors.secondary,
          } as React.CSSProperties}>
            {activeChapter && (
              <AudioPlayer
                src={activeChapter.audioSrc}
                title={activeChapter.title}
                image={activeChapter.image}
              />
            )}
            <div className="mt-2.5">
              <ChapterList
                chapters={sortedChapters}
                onChapterSelect={setActiveChapter}
                activeChapter={activeChapter}
                maxHeight={parseInt(listHeight)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;