import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import AudioPlayer from '@/components/AudioPlayer';
import ChapterList from '@/components/ChapterList';
import { useQuery } from '@tanstack/react-query';
import { getFeedItems } from '@/services/feedService';

const Customize = () => {
  const { toast } = useToast();
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

  React.useEffect(() => {
    if (chapters.length > 0) {
      const initialChapter = showFirstPost ? chapters[chapters.length - 1] : chapters[0];
      setActiveChapter(initialChapter);
    }
  }, [chapters, showFirstPost]);

  const sortedChapters = [...chapters];
  if (sortAscending) {
    sortedChapters.reverse();
  }

  const generateEmbedCode = () => {
    const embedCode = `<iframe 
  src="${window.location.origin}/embed?bg=${encodeURIComponent(customColors.background)}&text=${encodeURIComponent(customColors.text)}&primary=${encodeURIComponent(customColors.primary)}&secondary=${encodeURIComponent(customColors.secondary)}&height=${listHeight}&sortAsc=${sortAscending}&showFirst=${showFirstPost}"
  width="100%"
  height="${parseInt(listHeight) + 400}px"
  frameborder="0"
></iframe>`;

    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed Code Copied!",
      description: "The embed code has been copied to your clipboard.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Player Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="background">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={customColors.background}
                    onChange={(e) => setCustomColors(prev => ({...prev, background: e.target.value}))}
                    className="w-16"
                  />
                  <Input
                    type="text"
                    value={customColors.background}
                    onChange={(e) => setCustomColors(prev => ({...prev, background: e.target.value}))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="text">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text"
                    type="color"
                    value={customColors.text}
                    onChange={(e) => setCustomColors(prev => ({...prev, text: e.target.value}))}
                    className="w-16"
                  />
                  <Input
                    type="text"
                    value={customColors.text}
                    onChange={(e) => setCustomColors(prev => ({...prev, text: e.target.value}))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors(prev => ({...prev, primary: e.target.value}))}
                    className="w-16"
                  />
                  <Input
                    type="text"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors(prev => ({...prev, primary: e.target.value}))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors(prev => ({...prev, secondary: e.target.value}))}
                    className="w-16"
                  />
                  <Input
                    type="text"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors(prev => ({...prev, secondary: e.target.value}))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="listHeight">List Height (px)</Label>
                <Input
                  id="listHeight"
                  type="number"
                  value={listHeight}
                  onChange={(e) => setListHeight(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sortAscending"
                  checked={sortAscending}
                  onCheckedChange={setSortAscending}
                />
                <Label htmlFor="sortAscending">Sort Oldest First</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showFirstPost"
                  checked={showFirstPost}
                  onCheckedChange={setShowFirstPost}
                />
                <Label htmlFor="showFirstPost">Show First Post Initially</Label>
              </div>

              <Button onClick={generateEmbedCode} className="w-full">
                Generate Embed Code
              </Button>
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
  );
};

export default Customize;