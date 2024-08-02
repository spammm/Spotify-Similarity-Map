export const calculateSimilarity = <
  Song extends Record<string, unknown>,
  Fields extends string
>(
  song1: Song,
  song2: Song,
  fields: Fields[]
): number => {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  fields.forEach((field) => {
    const value1 = song1[field];
    const value2 = song2[field];

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      dotProduct += value1 * value2;
      magnitude1 += value1 ** 2;
      magnitude2 += value2 ** 2;
    }
  });

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
};
