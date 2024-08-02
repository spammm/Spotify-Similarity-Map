import { Song } from '../../../lib';

export interface ClusteredSong extends Song {
  cluster: number;
  x: number;
  y: number;
  [key: string]: number | string | undefined;
}
