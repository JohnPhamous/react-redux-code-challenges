import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchInput, selectInput } from "./searchBarSlice";
import { setWordList } from "../wordList/wordListSlice";

const SearchBar = () => {
  const input = useSelector(selectInput);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    e.preventDefault();
    dispatch(setSearchInput(e.target.value));
  };

  const getWordList = async (endpoint) => {
    try {
      const response = await fetch(endpoint, { cache: "no-cache" });

      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
    } catch (error) {
      throw new Error("Sorry, your request was unsuccessful.");
    }
  };

  const handleSubmit = async () => {
    const url = "https://api.datamuse.com/words?";
    const queryParams = "ml=";
    const queryString = input.replace(/\s/g, "+");
    const endpoint = `${url}${queryParams}${queryString}`;

    const apiResponse = await getWordList(endpoint);

    let wordListToRender = [];

    if (apiResponse.length > 10) {
      const firstTenWords = apiResponse.slice(0, 9);
      wordListToRender = firstTenWords;
    } else {
      wordListToRender = apiResponse;
    }

    dispatch(setWordList(wordListToRender));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          id="search-bar"
          type="search"
          placeholder="What's a word that means...?"
          onChange={handleChange}
          value={input}
          aria-label="Search"
        />
        <button className="btn" id="search-btn" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
