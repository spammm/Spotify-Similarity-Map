import { useContext } from 'react';
import { SongContext, SongContextProps } from './SongContext';

export const useSongs = (): SongContextProps => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSongs must be used within a SongProvider');
  }
  return context;
};
