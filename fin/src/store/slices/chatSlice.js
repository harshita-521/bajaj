import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName : "" , 
    policyName :"" , 
    chatHistory: []


}
export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setchatUserName: (state, action) => {
            state.userName = action.payload;
        },
        setPolicyName: (state, action) => {
            state.policyName = action.payload;
        },
        addChatMessage: (state, action) => {
            state.chatHistory.push(action.payload);
        },
        clearChatHistory: (state) => {
            state.chatHistory = [];
        },
    },
}) ; 

export const { setchatUserName, setPolicyName, addChatMessage, clearChatHistory } = chatSlice.actions;
export default chatSlice.reducer;
