import * as express from "express";
import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";

// pokedex api
const pokdex = express();
pokdex.use(cors({ origin: true }));
pokdex.get("/pokdex", async (req, res) => {
  try {
    const listResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0`,
    );
    const pokemonList = listResponse.data.results;
    console.log(pokemonList);

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
        sprites: pokemonData.sprites,
        includeGame,
      };
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    res.status(200).send(pokemonDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.fetchPokdex = functions.https.onRequest(pokdex);

// pokemon api
// const pokemon = express();
// pokemon.use(cors({ origin: true }));
// pokemon.get("/pokemon", async (req, res) => {
//   try {
//     const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/1`);
//     console.log(response);
//     res.status(200).send(response.data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });
//
// exports.fetchPokemon = functions.https.onRequest(pokemon);
