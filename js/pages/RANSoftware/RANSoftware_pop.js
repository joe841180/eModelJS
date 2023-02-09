import { configInfoContentText, refreshConfigInfo } from "./RANSoftware_global.js";
import { warnRanUpDialog, commonSettings, confirmCancelDialog } from "../../module/dialog.js";
import { getCookie, setCookie, cbrs_information_map, getLicenseInfo, getUrlData } from "../../module/globalSettings.js";
import { stopRan as stopRanService, startRan as startRanService, checkStatus } from "./ranServiceControlModule.js";
import { api } from "../../restfulApi.js";

// === configuration information - Settings ===
const netconfPath = {
  "CUIPAddress": [
    "/multiran-cm[ran-id='ranN']/gNodeB_CU_Configuration/GNB_CU_OAM_IP_ADDRESS",
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/FAPControl/NR/Gateway/F1APSigLinkServer",
  ],
  "DUIPAddress": [
    "/multiran-cm[ran-id='ranN']/gNB_DU_Configuration/DUOAM_IP_ADDRESS",
    "/multiran-cm[ran-id='ranN']/Proprietary_gNodeB_CU_Data_Model/gNodeBParams/stack_config/L3Params/F1AP/du_CommInfo/IPAddr",
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/FIVEGNR/RAN/MacParams/PHYCommInfo/SelfInfo/IPV4Address",
    // "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/LANDevice/LAN_HostConfigManagement/IPInterface/IPInterfaceIPAddress", #list(set err)
  ],
  "PLMN": [
    "/multiran-cm[ran-id='ranN']/Proprietary_gNodeB_CU_Data_Model/gNodeBParams/stack_config/L3Params/F1AP/du_CommInfo/NR-CGI/PLMNID",
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_CU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/LTE/RAN/Common/PLMNListItem/PLMNID",
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_CU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/LTE/RAN/Common/PLMNID",
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/FIVEGNR/RAN/CommonInfo/PLMNList/PLMNID",
  ],
  "SST": [
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/FIVEGNR/RAN/CommonInfo/PLMNList/SNSSAIList/Slice_SST",
  ],
  "SD": [
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/FIVEGNR/RAN/CommonInfo/PLMNList/SNSSAIList/Slice_SD",
  ],
  "TAC": [
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/FIVEGNR/RAN/CommonInfo/FIVEGSTAC",
  ],
  "PCI": [
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/FIVEGNR/RAN/CommonInfo/NRPCI",
  ],
  "CellID": [
    "/multiran-cm[ran-id='ranN']/Proprietary_gNodeB_CU_Data_Model/gNodeBParams/stack_config/L3Params/F1AP/du_CommInfo/NR-CGI/CellIdentity",
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_CU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/LTE/RAN/Common/CellIdentity",
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CellConfig/FIVEGNR/RAN/CommonInfo/CellIdentity",
  ],
  "frequencySettings": [
    "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/FrequencySetting",
  ],
  "cbsdEnabled": "/multiran-cm[ran-id='ranN']/Proprietary_gNodeB_DU_Data_Model/gNBDUParams/CbsdProvisioningParams/cbsdEnabled",
  "sasUrl": "/multiran-cm[ran-id='ranN']/Proprietary_gNodeB_DU_Data_Model/gNBDUParams/CbsdProvisioningParams/sasUrl",
  "UserId": "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CBSDConfig/RegistrationParams/UserId",
  "FccId": "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CBSDConfig/RegistrationParams/FccId",
  "CbsdSerialNumber": "/multiran-cm[ran-id='ranN']/UserDefined_TR196_gNodeB_DU_Data_Model/InternetGatewayDevice/Services/FAPService/CBSDConfig/RegistrationParams/CbsdSerialNumber",
  "cbsd_cpi_protectedHeader": "/multiran-cm[ran-id='ranN']/cbsd_configurations/cbsdConfigurationParams/cbsd_cpi_protectedHeader",
  "cbsd_cpi_encodedCpiSignedData": "/multiran-cm[ran-id='ranN']/cbsd_configurations/cbsdConfigurationParams/cbsd_cpi_encodedCpiSignedData",
  "cbsd_cpi_digitalSignatur": "/multiran-cm[ran-id='ranN']/cbsd_configurations/cbsdConfigurationParams/cbsd_cpi_digitalSignatur",
}

let urlData = getUrlData()
let currentPage = urlData?.pg == undefined ? alert("no page") : urlData.pg
let currentPage_lower = urlData?.pg == undefined ? "" : currentPage.toLowerCase()
let oamApi = new api(currentPage)
await oamApi.getIP()

const configSettingFormEl = document.getElementById("configSettingForm");
const configSettingModal = document.querySelector("#configurationSettingsModal");
const configSettingEls = document.querySelectorAll(".c-table__row")
const modalControl = new bootstrap.Modal(configSettingModal);

const configSettingModalBtn = document.querySelector("#configurationSettingsModalBtn"); //btn-settings
const configCancelingBtn = document.querySelector("#configCancelingBtn"); //btn-cancel
const configSettingBtn = document.querySelector("#configSettingBtn"); //btn-save & apply

