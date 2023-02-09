import { getCookie, setCookie, dealJson, removeSlash } from "../../module/globalSettings.js";
import { api, checkSus, apiDirectDataCheck } from "../../restfulApi.js";

const inOutPutJsonEl = document.querySelector("#inOutPutJson");
const importInputEl = document.querySelector("#importInput");
const importBtnEl = document.querySelector("#importBtn");
const exportBtnEl = document.querySelector("#exportBtn");

const graphContentEl = document.querySelector("#graphContent");
const graphEmptyStateEl = document.querySelector(".graphEmptyState");

//存setting5GC.json value 是ran1 的 key
let jsonKey = ""
//刷新小點顏色
let ledSwitch = async (jsonTree, serverIp) => {
  console.log("ledSwitch start");
  try {
    //取全裝置狀態
    let serverState = await get({
      request: "get",
      type: "serverState",
    });
    console.log(serverState);
    if (serverState["errorType"] != 0 && serverState["errorType"] != undefined) return console.log("Error: get service");

    console.log(jsonTree);
    console.log(serverIp);

    //Lists
    const rans = Object.entries(jsonTree[jsonKey]).filter(([key, value]) => key !== "mode");
    const rus = Object.entries(serverIp.RU).filter(([key, value]) => key.includes("RU"));

    let status5GC = Object.entries(serverState.body).filter(([key, value]) => key.includes("5gc"));
    // let ranStatusList = Object.entries(serverState.body).filter(([key, value]) => key.includes("ran"));
    let ruStatusList = Object.entries(serverState.body).filter(([key, value]) => key.includes("ru"));

    //取未讀通知
    let serverKeys = Object.keys(serverState.body).filter(value => !value.includes("5gc"));
    let Today = new Date();
    let resHistoryNotify = await get({
      "request": "get",
      "type": "notify",
      "body": {
        "page": 1,
        "startDate": "2000-09-21",
        "endDate": moment().format('YYYY-MM-DD'),
        "idORDescription": "",
        "source": serverKeys, //ru ran
        "severity": ["critical", "major", "minor"],
        "acknowledge": ["false"],
        "solved": ["false", "true"]
      }
    });
    resHistoryNotify = Object.values(resHistoryNotify.body.data);

    // console.log(resHistoryNotify.body);

    // ====== 5GC ======
    const statusCtl5GCEl = document.querySelector(`#statusCtl5GC`);

    //刷新小點顏色
    console.log(status5GC);
    status5GC = status5GC[0][1] ? "online" : "offline"
    statusCtl5GCEl.classList.remove("online", "error", "offline")
    statusCtl5GCEl.classList.add(status5GC)

    console.log(rans);

    // ====== RAN ======
    for (let [i, ran] of Object.entries(rans)) {
      i = parseInt(i)

      const ranStatusCtlEl = document.querySelector(`#ranStatusCtl${i}`);
      // const ranPopoverShowEl = document.querySelector(`#ranPopoverShow${i}`);

      //未讀通知
      let unReadNotify = resHistoryNotify.filter(value => value["netconf"].includes(ran[1]["name"].toLowerCase()));

      //刷新小點顏色
      console.log(ran[1]["name"]);

      const oamApi = new api(ran[1]["name"]) //"192.168.135.177"
      await oamApi.getIP()
      let resRanStatus = await oamApi.ranStatus();
      console.log(resRanStatus);

      if (resRanStatus["state"] && resRanStatus["data"].includes("5G system is UP")) resRanStatus = "online"
      else resRanStatus = "offline"

      if (resRanStatus != "offline") {
        resRanStatus = unReadNotify.length > 0 ? "error" : resRanStatus
      }
      ranStatusCtlEl.classList.remove("online", "error", "offline")
      ranStatusCtlEl.classList.add(resRanStatus)
    }

    // ====== RU ======
    console.log(rus);
    for (let [i, ru] of Object.entries(rus)) {
      let ruNum = ru[0].slice(2)
      console.log("ruNum:" + ruNum);
      // const ruPopoverShowEl = document.querySelector(`#ruPopoverShow${ruNum}`);
      const ruStatusCtlEl = document.querySelector(`#ruStatusCtl${ruNum}`);

      // RU狀態
      let ruStatus = ruStatusList.filter(([key, value]) => key.includes(ru[0].toLowerCase()));
      //未讀通知
      let unReadNotify = resHistoryNotify.filter(value => value["netconf"].includes(ru[0].toLowerCase()));

      //刷新小點顏色
      console.log(ruStatus);
      ruStatus = ruStatus[0][1] ? "online" : "offline"
      if (ruStatus != "offline") {
        ruStatus = unReadNotify.length > 0 ? "error" : ruStatus
      }
      ruStatusCtlEl.classList.remove("online", "error", "offline")
      ruStatusCtlEl.classList.add(ruStatus)

      // if (ruStatus == "offline") {
      //   // ruPopoverShowEl.classList.add("d-none")
      // } else {
      // }
    }
  } catch (error) {
    console.log("ledSwitch error");
    console.log(error);
    // alert(error)
  }
  console.log("ledSwitch end");
}


