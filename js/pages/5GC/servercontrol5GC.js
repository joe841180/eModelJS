import { getCookie, setCookie } from "../../module/globalSettings.js";
import { confirmCancelDialog, warnRanUpDialog } from "../../module/dialog.js";
import { api, checkSus, apiDirectDataCheck } from "../../restfulApi.js";

// 選單-dropdownMenu els
const dropdownMenuEl = document.querySelector("#dropdownMenu"); //dropdownMenu 展開/收起控制

const rebootEl = document.querySelector("#serverReboot"); //reboot
const shutdownEl = document.querySelector("#serverShutdown"); //Shutdown

const checkServer = async () => {
  let result = true
  let serverIp = await getCookie("serverIp")
  let rans = serverIp["RAN"]
  for (const [ranService, ip] of Object.entries(rans)) {
    let oamApi = new api(ranService)
    await oamApi.getIP()
    let res = await oamApi.ranStatus();
    console.log(res);
    result = (res["state"] && res["data"].includes("5G system is UP")) ? false : result
  }
  console.log(result);
  return result
}

//reboot重新啟動
const reboot = () => {
  rebootEl.addEventListener("click", async () => {
    let setTxt = {
      "title": "Reboot 5GC",
      "content": `All RAN services need to stop to finish resbooting 5GC. Are you sure you want to pause all RAN services and reboot 5GC server now?`,
      "confirm": "Reboot"
    }
    confirmCancelDialog(setTxt, async (result) => {
      if (!result.isConfirmed) return Swal.close();

      if (await checkServer()) {
        let serverIp = await getCookie("serverIp")

        let reboot = await get({
          request: "serverControl",
          type: "5GC",
          body: {
            action: "Reboot",
            ip: serverIp["5GC"]
          },
        }).then((res) => {
          console.log(res);
          // if (res["body"]["status"].includes("Success")) {
          //   susDialog("Reboot");
          // } else {
          //   failDialog("Reboot");
          // }
        });
      } else {
        let setTxt = {
          "title": "RAN service is up.",
          "content": `Please stop RAN Service before reboot 5GC.`
        }
        warnRanUpDialog(setTxt, () => { });
      }
    });


    //關閉選單
    dropdownMenuEl.classList.remove("show");
  });
};

//硬體關機
const shutdown = () => {
  shutdownEl.addEventListener("click", async () => {
    let setTxt = {
      "title": "Shutdown 5GC",
      "content": `Are you sure you want to shutdown 5GC server now? If 5GC is shutdown all RAN services network wont be working.`,
      "confirm": "Shutdown"
    }
    confirmCancelDialog(setTxt, async (result) => {
      if (!result.isConfirmed) return Swal.close();

      if (await checkServer()) {
        let serverIp = await getCookie("serverIp")

        let reboot = await get({
          request: "serverControl",
          type: "5GC",
          body: {
            action: "Shutdown",
            ip: serverIp["5GC"]
          },
        }).then((res) => {
          console.log(res);
          // if (res["body"]["status"].includes("Success")) {
          //   // susDialog("Reboot");
          // } else {
          //   // failDialog("Reboot");
          // }
        });
      }
      else {
        let setTxt = {
          "title": "RAN service is up.",
          "content": `Please stop RAN Service before shutdown 5GC.`
        }
        warnRanUpDialog(setTxt, () => { });
      }
    });

    //關閉選單
    dropdownMenuEl.classList.remove("show");
  });
};

async function serverSwitchMain() {
  reboot()
  shutdown()
}

serverSwitchMain();
