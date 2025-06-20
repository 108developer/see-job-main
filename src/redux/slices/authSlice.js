const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  userid: typeof window !== "undefined" ? localStorage.getItem("userid") : null,
  username:
    typeof window !== "undefined" ? localStorage.getItem("username") : null,
  useremail:
    typeof window !== "undefined" ? localStorage.getItem("useremail") : null,
  phone: typeof window !== "undefined" ? localStorage.getItem("phone") : null,
  role: typeof window !== "undefined" ? localStorage.getItem("role") : null,
  expiresIn:
    typeof window !== "undefined" ? localStorage.getItem("expiresIn") : null,
  subscription:
    typeof window !== "undefined" && localStorage.getItem("subscription")
      ? JSON.parse(localStorage.getItem("subscription"))
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, userid, username, useremail, phone, role, expiresIn } =
        action.payload;
      state.token = token;
      state.userid = userid;
      state.username = username;
      state.useremail = useremail;
      state.phone = phone;
      state.role = role;
      state.expiresIn = expiresIn;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("userid", userid);
        localStorage.setItem("username", username);
        localStorage.setItem("useremail", useremail);
        localStorage.setItem("phone", phone); // Save phone
        localStorage.setItem("role", role);
        localStorage.setItem("expiresIn", expiresIn);
      }
    },
    logout: (state) => {
      state.token = null;
      state.userid = null;
      state.username = null;
      state.useremail = null;
      state.phone = null; // Reset phone
      state.role = null;
      state.expiresIn = null;

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        localStorage.removeItem("username");
        localStorage.removeItem("useremail");
        localStorage.removeItem("phone"); // Remove phone
        localStorage.removeItem("role");
        localStorage.removeItem("expiresIn");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
