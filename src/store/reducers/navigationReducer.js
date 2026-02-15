import * as types from '../actionTypes';
import { ITEMS_PER_ROW, SECTIONS } from '../../constants';

const initialState = {
  activeSection: SECTIONS.GRID,
  focusedIndex: 0,
  focusedFilterIndex: 0,
};

const navigationReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_ACTIVE_SECTION:
      return { ...state, activeSection: payload.section };

    case types.SET_FOCUSED_INDEX:
      return { ...state, focusedIndex: payload.index };

    case types.SET_FOCUSED_FILTER_INDEX:
      return { ...state, focusedFilterIndex: payload.index };

    case types.NAVIGATE_UP:
      return { ...state, focusedIndex: Math.max(0, state.focusedIndex - ITEMS_PER_ROW) };

    case types.NAVIGATE_DOWN:
      return { ...state, focusedIndex: state.focusedIndex + ITEMS_PER_ROW };

    case types.NAVIGATE_LEFT:
      return { ...state, focusedIndex: Math.max(0, state.focusedIndex - 1) };

    case types.NAVIGATE_RIGHT:
      return { ...state, focusedIndex: state.focusedIndex + 1 };

    case types.SET_ACTIVE_FILTER:
    case types.CLEAR_SEARCH:
      return { ...state, focusedIndex: 0 };

    default:
      return state;
  }
};

export default navigationReducer;