// const switchStatus = (status) => {
//   //green - up
//   if (status == true || status == "true") return "online";
//   //red - alert
//   else if (status == false || status == "false") return "error";
//   //grey - down
//   else return "offline";
// }

const loadJsonTree = async (jsonTree) => {
  if (jsonTree != null) {
    handleGraphLayout(jsonTree);
    let serverIp = await getCookie("serverIp");
    // console.log(serverIp);
    // console.log(jsonTree.reign_ran);
    const rus = Object.entries(serverIp.RU).filter(([key, value]) => key.toUpperCase().includes("RU"));
    const rans = Object.entries(jsonTree[jsonKey]).filter(([key, value]) => key.toLowerCase().includes("ran"));
    //提前刷新燈號
    ledSwitch(jsonTree, serverIp)
    //每10秒刷一次燈號狀態
    setInterval(async () => {
      await ledSwitch(jsonTree, serverIp)
    }, 1000 * 10)

    // ===== RAN =====
    // console.log(rans);
    for (let [i, ran] of Object.entries(rans)) {
      let betweenApiCall = true
      i = parseInt(i)
      const ranPopoverCtlEl = document.querySelector(`#ranPopoverCtl${i}`);
      const ranStatusCtlEl = document.querySelector(`#ranStatusCtl${i}`);
      // const ranPopoverShowEl = document.querySelector(`#ranPopoverShow${i}`);

      const ranUpTimeTxtEl = document.querySelector(`#ranUpTimeTxt${i}`);
      const ranTimeSyncTxtEl = document.querySelector(`#ranTimeSyncTxt${i}`);
      const ranUECountTxtEl = document.querySelector(`#ranUECountTxt${i}`);

      console.log("ranPopoverCtlEl");
      console.log(ranPopoverCtlEl);

      // console.log(ranStatusCtlEl.classList.contains("offline"));
      // RAN懸浮視窗內容
      ranPopoverCtlEl.addEventListener('mouseenter', async function (e) {
        if (betweenApiCall) {
          betweenApiCall = false

          // console.log(ranStatusCtlEl.classList.contains("offline"));
          // console.log(ranStatusCtlEl.classList);

          if (!ranStatusCtlEl.classList.contains("offline")) {
            console.log(ran[1]["name"]);
            // 設定 host 取api
            const oamApi = new api(ran[1]["name"])
            await oamApi.getIP()
            let resRanUptime = await oamApi.ranUptime();
            let resRanTimeSync = await oamApi.ranTimeSync();
            let resRanUEcount = await oamApi.ranUEcount();

            console.log(resRanUptime);
            console.log(resRanTimeSync);
            console.log(resRanUEcount);

            // Up time
            if (apiDirectDataCheck(resRanUptime) && resRanUptime.data.toLowerCase().includes("seconds")) {
              ranUpTimeTxtEl.innerHTML = resRanUptime.data.trim().slice(0, 8)
            }
            // Time Sync
            if (apiDirectDataCheck(resRanTimeSync)) {
              ranTimeSyncTxtEl.innerHTML = resRanTimeSync.data
            }
            // UE count
            if (resRanUEcount.state) {
              ranUECountTxtEl.innerHTML = JSON.parse(resRanUEcount.data).num_of_ue
            }
          }
          else {
            ranUpTimeTxtEl.innerHTML = ""
            ranTimeSyncTxtEl.innerHTML = ""
            ranUECountTxtEl.innerHTML = ""
          }

          // //刷新懸浮視窗外框
          // if (unReadNotify.length > 0) {
          //   ranPopoverCtlEl.classList.remove("online", "error", "offline")
          //   ranPopoverCtlEl.classList.add("error")
          // }
          // else {
          //   ranPopoverCtlEl.classList.remove("online", "error", "offline")
          //   ranPopoverCtlEl.classList.add("online")
          // }

          setTimeout(() => { betweenApiCall = true }, 1000)//控制每最短1秒call一次API
        }
      })

    }

    // ===== RU =====
    // console.log(rus);
    for (let [i, ru] of Object.entries(rus)) {
      let ruNum = ru[0].slice(2)
      console.log(ruNum);
      const ruPopoverCtlEl = document.querySelector(`#ruPopoverCtl${ruNum}`);
      // const ruPopoverShowEl = document.querySelector(`#ruPopoverShow${ruNum}`);
      const ruTimeSyncTxtEl = document.querySelector(`#ruTimeSyncTxt${ruNum}`);
      const ruStatusCtlEl = document.querySelector(`#ruStatusCtl${ruNum}`);

      let betweenApiCall = true
      ruPopoverCtlEl.addEventListener('mouseenter', async function (e) {
        // console.log(e.target.attributes.name);

        // RU懸浮視窗內容
        if (betweenApiCall) {
          betweenApiCall = false
          if (!ruStatusCtlEl.classList.contains("offline")) {
            // Time Sync
            try {
              console.log("RU:" + ru[0].toLowerCase());
              let resRuTimeSync = await get({
                "request": "singleGet",
                "type": "netconf",
                "body": {
                  "netconf": ru[0].toLowerCase(),
                  "xpath": "/sync/ptp-status/lock-state",
                }
              });
              console.log("resRuTimeSync");
              console.log(resRuTimeSync);
              ruTimeSyncTxtEl.innerHTML = resRuTimeSync.body == undefined ? "" : resRuTimeSync.body
            }
            catch {
              ruTimeSyncTxtEl.innerHTML = ""
            }
          }
          else {
            ruTimeSyncTxtEl.innerHTML = ""
          }

          setTimeout(() => { betweenApiCall = true }, 1000) //控制每最短1秒call一次API
        }
      })
    }

  }
  // 顯示 
  else {
    graphEmptyStateEl.classList.remove("d-none");
  }
}