//權限設定
let userPrivileges = await getCookie("user_privileges");
// userPrivileges = ["5"]
console.log(userPrivileges);
const configSettingPrivileges = userPrivileges.includes("5")
const cuduIpSettingPrivileges = userPrivileges.includes("10")


console.log("pop");
console.log(configInfoContentText);

// btn-settings - loading data 
configSettingModalBtn.addEventListener("click", async (e) => {
  try {
    const loadSettingForm = async (ranStatus) => {
      // 彈窗
      modalControl.show(configSettingModal)

      // restful api(存至configInfoContentText)
      let gnbIdRes = await oamApi.gnbId();
      console.log("gnbIdRes:" + apiDirectDataCheck(gnbIdRes));
      configInfoContentText["gNBID"] = apiDirectDataCheck(gnbIdRes)

      let nrBandRes = await oamApi.nrBand();
      console.log("nrBandRes:" + apiDirectDataCheck(nrBandRes));
      configInfoContentText["NRBand"] = apiDirectDataCheck(nrBandRes)

      let nrModeRes = await oamApi.nrMode();
      console.log("nrModeRes:" + apiDirectDataCheck(nrModeRes));
      configInfoContentText["NRMode"] = apiDirectDataCheck(nrModeRes)

      let dlArfcnRes = await oamApi.dlArfcn();
      console.log("dlArfcnRes:" + apiDirectDataCheck(dlArfcnRes));
      configInfoContentText["DLARFCN"] = apiDirectDataCheck(dlArfcnRes)

      let scsRes = await oamApi.scs();
      console.log("scsRes:" + apiDirectDataCheck(scsRes));
      configInfoContentText["SCS"] = apiDirectDataCheck(scsRes)

      configSettingEls[0].children[1].innerHTML = configInfoContentText["gNBID"]
      configSettingEls[1].children[1].innerHTML = configInfoContentText["NRBand"]
      configSettingEls[2].children[1].innerHTML = configInfoContentText["NRMode"]
      configSettingEls[3].children[1].innerHTML = configInfoContentText["DLARFCN"]
      configSettingEls[4].children[1].innerHTML = configInfoContentText["SCS"]

      // netconf api
      // input框設定
      // console.log(cuduIpSettingPrivileges);
      // console.log(ranStatus);

      for (let el of configSettingFormEl) {
        if (el.name == "CU IP Address" || el.name == "DU IP Address") {
          el.disabled = cuduIpSettingPrivileges ? false : true
        } else {
          el.disabled = !configSettingPrivileges
        }

        el.value = configInfoContentText[el.id]
        oldData[el.id] = el.value
      }
    };
    let resRanStatus = await oamApi.ranStatus();
    console.log(resRanStatus);
    // resRanStatus["data"] = ""

    // RAN UP 的狀態:顯示彈窗提醒
    if (resRanStatus["state"] && !resRanStatus["data"].includes("5G system is UP")) {
      configSettingBtn.disabled = false
      loadSettingForm(true)
    } else {
      configSettingBtn.disabled = true
      let setTxt = {
        "title": "RAN service is up.",
        "content": `Please stop RAN Service before change profile.`
      }
      warnRanUpDialog(setTxt, () => {
        loadSettingForm(false)
      });
    }
    //鎖住user權限
    if (!configSettingPrivileges) {
      configSettingBtn.disabled = true // save & apply - btn
    }
  } catch (error) {
    alert("Loading Error: " + String(error))
  }
});

// configSettingModalBtn.addEventListener("click", () => {
//   modalControl
// })

//config info settings btn
let oldData = {}
configSettingBtn.addEventListener("click", async () => {
  try {
    for (let el of configSettingFormEl) {
      // console.log(el.name);
      // console.log(el.value);

      // 判斷是否更改
      if (oldData[el.id] != el.value) {
        // 取單次set所需之所有xpath
        let checkNetconfSet = [] //檢查回傳用
        console.log("netconfPath");
        console.log(netconfPath);
        console.log(netconfPath[el.id]);
        console.log(el.id);

        for (let xpath of netconfPath[el.id]) {
          console.log(xpath);
          let data = {
            "request": "set",
            "type": "netconf",
            "body": {
              "netconf": currentPage_lower,
              "setValue": el.value,
              "path": xpath
            }
          };
          // api - netconf
          let setData = await get(data);
          let response = checkSus(setData) ? "done" : "fail"
          checkNetconfSet.push(response)
          console.log(`response${response}`);
        }
        let findFail = checkNetconfSet.some((item) => (item == "fail"));
        if (findFail) {
          configInfoContentText[el.id] = "fail"
        } else {
          configInfoContentText[el.id] = el.value
          console.log(configInfoContentText);
        }
        refreshConfigInfo(); //刷新頁面資料
        console.log(`========${el.id} DONE========`);
      }
      else {
        console.log("no change");
      }

    }
  } catch (error) {
    alert("Send error: " + String(error))
  }
  modalControl.hide() //隱藏彈窗
});

