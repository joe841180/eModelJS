// settings
const hostName = window.location.hostname;
const hostAddress = hostName + ":8001";
const notifyBellWrapEl = document.querySelector("#notifyBellDropdown");
const unReadNum = document.querySelector(".c-notification__badge");
const notifyBellListEl = document.querySelector("#notifyBellList");

//alert notify settings
let popBell10s = ""; //通知彈窗
let notifyRemove10s = ""; //通知彈窗
let countNotifyBellId = 0; //通知彈窗
// 設定通知小鈴鐺中，標題對應的內容

// alert notify websocket
const alertNotifyWS = () => {
  const modalControl = new bootstrap.Dropdown(notifyBellWrapEl);
  console.log("load WS");
  try {
    // ws settings
    const socket = new WebSocket("wss://" + hostAddress + "/alert");
    // let hostAddress = "127.0.0.1:8001";
    // const socket = new WebSocket("ws://" + hostAddress);

    // 初始
    socket.addEventListener("open", async function (event) {
      if (socket.readyState == 0) setTimeout(alertNotifyWS, 3000);
      console.log("client connected");

      let data = {
        type: "notify",
        request: "test",
      };
      // for (const x of Array(1).keys()) {
      //   socket.send(JSON.stringify(data));
      // }

      // socket.send(JSON.stringify(data))
      // setInterval(() => {
      //   socket.send(JSON.stringify(data))
      // }, 11000)
    });

    //接收
    socket.addEventListener("message", function (event) {
      if (event.data != undefined) {
        // check websocket state
        if (socket.readyState == 0) return setTimeout(alertNotifyWS, 3000);
        // parse to json
        response = JSON.parse(event.data);
        // check data
        if (response["request"] != "returnLatestNotify") return;

        // 顯示未讀通知數量
        if (response["body"]["unReadNum"] > 0) {
          unReadNum.classList.remove("d-none"); //數字
          notifyBellListEl.classList.remove("d-none"); //alert list(顯示通知)
          unReadNum.innerHTML = response["body"]["unReadNum"]; //change number
        } else {
          unReadNum.classList.add("d-none"); //數字
          notifyBellListEl.classList.add("d-none"); //alert list(顯示通知)
        }

        modalControl.show(); //顯示通知
        notifyBellWrapEl.blur(); //取消btn已點特效

        // 設定通知內容 - date
        console.log(response);
        let notifyData = response["body"]["notifyData"];
        let date = moment(notifyData["time_open"]).format("YYYY-MM-DD HH:mm:ss");

        // 設定通知內容 - title/content
        let faultId = notifyData["fault_id"];
        let title, content;
        try {
          if (faultId in ranNotifyContentMap) {
            title = ranNotifyContentMap[faultId]["title"];
            content = ranNotifyContentMap[faultId]["content"];
          } else if (faultId in ruNotifyContentMap) {
            title = notifyData["fault_text"];
            let findKey = Object.keys(ruNotifyContentMap[faultId]).filter((k) => notifyData["fault_source"].includes(k));
            content = findKey.length > 0 ? ruNotifyContentMap[faultId][notifyData["fault_source"]] : "";
          } else {
            title = "unknownTitle";
            content = "unknownContent";
          }
        } catch (error) {
          console.log(error);
          title = "unknownTitle";
          content = "unknownContent";
        }

        let solved = notifyData["solved"] === "true" ? "alertSolved" : ""; //控制顯示solved
        let passData = `alertPk=${notifyData["pk"]}`; //跳轉頁面傳值

        let notifyTxt = `
        <a id="notiBell${countNotifyBellId}" href="./AlertManagement.html?${passData}" class="c-notification__item">
          <span class="c-notification__subtitle">${date}</span>
          <div class="d-flex align-items-center">
            <i class="c-notification__icon" data-icon="alert"></i>
            <h4 class="c-notification__title">${title}</h4>
          </div>
          <p class="c-notification__text ${solved}">${content}</p>
        </a>
        `;
        // 設定通知內容 - 嵌入html
        notifyTxt = document.createRange().createContextualFragment(notifyTxt);
        notifyBellListEl.append(notifyTxt);
        // 設定通知內容 - 通知內容10s後消失
        notifyRemove10s = setTimeout(() => {
          let notifyBellContentEl = document.querySelector(`#notiBell${countNotifyBellId}`);
          notifyBellContentEl.remove();
          if (notifyBellListEl.children.length == 0) notifyBellListEl.classList.add("d-none");
        }, 10000);
      }
    });
  } catch (error) {
    alert(error);
  }
};

