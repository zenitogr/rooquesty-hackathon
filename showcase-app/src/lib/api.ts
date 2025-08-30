import { localDadJokes } from './local-data';

interface MemeApiResponseMeme {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups: number;
  preview: string[];
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

export const getCategorizedMemes = async (count: number, existingUrls: Set<string>): Promise<string[]> => {
  const catMemesUrl = 'https://meme-api.com/gimme/Catmemes/50';
  const babyYodaMemesUrl = 'https://meme-api.com/gimme/BabyYodaMemes/50';

  try {
    const [catResponse, babyYodaResponse] = await Promise.all([
      fetch(catMemesUrl),
      fetch(babyYodaMemesUrl)
    ]);

    const catData = await catResponse.json();
    const babyYodaData = await babyYodaResponse.json();

    const allMemes: MemeApiResponseMeme[] = [];

    if (catData.memes) {
      allMemes.push(...catData.memes);
    }
    if (babyYodaData.memes) {
      allMemes.push(...babyYodaData.memes);
    }

    const newMemes = shuffle(allMemes).filter(meme => !existingUrls.has(meme.url));
    
    return newMemes.slice(0, count).map(meme => meme.url);
  } catch (error) {
    console.error('Error fetching from meme-api:', error);
    return [];
  }
};

const shuffledDadJokes = shuffle([...localDadJokes]);

let dadJokeIndex = 0;

export const getDadJokes = async (count: number, existingJokes: Set<string>): Promise<string[]> => {
  const jokes: string[] = [];
  let attempts = 0;
  while (jokes.length < count && attempts < shuffledDadJokes.length) {
    if (dadJokeIndex >= shuffledDadJokes.length) dadJokeIndex = 0;
    const joke = shuffledDadJokes[dadJokeIndex];
    if (!existingJokes.has(joke)) {
      jokes.push(joke);
    }
    dadJokeIndex++;
    attempts++;
  }
  return jokes;
};