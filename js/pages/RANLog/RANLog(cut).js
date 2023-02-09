import { getCookie, setCookie } from "../../module/globalSettings.js";


//DOMs
const logTextEl = document.querySelector(".l-ran__block"); //show log data
const logTitleEls = document.querySelector(".c-tabs").children; //DU L1 CBRS log
const currentRanTitleEl = document.querySelector(".l-header__title"); //show log data

const exportLogEl = document.querySelector("#exportLog"); //show log data
let data
let rollingNum = {
  "DULog": 0,
  "L1Log": 0,
  "CBRSLog": 0,
}
// //保存頁面的log
// let oldLog = {
//   "DULog": "",
//   "L1Log": "",
//   "CBRSLog": "",
// }


const basicLog = async (data) => {
  //netconf api - 取log
  let log = data["log"]
  let ip = data["ip"]
  let id = data["ran"].replace("RAN", "")

  // 取前30
  let resLatest30Log = await get({
    request: "latest30Log",
    type: "log",
    body: {
      logType: log,
      ip: ip,
      id: id,
    },
  })

  // console.log("getLog");
  // console.log(resLatest30Log);

  // show log
  let logTxt
  if (typeof resLatest30Log["body"] == "object") {
    logTxt = strParse(resLatest30Log["body"], log)
    logTextEl.innerHTML = logTxt;
    oldLog[log] = logTxt

    scroll2btm(log)
  } else {
    logTxt = resLatest30Log["body"]
    logTextEl.innerHTML = logTxt;
  }

}

async function reloadLogContent(data) {
  // settings
  let log = data["log"]
  let ip = data["ip"]
  let id = data["ran"].replace("RAN", "")

  // 取最新
  let resLatestLog = await get({
    request: "latestLog",
    type: "log",
    body: {
      logType: log,
      ip: ip,
      id: id,
    },
  })

  console.log(resLatestLog);

  // show log
  let logTxt
  if (typeof resLatestLog["body"] == "object") {
    if (resLatestLog["body"].length != 1 || resLatestLog["body"][0] != "") {
      logTxt = strParse(resLatestLog["body"], log)
      logTextEl.innerHTML += logTxt;
      oldLog[log] += logTxt
      scroll2btm(log)
    }
  } else {
    logTxt = resLatestLog["body"]
    logTextEl.innerHTML = logTxt;
  }
}

const strParse = (str, log) => {
  str = str.join("<p>") + "<p>"
  // str = str.replace(/[\n]/g, "&nbsp;")
  str = str.replace(/[\t]/g, "  ")
  // str = str.replace(" ", "&emsp;")

  //定位底部
  rollingNum[log] += 1
  // console.log("strParse");
  // console.log(`${log}${rollingNum[log]}`);
  str += `<div id="${log}${rollingNum[log]}"></div>`
  return str
}

const scroll2btm = (log) => {
  let rollingEl = logTextEl.querySelector(`#${log}${rollingNum[log]}`)
  rollingEl.scrollIntoView()
}

const downloadLog = async (data) => {
  // settings
  let log = data["log"]
  let ip = data["ip"]
  let id = data["ran"].replace("RAN", "")
  console.log("download log:" + log);

  // 取最新
  let resDownloadLog = await get({
    request: "download",
    type: "log",
    body: {
      logType: log,
      ip: ip,
      id: id,
    },
  })
  console.log(resDownloadLog);

  //儲存檔案
  let fileName = resDownloadLog["body"]["filename"]
  fileName = fileName.slice(fileName.lastIndexOf("/") + 1, fileName.length);
  console.log(fileName);
  let filedata = resDownloadLog["body"]["log"].join("")

  //藉型別陣列建構的 blob 來建立 URL
  let blob = new Blob([filedata], {
    type: "application/octet-stream",
  });
  var href = URL.createObjectURL(blob);
  // 從 Blob 取出資料
  var link = document.createElement("a");
  document.body.appendChild(link);
  link.href = href;
  link.download = fileName;
  link.click();
}

// 固定刷新log
let keepRolling = (data) => {
  console.log(data);
  return setInterval(() => {
    reloadLogContent(data)
  }, 10000)
}

async function main() {
  //權限設定
  let userPrivileges = await getCookie("user_privileges");
  // console.log(userPrivileges);
  userPrivileges = userPrivileges.filter(num => num == 8)
  if (userPrivileges.length == 0) logTitleEls[2].classList.add("d-none");

  //取目前RAN頁面
  let currentRan = await getCookie("currentRan")
  // let currentLog = await getCookie("currentLog")
  let serverIp = await getCookie("serverIp")
  let currentLog = Object.entries(logTitleEls).filter(([key, value]) => value.classList.contains("active"));
  currentLog = currentLog[0][1].innerHTML.replace(" ", "")
  console.log(currentLog);
  //default 頁面
  currentRan = currentRan ? currentRan : "RAN1"
  currentLog = currentLog ? currentLog : "DULog"
  serverIp = serverIp["RAN"][currentRan] ? serverIp["RAN"][currentRan] : ""

  data = {
    ran: currentRan,
    log: currentLog,
    ip: serverIp,
  }

  currentRanTitleEl.innerHTML = `${currentRan} Log`;//RAN title

  basicLog(data)  //latest 30 lines
  let keepRoll = keepRolling(data)

  // // 切換log
  // for (let titleEl of logTitleEls) {
  //   titleEl.addEventListener("click", async () => {
  //     clearInterval(keepRoll)
  //     //切換log
  //     currentLog = (titleEl.innerHTML.includes("DU")) ? "DULog" : currentLog
  //     currentLog = (titleEl.innerHTML.includes("L1")) ? "L1Log" : currentLog
  //     currentLog = (titleEl.innerHTML.includes("CBRS")) ? "CBRSLog" : currentLog
  //     data["log"] = currentLog //切換log(data)
  //     console.log("--------------------switch to" + currentLog + "--------------------");

  //     logTextEl.innerHTML = ""; //清空log頁面
  //     basicLog(data) //latest 30 lines

  //     if (currentLog != "CBRSLog") keepRoll = keepRolling(data)
  //   });
  // }

  //download log file
  exportLogEl.addEventListener("click", () => {
    downloadLog(data)
  })

}

main();