// alert notify 初始設定
const alertBtnSettings = async () => {
  try {
    // 更新目前未讀通知
    let resAlertNum = await get({
      request: "getNumber",
      type: "notify",
    });
    unReadNum.classList.remove("d-none");
    unReadNum.innerHTML = resAlertNum["body"]["unReadMessageNum"];
  } catch (error) {
    console.log("error alertBtnSettings");
    setTimeout(alertBtnSettings, 3000);
  }

  //點小鈴鐺跳頁
  const alertMGEl = document.querySelector("#sidebarAlertManagementControl");
  notifyBellWrapEl.addEventListener("click", () => {
    notifyBellListEl.classList.add("d-none");
    alertMGEl.click();
  });
};

// 接收+回傳(類restful api)
// let test = await get(data) //用法
function get(sendData) {
  const data = sendData;
  try {
    return new Promise(async function (resolve, reject) {
      let wspath = `/${data["request"]}${data["type"]}`;
      let socketGet = new WebSocket("wss://" + hostAddress + wspath); // websocket
      let resdata = data["request"];
      let checkReturn = resdata.slice(0, 1).toUpperCase() + resdata.slice(1, resdata.length);
      checkReturn = `return${checkReturn}`;

      socketGet.addEventListener("open", function (event) {
        // 發
        console.log("send data");
        socketGet.send(JSON.stringify(data));
        setTimeout(reject, 15000);
      });
      // 收
      socketGet.onmessage = (e) => {
        response = JSON.parse(e.data);
        // console.log(response);
        // console.log(checkReturn);
        if (response["request"] == checkReturn) {
          socketGet.close(1000, "Closing the connection");
          resolve(response);
        }

        setTimeout(reject, 15000);
      };
    });
  } catch (error) {
    return "connection fail";
  }
}

//pkg上傳
// var file = document.getElementById("computerFileInput").files[0];
function post(file, filePath) {
  let data = {
    request: "uploadDetail",
    type: "file",
    body: {
      name: file["name"], //ru1-1
      path: filePath,
    },
  };
  // settings WS
  let wspath = `/${data["request"]}${data["type"]}`;
  let socketPost = new WebSocket("wss://" + hostAddress + wspath); // websocket

  //檔名上傳
  return new Promise(function (resolve, reject) {
    socketPost.addEventListener("open", function (event) {
      // 發
      console.log("send data");
      socketPost.send(JSON.stringify(data));
      setTimeout(reject, 300000);
    });

    // 收
    socketPost.onmessage = (e) => {
      response = JSON.parse(e.data);
      if (response["request"] == "returnUploadDetail") {
        resolve(response);
      }
    };
    setTimeout(reject, 300000);
  })
    .then((res) => {
      return new Promise(function (resolve, reject) {
        // 檔案上傳
        let reader = new FileReader();
        let rawData = new ArrayBuffer();
        // reader.loadend = function () {};
        reader.onload = function (e) {
          rawData = e.target.result;
          //發
          socketPost.send(rawData);
          // 接收
          socketPost.onmessage = (e) => {
            try {
              response = JSON.parse(e.data);
              console.log(response);
              if (response["request"] == "returnUpload") {
                if (response["body"]["status"] == "Success") resolve(response);
                else reject(alert("upload file fail"));
              }
            } catch (error) {
              reject(alert("upload file fail"));
            }
          };
          setTimeout(reject, 300000);
        };
        reader.readAsArrayBuffer(file);
      });
    })
    .catch((res) => {
      console.log(res);
      return "connection fail";
    });
}

const realtimeMain = () => {
  let url = document.location.href;
  console.log(url);
  let list = ["index.html", "signup.html", "RAN-DULog.html", "RAN-L1Log.html", "RAN-CBRSLog.html"];

  if (list.filter((pg) => url.includes(pg)).length > 0) return;
  if (!url.includes("html")) return;
  alertBtnSettings();
  alertNotifyWS();
};

realtimeMain();
