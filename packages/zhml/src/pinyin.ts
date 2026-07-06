const VOWELS = {
  "a": ["ā", "á", "ǎ", "à"],
  "e": ["ē", "é", "ě", "è"],
  "i": ["ī", "í", "ǐ", "ì"],
  "o": ["ō", "ó", "ǒ", "ò"],
  "u": ["ū", "ú", "ǔ", "ù"],
  "ü": ["ǖ", "ǘ", "ǜ", "ǚ"]
} as const;

const REGEX = /(ai?|ang?|anr|ao|ei?|eng?|er|i|ing?|ou?|ong|u|ü)([1-4])/g;

export function numericToDiacritics(str: string): string {
  return str.replace(REGEX, (_, syllable, tone) => {
    const rest = syllable.slice(1);
    return VOWELS[syllable[0] as keyof typeof VOWELS][+tone - 1] + rest;
  });
}