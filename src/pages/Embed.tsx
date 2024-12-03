import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';
import { getSettingsById } from '@/services/settingsService';
import type { PlayerSettings } from '@/types/playerSettings';

const Embed = () => {
  const { embedId } = useParams();
  const [activeChapter, setActiveChapter] = useState<any>();
  const [settings, setSettings] = useState<PlayerSettings | null>(null);
  
  useEffect(() => {
    if (embedId) {
      const loadedSettings = getSettingsById(embedId);
      if (loadedSettings) {
        setSettings(loadedSettings);
        console.log('Settings loaded:', loadedSettings); // Debug log
      } else {
        console.log('No settings found for ID:', embedId); // Debug log
      }
    }
  }, [embedId]);

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['feed-items', settings?.feedUrl],
    queryFn: () => getFeedItems({ queryKey: ['feed-items', settings?.feedUrl || ''] }),
    enabled: !!settings?.feedUrl
  });

  useEffect(() => {
    if (chapters.length > 0 && settings) {
      const initialChapter = settings.showFirstPost ? chapters[chapters.length - 1] : chapters[0];
      setActiveChapter(initialChapter);
    }
  }, [chapters, settings?.showFirstPost]);

  const sortedChapters = [...chapters];
  if (settings?.sortAscending) {
    sortedChapters.reverse();
  }

  if (!settings) {
    return <div className="p-4">Keine Einstellungen gefunden</div>;
  }

  if (isLoading) {
    return <div className="p-4">Lädt...</div>;
  }

  return (
    <div style={{
      '--player-bg': settings.colors.background,
      '--player-text': settings.colors.text,
      '--player-primary': settings.colors.primary,
      '--player-secondary': settings.colors.secondary,
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
          maxHeight={parseInt(settings.listHeight)}
        />
      </div>
    </div>
  );
};

export default Embed;