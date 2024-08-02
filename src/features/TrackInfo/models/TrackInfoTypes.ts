export interface Artist {
  name: string;
  external_urls: { spotify: string };
}

export interface Album {
  name: string;
  release_date: string;
  total_tracks: number;
  images: { url: string }[];
  external_urls: { spotify: string };
}

export interface TrackData {
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string | null;
  external_urls: { spotify: string };
}
