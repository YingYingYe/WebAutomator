import { createSlice } from "@reduxjs/toolkit";

import store from "../../index";

const initialState = {
	themeMode: "light",
};

// Slice
const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setThemeMode: (state, action) => {
			const { payload } = action;
			state.themeMode = payload;
		},
	},
});

// Reducers
export default themeSlice.reducer;

// Selectors
export const themeSelector = (state) => state.theme;

// Actions
const { setThemeMode } = themeSlice.actions;

// Thunks
export const toggleThemeMode = () => (dispatch) => {
	const { themeMode } = store.getState().theme;
	const mode = themeMode === "light" ? "dark" : "light";
	dispatch(setThemeMode(mode));
};
