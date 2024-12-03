import { Card, CardContent } from "@/components/ui/card";
import { ColorSettings } from "@/components/ColorSettings";
import { PlayerSettings } from "@/components/PlayerSettings";
import { EmbedCodes } from "@/components/EmbedCodes";
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlayerSettings as PlayerSettingsType } from '@/types/playerSettings';
import { generateEmbedId, saveSettings, getAllSettings, getSettingsById, deleteSettings } from '@/services/settingsService';
import { Trash2 } from "lucide-react";

const Customize = () => {
  const { toast } = useToast();
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
  
  const [savedSettings, setSavedSettings] = useState<PlayerSettingsType[]>([]);
  const [activeChapter, setActiveChapter] = useState<any>();

  const { data: chapters = [] } = useQuery({
    queryKey: ['feed-items', settings.feedUrl],
    queryFn: () => getFeedItems({ queryKey: ['feed-items', settings.feedUrl] })
  });

  useEffect(() => {
    setSavedSettings(getAllSettings());
  }, []);

  useEffect(() => {
    if (chapters.length > 0) {
      const initialChapter = settings.showFirstPost ? chapters[chapters.length - 1] : chapters[0];
      setActiveChapter(initialChapter);
    }
  }, [chapters, settings.showFirstPost]);

  const sortedChapters = [...chapters];
  if (settings.sortAscending) {
    sortedChapters.reverse();
  }

  const handleSaveSettings = () => {
    if (!settings.name) {
      toast({
        title: "Error",
        description: "Bitte geben Sie einen Namen für die Einstellungen ein",
        variant: "destructive"
      });
      return;
    }
    
    saveSettings(settings);
    setSavedSettings(getAllSettings());
    toast({
      title: "Erfolg",
      description: "Einstellungen wurden erfolgreich gespeichert"
    });
  };

  const handleLoadSettings = async (id: string) => {
    const loadedSettings = await getSettingsById(id);
    if (loadedSettings) {
      setSettings(loadedSettings);
    }
  };

  const handleDeleteSettings = () => {
    if (settings.id) {
      deleteSettings(settings.id);
      setSavedSettings(getAllSettings());
      setSettings({
        ...settings,
        id: generateEmbedId(),
        name: ''
      });
      toast({
        title: "Erfolg",
        description: "Einstellungen wurden erfolgreich gelöscht"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="settingsName">Name der Einstellungen</Label>
                    <Input
                      id="settingsName"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      placeholder="Mein Custom Player"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Gespeicherte Einstellungen</Label>
                    <Select onValueChange={handleLoadSettings} value={settings.id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gespeicherte Einstellungen auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedSettings.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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

                <div className="flex gap-4">
                  <Button onClick={handleSaveSettings} className="flex-1">
                    Einstellungen speichern
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteSettings}
                    className="w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <EmbedCodes embedId={settings.id} />
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
        </div>
      </div>
    </div>
  );
};

export default Customize;