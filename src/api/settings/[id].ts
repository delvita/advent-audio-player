import { PlayerSettings } from '@/types/playerSettings';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const settings = localStorage.getItem(`settings_${id}`);
  
  if (!settings) {
    return new Response(JSON.stringify({ error: 'Settings not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  
  return new Response(settings, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}