//UI
const handleGraphLayout = (result) => {
  console.log("handleGraphLayout");
  const rans = Object.entries(result[jsonKey]).filter(([key, value]) => key.includes("ran"));
  console.log(rans);
  graphContentEl.innerHTML = ""
  graphContentEl.innerHTML += `
    <div class="l-graph__row">
      <div id="statusCtl5GC" class="l-graph__item l-graph__item--start">
        5GC
      </div>
      <div class="l-graph__placeholder"></div>
      <div class="l-graph__placeholder l-graph__placeholder--line"></div>
      <div class="d-flex flex-column" id="ranContentEl"></div>
    </div>
  `;
  const ranContentEl = document.querySelector("#ranContentEl");
  rans.forEach((ran, i) => {
    let ruNum = 0
    // console.log(ran);
    // console.log(i);

    ranContentEl.innerHTML += `
      <div class="l-graph__wrapper">
        <div class="l-graph__popover">
          <div id="ranPopoverCtl${i}" name="ran${i + 1}" class="l-graph__group ${i === 0 ? "l-graph__group--top" : ""}">
            <div id="ranStatusCtl${i}" class="l-graph__item l-graph__item--title offline">RAN ${i + 1}</div>
            <div class="cuContent"></div>
          </div>
          <div id="ranPopoverShow${i}" class="c-popover c-popover--center online">
            <h4 class="c-popover__title">RAN ${i + 1}</h4>
            <div class="c-popover__row">
              <div class="c-popover__col">System up time</div>
              <div id="ranUpTimeTxt${i}" class="c-popover__col"></div>
            </div>
            <div class="c-popover__row">
              <div class="c-popover__col">Time sync</div>
              <div id="ranTimeSyncTxt${i}" class="c-popover__col"></div>
            </div>
            <div class="c-popover__row">
              <div class="c-popover__col">UE Count</div>
              <div id="ranUECountTxt${i}" class="c-popover__col"></div>
            </div>
          </div>
        </div>
        <div class="l-graph__col l-graph__col--end ruContent"></div>
      </div>
    `;
    const ruContentEl = ranContentEl.querySelectorAll(".ruContent");
    const cus = Object.entries(ran[1]).filter(([key, value]) => key.includes("cu"));
    console.log(cus);
    cus.forEach((cu, j) => {
      const cuContentEl = ranContentEl.querySelectorAll(".cuContent");
      const dus = Object.entries(cu[1]).filter(([key, value]) => key.includes("du"));
      cuContentEl[i].innerHTML += `
        <div class="l-graph__row l-graph__row--multiple">
          <div class="l-graph__item l-graph__item--block" style="height: ${dus.length === 1 ? 5.5 : dus.length * 2.5 + (dus.length - 1) * 0.5}rem">CU</div>
          <div class="l-graph__col duContent"></div>
        </div>
        `;

      console.log("dus");
      console.log(dus);
      const duContentEl = ranContentEl.querySelectorAll(".duContent");
      dus.forEach((du, k) => {
        ruNum += 1
        // console.log(`i:${i}, j:${j}, k:${k}`);
        const handleIndex = () => {
          if (i === 0) {
            if (j === 0) {
              return 0;
            } else {
              return 1;
            }
          } else if (i === 1) {
            return i + j;
          } else {
            return i + i + j - 1;
          }
        };
        const handleItemLength = () => {
          if (dus.length === 1) {
            return 5.5;
          } else {
            return 2.5;
          }
        };
        duContentEl[handleIndex()].innerHTML += `
          <div class="l-graph__item l-graph__item--center" style="height: ${handleItemLength()}rem">DU</div>
        `;
        // id = "ruPopoverCtl${i + 1}-${k + 1}" 
        // name = "ru${i + 1}-${k + 1}"
        // console.log(`${i + 1}-${ruNum}`);
        // console.log(`ruPopoverShow${i + 1}-${ruNum}`);
        ruContentEl[i].innerHTML += `
          <div id="ruPopoverCtl${i + 1}-${ruNum}"  class="l-graph__popover">
            <div id="ruStatusCtl${i + 1}-${ruNum}" class="l-graph__item l-graph__item--end offline" style="height: ${handleItemLength()}rem">RU ${i + 1}-${ruNum}</div>
            <div id="ruPopoverShow${i + 1}-${ruNum}" class="c-popover c-popover--end online">
              <h4 class="c-popover__title">RU ${i + 1}-${ruNum}</h4>
              <div class="c-popover__row">
                <div class="c-popover__col">Time sync</div>
                <div id="ruTimeSyncTxt${i + 1}-${ruNum}" class="c-popover__col"></div>
              </div>
            </div>
          </div>
        `;
      });
    });
  });
  const wrapperEls = graphContentEl.querySelectorAll(".l-graph__wrapper");
  const lineEl = graphContentEl.querySelector(".l-graph__placeholder--line");
  lineEl.style.marginBottom = `${wrapperEls[wrapperEls.length - 1].clientHeight / 2 / 16}rem`;
  if (rans.length <= 1) {
    lineEl.style.borderColor = "transparent";
  }
};

