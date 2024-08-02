import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ClusteredSong } from '../../../../shared/providers';
import { SongList } from '../songList';
import styles from './Sidebar.module.css';

interface SidebarProps {
  songs: ClusteredSong[];
  onSongClick: (song: ClusteredSong) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  songs,
  onSongClick,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const debounced = useDebouncedCallback((value: string) => {
    setDebouncedSearchTerm(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debounced(e.target.value);
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.Track.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      song.Artist.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <input
          type="text"
          placeholder="Search by track or artist..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      <SongList songs={filteredSongs} onSongClick={onSongClick} />
    </div>
  );
};
