import { createSlice } from '@reduxjs/toolkit'

export const wordListSlice = createSlice({
  name: 'wordList',
  initialState: {
    value: []
  },
  reducers: {
    setWordList: (state, action) => {
      console.log('boba')
      state.value = action.payload
    }
  }
})

export const { setWordList } = wordListSlice.actions

export const selectWordList = (state) => state.wordList.value

export default wordListSlice.reducer
