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
  
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(existingSettings));
};

export const getAllSettings = (): PlayerSettings[] => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : [];
};

export const getSettingsById = (id: string): PlayerSettings | null => {
  const settings = getAllSettings();
  return settings.find(s => s.id === id) || null;
};

export const deleteSettings = (id: string): void => {
  const settings = getAllSettings().filter(s => s.id !== id);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};