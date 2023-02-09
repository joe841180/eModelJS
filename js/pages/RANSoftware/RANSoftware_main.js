import { configInfoContentText, refreshConfigInfo } from "./RANSoftware_global.js";
import { warnRanUpDialog } from "../../module/dialog.js";
import { getCookie, setCookie, cbrs_information_map, getLicenseInfo, getUrlData } from "../../module/globalSettings.js";
import { api } from "../../restfulApi.js";


// settings
let currentPkg = ""
let urlData = getUrlData()
let currentPage = urlData?.pg == undefined ? "RAN1" : urlData.pg
let serverIp = await getCookie("serverIp");
let oamApi = new api(currentPage)
// === License & Version - 主頁資料===
async function licVerData() {
  const licenseInfoEls = document.querySelector("#LicenseInfo");
  const licenseStartDateEls = document.querySelector("#LicenseStartDate");
  const licenseExpiresDateEls = document.querySelector("#LicenseExpiresDate");
  const ranVersionEls = document.querySelector("#RanVersion");
  const l1VersionEls = document.querySelector("#L1Version");
  await oamApi.getIP()
  let licVer = await oamApi.LicVer();
  console.log(licVer);
  if (licVer["state"]) {
    let data = getLicenseInfo(licVer)

    // 儲存目前pkg
    currentPkg = data.configInfo

    // 欄位設定
    licenseInfoEls.innerHTML = data.licInfo[0];
    licenseStartDateEls.innerHTML = data.licInfo[1];
    licenseExpiresDateEls.innerHTML = data.licInfo[2];
    ranVersionEls.innerHTML = data.ranVer;
    l1VersionEls.innerHTML = data.l1Ver;
  } else {
    let text = "no data"
    licenseInfoEls.innerHTML = text;
    licenseStartDateEls.innerHTML = text;
    licenseExpiresDateEls.innerHTML = text;
    ranVersionEls.innerHTML = text;
    l1VersionEls.innerHTML = text;
  }
}
// Configuration information - profile 下拉選單
async function getCIProfile() {
  const profileDropdownBtnEl = document.getElementById("profileDropdownBtn");
  const profileDropdownEl = document.getElementById("profileDropdown");
  await oamApi.getIP()
  let res = await oamApi.configProfileList();
  console.log("configProfileList");
  console.log(res);
  if (res["state"]) {
    let profileArr = res["data"].split(",");

    //改按鈕文字
    profileDropdownBtnEl.innerHTML = currentPkg;
    //改下拉選單
    let html = "";
    for (let i = 0; i < profileArr.length; i++) {
      html += '<li><a class="dropdown-item c-dropdown__item" >' + profileArr[i] + "</a></li>";
    }
    profileDropdownEl.innerHTML = html;

    //控制選單
    const profileDropdownEls = profileDropdownEl.querySelectorAll(".dropdown-item");

    for (let i = 0; i < profileDropdownEls.length; i++) {
      profileDropdownEls[i].addEventListener("click", async () => {
        await oamApi.getIP()
        let resRanStatus = await oamApi.ranStatus();
        console.log(resRanStatus);

        // RAN UP 的狀態:顯示彈窗提醒
        if (resRanStatus["state"] && resRanStatus["data"].includes("5G system is UP")) {
          let setTxt = {
            "title": "Save fail.",
            "content": `Please stop RAN Service before change profile.`
          }
          warnRanUpDialog(setTxt, () => { });
        } else {
          // API - profile set
          profileDropdownBtnEl.innerHTML = "loading...";
          // console.log("profileDropdownEls[i].innerHTML");
          // console.log(profileDropdownEls[i].innerHTML);
          await oamApi.getIP()
          let setProfile = await oamApi.configProfileSet(profileDropdownEls[i].innerHTML);
          if (setProfile["state"] && setProfile["data"].includes("Success")) {
            profileDropdownBtnEl.innerHTML = profileDropdownEls[i].innerHTML;
            document.getElementById("SystemUpgrade").innerHTML = profileDropdownEls[i].innerHTML;
          } else {
            profileDropdownBtnEl.innerHTML = currentPkg;
            let setTxt = {
              "title": "Save fail.",
              "content": setProfile["data"].replace("h1", "p")
            }
            warnRanUpDialog(setTxt, () => { });
          }
        }
      });
    }
  } else {
    alert("ConfigInfo profile error");
  }
}

