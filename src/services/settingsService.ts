import { PlayerSettings } from '@/types/playerSettings';
import { saveSettings as saveToSupabase, getSettingsById as getFromSupabase, getAllSettings as getAllFromSupabase, deleteSettings as deleteFromSupabase } from './supabaseService';

export const generateEmbedId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveSettings = async (settings: PlayerSettings): Promise<void> => {
  await saveToSupabase(settings);
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  return await getFromSupabase(id);
};

export const getAllSettings = async (): Promise<PlayerSettings[]> => {
  return await getAllFromSupabase();
};

export const deleteSettings = async (id: string): Promise<void> => {
  await deleteFromSupabase(id);
};