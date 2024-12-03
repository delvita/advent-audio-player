import { PlayerSettings } from '@/types/playerSettings';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log('API: Attempting to get settings for ID:', id);
    
    // Get settings from localStorage
    const settings = localStorage.getItem(`settings_${id}`);
    console.log('API: Retrieved settings from localStorage:', settings);
    
    if (!settings) {
      console.log('API: No settings found for ID:', id);
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }
    
    try {
      // Verify that settings is valid JSON and matches PlayerSettings type
      const parsedSettings: PlayerSettings = JSON.parse(settings);
      
      // Return the settings
      return NextResponse.json(parsedSettings);
      
    } catch (error) {
      console.error('API: Invalid JSON in settings:', error);
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API: Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}