// === License & Version - update // CBRS - setup ===
const setupModalEl = document.querySelector("#setupModal");
const setupStartEl = document.querySelector("#setupStartBtn");
const updateModalEl = document.querySelector("#updateModal");
const updateStartEl = document.querySelector("#updateStartBtn");
const cbrsSectionEl = document.querySelector("#cbrsSection");


//權限設定-CBRS
// userPrivileges = []
let CBRSPrivileges = userPrivileges.includes("8")
if (CBRSPrivileges) {
  cbrsSectionEl.classList.remove("d-none")
}
// // 控制按鈕 - 判斷無cbrs權限
// setupStartEl.disabled = !CBRSPrivileges
// if (!CBRSPrivileges) {
//   setupStartEl.classList.remove("e-btn--outline")
//   setupStartEl.classList.add("e-btn--action")
// }

//pop - 目前頁數
let currentIndex = 0;
let refreshPage = false //刷新頁面control

const handleDomEls = (modalEl, startEl, type) => {
  const bsModal = new bootstrap.Modal(modalEl);
  const nextBtnEl = modalEl.querySelector(".nextBtn");
  const stopRanBtnEl = modalEl.querySelector(".stopRanBtn");
  const cancelBtnEl = modalEl.querySelector(".cancelBtn");
  // const stopBtnEl = modalEl.querySelector(".stopBtn");
  const doneBtnEl = modalEl.querySelector(".doneBtn");
  const retryBtnEl = modalEl.querySelector(".retryBtn");
  const contentEls = modalEl.querySelectorAll(".c-modal__wrapper");
  const itemEls = modalEl.querySelectorAll(".c-modal__item");
  const timerEls = modalEl.querySelectorAll(".c-progress__bar");
  const fileInputEl = modalEl.querySelector(".fileInput");
  const fileBtnsEl = modalEl.querySelector(".fileBtns");
  const selectFileModalBtnEl = modalEl.querySelector(".selectFileModalBtn");
  const removeFileBtnEl = modalEl.querySelector(".removeFileBtn");
  // 
  const licenseInfoEl = document.querySelector("#licenseInfo");
  const ranVersionEl = document.querySelector("#ranVersion");
  const l1VersionEl = document.querySelector("#l1Version");
  const configInfoEl = document.querySelector("#configInfo");
  // const responseTextEls = modalEl.querySelectorAll(".c-modal__text");
  const responseTextSusEls = modalEl.querySelector("#resultSus");
  const responseTextFailEls = modalEl.querySelector("#resultFail");

  // === setup only ===
  const caFileInputEl = modalEl.querySelector(".caFileInput");
  const caFileLabelEl = caFileInputEl && caFileInputEl.parentNode.querySelector("label");
  const keyFileInputEl = modalEl.querySelector(".keyFileInput");
  const keyFileLabelEl = keyFileInputEl && keyFileInputEl.parentNode.querySelector("label");
  const caRemoveFileBtnEl = modalEl.querySelector(".caRemoveFileBtn");
  const keyRemoveFileBtnEl = modalEl.querySelector(".keyRemoveFileBtn");

  return {
    type: type,
    bs: bsModal,
    start: startEl,
    actions: {
      next: nextBtnEl,
      stopRan: stopRanBtnEl,
      cancel: cancelBtnEl,
      // stop: stopBtnEl,
      done: doneBtnEl,
      retry: retryBtnEl,
    },
    layout: {
      contents: contentEls,
      items: itemEls,
      timers: timerEls,
      checkBox: [
        licenseInfoEl,
        ranVersionEl,
        l1VersionEl,
        configInfoEl
      ],
      // resTexts: responseTextEls,
      resTextSus: responseTextSusEls,
      resTextFail: responseTextFailEls,
    },
    file: {
      input: fileInputEl,
      btns: fileBtnsEl,
      remove: removeFileBtnEl,
      select: selectFileModalBtnEl,
    },
    certificate: [
      {
        name: "ca",
        input: caFileInputEl,
        label: caFileLabelEl,
        remove: caRemoveFileBtnEl,
      },
      {
        name: "key",
        input: keyFileInputEl,
        label: keyFileLabelEl,
        remove: keyRemoveFileBtnEl,
      },
    ],
  };
};

const handleStartLayout = async (modalDoms) => {
  const { actions, layout, type } = modalDoms;
  const { contents, items } = layout;
  const { next, stopRan, cancel, stop, done, retry } = actions;

  /* 重置樣式設定 */
  contents.forEach((el) => {
    el.classList.add("d-none");
  });
  items.forEach((el) => {
    el.classList.remove("active");
    el.classList.remove("done");
  });
  contents[0].classList.remove("d-none");
  items[0].classList.add("active");

  cancel.classList.remove("d-none");
  cancel.innerHTML = "Cancel";
  // stop && stop.classList.add("d-none");
  done && done.classList.add("d-none");
  retry && retry.classList.add("d-none");

  refreshPage = false

  // 判斷RAN status
  next.classList.add("d-none"); // settings - 預設顯示stopRan
  let check = await checkStatus(currentPage)
  if (check) {
    next.classList.add("d-none");
    stopRan.classList.remove("d-none");
  } else {
    next.classList.remove("d-none");
    stopRan.classList.add("d-none");
  }
};

