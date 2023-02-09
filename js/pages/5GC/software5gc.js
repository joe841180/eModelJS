import { getCookie, setCookie } from "../../module/globalSettings.js";

const ip5gcEl = document.querySelector("#ip5GC");
const swVersionEl = document.querySelector("#sw_version");
const connectedBBUEl = document.querySelector("#connected_bbu");

const software5GC = async () => {
  //show 5GC ip
  let serverIp = await getCookie("serverIp");
  ip5gcEl.innerHTML = serverIp["5GC"]
  //show SW Version
  fetch('../../../backend/setting5GC.json')
    .then(response => response.json())
    .then(data => swVersionEl.innerHTML = data['5gc']['version'])
    .catch(error => console.error(error));
  //show of Connected BBU
  let bbu_count = Object.keys(serverIp['RAN']).length
  connectedBBUEl.innerHTML = bbu_count

}

software5GC()