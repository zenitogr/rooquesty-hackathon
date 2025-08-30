export const getCatMeme = async (existingUrls: Set<string>): Promise<string> => {
  let url;
  do {
    const response = await fetch(`https://cataas.com/cat/says/hello?${Math.random()}`);
    url = response.url;
  } while (existingUrls.has(url));
  return url;
};

export const getBabyYodaMemes = async (limit: number, existingUrls: Set<string>): Promise<string[]> => {
  const memes = new Set<string>();
  let pos = 0;
  while (memes.size < limit) {
    const response = await fetch(`https://g.tenor.com/v1/search?q=baby-yoda&key=LIVDSRZULELA&limit=${limit * 2}&pos=${pos}`);
    const data = await response.json();
    for (const r of data.results) {
      const url = r.media[0].gif.url;
      if (!existingUrls.has(url)) {
        memes.add(url);
        if (memes.size >= limit) break;
      }
    }
    pos += data.results.length;
    if (data.results.length === 0) break;
  }
  return Array.from(memes);
};

export const getDadJokes = async (limit: number, existingJokes: Set<string>): Promise<string[]> => {
  const jokes = new Set<string>();
  while (jokes.size < limit) {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    if (!existingJokes.has(data.joke)) {
      jokes.add(data.joke);
    }
  }
  return Array.from(jokes);
};