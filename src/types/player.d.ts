export interface Chapter {
  title: string;
  audioSrc: string;
  image?: string;
  publishDate?: string;
}

export interface PlayerPreviewProps {
  chapters?: Chapter[];
  showFirstPost: boolean;
  listHeight: string;
  style?: PlayerCSSProperties;
}