const handleShowModal = (modalDoms) => {
  const { bs, start, type } = modalDoms;
  start.addEventListener("click", () => {
    bs.show();
    handleStartLayout(modalDoms);
  });
};

async function set_cbrs_information() {
  let cbsd_enabled_xpath = netconfPath['cbsdEnabled']

  let send_cbsd_enabled = await get({
    "request": "set", "type": "netconf", "body": {
      "netconf": currentPage_lower, "setValue": "1", "path": cbsd_enabled_xpath
    }
  })
  console.log("cbsd_enabled : " + send_cbsd_enabled["body"]["status"]);

  location.reload()
}

const handleHideModal = (modalDoms) => {
  const { bs, actions, certificate, type } = modalDoms;
  const { cancel, done } = actions;
  cancel.addEventListener("click", () => {
    if (refreshPage) window.location.reload();
    bs.hide();
  });
  done &&
    done.addEventListener("click", () => {
      if (type == "setup") set_cbrs_information()
      else if (type == "update") window.location.reload();

      bs.hide();
    });
};

const handleOnHideModal = (modalDoms) => {
  const { bs, actions, file, certificate } = modalDoms;
  const { next } = actions;
  const { input, btns, remove } = file;
  bs._element.addEventListener("hidden.bs.modal", () => {
    currentIndex = 0;
    next && next.setAttribute("type", "button");
    btns && btns.classList.remove("d-none");
    remove && remove.classList.add("d-none");
    if (input) {
      input.value = "";
    }
    certificate.forEach((item) => {
      const { input, label, remove } = item;
      if (input) {
        input.value = "";
        label.classList.remove("d-none");
        remove.classList.add("d-none");
      }
    });
  });
};

//點next
const handleNext = (modalDoms, type) => {
  const { actions, layout } = modalDoms;
  const { next, cancel } = actions;
  const { contents, items } = layout;
  next.addEventListener("click", async () => {
    contents[currentIndex].classList.add("d-none");
    items[currentIndex].classList.add("done");
    items[currentIndex].classList.remove("active");
    cancel.classList.remove("d-none");
    if (type == "setup" && currentIndex == 1) {
      var ca_fileInput = document.getElementById('CACertificateFile');
      var key_fileInput = document.getElementById('certificateKeyFile');


      if (ca_fileInput.files.length == 0 || key_fileInput.files.length == 0) {
        alert('Please upload CA Certificate and Certificate Key')
      }
      else if (ca_fileInput.files.length > 0 && key_fileInput.files.length > 0) {
        var ca_file = ca_fileInput.files[0];
        var ca_fileName = ca_file.name;
        var ca_file_extension = ca_fileName.split('.').pop();
        var key_file = key_fileInput.files[0];
        var key_fileName = key_file.name;
        var key_file_extension = key_fileName.split('.').pop();
        if (ca_file_extension != 'crt' || key_file_extension != 'key') {
          console.log(ca_file_extension);
          console.log(key_file_extension);
          alert('The uploaded file format of CA Certificate or Certificate Key is incorrect')
        }
        else if (ca_file_extension === 'crt' && key_file_extension === 'key') {
          let msg = confirm(`Are you sure to upload ${ca_fileName} and ${key_fileName} ?`);
          if (msg == true) {
            currentIndex += 1;
          }

        }

      }

    } else {
      currentIndex += 1;
    }



    handleContentLayout(modalDoms, type);
  });
};

// update/setup stop ran
const handleStopRan = (modalDoms) => {
  const { actions } = modalDoms;
  const { next, stopRan } = actions;
  let start2StopRan = false

  stopRan.addEventListener("click", async () => {
    // API - stop ran
    start2StopRan = true
    let setTxt = {
      "title": "Stop RAN service",
      "content": `Please stop RAN Service before update profile.`,
      "confirm": "Stop RAN"
    }
    confirmCancelDialog(setTxt, async (result) => {
      if (!result.isConfirmed) return Swal.close();
      stopRanService(currentPage)
    });
    let ranStatusEl = document.querySelector(".c-dropdown__heading"); //Status
    let observer = new MutationObserver(function (mutations) {
      console.log(start2StopRan);
      if (!start2StopRan) return
      console.log(ranStatusEl.innerHTML);
      if (ranStatusEl.innerHTML == "Status: Offline") {
        next.classList.remove("d-none");
        stopRan.classList.add("d-none");
        start2StopRan = false
      }
    });
    observer.observe(ranStatusEl, {
      childList: true,
    });


    // const stoppingRan = {
    //   status: true,
    //   data: "Succcess",
    // };

    // let ranToggleEl = document.querySelector(".ranToggle"); //start stop
    // if (stoppingRan["status"] && stoppingRan["data"].includes("Succcess")) {
    //   next.classList.remove("d-none");
    //   stopRan.classList.add("d-none");
    // } else {
    //   next.classList.remove("d-none");
    //   stopRan.classList.add("d-none");
    // }
  });
};

let timeout;

