// import { commonSettings } from "./dialog.js";

const getCookie = (name) => {
  return new Promise((resolve, reject) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length != 2) return resolve("");

    let response = parts.pop().split(";").shift();
    response = JSON.parse(response);
    resolve(response);
  });
};
const setCookie = (name, value) => {
  // max-age:存活時間24HR
  document.cookie = name + "=" + JSON.stringify(value) + `; max-age=31536000; SameSite=strict; Secure=true`;
};

const logOut = () => {
  let url = document.location.href;
  url = url.slice(0, url.lastIndexOf("/"));
  window.location.href = `${url}/index.html`;
};

const clearAllCookies = () => {
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

//取url傳值
const getUrlData = () => {
  const search_url = new URL(window.location.href);
  const params = search_url.searchParams;
  let passData = {};
  for (let [key, value] of params.entries()) passData[key] = value;
  return passData;
};

export { getCookie, setCookie, clearAllCookies, getUrlData };
