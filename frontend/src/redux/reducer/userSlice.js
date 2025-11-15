import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        userCity: null,
        userState: null,
        userAddress: null,
        shopsInMyCity: null,
        itemsInMyCity: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setUserCity: (state, action) => {
            state.userCity = action.payload;
        },
        setUserState: (state, action) => {
            state.userState = action.payload;
        },
        setUserAddress: (state, action) => {
            state.userAddress = action.payload;
        },
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload;
        },
        setItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload;
        },
    },
})

export const { setUserData, setUserCity, setUserState, setUserAddress, setShopsInMyCity, setItemsInMyCity } = userSlice.actions;
export default userSlice.reducer;