const handleSuccessLayout = (modalDoms, type) => {
  const { actions, layout } = modalDoms;
  const { contents, items } = layout;
  contents[currentIndex].classList.add("d-none");
  items[currentIndex].classList.add("done");
  currentIndex += 1;
  handleContentLayout(modalDoms, type);
};

const handleContentLayout = async (modalDoms, type) => {
  const { actions, layout, file } = modalDoms;
  const { next, cancel, stop, done } = actions;
  const { contents, items, timers, checkBox, resTextSus, resTextFail } = layout;
  contents[currentIndex].classList.remove("d-none");
  items[currentIndex].classList.add("active");
  const computerFileInputEl = document.getElementById("computerFileInput")

  console.log("currentIndex" + currentIndex);
  switch (type) {
    case "setup":
      if (currentIndex === contents.length - 1) {
        next.classList.add("d-none")
        cancel.classList.add("d-none")
        let sas_url_input = document.getElementById("SASURL")
        let user_id_input = document.getElementById("userID")
        let fcc_id_input = document.getElementById("FCCID")
        let cbsd_sn_input = document.getElementById("CBSDSN")
        let portected_header_input = document.getElementById("portectedHeader")
        let encoded_CPI_input = document.getElementById("encodedCPI")
        let digital_signatur_input = document.getElementById("digitalSignature")

        let sas_url_data = sas_url_input.value
        let user_id_data = user_id_input.value
        let fcc_id_data = fcc_id_input.value
        let cbsd_sn_data = cbsd_sn_input.value
        let portected_header_data = portected_header_input.value
        let encoded_CPI_data = encoded_CPI_input.value
        let digital_signatur_data = digital_signatur_input.value

        let sas_url_xpath = netconfPath['sasUrl']
        let user_id_xpath = netconfPath['UserId']
        let fcc_id_xpath = netconfPath['FccId']
        let cbsd_sn_xpath = netconfPath['CbsdSerialNumber']
        let portected_header_xpath = netconfPath['cbsd_cpi_protectedHeader']
        let encoded_CPI_xpath = netconfPath['cbsd_cpi_encodedCpiSignedData']
        let digital_signatur_xpath = netconfPath['cbsd_cpi_digitalSignatur']

        let send_sas_url = await get({
          "request": "set", "type": "netconf", "body": {
            "netconf": currentPage_lower, "setValue": sas_url_data, "path": sas_url_xpath
          }
        })
        let send_user_id = await get({
          "request": "set", "type": "netconf", "body": {
            "netconf": currentPage_lower, "setValue": user_id_data, "path": user_id_xpath
          }
        })
        let send_fcc_id = await get({
          "request": "set", "type": "netconf", "body": {
            "netconf": currentPage_lower, "setValue": fcc_id_data, "path": fcc_id_xpath
          }
        })
        let send_cbsd_sn = await get({
          "request": "set", "type": "netconf", "body": {
            "netconf": currentPage_lower, "setValue": cbsd_sn_data, "path": cbsd_sn_xpath
          }
        })
        let send_portected_header = await get({
          "request": "set", "type": "netconf", "body": {
            "netconf": currentPage_lower, "setValue": portected_header_data, "path": portected_header_xpath
          }
        })
        let send_encoded_CPI = await get({
          "request": "set", "type": "netconf", "body": {
            "netconf": currentPage_lower, "setValue": encoded_CPI_data, "path": encoded_CPI_xpath
          }
        })
        let send_digital_signatur = await get({
          "request": "set", "type": "netconf", "body": {
            "netconf": currentPage_lower, "setValue": digital_signatur_data, "path": digital_signatur_xpath
          }
        })
        console.log("sas_url : " + send_sas_url["body"]["status"]);
        console.log("user_id : " + send_user_id["body"]["status"]);
        console.log("fcc_id : " + send_fcc_id["body"]["status"]);
        console.log("cbsd_sn : " + send_cbsd_sn["body"]["status"]);
        console.log("portected_header : " + send_portected_header["body"]["status"]);
        console.log("encoded_CPI : " + send_encoded_CPI["body"]["status"]);
        console.log("digital_signatur : " + send_digital_signatur["body"]["status"]);

        sas_url_data = ""
        user_id_data = ""
        fcc_id_data = ""
        cbsd_sn_data = ""
        portected_header_data = ""
        encoded_CPI_data = ""
        digital_signatur_data = ""

        //upload file
        var ca_fileInput = document.getElementById('CACertificateFile');
        var key_fileInput = document.getElementById('certificateKeyFile');
        var ca_file = ca_fileInput.files[0];
        var key_file = key_fileInput.files[0];

        let host = document.location.href
        const url = host
        const hostname = new URL(url).hostname;
        fetch(`https://${hostname}:16000/api/path/bbu/du`)
          .then(response => response.text())
          .then(async data => {
            console.log(data);
            let api_path = data
            let updload_ca_file = await post(ca_file, `/app/oam/backend/upload_file${api_path}cbsd/`)
            let updload_key_file = await post(key_file, `/app/oam/backend/upload_file${api_path}cbsd/`)
            console.log("updload file sus");
            console.log(updload_ca_file);
            console.log(updload_key_file);
          })
          .catch(error => console.error(error));

        items[currentIndex].classList.add("done");
        done.classList.remove("d-none");
        next.classList.add("d-none");
        cancel.classList.add("d-none");
      }
      else if (currentIndex === 1) {
        let sas_url_input = document.getElementById("SASURL")
        let user_id_input = document.getElementById("userID")
        let fcc_id_input = document.getElementById("FCCID")
        let cbsd_sn_input = document.getElementById("CBSDSN")
        let portected_header_input = document.getElementById("portectedHeader")
        let encoded_CPI_input = document.getElementById("encodedCPI")
        let digital_signatur_input = document.getElementById("digitalSignature")
        sas_url_input.value = cbrs_information_map["sasUrl"]
        user_id_input.value = cbrs_information_map["UserId"]
        fcc_id_input.value = cbrs_information_map["FccId"]
        cbsd_sn_input.value = cbrs_information_map["CbsdSerialNumber"]
        portected_header_input.value = cbrs_information_map["cbsd_cpi_protectedHeader"]
        encoded_CPI_input.value = cbrs_information_map["cbsd_cpi_encodedCpiSignedData"]
        digital_signatur_input.value = cbrs_information_map["cbsd_cpi_digitalSignatur"]
      }
      break;
    case "update":
      if (currentIndex === contents.length - 2) {
        done.classList.remove("d-none");
        next.classList.add("d-none");
        cancel.classList.add("d-none");
        // stop.classList.add("d-none");
      }
      else if (currentIndex === 1) {
        next.classList.add("d-none");
        computerFileInputEl.addEventListener("change", (input) => {
          if (input.target.files[0]) {
            next.classList.remove("d-none");
          }
        })
      }
      // Import package - update
      else if (currentIndex === 2) {
        next.classList.add("d-none");
        cancel.classList.add("d-none");
        // stop.classList.remove("d-none");
        timers[0].className = "progress-bar c-progress__bar u-animation u-animation--slide-right-30";

        // 從本機上傳pkg
        if (computerFileInputEl.files[0]) {
          let updloadPkg = await post(computerFileInputEl.files[0], "/app/oam/backend/upload_file/home/htc_pkgs/update/") //上傳pkg
          console.log(updloadPkg);
          if (checkSus(updloadPkg)) {
            console.log("updloadPkg sus");
            console.log(computerFileInputEl.files[0]["name"]);
            //確認選取
            let choosePkg = await oamApi.choosePackage(computerFileInputEl.files[0]["name"]);
            console.log(choosePkg);

            if (choosePkg["state"] && checkSus(choosePkg)) {
              console.log("choosePkg sus");

              next.click() //轉頁
            } else {
              handleFailLayout(modalDoms)
            }
          }
          else {
            handleFailLayout(modalDoms)
          }
        }
        // 從線上選pkg
        else if (file.remove.innerHTML) {
          //確認選取
          console.log("flieName:" + file.remove.innerHTML);
          let choosePkg = await oamApi.choosePackage(file.remove.innerHTML);
          if (choosePkg["state"] && checkSus(choosePkg)) {
            console.log("choosePkg sus");

            next.click() //轉頁
          } else {
            handleFailLayout(modalDoms)
          }
        }
        //未選擇檔案
        else {
          handleFailLayout(modalDoms)
        }
      }
      //勾選清單
      else if (currentIndex === 3) {
        const checkboxText = document.querySelectorAll(".c-checkbox__text");
        let packageInfo = await oamApi.pkgInfo()
        console.log(packageInfo);

        let data = getLicenseInfo(packageInfo)
        console.log("getLicenseInfo data");
        console.log(data);

        // checkbox information
        checkboxText[0].innerHTML = [data.licInfo[0], data.licInfo[1], data.licInfo[2]].join("<br>")
        checkboxText[1].innerHTML = data.ranVer
        checkboxText[2].innerHTML = data.l1Ver
        checkboxText[3].innerHTML = data.configInfo

        next.classList.remove("d-none");
        cancel.classList.remove("d-none");
        // stop.classList.add("d-none");
      } else if (currentIndex === 4) {
        // UI
        next.classList.add("d-none");
        cancel.classList.add("d-none");
        // stop.classList.remove("d-none");
        timers[1].className = "progress-bar c-progress__bar u-animation";


        // 處理checkbox勾選的選項
        let checkedNum = 0
        for (let i = 0; i < checkBox.length; i++) {
          checkedNum = checkBox[i].checked ? checkedNum + 1 : checkedNum
        }
        // console.log("checkedNum:" + checkedNum)

        let finshedRun = 0 // 目前已跑的項目
        let failRun = 0 //失敗次數


        // 處理跑條
        let handFinsh = async (index, response, pkgLicense) => {
          await new Promise(async function (resolve, reject) {
            finshedRun += 1;
            // 進度條
            switch (checkedNum) {
              case 4:
                timers[1].classList.add(`u-animation--slide-right-${finshedRun}of4`);
                resolve(response)
                break;
              case 3:
                timers[1].classList.add(`u-animation--slide-right-${finshedRun}of3`);
                resolve(response)
                break;
              case 2:
                let sr = finshedRun * 2 - 1;
                timers[1].classList.add(`u-animation--slide-right-${finshedRun}of4`);
                resolve(response)
                console.log(sr);
                break;
              case 1:
                timers[1].classList.add(`u-animation--slide-right-1`);
                resolve(response)
                break;
              default:
                resolve(response)
                break;
            }
          })
        };

        console.log("=====runList=====");
        // API列表
        let apiList = ["licenseInfo", "ranVersion", "l1Version", "configInfo"]
        let runList = {
          licenseInfo: { i: 0, name: "License Info", res: "" },
          ranVersion: { i: 1, name: "Ran Version", res: "" },
          l1Version: { i: 2, name: "L1 Version", res: "" },
          configInfo: { i: 3, name: "Config Info", res: "" },
        }
        // loop run api
        for (let [index, api] of apiList.entries()) {
          console.log(checkBox[index].id);
          console.log(checkBox[index].checked);
          let res

          if (checkBox[index].checked) {
            res = await oamApi[api]()
            runList[checkBox[index].id].res = res
            if (!res["state"]) failRun++
            else if (typeof res["data"] === "string") {
              if (!res["data"].includes("Success")) failRun++
            }
          }
          else {
            res = ""
          }
          console.log(res);
          let responseLayout = await handFinsh(index, res, checkBox[index].name)
          console.log(runList);
        }

        console.log(runList);
        console.log("=====runList end=====");
        console.log(failRun);
        // console.log(resTexts);
        // 成功處理
        if (failRun == 0) {
          // resTextSus.innerHTML = ""
          for (let [index, api] of Object.entries(runList)) {
            if (api.res == "") { }
            // licenseInfo/ranVersion/l1Version
            else if (typeof api.res["data"] === "string") {
              resTextSus.innerHTML += `<li class="c-list__item c-list__item--dot">${api.name}</li>`
            }
            // config info
            else {
              let ul = ""
              for (let [k, value] of Object.entries(api.res["data"])) {
                ul += `
                <li class="c-list__item c-list__item--line">
                  <ul class="c-list">
                    <li class="c-list__subitem">${k}:</li>
                    <li class="c-list__subitem">${value.includes("Success") ? "Success" : value}</li>
                  </ul>
                </li>
                `
              }
              ul = `<ul class="c-list">${ul}</ul>`
              resTextSus.innerHTML += `<li class="c-list__item c-list__item--dot">${api.name}${ul}</li>`
            }

          }
          handleSuccessLayout(modalDoms, type);
        }
        // 失敗處理
        else {
          // resTextFail.innerHTML = ""
          for (let [index, api] of Object.entries(runList)) {
            if (api.res == "") { }
            else if (typeof api.res["data"] === "string") {
              if (!api.res["data"].includes("Success")) {
                resTextFail.innerHTML += `
                <li class="c-list__item c-list__item--dot">
                  ${api.name}
                  <li class="c-list__item c-list__item--line">
                    <ul class="c-list">
                      <li class="c-list__subitem">${api.res["data"].includes("Success") ? "Success" : api.res["data"]}</li>
                    </ul>
                  </li>
                </li>
                `
              }
            }
            // config info
            else {
              console.log("res config info");
              console.log(api.res["data"]);
              let ul = ""
              for (let [k, value] of Object.entries(api.res["data"])) {
                ul += `
                <li class="c-list__item c-list__item--line">
                  <ul class="c-list">
                    <li class="c-list__subitem">${k}:</li>
                    <li class="c-list__subitem">${value.includes("Success") ? "Success" : value}</li>
                  </ul>
                </li>
                `
              }
              resTextFail.innerHTML += `
              <li class="c-list__item c-list__item--dot">
                ${api.name}
                <ul class="c-list">${ul}</ul>
              </li>`
            }
          }

          refreshPage = true //刷新頁面
          handleFailLayout(modalDoms)
        }
      }
      break;
  }
};

