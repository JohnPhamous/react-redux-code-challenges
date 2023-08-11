import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { vi } from 'vitest'

import App from './App'
const mockStore = configureMockStore()
let store = mockStore({
  searchBar: {
    value: ''
  }
})

describe('<App />', () => {
  it('should show a text input and a submit button', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // Check if the text input element is present
    const inputElement = screen.getByRole('searchbox')
    expect(inputElement).toBeInTheDocument()

    // Check if the submit button element is present
    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it.only('should allow a user to type in a word and start a search', async () => {
    const { rerender } = render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    let inputElement = screen.getByLabelText('Search')
    fireEvent.change(inputElement, { target: { value: 'bottle' } })
    expect(store.getActions()[0].payload).toBe('bottle')
    store = mockStore({
      searchBar: {
        value: store.getActions()[0].payload
      }
    })

    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    )
    inputElement = screen.getByDisplayValue('bottle')
    expect(inputElement).toBeInTheDocument()

    const submitButton = screen.getByRole('button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      console.log(store.getActions())
    })
  })
})
