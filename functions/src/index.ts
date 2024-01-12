import * as express from "express";
import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";

// pokedex api
const pokedex = express();
pokedex.use(cors({ origin: true }));
pokedex.get("/pokedex", async (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  try {
    const listResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`,
    );
    const pokemonList = listResponse.data.results;

    const pokemonDetailsPromises = pokemonList.map(async (pokemon: any) => {
      const pokemonResponse = await axios.get(pokemon.url);
      const pokemonData = pokemonResponse.data;

      // 종(species) 정보를 가져오기 위한 추가 요청
      const speciesResponse = await axios.get(pokemonData.species.url);
      const speciesData = speciesResponse.data;

      // 한국어 이름 추출
      const koreanNameEntry = speciesData.names.find(
        (nameEntry: any) => nameEntry.language.name === "ko",
      );
      const koreanName = koreanNameEntry
        ? koreanNameEntry.name
        : pokemonData.name;

      // 등장 시리즈 요청
      const includeGame = pokemonData.game_indices.map(
        (game: any) => game.version.name,
      );

      return {
        id: pokemonData.id,
        name: koreanName, // 한국어 이름 사용
        sprites: pokemonData.sprites.other["official-artwork"].front_default,
        includeGame,
      };
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    res.status(200).send(pokemonDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.fetchPokedex = functions.https.onRequest(pokedex);
