const host = `https://${window.location.hostname}:16000`;

//ran-狀態
async function ranStatus() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/ran-service/status`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      // 5G system is DOWN
      // 5G system is UP
      resMap["state"] = true;
      return res;
    },
  });

  resMap["data"] = res;
  return resMap;
}
//ran-詳細狀態
async function ranDetail() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/ran-service/status/detail`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//ran-停止服務
async function ranStop() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/ran-service/down`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//ran-開始服務
async function ranStart() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/ran-service/up`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//ran-重開機
async function ranReboot() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/reboot/bbu`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//ran-關機
async function ranShutdown() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/shutdown/bbu`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//樹狀圖ran-time sync
async function ranTimeSync() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/s-plane/bbu/status`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//ran-System Time
async function systemTime() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/date/bbu`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//樹狀圖ran-開機時間
async function ranUptime() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/uptime/bbu`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}

// configuration Settings - Profile List 主頁下拉選單
async function configProfileList() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/config-profile/list`;
  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
// configuration Settings - Profile Set 主頁下拉選單 選取
async function configProfileSet(package) {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/config-profile/set`;
  let res = await fetch(url, {
    method: "POST",
    body: package,
  }).then(res => {
    resMap["state"] = true;
    return res.text()
  }).catch(res => res.text())

  resMap["data"] = res;
  return resMap;
}

//configuration Settings - nrBand
async function nrBand() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/info/ran/para/nr-band`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//configuration Settings - gNB ID
async function gnbId() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/info/ran/para/gnb-id`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//configuration Settings - NR Mode
async function nrMode() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/info/ran/para/nr-mode`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//configuration Settings - DL ARFCN
async function dlArfcn() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/info/ran/para/dl-arfcn`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//configuration Settings - SCS
async function scs() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/info/ran/para/scs`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}

//ran-software-lisence version 目前系統的資訊
async function LicVer() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/info/software/system`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
//ran-software-lisence version-update-import package
async function choosePackage(package) {
  let resMap = {
    state: false,
    data: "",
  };

  let url = `${host}/api/package/import`;
  let res = await fetch(url, {
    method: "POST",
    body: package,
  }).then(res => {
    resMap["state"] = true;
    return res.text()
  }).catch(res => res.text())

  resMap["data"] = res;
  return resMap;
}
//ran-software-lisence version-update-install package
async function packageList() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/package/list/local`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}

//ran-software-lisence version-update-installation
async function licenseInfo() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/package/update/software/lic`;

  let res = await fetch(url, {
    method: "GET",
  }).then(res => {
    resMap["state"] = true;
    return res.text()
  }).catch(res => res.text())

  resMap["data"] = res;
  return resMap;
}
async function ranVersion() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/package/update/software/ran`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
async function l1Version() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/package/update/software/l1`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}

// config info - update list
async function configUpdateList() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/package/update/config-profile/list`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}
// config info - update set
async function configUpdateSet(setData) {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/package/update/config-profile/set`;

  let res = await fetch(url, {
    method: "POST",
    body: setData,
  }).then(res => {
    resMap["state"] = true;
    return res.text()
  }).catch(res => res.text())

  resMap["data"] = res;
  return resMap;
}

async function configInfo() {
  let resMap = {
    state: false,
    data: {},
  };

  return new Promise(function (resolve, reject) {
    // api - 取清單
    resolve(configUpdateList());

    setTimeout(reject, 30000);
  }).then(async (resList) => {
    // 切分清單項目
    resList = resList["data"].split(",");
    console.log(resList);
    // api - 取清單
    resMap["state"] = true;
    resMap["updateList"] = resList;
    for (const setData of resList) {
      let res = await configUpdateSet(setData);
      resMap["data"][setData] = res["data"];
      if (res["state"]) {
        resMap["state"] = !res["data"].includes("Success") ? false : resMap["state"];
      } else {
        resMap["state"] = false;
      }
    }
    console.log(resMap);
    return resMap;
  });
}

// 選擇的pkg資訊
async function pkgInfo() {
  let resMap = {
    state: false,
    data: "",
  };
  let url = `${host}/api/info/software/update`;

  let res = await $.ajax({
    async: true,
    type: "GET",
    url: url,
    error: function (xhr, status, error) {
      console.log(xhr);
      return status;
    },
    success: function (res) {
      resMap["state"] = true;
      return res;
    },
  });
  resMap["data"] = res;

  return resMap;
}

// 確認狀態(成功回傳Success，realtimeApi確認)
function checkSus(response) {
  console.log(response);
  try {
    return response["body"]["status"].includes("Success") ? true : false;
  } catch (e) {
    try {
      console.log(222);
      return response["data"].includes("Success") ? true : false;
    } catch (error) {
      console.log(333);
      return false
    }
  }
}

// 確認狀態(成功直接回傳資料)
function apiDirectDataCheck(response) {
  if (response["state"]) {
    if (response["data"].toLowerCase().includes("error")) return "api error"
    return response["data"];
  } else {
    return "error connection";
  }
}
