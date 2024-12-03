import { supabase } from "@/integrations/supabase/client";
import { PlayerSettings } from "@/types/playerSettings";

export const saveSettings = async (settings: PlayerSettings): Promise<void> => {
  const { error } = await supabase
    .from('player_settings')
    .upsert({
      id: settings.id,
      name: settings.name,
      feed_url: settings.feedUrl,
      colors: settings.colors,
      list_height: settings.listHeight,
      sort_ascending: settings.sortAscending,
      show_first_post: settings.showFirstPost,
      player_type: settings.playerType
    });

  if (error) throw error;
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  const { data, error } = await supabase
    .from('player_settings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    feedUrl: data.feed_url,
    colors: data.colors,
    listHeight: data.list_height,
    sortAscending: data.sort_ascending,
    showFirstPost: data.show_first_post,
    playerType: data.player_type
  };
};

export const getAllSettings = async (): Promise<PlayerSettings[]> => {
  const { data, error } = await supabase
    .from('player_settings')
    .select('*');

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    name: item.name,
    feedUrl: item.feed_url,
    colors: item.colors,
    listHeight: item.list_height,
    sortAscending: item.sort_ascending,
    showFirstPost: item.show_first_post,
    playerType: item.player_type
  }));
};

export const deleteSettings = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('player_settings')
    .delete()
    .eq('id', id);

  if (error) throw error;
};