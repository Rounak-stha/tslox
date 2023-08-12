import { configureStore } from '@reduxjs/toolkit'
import sourceReducer from './features/sourceSlice'

export const store = configureStore({
    reducer: {
        sourceReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
