import React from "react";
import SearchBar from "./components/searchBar/SearchBar";
import WordList from "./components/wordList/WordList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>What's that word?!</h1>
      <SearchBar />
      <WordList />
    </div>
  );
}

export default App;
