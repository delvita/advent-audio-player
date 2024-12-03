export interface PlayerSettings {
  id: string;
  name: string;
  feedUrl: string;
  colors: {
    text: string;
    primary: string;
    secondary: string;
    background: string;
  };
  listHeight: string;
  sortAscending: boolean;
  showFirstPost: boolean;
  playerType: string;
}