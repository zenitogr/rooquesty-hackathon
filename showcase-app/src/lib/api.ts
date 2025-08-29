export const getCatMeme = async (text: string) => {
  const response = await fetch(`https://cataas.com/cat/says/${text}`);
  return response.url;
};

export const getBabyYodaMeme = async () => {
  const response = await fetch(`https://g.tenor.com/v1/search?q=baby-yoda&key=LIVDSRZULELA&limit=1`);
  const data = await response.json();
  return data.results[0].media[0].gif.url;
};

export const getDadJoke = async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await response.json();
  return data.joke;
};