import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export interface Chapter {
  title: string;
  audioSrc: string;
  image?: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  onChapterSelect: (chapter: Chapter) => void;
  activeChapter?: Chapter;
}

const ChapterList = ({ chapters, onChapterSelect, activeChapter }: ChapterListProps) => {
  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => (
        <Card 
          key={index}
          className={`cursor-pointer transition-colors hover:bg-accent ${
            activeChapter?.audioSrc === chapter.audioSrc ? 'border-primary' : ''
          }`}
          onClick={() => onChapterSelect(chapter)}
        >
          <CardContent className="flex items-center gap-4 p-4">
            {chapter.image && (
              <img 
                src={chapter.image} 
                alt={chapter.title} 
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h4 className="font-medium">{chapter.title}</h4>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChapterList;