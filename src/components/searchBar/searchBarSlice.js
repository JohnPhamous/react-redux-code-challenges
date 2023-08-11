import { createSlice } from '@reduxjs/toolkit'

export const searchBarSlice = createSlice({
  name: 'input',
  initialState: {
    value: ''
  },
  reducers: {
    setSearchInput: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setSearchInput } = searchBarSlice.actions

export const selectInput = (state) => state.searchBar.value

export default searchBarSlice.reducer
