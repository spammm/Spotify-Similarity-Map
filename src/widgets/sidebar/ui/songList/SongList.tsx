import React from 'react';
import styles from './SongList.module.css';
import { ClusteredSong } from '../../../../shared/providers';
import { SongListItem } from './SongListItem';

interface SongListProps {
  songs: ClusteredSong[];
  onSongClick: (song: ClusteredSong) => void;
}

export const SongList: React.FC<SongListProps> = ({ songs, onSongClick }) => {
  return (
    <div className={styles.songListContainer}>
      <ul className={styles.songList}>
        {songs.map((song) => (
          <SongListItem key={song.ISRC} song={song} onSongClick={onSongClick} />
        ))}
      </ul>
    </div>
  );
};
