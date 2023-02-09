// import { warnRanUpDialog } from "../../module/dialog.js";
import { getCookie, getUrlData } from "../../module/globalSettings.js";
import { reboot, shutdown, stopRan, startRan, checkStatus, switchCBSD } from "./ranServiceControlModule.js";

// log顯示
const logPrivilegeCheck = async (currentPage) => {
  // === RAN LOG ===
  const ranLogEl = document.querySelector("#ranLog");
  const devModeEl = document.querySelector("#devMode");

  let current_privileges = await getCookie("user_privileges"); //cookies

  //權限控制
  if (current_privileges.includes("7")) {
    // 顯示log
    ranLogEl.classList.remove("d-none")
    devModeEl.classList.remove("d-none")

    // 頁面傳值
    ranLogEl.setAttribute("href", `./RAN-DULog.html?currentRan=${currentPage}`);
    ranLogEl.innerHTML = `${currentPage} log`;
  }
}

// RAN service control
async function ranControlMain() {
  let urlData = getUrlData()
  let currentPage = urlData?.pg == undefined ? "RAN1" : urlData.pg

  // log權限控制
  logPrivilegeCheck(currentPage)

  // settings
  const ranToggleEl = document.querySelector(".ranToggle"); //start stop
  const serverMenuEl = document.querySelector("#serverMenu"); //start stop
  // let serverIp = await getCookie("serverIp")

  reboot(currentPage);
  shutdown(currentPage);

  //server switch 啟動、關閉
  ranToggleEl.addEventListener("click", async () => {
    if (ranToggleEl.querySelector("div").innerText == "Stop") {
      console.log("try stop");
      // await switchCBSD("1", "192.168.135.177", false).then(res => {
      //   console.log("switchCBSD st");
      //   console.log(res);
      // }).catch(res => {
      //   console.log("switchCBSD err");
      //   console.log(res);
      // })
      stopRan(currentPage);
    } else {
      console.log("try start");
      // await switchCBSD("1", "192.168.135.177", false).then(res => {
      //   console.log("switchCBSD st");
      //   console.log(res);
      // }).catch(err => {
      //   console.log("switchCBSD err");
      //   console.log(err);
      // })
      startRan(currentPage);
    }
  });

  //start/stop RAN 選單
  serverMenuEl.addEventListener("show.bs.dropdown", () => {
    checkStatus(currentPage);
  });
}

ranControlMain();
