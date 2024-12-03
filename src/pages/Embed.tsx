import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PlayerPreview } from '@/components/PlayerPreview';
import { Chapter } from '@/components/ChapterList';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';
import { getSettingsById } from '@/services/settingsService';
import type { PlayerSettings } from '@/types/playerSettings';

const Embed = () => {
  const { embedId } = useParams();
  const [settings, setSettings] = useState<PlayerSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!embedId) return;
      
      try {
        const loadedSettings = await getSettingsById(embedId);
        if (loadedSettings) {
          setSettings(loadedSettings);
        } else {
          setError('Keine Einstellungen gefunden');
        }
      } catch (err) {
        setError('Fehler beim Laden der Einstellungen');
        console.error('Settings loading error:', err);
      }
    };
    
    loadSettings();
  }, [embedId]);

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['feed-items', settings?.feedUrl],
    queryFn: () => getFeedItems({ queryKey: ['feed-items', settings?.feedUrl || ''] }),
    enabled: !!settings?.feedUrl
  });

  if (isLoading) {
    return <div className="p-4">Lädt...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!settings) {
    return <div className="p-4">Keine Einstellungen gefunden</div>;
  }

  const sortedChapters = settings.sortAscending ? [...chapters].reverse() : chapters;

  return (
    <div style={{
      '--player-bg': settings.colors.background,
      '--player-text': settings.colors.text,
      '--player-primary': settings.colors.primary,
      '--player-secondary': settings.colors.secondary,
    } as React.CSSProperties}>
      <PlayerPreview
        chapters={sortedChapters}
        showFirstPost={settings.showFirstPost}
        listHeight={settings.listHeight}
      />
    </div>
  );
};

export default Embed;