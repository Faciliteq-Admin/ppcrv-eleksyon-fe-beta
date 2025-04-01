import { combineReducers, configureStore } from '@reduxjs/toolkit'
import usersReducer from './reducers/usersReducer';

const rootReducer = combineReducers({ users: usersReducer });

const store = configureStore({
    reducer: rootReducer
});

// Get the type of store variable
export type AppStore = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default store;