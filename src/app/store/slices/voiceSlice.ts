import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = [
    {id: 1, title: 'voice1', description:"Desc 1"}
]

const voicesSlice = createSlice({
    name: 'voices',
    initialState,
    reducers: {
        addVoice: (state, action: PayloadAction<any>) => {
            const { id, title } = action.payload;
            state.push({id, title})
        },
        deleteVoice: (state, action: PayloadAction<any>) => {
            const voiceId = action.payload;
            return state.filter((post:any)=>post.id===voiceId)
        },
    }
})

export const { addVoice, deleteVoice } = voicesSlice.actions;
export default voicesSlice.reducer;