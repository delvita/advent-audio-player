import { PlayerSettings } from '@/types/playerSettings';

const SETTINGS_KEY = 'player_settings';

export const generateEmbedId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveSettings = (settings: PlayerSettings): void => {
  try {
    const existingSettings = getAllSettings();
    const settingsIndex = existingSettings.findIndex(s => s.id === settings.id);
    
    if (settingsIndex >= 0) {
      existingSettings[settingsIndex] = settings;
    } else {
      existingSettings.push(settings);
    }
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(existingSettings));
    localStorage.setItem(`settings_${settings.id}`, JSON.stringify(settings));
    console.log('Settings saved successfully:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getAllSettings = (): PlayerSettings[] => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : [];
  } catch (error) {
    console.error('Error getting all settings:', error);
    return [];
  }
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  try {
    const localSettings = localStorage.getItem(`settings_${id}`);
    if (localSettings) {
      const settings = JSON.parse(localSettings);
      console.log('Settings loaded from localStorage:', settings);
      return settings;
    }
    
    console.log('No settings found for ID:', id);
    return null;
  } catch (error) {
    console.error('Error getting settings by ID:', error);
    return null;
  }
};

export const deleteSettings = (id: string): void => {
  try {
    const settings = getAllSettings().filter(s => s.id !== id);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.removeItem(`settings_${id}`);
    console.log('Settings deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting settings:', error);
  }
};