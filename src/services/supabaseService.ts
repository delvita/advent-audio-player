import { supabase } from "@/integrations/supabase/client";
import { PlayerSettings } from "@/types/playerSettings";

// Type for the database row
type DbPlayerSettings = {
  id: string;
  name: string;
  feed_url: string;
  colors: PlayerSettings['colors'];
  list_height: string;
  sort_ascending: boolean;
  show_first_post: boolean;
  player_type: "big" | "medium" | "small";
};

// Convert database row to PlayerSettings
const toPlayerSettings = (dbSettings: any): PlayerSettings => ({
  id: dbSettings.id,
  name: dbSettings.name,
  feedUrl: dbSettings.feed_url,
  colors: typeof dbSettings.colors === 'string' 
    ? JSON.parse(dbSettings.colors) 
    : dbSettings.colors,
  listHeight: dbSettings.list_height,
  sortAscending: dbSettings.sort_ascending,
  showFirstPost: dbSettings.show_first_post,
  playerType: dbSettings.player_type as "big" | "medium" | "small",
});

// Convert PlayerSettings to database format
const toDbFormat = (settings: PlayerSettings): Omit<DbPlayerSettings, 'id'> => ({
  name: settings.name,
  feed_url: settings.feedUrl,
  colors: settings.colors,
  list_height: settings.listHeight,
  sort_ascending: settings.sortAscending,
  show_first_post: settings.showFirstPost,
  player_type: settings.playerType,
});

export const saveSettings = async (settings: PlayerSettings): Promise<void> => {
  const { error } = await supabase
    .from('player_settings')
    .upsert({
      id: settings.id,
      ...toDbFormat(settings)
    });

  if (error) throw error;
};

export const deleteSettings = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('player_settings')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAllSettings = async (): Promise<PlayerSettings[]> => {
  const { data, error } = await supabase
    .from('player_settings')
    .select('*');

  if (error) throw error;
  return data ? data.map(toPlayerSettings) : [];
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  const { data, error } = await supabase
    .from('player_settings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? toPlayerSettings(data) : null;
};