import { getCookie, setCookie } from "../../module/globalSettings.js";
import { api } from "../../restfulApi.js";

console.log("test");
let httpApi = new api();
//======= sign in =======
let form = document.querySelector(".l-auth__form");
let input = form.querySelectorAll("input");
let button = document.querySelector("button");
const passwordInputEl = document.querySelector("#passwordInput");

// 登入觸發
button.addEventListener("click", sendMsg);
passwordInputEl.addEventListener("keypress", function (e) {
  if (e.keyCode === 13 || e.which === 13) {
    e.preventDefault();
    sendMsg();
  }
});

// 登入
async function sendMsg() {
  let phone_email = input[0].value;
  let password = input[1].value;
  let data = {};
  if (phone_email.includes("@")) data["email"] = phone_email;
  else data["phone"] = phone_email;
  data["password"] = password;

  if (phone_email == "" || password == "") {
    alert("輸入框不能為空");
  } else {
    // API
    let resLogIn = await httpApi.logIn(data);
    console.log(resLogIn);

    // 登入成功判斷
    if (resLogIn.state) {
      setCookie("access", resLogIn?.data?.access);
      setCookie("refresh", resLogIn?.data?.refresh);

      // let access = await getCookie("access");
      // let refresh = await getCookie("refresh");

      // let url = document.location.href;
      // url = url.slice(0, url.lastIndexOf("/"));
      // window.location.href = `${url}/overview.html`;
    } else {
      console.log(resLogIn.state);
      alert(resLogIn.data);
    }
  }
}


async function test() {
  let url = "http://192.168.0.101:8000/account/self/profile/";
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      } else {
        let response = {
          state: true,
          data: await res.json(),
        };
        return response;
      }
    })
    .catch(async (err) => {
      let res = {
        state: false,
      };
      try {
        res["data"] = JSON.parse(err?.message)["message"];
      } catch (error) {
        res["data"] = String(err);
      }
      return res;
    });
}
test()
console.log("test");
