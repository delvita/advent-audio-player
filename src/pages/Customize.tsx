import { SettingsForm } from "../components/SettingsForm";
import { PlayerPreview } from '../components/PlayerPreview';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeedItems } from '../services/feedService';
import { useState } from 'react';
import { useToast } from "../hooks/use-toast";
import { PlayerSettings as PlayerSettingsType } from '../types/playerSettings';
import { generateEmbedId, saveSettings, getAllSettings, getSettingsById, deleteSettings } from '../services/settingsService';
import { TemplatesList } from "../components/TemplatesList";
import { Card } from "../components/ui/card";

const Customize = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<PlayerSettingsType>({
    id: generateEmbedId(),
    name: '',
    feedUrl: 'https://wirfamilien.ch/tag/advent/feed',
    colors: {
      background: '#ffffff',
      text: '#000000',
      primary: '#9b87f5',
      secondary: '#7E69AB'
    },
    listHeight: '600',
    sortAscending: false,
    showFirstPost: false,
    playerType: 'medium'
  });

  const { data: savedSettings = [], isError: isSettingsError } = useQuery({
    queryKey: ['settings'],
    queryFn: getAllSettings
  });

  const { data: chapters = [], isError: isFeedError } = useQuery({
    queryKey: ['feed-items', settings.feedUrl],
    queryFn: () => getFeedItems({ queryKey: ['feed-items', settings.feedUrl] })
  });

  const saveMutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Erfolg",
        description: "Einstellungen wurden erfolgreich gespeichert"
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern der Einstellungen",
        variant: "destructive"
      });
      console.error('Save settings error:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Erfolg",
        description: "Einstellungen wurden erfolgreich gelöscht"
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Fehler beim Löschen der Einstellungen",
        variant: "destructive"
      });
      console.error('Delete settings error:', error);
    }
  });

  const handleSaveSettings = () => {
    if (!settings.name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen für die Einstellungen ein",
        variant: "destructive"
      });
      return;
    }
    
    saveMutation.mutate(settings);
  };

  const handleLoadSettings = async (id: string) => {
    try {
      const loadedSettings = await getSettingsById(id);
      if (loadedSettings) {
        setSettings(loadedSettings);
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Einstellungen",
        variant: "destructive"
      });
      console.error('Load settings error:', error);
    }
  };

  const handleDeleteSettings = (id: string) => {
    deleteMutation.mutate(id);
    if (id === settings.id) {
      setSettings({
        ...settings,
        id: generateEmbedId(),
        name: ''
      });
    }
  };

  const sortedChapters = [...(chapters || [])];
  if (settings.sortAscending) {
    sortedChapters.reverse();
  }

  if (isSettingsError || isFeedError) {
    toast({
      title: "Fehler",
      description: "Fehler beim Laden der Daten",
      variant: "destructive"
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SettingsForm
            settings={settings}
            onSettingsChange={setSettings}
            onSave={handleSaveSettings}
          />
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Templates</h3>
            <TemplatesList
              templates={savedSettings}
              onEdit={handleLoadSettings}
              onDelete={handleDeleteSettings}
            />
          </div>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vorschau</h2>
            <div 
              className="rounded-lg overflow-hidden"
              style={{
                '--player-bg': settings.colors.background,
                '--player-text': settings.colors.text,
                '--player-primary': settings.colors.primary,
                '--player-secondary': settings.colors.secondary,
              } as React.CSSProperties}
            >
              <PlayerPreview
                chapters={sortedChapters}
                showFirstPost={settings.showFirstPost}
                listHeight={settings.listHeight}
                style={{
                  background: settings.colors.background,
                  color: settings.colors.text
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Customize;
