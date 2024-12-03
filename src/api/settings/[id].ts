import { PlayerSettings } from '@/types/playerSettings';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log('API: Attempting to get settings for ID:', id);
    
    // Define headers with correct content type and CORS
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    // Get settings from localStorage
    const settings = localStorage.getItem(`settings_${id}`);
    console.log('API: Retrieved settings from localStorage:', settings);
    
    if (!settings) {
      console.log('API: No settings found for ID:', id);
      return new Response(
        JSON.stringify({ error: 'Settings not found' }), 
        { 
          status: 404,
          headers
        }
      );
    }
    
    try {
      // Verify that settings is valid JSON and matches PlayerSettings type
      const parsedSettings: PlayerSettings = JSON.parse(settings);
      
      // Return the settings with proper headers
      return new Response(
        JSON.stringify(parsedSettings),
        { 
          status: 200,
          headers
        }
      );
    } catch (error) {
      console.error('API: Invalid JSON in settings:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid settings data' }), 
        { 
          status: 500,
          headers
        }
      );
    }
  } catch (error) {
    console.error('API: Error in GET handler:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    })
  });
}