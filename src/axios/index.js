import axios from "axios";
import { Button, notification, Space } from "antd";

export default function a(config = {}) {
  const { auth = false } = config;

  const instance = axios.create({
    headers: {
      //   Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json",
      "Access-Control-Expose-Headers": "Content-Disposition",
    },
    baseURL: "/",
    timeout: 100000,
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const errorCode = error?.response?.status;
      console.log("API error >>>>>>", error, "ERROR code:", errorCode);

      notification["error"]({
        message: "Network Error",
        description: "Network Error",
        type: "error",
        duration: 4500,
      });
    }
  );

  return instance({ ...config });
}
