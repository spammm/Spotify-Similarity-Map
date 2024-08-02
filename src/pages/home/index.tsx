import React, { useState } from 'react';
import { CompareFieldsType, compareFields } from '../../shared/config';
import { calculateSimilarity } from '../../shared/lib';
import { ClusteredSong, useSongs } from '../../shared/providers';
import { CanvasMap } from '../../features/Canvas';
import { Sidebar } from '../../widgets/sidebar';
import { Loader } from './ui/Loader';
import { TrackInfo } from '../../features/TrackInfo';
import styles from './ui/Home.module.css';

export const Home: React.FC = () => {
  const { songs, selectSong, selectedSong } = useSongs();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [similarSongs, setSimilarSongs] = useState<ClusteredSong[]>([]);

  const handleSongClick = (song: ClusteredSong) => {
    selectSong(song);

    setIsSidebarOpen(false);

    const similarities = songs
      .map((s) => ({
        song: s,
        similarity: calculateSimilarity<ClusteredSong, CompareFieldsType>(
          song,
          s,
          [...compareFields]
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .map((item) => item.song);

    setSimilarSongs(similarities);
  };

  const handleSongSelectFromMap = (song: ClusteredSong) => {
    handleSongClick(song);
  };

  if (!songs.length) return <Loader />;

  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <button
            className={styles.button}
            onClick={() => setIsSidebarOpen(true)}
          >
            Список песен
          </button>
          {selectedSong && <TrackInfo song={selectedSong} />}
          {!selectedSong && (
            <p className={styles.intro}>Выберите песню чтобы начать</p>
          )}
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.scrollable}>
            {!!similarSongs.length && (
              <CanvasMap
                songs={similarSongs}
                fundedSong={selectedSong}
                onSongSelect={handleSongSelectFromMap}
              />
            )}
          </div>
        </div>
      </main>
      <Sidebar
        songs={songs}
        onSongClick={handleSongClick}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};
