import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import AudioPlayer from '@/components/AudioPlayer';

const Customize = () => {
  const { toast } = useToast();
  const [customColors, setCustomColors] = useState({
    background: '#f3e8ff',
    text: '#1a1a1a',
    primary: '#9333ea',
    secondary: '#d8b4fe'
  });
  
  const [previewAudio] = useState({
    src: 'https://example.com/sample.mp3',
    title: 'Preview Audio',
    image: 'https://example.com/image.jpg'
  });

  const generateEmbedCode = () => {
    const embedCode = `<iframe 
  src="YOUR_DOMAIN/embed?bg=${encodeURIComponent(customColors.background)}&text=${encodeURIComponent(customColors.text)}&primary=${encodeURIComponent(customColors.primary)}&secondary=${encodeURIComponent(customColors.secondary)}"
  width="100%"
  height="200"
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
      <h1 className="text-3xl font-bold mb-8">Customize Player</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Color Settings</h2>
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
            '--player-secondary': customColors.secondary
          } as React.CSSProperties}>
            <AudioPlayer {...previewAudio} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;