import { getCookie, setCookie, getUrlData } from "../../module/globalSettings.js";
import { api, checkSus, apiDirectDataCheck } from "../../restfulApi.js";
import { warnRanUpDialog, commonSettings, confirmCancelDialog } from "../../module/dialog.js";


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

// async function reloadTitle(currentLog) {
//   // clear title
//   for (let titleEl of logTitleEls) titleEl.classList.remove("active")

//   //active title
//   if (currentLog.includes("DU")) logTitleEls[0].classList.add("active");
//   else if (currentLog.includes("L1")) logTitleEls[1].classList.add("active");
//   else if (currentLog.includes("CBRS")) logTitleEls[2].classList.add("active");
// }

const basicLog = async (data) => {
  //netconf api - 取log
  let log = data["log"]
  let ip = data["ip"]
  let id = data["ran"].replace("RAN", "")

  // 取前30
  let resLatest30Log = await get({
    request: `${log}latest30Log`,
    type: "log",
    body: {
      logType: log,
      ip: ip,
      id: id,
    },
  })

  // console.log("getLog");
  console.log(resLatest30Log);

  // show log
  let logTxt
  if (typeof resLatest30Log["body"] == "object") {
    logTxt = strParse(resLatest30Log["body"], log)
    logTextEl.innerHTML = logTxt;
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
    request: `${log}latestLog`,
    type: "log",
    body: {
      logType: log,
      ip: ip,
      id: id,
    },
  })
  console.log(resLatestLog);


  // show log
  if (typeof resLatestLog["body"] == "object") {
    if (resLatestLog["body"].length != 1 || resLatestLog["body"][0] != "") {
      logTextEl.innerHTML += strParse(resLatestLog["body"], log);
      scroll2btm(log)
      // console.log(resLatestLog);
    }
  } else {
    if (resLatestLog["body"] == "refresh") window.location.reload();
    // logTextEl.innerHTML = resLatestLog["body"]
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

//下載檔案
const downloadLog = async (data) => {
  // settings
  let log = data["log"]
  let ip = data["ip"]
  let id = data["ran"].replace("RAN", "")
  console.log("download log:" + log);

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

//check RAN status 確認service
const checkRANservice = async (oamApi) => {
  let resRanStatus = await oamApi.ranStatus();
  // console.log(resRanStatus);
  if (!resRanStatus["state"]) return alert("connection fail")
  else if (resRanStatus["data"].includes("5G system is UP")) return true
  else return false
}

// 計時器控制
let keepRolling = (data) => {
  console.log(data);

  //固定刷新log
  let timeSet = data["log"] == "CBRSLog" ? 30000 : 2000
  return setInterval(() => {
    reloadLogContent(data)
  }, timeSet)
}


async function main() {
  //權限設定
  let userPrivileges = await getCookie("user_privileges");
  // console.log(userPrivileges);
  userPrivileges = userPrivileges.filter(num => num == 8)
  if (userPrivileges.length != 0) logTitleEls[2].classList.remove("d-none");

  //取目前RAN頁面
  let currentRan
  try {
    let passData = getUrlData()
    currentRan = passData["currentRan"]
  } catch (error) {
    currentRan = ""
    console.log(error);
  }

  let serverIp = await getCookie("serverIp")

  // 取目前log
  let url = document.location.href;
  let currentPageUrl = url.slice(url.lastIndexOf("/") + 1, url.length);
  console.log(currentPageUrl);
  let currentLog = ""
  if (currentPageUrl.includes("DULog")) currentLog = "DULog"
  else if (currentPageUrl.includes("L1Log")) currentLog = "L1Log"
  else if (currentPageUrl.includes("CBRSLog")) currentLog = "CBRSLog"


  //default 頁面
  currentRan = currentRan == "" ? "RAN1" : currentRan
  currentLog = currentLog == "" ? "DULog" : currentLog
  serverIp = serverIp["RAN"][currentRan] ? serverIp["RAN"][currentRan] : ""

  data = {
    ran: currentRan,
    log: currentLog,
    ip: serverIp,
  }

  currentRanTitleEl.innerHTML = `${currentRan} Log`;//RAN title


  // reloadTitle(currentLog)
  basicLog(data)  //latest 30 lines
  let keepRoll = keepRolling(data)

  // 切換log
  for (let titleEl of logTitleEls) {
    let logType = titleEl.innerHTML.replace(" ", "")
    titleEl.setAttribute("href", `./RAN-${logType}.html?currentRan=${currentRan}`);
  }

  //download log file
  exportLogEl.addEventListener("click", async () => {
    //切換下載按鈕
    let oamApi = new api(data["ran"])
    await oamApi.getIP()
    let check = await checkRANservice(oamApi)
    // let check = true
    console.log(check);
    if (check) {
      let setTxt = {
        "title": "RAN service is up.",
        "content": `Please stop RAN service before download file .`
      }
      warnRanUpDialog(setTxt, () => { });
    }
    else {
      downloadLog(data)
    }

  })

}

main();
