export async function fetchGameList() {
  const url = `https://www.giantbomb.com/api/games/?api_key=${process.env.NEXT_PUBLIC_GAMEBOMB_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });
    return response.json();
  } catch (error) {
    return `An error occurred: ${error}`;
  }
}
