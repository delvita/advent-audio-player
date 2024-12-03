import { PlayerSettings } from '@/types/playerSettings';

const SETTINGS_KEY = 'player_settings';

export const generateEmbedId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveSettings = async (settings: PlayerSettings): Promise<void> => {
  try {
    localStorage.setItem(`settings_${settings.id}`, JSON.stringify(settings));
    console.log('Settings saved successfully:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  try {
    const settings = localStorage.getItem(`settings_${id}`);
    if (!settings) {
      console.log('No settings found for ID:', id);
      return null;
    }
    return JSON.parse(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
};