//儲存檔案
function downloadFiles(fileName, data) {
  //藉型別陣列建構的 blob 來建立 URL
  let blob = new Blob([data], {
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

//取setting5GC.json value 是ran1 的 key
function get_reign_key(jsonObject) {
  for (let key in jsonObject) {
    for (let innerKey in jsonObject[key]) {
      if (innerKey == "ran1") {
        jsonKey = key;
        break;
      }
    }
  }
}
async function overviewMain() {
  console.log("get cookies");
  console.log(await getCookie("user_name"));
  console.log(await getCookie("user_privileges"));
  console.log(await getCookie("lastTime"));

  let jsonTree = await get({
    "request": "get",
    "type": "json",
  });
  jsonTree = checkSus(jsonTree) ? jsonTree["body"]["data"] : {};
  //取setting5GC.json value 是ran1 的 key
  get_reign_key(jsonTree)
  // console.log(jsonTree);
  // jsonTree = {}

  if (Object.keys(jsonTree).length !== 0) {
    setCookie("jsonTree", jsonTree); //原json檔
    setCookie("serverIp", dealJson(jsonTree)["data"]); //處理過的json資料
    await loadJsonTree(jsonTree)
  } else {
    graphEmptyStateEl.classList.remove("d-none");
  }

  // 權限-右上角選單
  let current_privileges = await getCookie("user_privileges"); //cookies
  // current_privileges = ["6"]
  if (current_privileges.includes("4") && Object.keys(jsonTree).length !== 0) {
    inOutPutJsonEl.classList.remove("d-none")
    //右上角下拉選單 import
    importBtnEl.addEventListener("click", () => {
      importInputEl.click()
    })
    //右上角下拉選單 export
    exportBtnEl.addEventListener("click", async () => {
      let fileName = "network_arch.json";
      let getJson = await getCookie("jsonTree")
      const data = JSON.stringify(getJson, null, 6);
      downloadFiles(fileName, data)
    })
  }


  // 上傳json
  importInputEl.addEventListener("change", () => {
    if (!current_privileges.includes("4")) return alert("Permission denied")

    const file = importInputEl.files[0];
    let fileTypes = ["json"];
    if (file) {
      let extension = file.name.split(".").pop().toLowerCase(),
        isSuccess = fileTypes.indexOf(extension) > -1;
      if (isSuccess) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async function (e) {
          let result;
          // 確認JSON檔
          try {
            result = JSON.parse(e.target.result);
            let tryJson = dealJson(result)
            console.log(tryJson);
            if (!tryJson.state) throw "json undefined"
          } catch (error) {
            console.log(error);
            importInputEl.value = "";
            return alert("JSON ERROR:" + String(error));
          }

          try {
            graphEmptyStateEl.classList.add("d-none");
            // API - 上傳json
            let resUpload = await get({
              request: "upload",
              type: "json",
              body: result
            })
            console.log(resUpload);
            if (resUpload["errorType"] == 0) {
              let serviceIp = dealJson(result)
              console.log(serviceIp);
              if (!serviceIp.state) throw "JSON ERROR:"
              setCookie("jsonTree", result); //原json檔
              setCookie("serverIp", serviceIp.data); //處理過的json資料
              window.location.reload();
              // await loadJsonTree(result)
            } else throw "Failed to upload"
          } catch (err) {
            importInputEl.value = "";
            console.log("上傳json error");
            alert(err);
          }
        };
      } else {
        console.log("error");
        importInputEl.value = "";
        alert("Invalid file. Please import a legal JSON file.");
      }
    }
  });

}

overviewMain()