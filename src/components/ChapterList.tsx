import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

export interface Chapter {
  title: string;
  audioSrc: string;
  image?: string;
  publishDate?: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  onChapterSelect: (chapter: Chapter) => void;
  activeChapter: Chapter | null;
  maxHeight?: number;
}

const ChapterList = ({ chapters, onChapterSelect, activeChapter, maxHeight = 600 }: ChapterListProps) => {
  const heightClasses: Record<string, string> = {
    '300': 'h-[300px]',
    '400': 'h-[400px]',
    '500': 'h-[500px]',
    '600': 'h-[600px]',
    '700': 'h-[700px]'
  };
  
  const getHeightClass = (height: number): string => {
    const heightStr = height.toString();
    return heightClasses[heightStr] || heightClasses['600'];
  };
  
  return (
    <ScrollArea className={`w-full ${getHeightClass(maxHeight)} rounded-md border`}>
      <div className="space-y-0">
        {chapters.map((chapter, index) => (
          <div 
            key={index}
            className={`cursor-pointer transition-colors hover:bg-accent p-4 border-b last:border-b-0 ${
              activeChapter?.audioSrc === chapter.audioSrc ? 'bg-accent/50' : ''
            }`}
            onClick={() => onChapterSelect(chapter)}
          >
            <div className="flex gap-3">
              {chapter.image && (
                <img 
                  src={chapter.image} 
                  alt={chapter.title} 
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex flex-col flex-grow">
                <h4 className="font-medium text-sm">{chapter.title}</h4>
                {chapter.publishDate && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(chapter.publishDate), 'dd.MM.yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChapterList;