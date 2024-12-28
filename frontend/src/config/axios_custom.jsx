import axios from "axios";
// import store from "../redux/store";
// import { setUserLoginInfo } from "../redux/slice/accountSlice";
const instance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
const NO_RETRY_HEADER = "x-no-retry";

instance.interceptors.request.use(
  function (config) {
    if (window.localStorage.getItem("user_id")) {
      config.headers["x-client-id"] = window.localStorage.getItem("user_id");
    }
    if (
      window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("access_token")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("access_token");
    }
    if (!config.headers.Accept && config.headers["Content-Type"]) {
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json; charset=utf-8";
    }

    if (config.url.includes("/auth/handleRefreshToken")) {
      const refreshToken = getCookie("refresh_token");
      if (refreshToken) {
        config.headers["refreshToken"] = refreshToken;
      }
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    const statusCode = error?.response?.status;
    const originalRequest = error.config;
    switch (statusCode) {
      case 403:
        window.location.href = "/access-denied";
        break;
      case 401:
        try {
          if (
            !originalRequest._retry &&
            error.config.url !== "/auth/sign-in" &&
            !error.config.headers[NO_RETRY_HEADER]
          ) {
            originalRequest._retry = true;
            const response = await instance.get("/auth/handleRefreshToken");
            const newToken = response.metadata.accessToken;
            if (newToken) {
              // store.dispatch(setUserLoginInfo(response.metadata.user));
              error.config.headers["Authorization"] = `Beaer ${newToken}`;
              localStorage.setItem("access_token", newToken);
              localStorage.setItem("user_id", newToken);
              return instance.request(originalRequest);
            }
          }
        } catch (e) {
          // Handle refresh token error or redirect to login
        }
        break;

      case 404:
        break;

      // Có thể thêm các case khác ...
    }
    return error?.response?.data || Promise.reject(error);
  }
);
export default instance;
