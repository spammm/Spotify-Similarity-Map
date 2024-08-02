import { Song } from "../../../lib";

export const createClusterLength = () => {
  const clusterSizes: Record<number, number> = {};

  return (clusters: number[], clusterIndex: number) => {
    if (!clusterSizes[clusterIndex]) {
      const clusterSize = clusters.reduce((acc, cluster) => {
        return cluster === clusterIndex ? acc + 1 : acc;
      }, 0);
      clusterSizes[clusterIndex] = clusterSize;
    }
    return clusterSizes[clusterIndex];
  };
};

export const calculateClusterCenters = (numClusters: number) => {
  const clusterCenters: { x: number; y: number; radius: number }[] = [];
  const maxRadius = 3000;
  const gridSize = Math.ceil(Math.sqrt(numClusters));

  for (let i = 0; i < numClusters; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    const baseX = col * (maxRadius + 1000);
    const baseY = row * (maxRadius + 1000);

    clusterCenters.push({
      x: baseX + Math.random() * 800,
      y: baseY + Math.random() * 800,
      radius: Math.random() * 1200 + 1600,
    });
  }

  return clusterCenters;
};

export const distributeSongsAcrossClusters = (
  parsedSongs: Song[],
  clusters: number[],
  clusterCenters: { x: number; y: number; radius: number }[]
) => {
  const clusterLength = createClusterLength();

  return parsedSongs.map((song, index) => {
    const cluster = clusters[index];
    const clusterCenter = clusterCenters[cluster];
    const clusterSize = clusterLength(clusters, cluster);

    const angle = (index % clusterSize) * ((2 * Math.PI) / clusterSize);
    const minDistance = 20;
    const radiusStep = Math.max(
      (clusterCenter.radius - minDistance) / clusterSize,
      minDistance
    );
    const radius = radiusStep * index;

    return {
      ...song,
      cluster,
      x: clusterCenter.x + radius * Math.cos(angle),
      y: clusterCenter.y + radius * Math.sin(angle),
    };
  });
};
