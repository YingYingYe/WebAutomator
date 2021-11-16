import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	listItem: 0,
};

// Slice
const listItemSlice = createSlice({
	name: "listItem",
	initialState,
	reducers: {
		setListItem: (state, action) => {
			const { payload } = action;
			state.listItem = payload;
		},
	},
});

// Reducers
export default listItemSlice.reducer;

// Selectors
export const listItemSelector = (state) => state.listItem;

// Actions
export const { setListItem } = listItemSlice.actions;

// Thunks
// export const toggleThemeMode = () => (dispatch) => {
// 	const { themeMode } = store.getState().theme;
// 	const mode = themeMode === "light" ? "dark" : "light";
// 	dispatch(setThemeMode(mode));
// };