const handleFailLayout = (modalDoms) => {
  const { actions, layout } = modalDoms;
  const { cancel, stop, retry } = actions;
  const { contents, items } = layout;
  contents[currentIndex].classList.add("d-none");
  contents[contents.length - 1].classList.remove("d-none");
  items[3].classList.add("done");
  // stop.classList.add("d-none");
  cancel.classList.remove("d-none");
  retry.classList.remove("d-none");
};

const handleExitAlert = (modalDoms, type) => {
  const { bs, actions, layout } = modalDoms;
  const { stop } = actions;
  const { timers } = layout;
  stop.addEventListener("click", () => {
    clearTimeout(timeout);
    timers[0].className = "progress-bar c-progress__bar";
    timers[1].className = "progress-bar c-progress__bar";
    commonSettings
      .fire({
        title: "Exit software update",
        html: "Are you sure you want to exit software up update?",
        showCancelButton: true,
        confirmButtonText: "Resume",
        reverseButtons: true,
        timerProgressBar: false,
        buttonsStyling: false,
        customClass: {
          container: "c-alert__container",
          popup: "c-alert__popup",
          title: "c-alert__title",
          htmlContainer: "c-alert__content",
          confirmButton: "e-btn e-btn--action c-alert__btn",
          cancelButton: "e-btn e-btn--outline c-alert__btn",
        },
      })
      .then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          handleFailLayout(modalDoms);
        } else if (result.dismiss === Swal.DismissReason.confirm) {
          timers[0].className = "progress-bar c-progress__bar u-animation u-animation--slide-right";
          timers[1].className = "progress-bar c-progress__bar u-animation u-animation--slide-right";
          timeout = setTimeout(() => {
            handleSuccessLayout(modalDoms, type);
          }, 30000);
        } else if (result.dismiss === Swal.DismissReason.backdrop) {
          commonSettings
            .fire({
              title: "Stop RAN service failed",
              html: "Sorry, RAN service failed to stop. Please check your RAN status and try it again.",
              showCancelButton: false,
              confirmButtonText: "OK",
              reverseButtons: true,
              timerProgressBar: false,
              buttonsStyling: false,
              customClass: {
                container: "c-alert__container",
                popup: "c-alert__popup",
                title: "c-alert__title",
                htmlContainer: "c-alert__content",
                confirmButton: "e-btn e-btn--action c-alert__btn",
                cancelButton: "e-btn e-btn--outline c-alert__btn",
              },
            })
            .then((result) => {
              bs.hide();
            });
        }
      });
  });
};

