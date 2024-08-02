import { Canvas, TPointerEventInfo, Point } from 'fabric';
import { ClusteredSong } from '../../../shared/providers';

export const initializeCanvas = (
  canvasRef: React.MutableRefObject<Canvas | null>,
  fundedSong: ClusteredSong | null
) => {
  const canvas = new Canvas('song-map', {
    width: window.innerWidth - 10,
    height: window.innerHeight - 110,
    selection: false,
    isDrawingMode: true,
  });
  canvasRef.current = canvas;
  canvas.renderAll();

  if (fundedSong) {
    const zoom = 2;
    canvas.setZoom(zoom);

    const objectCenter = new Point(fundedSong.x, fundedSong.y);
    const canvasCenterX = canvas.getWidth() / 2;
    const canvasCenterY = canvas.getHeight() / 2;
    const canvasCenter = new Point(canvasCenterX, canvasCenterY);

    const panOffset = objectCenter.subtract(canvasCenter);
    const panX = panOffset.x * zoom + canvasCenterX;
    const panY = panOffset.y * zoom + canvasCenterY;

    canvas.absolutePan(new Point(panX, panY));
    canvas.renderAll();
  }

  return canvas;
};

export const updateCanvasOnZoom = (
  canvas: Canvas,
  debouncedUpdateCanvas: () => void
) => {
  canvas.on('mouse:wheel', (opt: TPointerEventInfo<WheelEvent>) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    zoom = Math.min(Math.max(zoom, 0.1), 20);
    const point = new Point(opt.e.offsetX, opt.e.offsetY);
    canvas.zoomToPoint(point, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    debouncedUpdateCanvas();
  });
};

// получаем только видимые узлы
export const getVisibleSongs = (canvas: Canvas, songs: ClusteredSong[]) => {
  const visibleArea = {
    left: -canvas.viewportTransform[4] / canvas.getZoom(),
    top: -canvas.viewportTransform[5] / canvas.getZoom(),
    right:
      (-canvas.viewportTransform[4] + canvas.getWidth()) / canvas.getZoom(),
    bottom:
      (-canvas.viewportTransform[5] + canvas.getHeight()) / canvas.getZoom(),
  };

  return songs
    .filter(
      (song) =>
        song.x > visibleArea.left &&
        song.x < visibleArea.right &&
        song.y > visibleArea.top &&
        song.y < visibleArea.bottom
    )
    .sort((a, b) => b['Spotify Streams'] - a['Spotify Streams'])
    .slice(0, 500); // ограничеваем количество видимых узлов, выбирая самые популярные
};

export const enableCanvasPanning = (
  canvas: Canvas,
  debouncedUpdateCanvas: () => void
) => {
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on('mouse:down', function (opt: TPointerEventInfo<MouseEvent>) {
    const evt = opt.e;
    isPanning = true;
    lastPosX = evt.clientX;
    lastPosY = evt.clientY;
    canvas.setCursor('move');
  });

  canvas.on('mouse:move', function (opt: TPointerEventInfo<MouseEvent>) {
    if (isPanning) {
      const e = opt.e;
      const vpt = canvas.viewportTransform!;
      vpt[4] += e.clientX - lastPosX;
      vpt[5] += e.clientY - lastPosY;
      canvas.requestRenderAll();
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    }
  });

  canvas.on('mouse:up', function () {
    isPanning = false;
    canvas.setCursor('default');
    debouncedUpdateCanvas();
  });
};
