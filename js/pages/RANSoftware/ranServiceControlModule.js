import { commonSettings, confirmCancelDialog, warnRanUpDialog } from "../../module/dialog.js";
import { api, checkSus, apiDirectDataCheck } from "../../restfulApi.js";
import { getCookie, setCookie, clearAllCookies, getUrlData } from "../../module/globalSettings.js";

// 選單-dropdownMenu els
const serverMenuEl = document.querySelector("#serverMenu"); //start stop
const ranToggleEl = document.querySelector(".ranToggle"); //start stop
const ranStatusEl = document.querySelector(".c-dropdown__heading"); //Status

const dropdownMenuEl = document.querySelector("#dropdownMenu"); //dropdownMenu 展開/收起控制
const rebootEl = document.querySelector("#serverReboot"); //reboot
const shutdownEl = document.querySelector("#serverShutdown"); //Shutdown

//確認service
const checkServer = async (serviceName) => {
  let oamApi = new api(serviceName)
  await oamApi.getIP();
  let resRanStatus = await oamApi.ranStatus();
  console.log(resRanStatus);
  // resRanStatus["data"] = "5G system is UP"
  if (resRanStatus["state"] && !resRanStatus["data"].includes("5G system is UP")) return true
  else return false
}

// start/stop RAN: state狀態，true為有值，false為跳過CBRS
const switchCBSD = (id, ip, service) => {
  return new Promise(async (resolve, reject) => {
    let res = {}
    try {
      console.log("=============START switchCBSD=============");

      let resCheckCBRS = await cbrsInfo(id)
        .then(response => {
          let res = {}
          res["data"] = response

          if (res["data"]["body"]["cbsdEnabled"] != "1") {
            res["state"] = false
            return resolve(res)
          }
          else return res
        })
        .catch(err => {
          return reject(err)
        })

      console.log("resCheckCBRS");
      console.log(resCheckCBRS);

      let resSwitchCBSD = await processCBRS(id, ip, service)
        .then(response => {
          let res = {}
          res["data"] = response

          if (res["data"]["body"] == "Success") {
            res["state"] = true
            return resolve(res)
          }
          else {
            res["state"] = false
            return reject(res)
          }
        })
        .catch(err => {
          console.log("resSwitchCBSD error");
          return reject(String(err))
        })
    } catch (err) {
      console.log("switchCBSD error");
      reject(String(err))
    }
  })
}

// Get CBRS info
const cbrsInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("=============START cbrsInfo=============");
      let res = await get({
        "request": "getCbrsInformation",
        "type": "cbrs",
        "data": String(id)
      })
      console.log(res);

      if (res["errorType"] != 0) return reject(res["errorMessage"])
      else return resolve(res)

    } catch (error) {
      console.log("cbrsInfo error");
      reject(String(error))
    }
  })
}
// start/stop CBRS
const processCBRS = (id, ip, service) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("=============START processCBRS=============");
      let res = await get({
        "request": "preprocessRAN",
        "type": "sshpass",
        "body": {
          id: id,
          ip: ip,
          start: service //true, false
        }
      })
      console.log(res);

      if (res["errorType"] != 0) reject(res["errorMessage"])
      else resolve(res)
    } catch (error) {
      console.log("cbrsInfo error");
      reject(String(error))
    }
  })
}

//API - stop ran
const apiStopRan = async (serviceName) => {
  // const oamApi = new api("192.168.135.177")
  return new Promise(async (resolve, reject) => {
    let result = {}
    // let data = getUrlData();
    let oamApi = new api(serviceName);
    await oamApi.getIP()

    // ===== stop CBSD =====
    let userPrivileges = await getCookie("user_privileges");
    try {
      if (userPrivileges.includes("8")) {
        let ranID = serviceName.replace("RAN", "")
        console.log("ranID:" + ranID);
        console.log("serverIp:" + oamApi.ip);
        let resStopCBSD = await switchCBSD(ranID, oamApi.ip, false).then(res => {
          console.log(res);
          if (!res["state"]) throw "Stop CBSD fail"
        }).catch(res => {
          console.log(res);
          throw "Stop CBSD fail"
        })
      }
    } catch (error) {
      console.log(error);
      result["state"] = false
      result["data"] = String(error)
      resolve(result)
    }

    // ===== stop RAN =====
    try {
      console.log("apiStopRan START");
      console.log(serviceName);

      let res = await oamApi.ranStop().then(async (res) => {
        console.log(res);
        if (res["state"] && res["data"].toLowerCase().includes("done")) {
          let status = await loopCheckStatus(serviceName)
          console.log(status);

          result["state"] = status.includes("PARTIAL") ? false : true
          result["data"] = status
          resolve(result)
        } else {
          result["state"] = false
          result["data"] = res["data"]
          resolve(result)
        }
      });
    } catch (error) {
      console.log("apiStopRan error");
      console.log(error);
      result["state"] = false
      result["data"] = error
      resolve(result)
    }
  })
}