const handleFileLayout = (modalDoms) => {
  const { file } = modalDoms;
  const { input, btns, remove } = file;
  input &&
    input.addEventListener("change", (e) => {
      const fileData = input.files[0];
      btns.classList.add("d-none");
      remove.classList.remove("d-none");
      remove.innerHTML = fileData.name;
    });
};

const handleRemoveFile = (modalDoms) => {
  const { file } = modalDoms;
  const { input, btns, remove } = file;
  remove &&
    remove.addEventListener("click", () => {
      btns.classList.remove("d-none");
      remove.classList.add("d-none");
      input.value = "";
    });
};

const handleShowFileModal = (modalDoms) => {
  const { file, actions } = modalDoms;
  const { next } = actions;
  const { btns, remove, select } = file;
  select &&
    select.addEventListener("click", async () => {

      //取online pkg清單
      let res = await oamApi.packageList();
      let pkgList = res["data"].split(",");
      let inputOptions = {}
      pkgList.sort().map((runFile) => { inputOptions[runFile] = runFile })

      const { value: file } = await commonSettings.fire({
        title: "Select color",
        input: "radio",
        showCancelButton: true,
        confirmButtonText: "Select",
        reverseButtons: true,
        timerProgressBar: false,
        buttonsStyling: false,
        customClass: {
          container: "c-alert__container",
          popup: "c-alert__popup",
          title: "c-alert__title",
          htmlContainer: "c-alert__content",
          confirmButton: "e-btn e-btn--action c-alert__btn",
          cancelButton: "e-btn e-btn--outline c-alert__btn",
        },
        inputOptions: inputOptions,
      });
      if (file) {
        remove.classList.remove("d-none");
        btns.classList.add("d-none");
        remove.innerHTML = file;
        next.classList.remove("d-none");
      }
    });
};

