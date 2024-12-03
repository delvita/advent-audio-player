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
    // Also save individual settings by ID for cross-domain access
    localStorage.setItem(`settings_${settings.id}`, JSON.stringify(settings));
    console.log('Settings saved successfully:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getAllSettings = (): PlayerSettings[] => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    console.log('Raw settings from localStorage:', settings);
    return settings ? JSON.parse(settings) : [];
  } catch (error) {
    console.error('Error getting settings:', error);
    return [];
  }
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  try {
    // First try to get settings from localStorage
    const localSettings = localStorage.getItem(`settings_${id}`);
    if (localSettings) {
      console.log('Settings found in localStorage:', localSettings);
      return JSON.parse(localSettings);
    }
    
    // If not in localStorage, try the API endpoint
    console.log('Fetching settings from API for ID:', id);
    const apiUrl = `${window.location.origin}/api/settings/${id}`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      console.error('API response not OK:', response.status);
      return null;
    }

    const rawText = await response.text();
    console.log('Raw API response:', rawText);

    try {
      const settings = JSON.parse(rawText);
      console.log('Settings parsed successfully:', settings);
      
      if (settings.error) {
        console.error('API returned error:', settings.error);
        return null;
      }
      
      return settings;
    } catch (error) {
      console.error('Failed to parse API response:', error);
      return null;
    }
  } catch (error) {
    console.error('Error getting settings by ID:', error);
    return null;
  }
};

export const deleteSettings = (id: string): void => {
  const settings = getAllSettings().filter(s => s.id !== id);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  localStorage.removeItem(`settings_${id}`);
};