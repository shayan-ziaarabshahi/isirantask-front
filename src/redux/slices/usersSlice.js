import { createSlice } from "@reduxjs/toolkit";



const setUsers = (state, action) => {
  console.log(action.payload)
   state.users = action.payload.users
}


const initialState = {
   users: []
}


const usersSlice = createSlice({
   name:'usersSlice',
   initialState,
   reducers:{
      setUsers
   }
})


export const {
  setUsers:setUsersAction,
} = usersSlice.actions


export default usersSlice.reducer
