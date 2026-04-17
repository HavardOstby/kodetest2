export function calculateDangerScore(text: string): number {
  const vowels = text.match(/[aeiouAEIOU]/g);
  return vowels ? vowels.length : 0;
}
