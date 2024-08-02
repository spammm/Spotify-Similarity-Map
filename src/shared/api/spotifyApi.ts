const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
let accessToken = '';

export const getAccessToken = async () => {
  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
      'Accept-Language': 'en-US',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  };

  try {
    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      authOptions
    );
    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token', error);
  }
};

export const getTrackByISRC = async (isrc: string) => {
  if (!accessToken) {
    await getAccessToken();
  }

  const searchOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': 'en-US', // Подменяем заголовок для русских браузеров
    },
  };
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=isrc:${isrc}`,
      searchOptions
    );
    const data = await response.json();

    if (data.tracks && data.tracks.items.length > 0) {
      // console.log('Track data:', data.tracks.items[0]);
      return data.tracks.items[0];
    } else {
      console.error('No track found for ISRC:', isrc);
      return null;
    }
  } catch (error) {
    console.error('Error fetching track by ISRC from Spotify', error);
    return null;
  }
};
