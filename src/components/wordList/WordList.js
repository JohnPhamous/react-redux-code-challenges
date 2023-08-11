import React from "react";
import { useSelector } from "react-redux";
import { selectWordList } from "./wordListSlice";
import { selectInput } from "../searchBar/searchBarSlice";

const WordList = () => {
  const input = useSelector(selectInput);
  const wordList = useSelector(selectWordList);

  return (
    <div>
      {input.length === 0 ? (
        <h2>
          Enter a prompt in the search bar to find words with a similar meaning.
        </h2>
      ) : (
        <h2>Here are a list of words that mean: "{input}".</h2>
      )}
      <ul>
        {wordList.map((wordListItem) => {
          const word = wordListItem.word;
          return <li key={word}>{word}</li>;
        })}
      </ul>
    </div>
  );
};

export default WordList;
