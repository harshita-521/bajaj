import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName : "" , 
    userId : "" , 
    email :""  , 
    policies: [
        {
            policyId: "",
            policyName: "",
            indexName : "",
            createdAt: "",
        }
    ] , 
    


}
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers :{
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setUserId: (state, action) => { 
            state.userId = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        addPolicy: (state, action) => {
            state.policies.push(action.payload);
        },
        removePolicy: (state, action) => {
            state.policies = state.policies.filter(policy => policy.policyId !== action.payload);
        }
    }

}); 
export const { setUserName, setUserId, setEmail, addPolicy, removePolicy } = userSlice.actions;
export default userSlice.reducer;
