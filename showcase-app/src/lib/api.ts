import { localCatMemes, localBabyYodaMemes, localDadJokes } from './local-data';

interface ImgflipMeme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const getImgflipMemes = async (count: number): Promise<string[]> => {
  try {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data = await response.json();
    if (data.success) {
      const memes: ImgflipMeme[] = data.data.memes;
      return shuffle(memes).slice(0, count).map(meme => meme.url);
    }
  } catch (error) {
    console.error('Error fetching from Imgflip API:', error);
  }
  return [];
};

const shuffledDadJokes = shuffle([...localDadJokes]);

let dadJokeIndex = 0;

export const getDadJokes = async (count: number, existingJokes: Set<string>): Promise<string[]> => {
  const jokes: string[] = [];
  for (let i = 0; i < count; i++) {
    if (dadJokeIndex >= shuffledDadJokes.length) dadJokeIndex = 0;
    jokes.push(shuffledDadJokes[dadJokeIndex]);
    dadJokeIndex++;
  }
  return jokes;
};