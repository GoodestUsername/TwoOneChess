import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "util/store";

export interface SidebarState {
    collapse: boolean,
    toggle: boolean,
}

const sidebarInitialState: SidebarState = {
    collapse: true,
    toggle: true
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: sidebarInitialState,
    reducers: {
        toggleCollapse: state => {
            state.collapse = !state.collapse;
        },
        toggleSidebar: state => {
            state.toggle = !state.toggle;
        },
    }
})

export const selectToggle = (state: RootState) => state.sidebar.toggle;
export const selectCollapse = (state: RootState) => state.sidebar.collapse;

export const { toggleCollapse, toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice;