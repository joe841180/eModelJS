import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig, * as axiosHttp from "src/axiosConnection";
// import { logIn } from "../contexts/connection";
// import axios from "axios";


export const axiosLogin = createAsyncThunk("authentication/login", async (payload) => {
  try {

    console.log("payload123");
    console.log(payload);
    payload = {
      phone: "3",
      password: "3",
    };
    console.log(payload);

    // fetch('http://192.168.0.102/account/login/', {
    //   method: "POST",
    //   headers: new Headers({
    //     'Content-Type': 'application/json'
    //   }),
    //   body: JSON.stringify(payload)
    // })
    //   .then(async (res) => {
    //     if (res.status === 200) {
    //       res = await res.json()
    //       console.log("fetch");
    //       console.log(res);
    //     } else {
    //       throw new Error(res);
    //     }
    //   })

    // 
    // const response = await logIn(payload);
    // console.log("response");
    // console.log(response);
    // if (!response.state) throw response.data

    // 
    const response = await axiosHttp.logIn(payload)
    axiosConfig.interceptors.request.use((config) => {
      const token = response.data.access
      const refresh = response.data.refresh
      config.headers.Authorization = `Bearer ${token}`

      localStorage.setItem("authenticated", "true")
      return config
    });

    return response.data;
  } catch (error) {
    console.log('error');
    console.log(error);
    throw error.message
  }
});

const initialAuthState = {
  status: 0, // 0-loading 1-success 2-fail
  isAuthenticated: false,
  token: {},
  accountInfo: {},
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    logout: (state, action) => {
      state.isAuthenticated = false;
    },
    skip: (state, action) => {
      state.isAuthenticated = true;
    },
    getAccountInfo: async (state, action) => {
      const user = {
        id: "5e86809283e28b96d2d38537",
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: "Anika Visser",
        email: "anika.visser@devias.io",
      };
      state.accountInfo = user;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(axiosLogin.pending, (state, { payload }) => {
        console.log('pending');
        state.status = 0
      })
      .addCase(axiosLogin.fulfilled, (state, { payload }) => {
        console.log('fulfilled');
        state.status = 1;
        state.accountInfo = payload;
        state.isAuthenticated = true;
      })
      .addCase(axiosLogin.rejected, (state, { payload }) => {
        console.log("rejected");
        state.status = 2;
      })
  }
});

export const selectAuthentication = (state) => state.authentication;
export const authActs = authSlice.actions;
export default authSlice.reducer;