//API - start ran
const apiStartRan = async (serviceName) => {
  // const oamApi = new api("192.168.135.177")
  return new Promise(async (resolve, reject) => {
    let result = {}
    // let data = getUrlData();
    let oamApi = new api(serviceName)
    await oamApi.getIP()
    // ===== start CBSD =====
    let userPrivileges = await getCookie("user_privileges");
    try {
      if (userPrivileges.includes("8")) {
        let ranID = serviceName.replace("RAN", "")
        console.log("ranID:" + ranID);
        console.log("serverIp:" + oamApi.ip);
        let resStopCBSD = await switchCBSD(ranID, oamApi.ip, true).then(res => {
          console.log(res);
          if (!res["state"]) throw "Start CBSD fail"
        }).catch(res => {
          console.log(res);
          throw "Start CBSD fail"
        })
      }
    } catch (error) {
      console.log(error);
      result["state"] = false
      result["data"] = String(error)
      resolve(result)
    }

    // ===== start RAN =====
    try {
      console.log("apiStartRan START");
      // console.log(serviceName);

      let res = await oamApi.ranStart().then(async (res) => {
        console.log(res);
        // res["data"] = "==== [ERROR] USB inserted! ===="

        if (res["data"].includes("5G system is UP")) {
          let status = await loopCheckStatus(serviceName)
          console.log(status);

          result["state"] = status.includes("PARTIAL") ? false : true
          result["data"] = status

          console.log("apiStartRan END");
          resolve(result)
        } else {
          result["state"] = false
          result["data"] = res["data"]

          console.log("apiStartRan END");
          resolve(result)
        }
      });

    } catch (error) {
      console.log("apiStartRan error");
      console.log(error);

      result["state"] = false
      result["data"] = error
      reject(result)
    }
  })
}

