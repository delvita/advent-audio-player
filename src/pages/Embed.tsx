import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PlayerPreview } from '@/components/PlayerPreview';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';
import { getSettingsById } from '@/services/settingsService';
import type { PlayerSettings } from '@/types/playerSettings';
import type { PlayerCSSProperties } from '@/types/css';
import { useToast } from '@/components/ui/use-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Embed = () => {
  const { embedId } = useParams();
  const [settings, setSettings] = useState<PlayerSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      if (!embedId) return;
      
      try {
        const loadedSettings = await getSettingsById(embedId);
        setSettings(loadedSettings);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load player settings",
          variant: "destructive"
        });
        console.error('Settings loading error:', err);
      }
    };
    
    loadSettings();
  }, [embedId, toast]);

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['feed-items', settings?.feedUrl],
    queryFn: () => getFeedItems({ queryKey: ['feed-items', settings?.feedUrl || ''] }),
    enabled: !!settings?.feedUrl,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load audio chapters",
          variant: "destructive"
        });
      }
    }
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!settings) {
    return <div className="p-4">No settings found</div>;
  }

  const sortedChapters = settings.sortAscending ? [...chapters].reverse() : chapters;

  const playerStyle: PlayerCSSProperties = {
    '--player-bg': settings.colors.background,
    '--player-text': settings.colors.text,
    '--player-primary': settings.colors.primary,
    '--player-secondary': settings.colors.secondary,
  };

  return (
    <ErrorBoundary>
      <div className="h-full w-full" style={playerStyle}>
        <PlayerPreview
          chapters={sortedChapters}
          showFirstPost={settings.showFirstPost}
          listHeight={settings.listHeight}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Embed;