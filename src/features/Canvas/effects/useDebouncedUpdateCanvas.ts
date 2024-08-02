import { useCallback } from 'react';
import { Canvas } from 'fabric';
import { useDebouncedCallback } from 'use-debounce';
import { renderCanvasContent } from '../lib/canvasRenderer';
import { ClusteredSong } from '../../../shared/providers';

export const useDebouncedUpdateCanvas = (
  canvasRef: React.RefObject<Canvas>,
  songs: ClusteredSong[],
  onSongSelect: ((song: ClusteredSong) => void) | undefined
) => {
  const updateCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    renderCanvasContent(canvasRef.current, songs, onSongSelect);
  }, [canvasRef, songs, onSongSelect]);

  return useDebouncedCallback(updateCanvas, 300);
};
