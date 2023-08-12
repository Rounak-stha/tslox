import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface sourceState {
    value: string
}

const initialState: sourceState = {
    value: '',
}

export const sourceSlice = createSlice({
    name: 'source',
    initialState,
    reducers: {
        updatesource: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        },
    },
})

export const { updatesource } = sourceSlice.actions
export default sourceSlice.reducer
