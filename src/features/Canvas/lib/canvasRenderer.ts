import { Canvas, Circle, IText, Line, Point, Shadow } from 'fabric';
import { calculateSimilarity } from '../../../shared/lib';
import { getVisibleSongs } from '../processing/canvasUtils';
import { compareFields as originalCompareFields } from '../../../shared/config';
import { ClusteredSong } from '../../../shared/providers';
import { truncateText } from './../../../shared/lib/textUtils/truncateText';

export const renderCanvasContent = (
  canvas: Canvas,
  songs: ClusteredSong[],
  onSongSelect: ((song: ClusteredSong) => void) | undefined
) => {
  canvas.clear();
  const visibleSongs = getVisibleSongs(canvas, songs);
  const maxStreams = Math.max(
    ...visibleSongs.map((song) => song['Spotify Streams'])
  );
  const compareFields = [...originalCompareFields];

  const songObjects = visibleSongs.map((song) => {
    const radius = Math.max((song['Spotify Streams'] / maxStreams) * 20, 5);
    const circle = new Circle({
      radius,
      fill: 'yellow',
      left: song.x,
      top: song.y,
      originX: 'center',
      originY: 'center',
      hasControls: false,
      selectable: false,
      hoverCursor: 'pointer',
      shadow: new Shadow({
        color: 'yellow',
        blur: 15,
        offsetX: 0,
        offsetY: 0,
      }),
    });

    const text = new IText(truncateText(song.Track, 25), {
      left: song.x,
      top: song.y - radius - 10,
      fill: 'white',
      originX: 'center',
      originY: 'center',
      hasControls: false,
      selectable: false,
      fontSize: 24 / canvas.getZoom(),
      hoverCursor: 'pointer',
    });

    // Добавляем обработчик клика для зума на текст
    text.on('mousedown', () => {
      const zoom = 2;
      canvas.setZoom(zoom);

      const objectCenter = new Point(song.x, song.y);
      const canvasCenterX = canvas.getWidth() / 2;
      const canvasCenterY = canvas.getHeight() / 2;
      const canvasCenter = new Point(canvasCenterX, canvasCenterY);

      const panOffset = objectCenter.subtract(canvasCenter);
      const panX = panOffset.x * zoom + canvasCenterX;
      const panY = panOffset.y * zoom + canvasCenterY;

      canvas.absolutePan(new Point(panX, panY));
      canvas.renderAll();
    });

    // Обработчик клика для отображения информации о песне
    if (onSongSelect) {
      circle.on('mousedown', () => onSongSelect(song));
      // text.on('mousedown', () => onSongSelect(song));
    }

    circle.set('song', song);
    canvas.add(circle);
    canvas.add(text);
    canvas.sendObjectToBack(text);

    return { circle, text, song };
  });

  // Создание и отрисовка связей между песнями
  const connections = [];

  for (let i = 0; i < songObjects.length; i++) {
    const { circle: circle1, song: song1 } = songObjects[i];
    for (let j = i + 1; j < songObjects.length; j++) {
      const { circle: circle2, song: song2 } = songObjects[j];
      const similarity = calculateSimilarity(song1, song2, compareFields);

      if (similarity > 0) {
        connections.push({ start: circle1, end: circle2, similarity });
      }
    }
  }

  // Минимальное и максимальное значение схожести
  const minSimilarity = Math.min(...connections.map((c) => c.similarity));
  const maxSimilarity = Math.max(...connections.map((c) => c.similarity));

  const range = maxSimilarity - minSimilarity || 1;
  // Рендер связей
  connections
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 200) // Ограничиваем количество отображаемых связей
    .forEach(({ start, end, similarity }) => {
      // Масштабируем ширину линий относительно найденных значений
      const lineWidth = 1 + ((similarity - minSimilarity) / range) * 4;
      const line = new Line([start.left!, start.top!, end.left!, end.top!], {
        stroke: '#1373A8',
        strokeWidth: lineWidth,
        selectable: false,
        strokeDashArray: similarity < 0.3 ? [5, 5] : undefined,
      });

      canvas.add(line);
      canvas.sendObjectToBack(line);
    });

  canvas.backgroundColor = '#030E2E';
  canvas.renderAll();
};
