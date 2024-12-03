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
  activeChapter?: Chapter;
  maxHeight?: number;
}

const ChapterList = ({ chapters, onChapterSelect, activeChapter, maxHeight = 600 }: ChapterListProps) => {
  return (
    <ScrollArea className={`w-full h-[${maxHeight}px] rounded-md border`}>
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