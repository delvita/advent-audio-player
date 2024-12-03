import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList, { Chapter } from '@/components/ChapterList';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';
import { getSettingsById } from '@/services/settingsService';
import type { PlayerSettings } from '@/types/playerSettings';

const Embed = () => {
  const { embedId } = useParams();
  const [settings, setSettings] = useState<PlayerSettings | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (embedId) {
        setIsLoading(true);
        setError(null);
        try {
          const loadedSettings = await getSettingsById(embedId);
          if (loadedSettings) {
            setSettings(loadedSettings);
          } else {
            setError('Keine Einstellungen gefunden');
          }
        } catch (err) {
          setError('Fehler beim Laden der Einstellungen');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadSettings();
  }, [embedId]);

  const { data: chapters = [] } = useQuery({
    queryKey: ['feed-items', settings?.feedUrl],
    queryFn: () => getFeedItems({ queryKey: ['feed-items', settings?.feedUrl || ''] }),
    enabled: !!settings?.feedUrl
  });

  const sortedChapters = settings?.sortAscending ? [...chapters].reverse() : chapters;

  useEffect(() => {
    if (sortedChapters.length > 0 && settings && !activeChapter) {
      const initialChapter = settings.showFirstPost 
        ? sortedChapters[sortedChapters.length - 1] 
        : sortedChapters[0];
      setActiveChapter(initialChapter);
    }
  }, [sortedChapters.length, settings]);

  if (isLoading) {
    return <div className="p-4">Lädt...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!settings) {
    return <div className="p-4">Keine Einstellungen gefunden</div>;
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
          autoPlay={false}
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