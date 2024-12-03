import { Card, CardContent } from "@/components/ui/card";
import { ColorSettings } from "@/components/ColorSettings";
import { PlayerSettings } from "@/components/PlayerSettings";
import { EmbedCodes } from "@/components/EmbedCodes";
import { PlayerPreview } from '@/components/PlayerPreview';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlayerSettings as PlayerSettingsType } from '@/types/playerSettings';
import { generateEmbedId, saveSettings, getAllSettings, getSettingsById, deleteSettings } from '@/services/settingsService';
import { TemplatesList } from "@/components/TemplatesList";

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

  const { data: savedSettings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: getAllSettings
  });

  const { data: chapters = [] } = useQuery({
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
    onError: () => {
      toast({
        title: "Error",
        description: "Fehler beim Speichern der Einstellungen",
        variant: "destructive"
      });
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
    onError: () => {
      toast({
        title: "Error",
        description: "Fehler beim Löschen der Einstellungen",
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    if (!settings.name) {
      toast({
        title: "Error",
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
        title: "Error",
        description: "Fehler beim Laden der Einstellungen",
        variant: "destructive"
      });
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

  const sortedChapters = [...chapters];
  if (settings.sortAscending) {
    sortedChapters.reverse();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="settingsName">Name der Einstellungen</Label>
                  <Input
                    id="settingsName"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    placeholder="Mein Custom Player"
                  />
                </div>

                <div>
                  <Label htmlFor="feedUrl">Feed URL</Label>
                  <Input
                    id="feedUrl"
                    value={settings.feedUrl}
                    onChange={(e) => setSettings({ ...settings, feedUrl: e.target.value })}
                  />
                </div>

                <ColorSettings 
                  colors={settings.colors} 
                  onChange={(colors) => setSettings({ ...settings, colors })} 
                />
                
                <PlayerSettings
                  listHeight={settings.listHeight}
                  sortAscending={settings.sortAscending}
                  showFirstPost={settings.showFirstPost}
                  playerType={settings.playerType}
                  onHeightChange={(height) => setSettings({ ...settings, listHeight: height })}
                  onSortChange={(sort) => setSettings({ ...settings, sortAscending: sort })}
                  onFirstPostChange={(show) => setSettings({ ...settings, showFirstPost: show })}
                  onPlayerTypeChange={(type) => setSettings({ ...settings, playerType: type })}
                />

                <Button onClick={handleSaveSettings} className="w-full">
                  Einstellungen speichern
                </Button>

                <EmbedCodes embedId={settings.id} />

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Templates</h3>
                  <TemplatesList
                    templates={savedSettings}
                    onEdit={handleLoadSettings}
                    onDelete={handleDeleteSettings}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Vorschau</h2>
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
        </div>
      </div>
    </div>
  );
};

export default Customize;