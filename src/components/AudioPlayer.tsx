import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  src: string;
  title: string;
  image?: string;
  autoPlay?: boolean;
}

const AudioPlayer = ({ src, title, image, autoPlay = false }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      
      // Don't attempt autoplay on initial load
      setIsPlaying(false);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        }
      };
    }
  }, [src]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Playback failed:', error);
            toast({
              title: "Wiedergabe fehlgeschlagen",
              description: "Bitte versuchen Sie es erneut.",
              variant: "destructive",
            });
            setIsPlaying(false);
          });
      }
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

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <CardContent className="p-6">
        {image && (
          <div className="mb-4">
            <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg shadow-lg" />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-100">{title}</h3>
        <audio ref={audioRef} src={src} className="hidden" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-purple-700 dark:text-purple-200">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleSliderChange}
            className="w-full"
          />

          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSkipBack}
              className="hover:bg-purple-100 dark:hover:bg-purple-900"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              onClick={togglePlay}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSkipForward}
              className="hover:bg-purple-100 dark:hover:bg-purple-900"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;