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

// sidebar slice, contains boolean state for collapse and toggled properties for sidebar
const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: sidebarInitialState,
    // reducers flip boolean for each state toggle propety
    reducers: {
        /** 
         * Flips the boolean value of collapse
         *  @param {SidebarState} state { current sidebar slice state, boolean for collapse and toggle}
         */
        toggleCollapse: state => {
            state.collapse = !state.collapse;
        },
        /** 
         * Flips the boolean value of toggle
         *  @param {SidebarState} state { current sidebar slice state, boolean for collapse and toggle}
         */
        toggleSidebar: state => {
            state.toggle = !state.toggle;
        },
    }
})

export const selectToggle = (state: RootState) => state.sidebar.toggle;
export const selectCollapse = (state: RootState) => state.sidebar.collapse;

export const { toggleCollapse, toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice;