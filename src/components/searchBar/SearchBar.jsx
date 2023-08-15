import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchInput, selectInput } from "./searchBarSlice";
import { setWordList } from "../wordList/wordListSlice";

export const getWordList = async (endpoint) => {
  const response = await fetch(endpoint, { cache: "no-cache" });

  if (response.ok) {
    const jsonResponse = await response.json();
    return jsonResponse;
  }
};

const SearchBar = () => {
  const [error, setError] = useState(null);
  const input = useSelector(selectInput);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    e.preventDefault();
    dispatch(setSearchInput(e.target.value));
  };

  const handleSubmit = async () => {
    setError(null);
    const url = "https://api.datamuse.com/words?";
    const queryParams = "max=10&ml=";
    const endpoint = `${url}${queryParams}${encodeURIComponent(input)}`;

    try {
      const words = await getWordList(endpoint);
      dispatch(setWordList(words));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      {error !== null && <p data-testid="error-message">{error}</p>}
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
