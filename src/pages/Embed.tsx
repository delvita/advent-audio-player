import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PlayerPreview } from '../components/PlayerPreview';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '../services/feedService';
import { getSettingsById } from '../services/settingsService';
import { useToast } from '../hooks/use-toast';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { PlayerSettings } from '../types/settings';
import type { PlayerCSSProperties } from '../types/styles';

const Embed = () => {
  const { embedId } = useParams();
  const [settings, setSettings] = useState<PlayerSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      if (!embedId) {
        toast({
          title: "Fehler",
          description: "Keine Player-ID gefunden",
          variant: "destructive"
        });
        return;
      }
      
      try {
        const loadedSettings = await getSettingsById(embedId);
        if (!loadedSettings) {
          toast({
            title: "Fehler",
            description: "Player-Einstellungen nicht gefunden",
            variant: "destructive"
          });
          return;
        }
        setSettings(loadedSettings);
      } catch (err) {
        toast({
          title: "Fehler",
          description: "Fehler beim Laden der Player-Einstellungen",
          variant: "destructive"
        });
        console.error('Settings loading error:', err);
      }
    };
    
    loadSettings();
  }, [embedId, toast]);

  const { 
    data: chapters = [], 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['feed-items', settings?.feedUrl],
    queryFn: () => getFeedItems({ queryKey: ['feed-items', settings?.feedUrl || ''] }),
    enabled: !!settings?.feedUrl,
    meta: {
      onError: (err: Error) => {
        toast({
          title: "Fehler",
          description: "Fehler beim Laden der Audio-Kapitel",
          variant: "destructive"
        });
        console.error('Feed loading error:', err);
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Audio-Kapitel'}
        </p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <p className="text-muted-foreground">Keine Player-Einstellungen gefunden</p>
      </div>
    );
  }

  if (!Array.isArray(chapters) || chapters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <p className="text-muted-foreground">Keine Audio-Kapitel verfügbar</p>
      </div>
    );
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
          style={playerStyle}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Embed;
