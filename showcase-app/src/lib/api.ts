import { localCatMemes, localBabyYodaMemes, localDadJokes } from './local-data';

const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const shuffledCatMemes = shuffle([...localCatMemes]);
const shuffledBabyYodaMemes = shuffle([...localBabyYodaMemes]);
const shuffledDadJokes = shuffle([...localDadJokes]);

let catMemeIndex = 0;
let babyYodaMemeIndex = 0;
let dadJokeIndex = 0;

export const getCatMeme = async (existingUrls: Set<string>): Promise<string> => {
  if (catMemeIndex >= shuffledCatMemes.length) catMemeIndex = 0;
  const meme = shuffledCatMemes[catMemeIndex];
  catMemeIndex++;
  return meme;
};

export const getBabyYodaMemes = async (count: number, existingUrls: Set<string>): Promise<string[]> => {
  const memes: string[] = [];
  for (let i = 0; i < count; i++) {
    if (babyYodaMemeIndex >= shuffledBabyYodaMemes.length) babyYodaMemeIndex = 0;
    memes.push(shuffledBabyYodaMemes[babyYodaMemeIndex]);
    babyYodaMemeIndex++;
  }
  return memes;
};

export const getDadJokes = async (count: number, existingJokes: Set<string>): Promise<string[]> => {
  const jokes: string[] = [];
  for (let i = 0; i < count; i++) {
    if (dadJokeIndex >= shuffledDadJokes.length) dadJokeIndex = 0;
    jokes.push(shuffledDadJokes[dadJokeIndex]);
    dadJokeIndex++;
  }
  return jokes;
};