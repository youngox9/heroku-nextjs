import { createStore, combineReducers } from "redux";
// state
const initialState = {
  isLoading: false,
};

// reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_LOADING": {
      const { isLoading } = action;

      return {
        ...state,
        isLoading,
      };
    }
    default:
      return state;
  }
};

const combine = combineReducers({
  global: reducer,
});

const store = createStore(combine);

export default store;