//start ran
async function startRan(serviceName) {
  let timerInterval;

  commonSettings
    .fire({
      title: "Start RAN service...",
      html: "It takes about <b></b> seconds to start RAN service...",
      timer: 60000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        container: "c-alert__container",
        popup: "c-alert__popup c-alert__popup--timer",
        title: "c-alert__title",
        htmlContainer: "c-alert__content c-alert__content--timer",
        timerProgressBar: "c-alert__timer",
      },
      didOpen: async () => {
        let ranRunning = true;

        //timer
        document.querySelector(".swal2-timer-progress-bar-container").classList.add("c-alert__timer-container");
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          if (ranRunning && Swal.getTimerLeft() < 100) {
            Swal.stopTimer();
            let content = Swal.getHtmlContainer().innerHTML;
            if (content.includes("It takes about")) {
              Swal.getHtmlContainer().innerHTML = "Please wait";
            }
          } else {
            b.textContent = Math.floor(Swal.getTimerLeft() / 1000);
          }
        }, 100);

        //執行API - ranStart
        console.log("ranStart");
        await apiStartRan(serviceName).then(res => {
          // ranRunning = false;
          Swal.close()
          console.log("apiStartRan");
          console.log(res);

          if (res["state"]) {
            ranToggleEl.querySelector("div").innerText = "Stop";
            ranStatusEl.innerText = "Status: Online";
            ranSusDialog("Start");
          } else {
            let dialogData = {
              "switch": "Start",
              "content": res["data"]
            }
            ranFailDialog(dialogData, serviceName);
          }
        })

      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    })
}
//stop ran
async function stopRan(serviceName) {
  let timerInterval;

  commonSettings
    .fire({
      title: "Stop RAN service...",
      html: "It takes about <b></b> seconds to stop RAN service...",
      timer: 10000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        container: "c-alert__container",
        popup: "c-alert__popup c-alert__popup--timer",
        title: "c-alert__title",
        htmlContainer: "c-alert__content c-alert__content--timer",
        timerProgressBar: "c-alert__timer",
      },
      didOpen: async () => {
        let ranRunning = true;

        //timer
        document.querySelector(".swal2-timer-progress-bar-container").classList.add("c-alert__timer-container");
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          if (ranRunning && Swal.getTimerLeft() < 100) {
            Swal.stopTimer();
            let content = Swal.getHtmlContainer().innerHTML;
            if (content.includes("It takes about")) {
              Swal.getHtmlContainer().innerHTML = "Please wait";
            }
          } else {
            b.textContent = Math.floor(Swal.getTimerLeft() / 1000);
          }
        }, 100);

        //執行API - ranStop
        await apiStopRan(serviceName).then(res => {
          // ranRunning = false;
          Swal.close()

          if (res["state"]) {
            ranToggleEl.querySelector("div").innerText = "Start";
            ranStatusEl.innerText = "Status: Offline";
            ranSusDialog("Stop");
          } else {
            let dialogData = {
              "switch": "Stop",
              "content": res["data"]
            }
            ranFailDialog(dialogData, serviceName);
          }
        }).catch(err => {
          console.log(err);
          let dialogData = {
            "switch": "Stop",
            "content": String(err)
          }
          ranFailDialog(dialogData, serviceName);
        })


        // test
        // setTimeout(() => {
        //   ranRunning = false;
        //   Swal.close()
        //   ranFailDialog("Start");
        // }, 3000)
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    })
}
//ran - 成功後彈窗
function ranSusDialog(serverSwitch) {
  console.log(`${serverSwitch} RAN service successfully`);
  // checkStatus();

  commonSettings.fire({
    title: `${serverSwitch} RAN service successfully`,
    html: `RAN service has been ${serverSwitch.toLowerCase()}ed successfully!`,
    confirmButtonText: "OK",
    buttonsStyling: false,
    allowOutsideClick: false,
    customClass: {
      container: "c-alert__container",
      popup: "c-alert__popup",
      title: "c-alert__title",
      htmlContainer: "c-alert__content",
      confirmButton: "e-btn e-btn--action c-alert__btn",
    },
  });
  document.querySelector(".swal2-actions").classList.add("c-alert__action");
  document.querySelector(".swal2-timer-progress-bar-container").classList.add("d-none");
}
//start ran - 失敗後彈窗
function ranFailDialog(serverSwitch, serviceName) {
  console.log(`${serverSwitch["switch"]} RAN service failed`);

  // serverSwitch["content"] = serverSwitch["content"].replace(/\n/g, "<p>")
  let confirmAction
  let content = serverSwitch["content"]

  if (content.includes("RAN is still running")) {
    content = "RAN service is Partail. Please try again."
    confirmAction = true
  } else {
    // 設定錯誤訊息
    if (content.includes("[ERROR]")) {
      content = content.split("[ERROR]")[1]
      content = content.split("!")[0]
    }
    else {
      content = `Sorry, RAN service failed to ${serverSwitch["switch"].toLowerCase()}. Please try again.`
    }
    confirmAction = serverSwitch["switch"] == "Start" ? true : false
  }

  commonSettings
    .fire({
      title: `${serverSwitch["switch"]} RAN service failed`,
      html: content,
      showCancelButton: true,
      confirmButtonText: "Try it again",
      reverseButtons: true,
      timerProgressBar: false,
      buttonsStyling: false,
      allowOutsideClick: false,
      customClass: {
        container: "c-alert__container",
        popup: "c-alert__popup",
        title: "c-alert__title",
        htmlContainer: "c-alert__content",
        confirmButton: "e-btn e-btn--action c-alert__btn ranToggle",
        cancelButton: "e-btn e-btn--outline c-alert__btn",
      }
    })
    .then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("confirmAction:" + confirmAction);

        if (confirmAction) reStartRan(serviceName);
        else stopRan(serviceName);

      } else if (result.isDenied) {
        Swal.close();
      }
    });
  document.querySelector(".swal2-actions").classList.add("c-alert__action");
  document.querySelector(".swal2-timer-progress-bar-container").classList.add("d-none");
}

//start ran
async function reStartRan(serviceName) {
  let timerInterval;

  commonSettings
    .fire({
      title: "Restart RAN service...",
      html: "It takes about <b></b> seconds to restart RAN service...",
      timer: 80000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        container: "c-alert__container",
        popup: "c-alert__popup c-alert__popup--timer",
        title: "c-alert__title",
        htmlContainer: "c-alert__content c-alert__content--timer",
        timerProgressBar: "c-alert__timer",
      },
      didOpen: async () => {
        let ranRunning = true;

        //timer
        document.querySelector(".swal2-timer-progress-bar-container").classList.add("c-alert__timer-container");
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          if (ranRunning && Swal.getTimerLeft() < 100) {
            Swal.stopTimer();
            let content = Swal.getHtmlContainer().innerHTML;
            if (content.includes("It takes about")) {
              Swal.getHtmlContainer().innerHTML = "Please wait";
            }
          } else {
            b.textContent = Math.floor(Swal.getTimerLeft() / 1000);
          }
        }, 100);

        //執行API - ranStop
        let resApiStopRan = await apiStopRan(serviceName)
        console.log(resApiStopRan);
        if (!resApiStopRan["state"]) {
          Swal.close()
          let dialogData = {
            "switch": "Stop",
            "content": resApiStopRan["data"]
          }
          ranFailDialog(dialogData, serviceName);
        }
        //執行API - ranStart
        else {
          await apiStartRan(serviceName).then(res => {
            Swal.close()
            console.log(res);

            if (res["state"]) {
              ranToggleEl.querySelector("div").innerText = "Stop";
              ranStatusEl.innerText = "Status: Online";
              ranSusDialog("Start");
            } else {
              let dialogData = {
                "switch": "Start",
                "content": res["data"]
              }
              ranFailDialog(dialogData, serviceName);
            }
          })
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    })
}


