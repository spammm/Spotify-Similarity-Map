export const compareFields = [
  'Spotify Popularity',
  'Spotify Streams',
  'Track Score',
  'Spotify Playlist Count',
  'Spotify Playlist Reach',
  'YouTube Views',
  'YouTube Likes',
  'TikTok Posts',
  'TikTok Likes',
  'TikTok Views',
  'Apple Music Playlist Count',
  'AirPlay Spins',
  'SiriusXM Spins',
  'Deezer Playlist Count',
  'Deezer Playlist Reach',
  'Amazon Playlist Count',
  'Pandora Streams',
  'Pandora Track Stations',
  'Soundcloud Streams',
  'Shazam Counts',
] as const;

export type CompareFieldsType = (typeof compareFields)[number];
