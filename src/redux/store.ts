import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { baseApi } from './api/baseApi';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

/**
 * We use react persist to store the user's authentication information in the local storage of the browser.
 * Here are the steps of configuring persist
 * 1) We import the persistStore and persistReducer from redux-persist.
 * 2) We import the storage from redux-persist/lib/storage.
 * 3) We create a persistConfig object with a key and storage.
 * 4) We create a persistedAuthReducer by passing the persistConfig and authReducer to the persistReducer function.
 * 5) We pass the persistedAuthReducer to the auth key in the reducer object of the configureStore function.
 * 6) We create a persistor by passing the store to the persistStore function.
 * 7) We export the store and persistor.
 * 8) We connect the persistor in our main.tsx file. By wrapping the RouterProvider with the PersistGate component.
 *
 * AFTER CONFIGURING PERSIST WE WILL FACE A NON-SERIALIZABLE ERROR BECAUSE WE ARE STORING THE USER OBJECT IN THE REDUX STORE AND THE USER OBJECT IS NOT SERIALIZABLE.
 *
 * TO FIX THIS ERROR WE NEED TO ADD A SERIALIZABLECHECK OBJECT TO THE getDefaultMiddleware FUNCTION IN THE MIDDLEWARE PROPERTY OF THE configureStore FUNCTION.
 *
 *
 */
