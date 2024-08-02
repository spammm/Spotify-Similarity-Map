import { kmeans } from 'ml-kmeans';
import {
  calculateClusterCenters,
  distributeSongsAcrossClusters,
} from '../utils';
import { ClusteredSong } from '../types/ClusteredSong';
import { parseCsvToSongs } from '../../../lib';
import { compareFields } from '../../../config';

export const fetchSongs = async (): Promise<ClusteredSong[]> => {
  const response = await fetch('/MSSS2024.csv');
  const csvData = await response.text();
  const parsedSongs = await parseCsvToSongs(csvData);

  const songFeatures = parsedSongs.map((song) =>
    compareFields.map((field) => song[field])
  );

  const numClusters = songFeatures.length
    ? Math.round(Math.sqrt(songFeatures.length))
    : 0;

  const clusters = kmeans(songFeatures, numClusters, {});
  const clusterCenters = calculateClusterCenters(numClusters);

  const clusteredSongs = distributeSongsAcrossClusters(
    parsedSongs,
    clusters.clusters,
    clusterCenters
  );

  return clusteredSongs;
};
