import type { PlayerSettings } from '@/types/playerSettings';

// In-memory storage für Entwicklungszwecke
const settingsStorage = new Map<string, PlayerSettings>();

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  if (!id) {
    return new Response(
      JSON.stringify({ error: 'ID is required' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const settings = settingsStorage.get(id);
  
  if (!settings) {
    return new Response(
      JSON.stringify({ error: 'Settings not found' }),
      { status: 404, headers: corsHeaders }
    );
  }
  
  return new Response(
    JSON.stringify(settings),
    { status: 200, headers: corsHeaders }
  );
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  if (!id) {
    return new Response(
      JSON.stringify({ error: 'ID is required' }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const data = await request.json();
    settingsStorage.set(id, data);
    
    return new Response(
      JSON.stringify({ message: 'Settings saved successfully' }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to parse request body' }),
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}