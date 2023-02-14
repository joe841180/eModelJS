//
import { getCookie, setCookie } from "./module/globalSettings.js";
class api {
  constructor() {
    this.host = "http://192.168.0.102";
  }
  // 登入
  async logIn(data) {
    let url = this.host + "/account/login/";
    return axios
      .post(url, data)
      .then(async (res) => {
        if (res.status === 200) {
          // console.log(res);
          setCookie("access", res.data.access);
          setCookie("refresh", res.data.refresh);
          let response = {
            state: true,
          };
          return response;
        } else {
          throw new Error(res);
        }
      })
      .catch(async (err) => {
        console.log(err);
        let res = {
          state: false,
        };
        try {
          res["data"] = err.response.data;
        } catch (error) {
          res["data"] = String(err);
        }
        return res;
      });
  }
  // 查閱用戶詳細資料
  async accountProfile() {
    let token = await getCookie("access");
    let url = this.host + "/account/self/profile/";
    return axios({
      method: "GET",
      url: url,
      responseType: "json", // responseType 也可以寫在 header 裡面
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 跟 token 中間有一個空格
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          // console.log(res);
          let response = {
            state: true,
            data: res.data,
          };
          return response;
        } else {
          throw new Error(res);
        }
      })
      .catch(async (err) => {
        console.log(err);
        let res = {
          state: false,
        };
        try {
          res["data"] = err.response.data;
        } catch (error) {
          res["data"] = String(err);
        }
        return res;
      });
  }
  // 修改用戶詳細資料
  async changeAccountProfile() {
    let token = await getCookie("access");
    let url = this.host + "/account/self/profile/";
    return axios({
      method: "PATCH",
      url: url,
      responseType: "json", // responseType 也可以寫在 header 裡面
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 跟 token 中間有一個空格
      },
      data: {
        email: "333@333.com",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          console.log(res);
          let response = {
            state: true,
            data: res.data,
          };
          return response;
        } else {
          throw new Error(res);
        }
      })
      .catch(async (err) => {
        console.log(err);
        let res = {
          state: false,
        };
        try {
          res["data"] = err.response.data;
        } catch (error) {
          res["data"] = String(err);
        }
        return res;
      });
  }
}

export { api };
