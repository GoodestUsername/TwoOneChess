import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sidebarSlice from 'features/components/sidebar/sidebarSlice';

const rootReducer = combineReducers({
    sidebar: sidebarSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;