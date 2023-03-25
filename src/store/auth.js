import { createSlice } from "@reduxjs/toolkit";
import { logIn } from "../contexts/connection";

const initialAuthState = {
  isAuthenticated: false,
  accountInfo: {},
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      if (action.payload.email !== "demo@devias.io" || action.payload.password !== "Password123!") {
        throw new Error("Please check your email and password");
      }
      console.log("123");

      try {
        const data = {
          // email: "123",
          phone: "3",
          password: "3",
        };

        let resLogIn = logIn(data);
        console.log(resLogIn);
        if (!resLogIn.state) {
          throw new Error("Please check your email and password");
        }

        // localStorage.setItem("access", "true");
        // localStorage.setItem("refresh", "true");
      } catch (err) {
        console.error(err);
      }

      state.isAuthenticated = true;
    },
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
});

export const authActs = authSlice.actions;
export default authSlice.reducer;