const handleRetry = (modalDoms) => {
  const { bs, actions } = modalDoms;
  const { retry } = actions;
  retry &&
    retry.addEventListener("click", () => {
      bs.hide();
      setTimeout(() => {
        bs.show();
        handleStartLayout(modalDoms);
      }, 0);
    });
};

const handleCertificate = (modalDoms) => {
  const { certificate } = modalDoms;
  certificate.forEach((item) => {
    const { input, label, remove } = item;
    input.addEventListener("change", (e) => {
      const fileData = input.files[0];
      label.classList.add("d-none");
      remove.classList.remove("d-none");
      remove.innerHTML = fileData.name;
    });
  });
};

const handleRemoveCertificate = (modalDoms) => {
  const { certificate } = modalDoms;
  certificate.forEach((item) => {
    const { input, label, remove } = item;
    remove.addEventListener("click", () => {
      label.classList.remove("d-none");
      remove.classList.add("d-none");
      input.value = "";
    });
  });
};

const modalEls = [
  {
    type: "setup",
    modalEl: setupModalEl,
    startEl: setupStartEl,
  },
  {
    type: "update",
    modalEl: updateModalEl,
    startEl: updateStartEl,
  },
];

modalEls.forEach((item) => {
  const { modalEl, startEl, type } = item;
  const modalDoms = handleDomEls(modalEl, startEl, type);
  handleShowModal(modalDoms);
  handleHideModal(modalDoms);
  handleOnHideModal(modalDoms);
  handleNext(modalDoms, type);
  handleRetry(modalDoms);

  if (type === "update") {
    handleStopRan(modalDoms);
    // handleExitAlert(modalDoms, type);
    handleFileLayout(modalDoms);
    handleRemoveFile(modalDoms);
    handleShowFileModal(modalDoms);
  } else if (type === "setup") {
    handleStopRan(modalDoms);
    handleCertificate(modalDoms);
    handleRemoveCertificate(modalDoms);
  }
});
