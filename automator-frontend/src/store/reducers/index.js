import { combineReducers } from "@reduxjs/toolkit";
import theme from "./theme";
import listItem from "./listitem";

const rootReducer = combineReducers({
	listItem: listItem,
	theme: theme,
});
export default rootReducer;
