import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title: string;
  image?: string;
}

const AudioPlayer = ({ src, title, image }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        {image && (
          <div className="mb-4">
            <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <audio ref={audioRef} src={src} className="hidden" />
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={handleSkipBack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleSkipForward}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;