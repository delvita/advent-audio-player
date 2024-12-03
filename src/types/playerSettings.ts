export interface PlayerSettings {
  id: string;
  name: string;
  feedUrl: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
  };
  listHeight: string;
  sortAscending: boolean;
  showFirstPost: boolean;
  playerType: 'big' | 'medium' | 'small';
}