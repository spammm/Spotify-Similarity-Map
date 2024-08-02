import React, { useEffect, useState, useRef } from 'react';
import { TrackData } from '../models/TrackInfoTypes';
import { getTrackByISRC } from '../../../shared/api';
import { ClusteredSong } from '../../../shared/providers';
import styles from './TrackInfo.module.css';

interface TrackInfoProps {
  song: ClusteredSong;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ song }) => {
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const track = await getTrackByISRC(song.ISRC);
        if (track) {
          setTrackData(track);
          setPreviewUrl(track.preview_url || null);
        } else {
          console.error('Данные трека недоступны для этой песни.');
          setTrackData(null);
          setPreviewUrl(null);
        }
      } catch (error) {
        console.error('Ошибка при получении данных трека:', error);
        setTrackData(null);
        setPreviewUrl(null);
      }
    };

    fetchTrackData();
  }, [song.ISRC]);

  return (
    <div
      className={`${styles.trackInfo} ${isMinimized ? styles.minimized : ''}`}
    >
      <button
        className={styles.closeButton}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {isMinimized
          ? `Прослушать эту песню: ${trackData?.name && trackData.name} ⬆️`
          : '⬇️'}
      </button>
      {!isMinimized && trackData && (
        <>
          <h2 className={styles.trackTitle}>{trackData.name}</h2>
          <p className={styles.trackArtist}>
            {trackData.artists.map((artist) => artist.name).join(', ')}
          </p>
          {trackData.album && (
            <div className={styles.albumInfo}>
              <img
                src={trackData.album.images[0]?.url}
                alt={trackData.album.name}
                className={styles.albumImage}
              />
              <p>{trackData.album.name}</p>
              <p>{trackData.album.release_date}</p>
              <p>{trackData.album.total_tracks} треков</p>
              <a
                href={trackData.external_urls.spotify}
                target="_blank"
                className={styles.spotifyLink}
              >
                Открыть в Spotify
              </a>
            </div>
          )}
        </>
      )}
      {previewUrl ? (
        <audio
          controls
          className={styles.audioPlayer}
          ref={audioRef}
          src={previewUrl}
        >
          Ваш браузер не поддерживает аудио элемент.
        </audio>
      ) : (
        <p className={styles.trackError}>
          Предпрослушивание недоступно для этого трека.
        </p>
      )}
    </div>
  );
};