// Configuration information - 主頁資料
function addSectionContent(data) {
  try {
    console.log(data);
    //資料存入map
    configInfoContentText["CUIPAddress"] = data["CU-IP"];
    configInfoContentText["DUIPAddress"] = data["DU-IP"];
    configInfoContentText["PLMN"] = data["PLMN"];
    configInfoContentText["SST"] = data["SST"];
    configInfoContentText["SD"] = data["SD"];
    configInfoContentText["TAC"] = data["TAC"];
    configInfoContentText["PCI"] = data["PCI"];
    configInfoContentText["CellID"] = data["Cell-ID"];
    configInfoContentText["frequencySettings"] = data["FrequencySetting"];
  } catch (error) {
    console.log(error);
    alert(error)
  }
}

async function cbrs_information() {
  let ran_id = serverIp.group[currentPage].id
  let res = await get({
    "request": "getCbrsInformation",
    "type": "cbrs",
    "data": ran_id
  })
  let sas_url_data = res["body"]["sasUrl"]
  let user_id_data = res["body"]["UserId"]
  let fcc_id_data = res["body"]["FccId"]
  let cbsd_serial_number_data = res["body"]["CbsdSerialNumber"]
  let cbsd_cpi_protected_header_data = res["body"]["cbsd_cpi_protectedHeader"]
  let cbsd_cpi_encoded_cpi_signed_data = res["body"]["cbsd_cpi_encodedCpiSignedData"]
  let cbsd_cpi_digital_signatur_data = res["body"]["cbsd_cpi_digitalSignatur"]
  //insert global cbrs information map
  cbrs_information_map["sasUrl"] = sas_url_data
  cbrs_information_map["UserId"] = user_id_data
  cbrs_information_map["FccId"] = fcc_id_data
  cbrs_information_map["CbsdSerialNumber"] = cbsd_serial_number_data
  cbrs_information_map["cbsd_cpi_protectedHeader"] = cbsd_cpi_protected_header_data
  cbrs_information_map["cbsd_cpi_encodedCpiSignedData"] = cbsd_cpi_encoded_cpi_signed_data
  cbrs_information_map["cbsd_cpi_digitalSignatur"] = cbsd_cpi_digital_signatur_data
  console.log(res["body"]["cbsdEnabled"] + "====cbsdEnabled");
  if (res["body"]["cbsdEnabled"] == "1") {
    let set_information = document.querySelectorAll(".l-ran__set")
    let cbrs_information = document.querySelectorAll(".l-ran__text")

    cbrs_information[5].innerHTML = cbrs_information_map["sasUrl"]
    cbrs_information[6].innerHTML = cbrs_information_map["UserId"]
    cbrs_information[7].innerHTML = cbrs_information_map["FccId"]
    cbrs_information[8].innerHTML = cbrs_information_map["CbsdSerialNumber"]

    set_information[6].classList.remove("d-none")
    set_information[7].classList.remove("d-none")
    set_information[8].classList.remove("d-none")
    set_information[9].classList.remove("d-none")

  }
  else {
    let default_information = document.querySelectorAll(".l-ran__subtitle")
    default_information[6].classList.remove("d-none")
    let cbrsBtn = document.getElementById("setupStartBtn")
    cbrsBtn.innerHTML = "Start CBRS set up"
  }
}

async function main() {
  //License Version
  await licVerData();
  await cbrs_information()

  //Configuration information - 取restfulApi資料
  await oamApi.getIP()
  let nrBandRes = await oamApi.nrBand();
  configInfoContentText["NRBand"] = apiDirectDataCheck(nrBandRes);

  //Configuration information - 取netconf資料
  let ranData = await get({
    request: "get",
    type: "netconf",
    body: {
      netconf: "ran1",
    },
  });
  console.log(ranData);
  addSectionContent(ranData["body"]);

  //Configuration information - 取profile下拉選單
  await getCIProfile();

  //Configuration information - 刷新頁面資料
  refreshConfigInfo();
}

window.onload = function () {
  main();
};