//reboot重新啟動
const reboot = (serviceName) => {
  rebootEl.addEventListener("click", async () => {
    let checkStates = await checkServer(serviceName)
    console.log(checkStates);

    if (checkStates) {
      let setTxt = {
        "title": "Reboot RAN",
        "content": `Are you sure you want to reboot RAN server now?<p>If RAN is reboot all RANs wont be working.`,
        "confirm": "Reboot"
      }
      confirmCancelDialog(setTxt, async (result) => {
        if (!result.isConfirmed) return Swal.close();

        console.log("reboot");
        let oamApi = new api(serviceName)
        await oamApi.getIP();

        // log out
        clearAllCookies()
        // reboot
        await oamApi.ranReboot();
      });
    }
    else {
      let setTxt = {
        "title": "Reboot RAN failed",
        "content": `Please stop RAN Service before Reboot operation.`
      }
      warnRanUpDialog(setTxt, () => { });
    }
  });
};

//硬體關機
const shutdown = (serviceName) => {
  shutdownEl.addEventListener("click", async () => {
    let checkStates = await checkServer(serviceName)
    console.log(checkStates);

    if (checkStates) {
      let setTxt = {
        "title": "Shutdown RAN",
        "content": `Are you sure you want to shutdown RAN server now?<p>If RAN is shutdown all RANs wont be working.`, // If RAN is shutdown website wont be working.
        "confirm": "Shutdown"
      }
      confirmCancelDialog(setTxt, async (result) => {
        if (!result.isConfirmed) return Swal.close();

        // log out
        clearAllCookies()

        // Shutdown
        console.log("shutdown");
        let oamApi = new api(serviceName)
        await oamApi.getIP();
        await oamApi.ranShutdown();
      });
    }
    else {
      let setTxt = {
        "title": "Shutdown RAN failed",
        "content": `Please stop RAN Service before Shutdown operation.`
      }
      warnRanUpDialog(setTxt, () => { });
    }
  });
};

// check status until it's not pratail
const loopCheckStatus = async (serviceName) => {
  console.log("loopCheckStatus ST");
  let oamApi = new api(serviceName)
  await oamApi.getIP();

  // let resRanStatus = await oamApi.ranStatus();
  // console.log(resRanStatus);
  // let runLoop = resRanStatus["data"].includes("PARTIAL") ? true : false
  let res

  for (let i of Array(10).keys()) {
    res = await oamApi.ranStatus();
    console.log(res);
    res = res["data"]
    let runLoop = res.includes("PARTIAL") ? true : false

    if (runLoop) {
      console.log("等候中...");
    } else {
      console.log("等候完畢!");
      break
    }
  }
  console.log("loopCheckStatus ED");
  return res
};


// 確認、顯示server狀態
const checkStatus = async (serviceName) => {
  let oamApi = new api(serviceName)
  await oamApi.getIP();
  let resRanStatus = await oamApi.ranStatus();
  console.log(resRanStatus);

  if (resRanStatus["state"] && resRanStatus["data"].includes("PARTIAL")) {
    ranToggleEl.querySelector("div").innerText = "Stop";
    ranStatusEl.innerText = "Status: Partial";
    return false
  } else if (resRanStatus["state"] && resRanStatus["data"].includes("5G system is UP")) {
    ranToggleEl.querySelector("div").innerText = "Stop";
    ranStatusEl.innerText = "Status: Online";
    return true
  } else {
    ranToggleEl.querySelector("div").innerText = "Start";
    ranStatusEl.innerText = "Status: Offline";
    return false
  }
};



export {
  reboot,
  shutdown,
  stopRan,
  startRan,
  checkStatus,
  switchCBSD
}