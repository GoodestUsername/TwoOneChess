import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sidebarSlice from 'features/components/sidebar/sidebarSlice';
import historySlice from 'features/components/twoonechess/historySlice';

const rootReducer = combineReducers({
    sidebar: sidebarSlice.reducer,
    history: historySlice.reducer,
});

const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;