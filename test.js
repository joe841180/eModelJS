import { api } from "./js/restfulApi.js";
import { getCookie, setCookie } from "./js/module/globalSettings.js";
let httpApi = new api();

// PUT、PATCH、DELETE (皆需指定id) ~/users/1

const test = async () => {
  const data = {
    // email: "123",
    phone: "3",
    password: "3",
  };

  let resLogIn = await httpApi.logIn(data);
  resLogIn = resLogIn?.data?.access
  console.log(resLogIn);
  let test1 = await httpApi.test(resLogIn);
  console.log(test1);
  // if (resLogIn.state) {
  //   setCookie("access", resLogIn?.data?.access);
  //   setCookie("refresh", resLogIn?.data?.refresh);
  // } else {
  //   console.log(resLogIn.state);
  //   alert(resLogIn.data);
  // }
};

test();
