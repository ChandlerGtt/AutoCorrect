import dictionary from "./dictionary.json";

export interface SpellcheckResult {
  word: string;
  corrected: string;
  isCorrect: boolean;
  candidates: string[];
}

type WordCounts = Record<string, number>;

const WORD_COUNTS: WordCounts = dictionary;

const alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split("");

// Generate all edit-distance-1 variations of a word
function editDistance1(word: string): string[] {
  const results: string[] = [];
  const wordArr: string[] = word.toLowerCase().split("");

  // Insertions
  for (let i = 0; i <= wordArr.length; i++) {
    for (const letter of alphabet) {
      const newWord = [...wordArr];
      newWord.splice(i, 0, letter);
      results.push(newWord.join(""));
    }
  }

  // Deletions
  if (wordArr.length > 0) {
    for (let i = 0; i < wordArr.length; i++) {
      const newWord = [...wordArr];
      newWord.splice(i, 1);
      results.push(newWord.join(""));
    }
  }

  // Transposes
  for (let i = 0; i < wordArr.length - 1; i++) {
    const newWord = [...wordArr];
    const tmp = newWord[i];
    newWord[i] = newWord[i + 1];
    newWord[i + 1] = tmp;
    results.push(newWord.join(""));
  }

  // Substitutions
  for (let i = 0; i < wordArr.length; i++) {
    for (const letter of alphabet) {
      const newWord = [...wordArr];
      newWord[i] = letter;
      results.push(newWord.join(""));
    }
  }

  return results;
}

// Spell corrector
export function correct(word: string): SpellcheckResult {
  const cleanWord: string = word.toLowerCase();

  // Word already correct
  if (WORD_COUNTS[cleanWord]) {
    return {
      word,
      corrected: word,
      isCorrect: true,
      candidates: [],
    };
  }

  let bestWord: string = word;
  let bestFreq: number = 0;

  const edits1: string[] = editDistance1(cleanWord);

  // Check edit distance 1 candidates
  for (const candidate of edits1) {
    const freq = WORD_COUNTS[candidate];
    if (freq && freq > bestFreq) {
      bestFreq = freq;
      bestWord = candidate;
    }
  }

  // If we found a strong edit-distance-1 candidate
  if (bestWord !== word) {
    return {
      word,
      corrected: bestWord,
      isCorrect: false,
      candidates: [bestWord],
    };
  }

  // Try edit-distance-2
  const edits2: string[] = [];
  for (const e1 of edits1) {
    edits2.push(...editDistance1(e1));
  }

  for (const candidate of edits2) {
    const freq = WORD_COUNTS[candidate];
    if (freq && freq > bestFreq) {
      bestFreq = freq;
      bestWord = candidate;
    }
  }

  const isCorrect: boolean = bestWord === word;

  return {
    word,
    corrected: bestWord,
    isCorrect,
    candidates: isCorrect ? [] : [bestWord],
  };
}
