import Papa from 'papaparse';
import { compareFields, CompareFieldsType } from '../../config';

interface CsvSong {
  ISRC: string;
  Track: string;
  Artist: string;
  [key: string]: string | undefined;
}

export type Song = {
  [key in CompareFieldsType]: number;
} & {
  ISRC: string;
  Track: string;
  Artist: string;
};

export const parseCsvToSongs = (csvData: string): Promise<Song[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvSong>(csvData, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: false,
      complete: (result) => {
        if (result.errors.length > 0) {
          console.warn('Some rows had errors and were skipped:', result.errors);
        }

        const songs: Song[] = result.data
          .map((song) => {
            if (!song.ISRC || !song.Track) {
              return null;
            }
            const parsedSong: Song = {
              ISRC: song.ISRC,
              Track: song.Track,
              Artist: song.Artist,
              ...(Object.fromEntries(
                compareFields.map((field) => [field, 0])
              ) as Record<CompareFieldsType, number>),
            };

            compareFields.forEach((field) => {
              parsedSong[field] = parseFloat(
                song[field]?.replace(/,/g, '') || '0'
              );
            });

            return parsedSong;
          })
          .filter((song) => song !== null)
          .reduce((result: Song[], song) => {
            if (!result.find((s) => s.ISRC === song!.ISRC)) {
              result.push(song as Song);
            }
            return result;
          }, []);

        resolve(songs);
      },
      error: (error: unknown) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      },
    });
  });
};
