import { SPOTIFY_TOKEN_URL, SPOTIFY_API_URL, TOKEN_EXPIRY_KEY, TOKEN_KEY } from '../config';

const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export const getAccessToken = async (): Promise<string | null> => {
  const currentTime = Date.now();
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedTokenExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (
    storedToken &&
    storedTokenExpiry &&
    currentTime < parseInt(storedTokenExpiry)
  ) {
    return storedToken;
  }

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
    const response = await fetch(SPOTIFY_TOKEN_URL, authOptions);
    const data = await response.json();
    const accessToken = data.access_token;
    const expiresIn = data.expires_in;

    if (accessToken) {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(
        TOKEN_EXPIRY_KEY,
        (currentTime + expiresIn * 1000).toString()
      );
      return accessToken;
    }

    return null;
  } catch (error) {
    console.error('Error getting Spotify access token', error);
    return null;
  }
};

export const getTrackByISRC = async (isrc: string) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.error('No access token available');
    return null;
  }

  const searchOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': 'en-US',
    },
  };

  try {
    const response = await fetch(
      `${SPOTIFY_API_URL}/search?type=track&q=isrc:${isrc}`,
      searchOptions
    );
    const data = await response.json();

    if (data.tracks && data.tracks.items.length > 0) {
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
