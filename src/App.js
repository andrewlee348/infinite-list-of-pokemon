import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import logo from "./logo.svg";
import "./App.css";

const PAGE_SIZE = 12;

const fetchPokemonPage = async (offset = 0) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
  );
  return response.data.results;
};

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const endOfPageRef = useRef();
  const intersectionCallback = useRef();

  useEffect(() => {
    setIsLoading(true);
    fetchPokemonPage().then((firstPageOfPokemon) => {
      setPokemonList(firstPageOfPokemon);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      intersectionCallback.current(entries);
    });
    observer.observe(endOfPageRef.current);
  }, []);

  const handleIntersection = (entries) => {
    const endOfPage = entries[0];
    if (endOfPage.isIntersecting && !isLoading) {
      setIsLoading(true);
      fetchPokemonPage(pokemonList.length).then((newPageOfPokemon) => {
        {
          setPokemonList([...pokemonList, ...newPageOfPokemon]);
          setIsLoading(false);
        }
      });
      console.log("is intersecting");
    } else {
      console.log("is not intersecting");
    }
  };

  useEffect(() => {
    intersectionCallback.current = handleIntersection;
  });

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Infinite scrolling list of pokemon
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 250px 250px 250px",
          margin: "auto",
          maxWidth: "1000px",
        }}
      >
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.name}
            style={{
              border: "1px solid lightgray",
              padding: "5px",
              margin: "5px",
              textAlign: "center",
            }}
          >
            <h3>{pokemon.name}</h3>
            <img
              src={`https://img.pokemondb.net/artwork/${pokemon.name}.jpg`}
              width="200px"
            />
          </div>
        ))}
      </div>
      {isLoading && (
        <div style={{ textAlign: "center", margin: "10px" }}>Loading ...</div>
      )}
      <div ref={endOfPageRef} style={{ height: "1px" }}></div>
    </div>
  );
}

export default App;
