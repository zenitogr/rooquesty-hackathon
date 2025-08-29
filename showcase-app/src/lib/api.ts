export const getCatMeme = async (text: string) => {
  const response = await fetch(`https://cataas.com/cat/says/${text}`);
  return response.url;
};

export const getBabyYodaMemes = async (limit: number = 10) => {
  const response = await fetch(`https://g.tenor.com/v1/search?q=baby-yoda&key=LIVDSRZULELA&limit=${limit}`);
  const data = await response.json();
  return data.results.map((r: any) => r.media[0].gif.url);
};

export const getDadJokes = async (limit: number = 10) => {
  const jokes = [];
  for (let i = 0; i < limit; i++) {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    jokes.push(data.joke);
  }
  return jokes;
};