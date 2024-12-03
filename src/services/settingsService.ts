import { PlayerSettings } from '@/types/playerSettings';

const SETTINGS_KEY = 'player_settings';

export const generateEmbedId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const encodeSettings = (settings: PlayerSettings): string => {
  return btoa(JSON.stringify(settings));
};

export const decodeSettings = (encoded: string): PlayerSettings | null => {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
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
    // Encode settings in URL-safe format
    const encodedSettings = encodeSettings(settings);
    localStorage.setItem(`encoded_${settings.id}`, encodedSettings);
    console.log('Settings saved successfully:', settings);
    console.log('All settings after save:', existingSettings);
    console.log('Encoded settings:', encodedSettings);
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

export const getSettingsById = (id: string): PlayerSettings | null => {
  try {
    // First try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const encodedSettings = urlParams.get('settings');
    
    if (encodedSettings) {
      const settings = decodeSettings(encodedSettings);
      if (settings) {
        console.log('Settings loaded from URL:', settings);
        return settings;
      }
    }
    
    // Then try localStorage
    const settings = getAllSettings();
    console.log('Looking for settings with ID:', id);
    console.log('Available settings:', settings);
    const foundSettings = settings.find(s => s.id === id);
    console.log('Found settings:', foundSettings);
    
    // If not found in localStorage, try encoded storage
    if (!foundSettings) {
      const encodedFromStorage = localStorage.getItem(`encoded_${id}`);
      if (encodedFromStorage) {
        const decodedSettings = decodeSettings(encodedFromStorage);
        console.log('Settings loaded from encoded storage:', decodedSettings);
        return decodedSettings;
      }
    }
    
    return foundSettings || null;
  } catch (error) {
    console.error('Error getting settings by ID:', error);
    return null;
  }
};

export const deleteSettings = (id: string): void => {
  const settings = getAllSettings().filter(s => s.id !== id);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  localStorage.removeItem(`encoded_${id}`);
};