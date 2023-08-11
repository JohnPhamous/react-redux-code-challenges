import { configureStore } from '@reduxjs/toolkit'
import searchBarReducer from './components/searchBar/searchBarSlice'
import wordListReducer from './components/wordList/wordListSlice'

export default configureStore({
  reducer: {
    searchBar: searchBarReducer,
    wordList: wordListReducer
  }
})
