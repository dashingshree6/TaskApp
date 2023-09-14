import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  authenticated: false,
  loading: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.authenticated = true
    },
    logout: (state) => {
      state.authenticated = false
    },
    loaderOn: (state) => {
      state.loading = true
    },
    loaderOff: (state) => {
    state.loading = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, loaderOff, loaderOn } = authSlice.actions

export default authSlice.reducer