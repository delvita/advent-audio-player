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
import { generateEmbedId, saveSettings, getAllSettings, getSettingsById } from '@/services/settingsService';

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
        description: "Please enter a name for your settings",
        variant: "destructive"
      });
      return;
    }
    
    saveSettings(settings);
    setSavedSettings(getAllSettings());
    toast({
      title: "Success",
      description: "Settings saved successfully"
    });
  };

  const handleLoadSettings = (id: string) => {
    const loadedSettings = getSettingsById(id);
    if (loadedSettings) {
      setSettings(loadedSettings);
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
                    <Label htmlFor="settingsName">Settings Name</Label>
                    <Input
                      id="settingsName"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      placeholder="My Custom Player"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Saved Settings</Label>
                    <Select onValueChange={handleLoadSettings} value={settings.id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select saved settings" />
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

                <Button onClick={handleSaveSettings} className="w-full">
                  Save Settings
                </Button>

                <EmbedCodes embedId={settings.id} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
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