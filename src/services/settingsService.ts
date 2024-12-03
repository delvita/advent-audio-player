import { PlayerSettings } from '@/types/playerSettings';

const SETTINGS_KEY = 'player_settings';
const API_BASE_URL = 'https://advent-audio-player.lovable.app'; // Feste API-URL

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
  }
};

export const getAllSettings = (): PlayerSettings[] => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : [];
  } catch (error) {
    console.error('Error getting settings:', error);
    return [];
  }
};

export const getSettingsById = async (id: string): Promise<PlayerSettings | null> => {
  try {
    // Zuerst in localStorage suchen
    const localSettings = localStorage.getItem(`settings_${id}`);
    if (localSettings) {
      const parsedSettings = JSON.parse(localSettings);
      console.log('Settings loaded from localStorage:', parsedSettings);
      return parsedSettings;
    }
    
    // Wenn nicht in localStorage gefunden, API anfragen
    console.log('Fetching settings from API for ID:', id);
    const response = await fetch(`${API_BASE_URL}/api/settings/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('API response not OK:', response.status);
      return null;
    }

    const rawText = await response.text();
    
    try {
      if (rawText.trim().startsWith('<!DOCTYPE')) {
        console.error('Received HTML instead of JSON');
        return null;
      }
      
      const settings = JSON.parse(rawText);
      console.log('Settings parsed successfully:', settings);
      
      if (settings.error) {
        console.error('API returned error:', settings.error);
        return null;
      }
      
      // Erfolgreiche API-Antwort auch im localStorage speichern
      localStorage.setItem(`settings_${id}`, JSON.stringify(settings));
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