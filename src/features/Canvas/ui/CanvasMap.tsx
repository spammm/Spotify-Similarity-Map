import React, { useRef, useEffect } from 'react';
import { useDebouncedUpdateCanvas } from '../effects/useDebouncedUpdateCanvas';
import {
  enableCanvasPanning,
  initializeCanvas,
  updateCanvasOnZoom,
} from '../processing/canvasUtils';
import { renderCanvasContent } from '../lib/canvasRenderer';
import { Canvas } from 'fabric';
import { ClusteredSong } from '../../../shared/providers';

interface CanvasMapProps {
  songs: ClusteredSong[];
  fundedSong: ClusteredSong | null;
  onSongSelect?: (song: ClusteredSong) => void; // Новый пропс для отправки выбранной песни
}

export const CanvasMap: React.FC<CanvasMapProps> = ({
  songs,
  fundedSong,
  onSongSelect,
}) => {
  const canvasRef = useRef<Canvas | null>(null);
  const debouncedUpdateCanvas = useDebouncedUpdateCanvas(
    canvasRef,
    songs,
    onSongSelect
  );

  useEffect(() => {
    const canvas = initializeCanvas(canvasRef, fundedSong);
    updateCanvasOnZoom(canvas, debouncedUpdateCanvas);
    enableCanvasPanning(canvas, debouncedUpdateCanvas);
    // Рендерим начальное содержимое с обработчиком клика
    renderCanvasContent(canvas, songs, onSongSelect);
    // Сохраняем текущее значение ref в переменной
    const currentCanvas = canvas;

    return () => {
      if (currentCanvas) {
        currentCanvas.dispose();
      }
    };
  }, [fundedSong, debouncedUpdateCanvas, songs, onSongSelect]);

  useEffect(() => {
    if (canvasRef.current) {
      renderCanvasContent(canvasRef.current, songs, onSongSelect);
    }
  }, [songs, onSongSelect]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.setDimensions({
          width: window.innerWidth - 10,
          height: window.innerHeight - 110,
        });
        renderCanvasContent(canvasRef.current, songs, onSongSelect);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [songs, onSongSelect]);

  return <canvas id="song-map" className="canvas" />;
};
