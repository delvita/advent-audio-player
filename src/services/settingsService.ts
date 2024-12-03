import { PlayerSettings } from '@/types/playerSettings';

export const generateEmbedId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveSettings = async (settings: PlayerSettings): Promise<void> => {
  try {
    localStorage.setItem(`settings_${settings.id}`, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  try {
    const settings = localStorage.getItem(`settings_${id}`);
    if (!settings) {
      return null;
    }
    return JSON.parse(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
};

export const getAllSettings = (): PlayerSettings[] => {
  const settings: PlayerSettings[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('settings_')) {
      const setting = localStorage.getItem(key);
      if (setting) {
        settings.push(JSON.parse(setting));
      }
    }
  }
  return settings;
};

export const deleteSettings = (id: string): void => {
  localStorage.removeItem(`settings_${id}`);
};