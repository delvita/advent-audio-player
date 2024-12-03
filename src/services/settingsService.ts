import { supabase } from "@/integrations/supabase/client";
import { PlayerSettings } from "@/types/playerSettings";
import { Database } from "@/integrations/supabase/types";

type DbPlayerSettings = Database['public']['Tables']['player_settings']['Row'];

const mapDbToPlayerSettings = (dbSettings: DbPlayerSettings): PlayerSettings => {
  const colors = typeof dbSettings.colors === 'string' 
    ? JSON.parse(dbSettings.colors) 
    : dbSettings.colors;

  return {
    id: dbSettings.id,
    name: dbSettings.name,
    feedUrl: dbSettings.feed_url,
    colors: colors as PlayerSettings['colors'],
    listHeight: dbSettings.list_height,
    sortAscending: dbSettings.sort_ascending,
    showFirstPost: dbSettings.show_first_post,
    playerType: dbSettings.player_type as PlayerSettings['playerType']
  };
};

const mapPlayerSettingsToDb = (settings: PlayerSettings) => {
  return {
    id: settings.id,
    name: settings.name,
    feed_url: settings.feedUrl,
    colors: settings.colors,
    list_height: settings.listHeight,
    sort_ascending: settings.sortAscending,
    show_first_post: settings.showFirstPost,
    player_type: settings.playerType
  };
};

export const generateEmbedId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveSettings = async (settings: PlayerSettings): Promise<void> => {
  const dbSettings = mapPlayerSettingsToDb(settings);
  const { error } = await supabase
    .from('player_settings')
    .upsert(dbSettings);

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

  return mapDbToPlayerSettings(data);
};

export const getAllSettings = async (): Promise<PlayerSettings[]> => {
  const { data, error } = await supabase
    .from('player_settings')
    .select('*');

  if (error) throw error;
  if (!data) return [];

  return data.map(mapDbToPlayerSettings);
};

export const deleteSettings = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('player_settings')
    .delete()
    .eq('id', id);

  if (error) throw error;
};