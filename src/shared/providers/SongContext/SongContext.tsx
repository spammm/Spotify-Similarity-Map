import React, { createContext, useEffect, useState } from 'react';
import { fetchSongs } from './service';
import { ClusteredSong } from './types';

export interface SongContextProps {
  songs: ClusteredSong[];
  fetchSongs: () => void;
  selectSong: (song: ClusteredSong) => void;
  selectedSong: ClusteredSong | null;
}

const SongContext = createContext<SongContextProps | undefined>(undefined);

export const SongProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [songs, setSongs] = useState<ClusteredSong[]>([]);
  const [selectedSong, setSelectedSong] = useState<ClusteredSong | null>(null);

  const loadSongs = async () => {
    const clusteredSongs = await fetchSongs();
    setSongs(clusteredSongs);
  };

  const selectSong = (song: ClusteredSong) => {
    setSelectedSong(song);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <SongContext.Provider
      value={{ songs, fetchSongs: loadSongs, selectSong, selectedSong }}
    >
      {children}
    </SongContext.Provider>
  );
};

export { SongContext };
