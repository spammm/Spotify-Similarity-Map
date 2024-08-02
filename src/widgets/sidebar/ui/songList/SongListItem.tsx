import React from 'react';
import { ClusteredSong } from '../../../../shared/providers';
import styles from './SongList.module.css';

interface SongListItemProps {
  song: ClusteredSong;
  onSongClick: (song: ClusteredSong) => void;
}

export const SongListItem: React.FC<SongListItemProps> = React.memo(
  ({ song, onSongClick }) => {
    return (
      <li
        key={song.ISRC}
        className={styles.songItem}
        onClick={() => onSongClick(song)}
      >
        {song.Track} - {song.Artist}
      </li>
    );
  }
);
