import { PlayerSettings } from '@/types/playerSettings';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log('Attempting to get settings for ID:', id);
    
    // Get settings from localStorage
    const settings = localStorage.getItem(`settings_${id}`);
    console.log('Retrieved settings from localStorage:', settings);
    
    // Define headers with correct content type and CORS
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    if (!settings) {
      console.log('No settings found for ID:', id);
      return new Response(
        JSON.stringify({ error: 'Settings not found' }), 
        { 
          status: 404,
          headers
        }
      );
    }
    
    return new Response(
      settings,
      { 
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error('Error in GET handler:', error);
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