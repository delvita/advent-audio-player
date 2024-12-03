import { PlayerSettings } from '@/types/playerSettings';

const SETTINGS_KEY = 'player_settings';

export const generateEmbedId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveSettings = (settings: PlayerSettings): void => {
  const existingSettings = getAllSettings();
  const settingsIndex = existingSettings.findIndex(s => s.id === settings.id);
  
  if (settingsIndex >= 0) {
    existingSettings[settingsIndex] = settings;
  } else {
    existingSettings.push(settings);
  }
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(existingSettings));
    localStorage.setItem(`settings_${settings.id}`, JSON.stringify(settings));
    console.log('Settings saved successfully:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('Failed to save settings');
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
    // Zuerst im localStorage suchen
    const localSettings = localStorage.getItem(`settings_${id}`);
    if (localSettings) {
      console.log('Settings loaded from localStorage:', JSON.parse(localSettings));
      return JSON.parse(localSettings);
    }
    
    // Wenn nicht im localStorage, dann von der API abrufen
    const response = await fetch(`/api/settings/${id}`);
    if (!response.ok) {
      console.error('API request failed:', response.status);
      return null;
    }
    
    const settings = await response.json();
    if (settings.error) {
      console.error('API returned error:', settings.error);
      return null;
    }
    
    // Erfolgreiche API-Antwort im localStorage speichern
    localStorage.setItem(`settings_${id}`, JSON.stringify(settings));
    console.log('Settings loaded from API:', settings);
    return settings;
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
    throw new Error('Failed to delete settings');
  }
};