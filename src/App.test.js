import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import React from "react";

import App from "./App";

const mockStore = configureMockStore();
let store = mockStore({
  searchBar: {
    value: "",
  },
  wordList: {
    value: [],
  },
});

describe("<App />", () => {
  beforeEach(() => {
    store = mockStore({
      searchBar: {
        value: "",
      },
      wordList: {
        value: [],
      },
    });
  });

  it("should show a text input and a submit button", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Check if the text input element is present
    const inputElement = screen.getByRole("searchbox");
    expect(inputElement).toBeInTheDocument();

    // Check if the submit button element is present
    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should allow a user to type in a word and start a search", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
        {
          word: "lily-white",
          score: 40023443,
          tags: ["syn", "adj", "results_type:primary_rel"],
        },
        {
          word: "whiteness",
          score: 40023139,
          tags: ["syn", "n"],
        },
        {
          word: "whiten",
          score: 40022066,
          tags: ["syn", "v", "n", "prop"],
        },
        {
          word: "snowy",
          score: 40016788,
          tags: ["syn", "adj", "n"],
        },
        {
          word: "white-hot",
          score: 40010953,
          tags: ["syn", "adj"],
        },
        {
          word: "hot",
          score: 40008966,
          tags: ["syn", "adj", "adv", "v", "n"],
        },
        {
          word: "colorless",
          score: 40003341,
          tags: ["syn", "adj"],
        },
        {
          word: "achromatic",
          score: 39996509,
          tags: ["syn", "adj", "ant"],
        },
        {
          word: "light",
          score: 39984498,
          tags: ["syn", "n", "adj", "v", "adv"],
        },
        {
          word: "covered",
          score: 39981436,
          tags: ["syn", "adj"],
        },
      ]),
    });

    const { rerender } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    let inputElement = screen.getByLabelText("Search");
    fireEvent.change(inputElement, { target: { value: "bottle" } });
    expect(store.getActions()[0].payload).toBe("bottle");
    store = mockStore({
      searchBar: {
        value: store.getActions()[0].payload,
      },
      wordList: {
        value: [],
      },
    });

    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    );
    inputElement = screen.getByDisplayValue("bottle");
    expect(inputElement).toBeInTheDocument();

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    expect(mockFetch).toBeCalledTimes(1);
    expect(mockFetch).toBeCalledWith(
      "https://api.datamuse.com/words?max=10&ml=bottle",
      { cache: "no-cache" }
    );
  });

  it("should show a list of words after a user searches", async () => {
    const mockWords = [
      {
        word: "lily-white",
        score: 40023443,
        tags: ["syn", "adj", "results_type:primary_rel"],
      },
      {
        word: "whiteness",
        score: 40023139,
        tags: ["syn", "n"],
      },
      {
        word: "whiten",
        score: 40022066,
        tags: ["syn", "v", "n", "prop"],
      },
      {
        word: "snowy",
        score: 40016788,
        tags: ["syn", "adj", "n"],
      },
      {
        word: "white-hot",
        score: 40010953,
        tags: ["syn", "adj"],
      },
      {
        word: "hot",
        score: 40008966,
        tags: ["syn", "adj", "adv", "v", "n"],
      },
      {
        word: "colorless",
        score: 40003341,
        tags: ["syn", "adj"],
      },
      {
        word: "achromatic",
        score: 39996509,
        tags: ["syn", "adj", "ant"],
      },
      {
        word: "light",
        score: 39984498,
        tags: ["syn", "n", "adj", "v", "adv"],
      },
      {
        word: "covered",
        score: 39981436,
        tags: ["syn", "adj"],
      },
    ];
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWords),
    });

    const { rerender } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const inputElement = screen.getByLabelText("Search");
    fireEvent.change(inputElement, { target: { value: "bottle" } });
    store = mockStore({
      searchBar: {
        value: store.getActions()[0].payload,
      },
      wordList: {
        value: mockWords,
      },
    });

    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    rerender(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const list = screen.getByRole("list");
    mockWords.forEach((word) => {
      expect(list).toContainElement(screen.getByText(word.word));
    });
  });

  it("should throw an error if getting the synonyms fails", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error("API Error")),
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessageContainer = screen.getByTestId("error-message");
      expect(errorMessageContainer).toBeInTheDocument();
      expect(errorMessageContainer.textContent?.length).toBeGreaterThan(0);
    });
  });
});
