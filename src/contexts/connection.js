const host = "http://192.168.0.102";

// 登入
export async function logIn(data) {
  let url = host + "/account/login/";

  return fetch(url, {
    method: "POST",
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  })
    .then(async (res) => {
      if (res.status === 200) {
        res = await res.json()
        window.sessionStorage.setItem('authenticated', 'true');
        let response = {
          state: true,
          data: res
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

// 搜尋/進階搜尋
export async function searchModel(data) {
  let url = host + "/model/";
  let token = await getCookie("access");

  return fetch(url, {
    method: "GET",
    headers: new Headers({
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    })
  })
    .then(async (res) => {
      if (res.status === 200) {
        res = await res.json()
        let response = {
          state: true,
          data: res
        };
        return response;
      } else {
        let response = {
          state: false,
          data: new Error(res)
        };
        return response;
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
export async function searchModelDetail(id) {
  let url = host + `/account/${id}/profile/`;
  let token = await getCookie("access");

  return fetch(url, {
    method: "GET",
    headers: new Headers({
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    })
  })
    .then(async (res) => {
      if (res.status === 200) {
        res = await res.json()
        let response = {
          state: true,
          data: res
        };
        return response;
      } else {
        let response = {
          state: false,
          data: new Error(res)
        };
        return response;
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
// // 查閱用戶詳細資料
// export async function accountProfile() {
//   let token = await getCookie("access");
//   let url = host + "/account/self/profile/";
//   return axios({
//     method: "GET",
//     url: url,
//     responseType: "json", // responseType 也可以寫在 header 裡面
//     headers: {
//       Authorization: `Bearer ${token}`, // Bearer 跟 token 中間有一個空格
//     },
//   })
//     .then(async (res) => {
//       if (res.status === 200) {
//         // console.log(res);
//         let response = {
//           state: true,
//           data: res.data,
//         };
//         return response;
//       } else {
//         throw new Error(res);
//       }
//     })
//     .catch(async (err) => {
//       console.log(err);
//       let res = {
//         state: false,
//       };
//       try {
//         res["data"] = err.response.data;
//       } catch (error) {
//         res["data"] = String(err);
//       }
//       return res;
//     });
// }
// // 修改用戶詳細資料
// export async function changeAccountProfile() {
//   let token = await getCookie("access");
//   let url = host + "/account/self/profile/";
//   return axios({
//     method: "PATCH",
//     url: url,
//     responseType: "json", // responseType 也可以寫在 header 裡面
//     headers: {
//       Authorization: `Bearer ${token}`, // Bearer 跟 token 中間有一個空格
//     },
//     data: {
//       email: "333@333.com",
//     },
//   })
//     .then(async (res) => {
//       if (res.status === 200) {
//         console.log(res);
//         let response = {
//           state: true,
//           data: res.data,
//         };
//         return response;
//       } else {
//         throw new Error(res);
//       }
//     })
//     .catch(async (err) => {
//       console.log(err);
//       let res = {
//         state: false,
//       };
//       try {
//         res["data"] = err.response.data;
//       } catch (error) {
//         res["data"] = String(err);
//       }
//       return res;
//     });
// }

