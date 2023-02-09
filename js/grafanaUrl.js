import { getCookie, setCookie, getUrlData } from "../js/module/globalSettings.js";
import { api } from "../js/restfulApi.js";

const grafanaEl = document.querySelector("iframe")
const asideEl = document.querySelector("aside")
const headerEl = document.querySelector("header")

const grafanaMain = async () => {

  try {
    const currentUrl = document.location.href;
    let currentPageUrl = currentUrl.slice(currentUrl.lastIndexOf("/"), currentUrl.lastIndexOf("html") + 4);
    currentPageUrl = currentPageUrl.replace(".html", "")
    currentPageUrl = currentPageUrl.replace("/", "")
    let url, timediff, ip

    // 判斷ip
    let urlData = getUrlData()
    let currentPage = urlData?.pg != undefined ? urlData?.pg : "";
    let serverIp = await getCookie("serverIp");

    console.log(currentPageUrl);
    console.log(serverIp);
    console.log(currentPage);

    if (["RAN", "RU"].find(url => currentPageUrl.includes(url)) && currentPage != "") {
      const oamApi = new api(currentPage)
      await oamApi.getIP()
      ip = oamApi.ip
    }
    else if (["5GC"].find(url => currentPageUrl.includes(url))) {
      ip = serverIp["RAN"]["RAN1"]
    }
    else if (["UE-RAN"].find(url => currentPageUrl.includes(url))) {
      let ran_page_number = urlData['ranNum']
      let ran_number = `RAN${ran_page_number}`
      if (ran_page_number == undefined) {
        ran_number = "RAN1"
        currentPageUrl = "UE-RAN1"
      } else {
        currentPageUrl = `UE-RAN${ran_page_number}`
      }

      ip = serverIp["RAN"][ran_number]



    }
    else alert("no page")


    let resTimeDiff = await get({
      "type": "sshpass",
      "request": "grafanaTimediff",
      "body": {
        "ip": ip,
        "5gcIp": serverIp["5GC"] == undefined ? "" : serverIp["5GC"]
      }
    })
    console.log(resTimeDiff);

    timediff = resTimeDiff["errorType"] == 0 ? "-" + resTimeDiff["body"] + "s" : ""
    console.log("timediff:" + timediff);

    // 切換URL
    // currentPageUrl = "UE-RAN2"
    switch (currentPageUrl) {
      case "5GC-system":
        url = `https://${ip}:3000/d/0FshXCFVk/node_exporter_182_20221209?orgId=1&kiosk&theme=dark&from=now-1m&to=now&refresh=5s`
        break;
      case "RAN-system":
        url = `https://${ip}:3000/d/Nrqw_CKVk/node_exporter_20221209?orgId=1&kiosk&theme=dark&from=now-1m&to=now&refresh=5s&var-DS_PROMETHEUS=Prometheus&var-job=node_exporter&var-hostname=All&var-node=localhost%3A9100&var-maxmount=%2Fhome&var-env=&var-name=&from=1670578929854&to=1670578989854&theme=dark`
        break;
      case "RAN-performance":
        url = `https://${ip}:3000/d/PYyqXCFVz/ran-pm-data_20221209?orgId=1&kiosk&theme=dark&from=now-5m&to=now&refresh=1m`
        break;
      case "UE-RAN1":
        url = `https://${ip}:3000/d/fdMxXCF4z/pdcp_throughput_multiran_20221209?orgId=1&kiosk&theme=dark&from=now-15s&to=now&refresh=1s`
        break;
      case "UE-RAN2":
        url = `https://${ip}:3000/d/hcSuuCK4k/pdcp_throughput_multiran2_20221209?orgId=1&kiosk&theme=dark&from=now-15s&to=now&refresh=1s`
        break;
      case "RU-performance":
        url = `https://${ip}:3000/d/Nn0grjFVz/ru-pm-data_20221209?orgId=1&kiosk&theme=dark&from=now-10m&to=now&refresh=5m`
        break;
      default:
        break;
    }

    // 自動嵌入timediff
    let urlList = url.split("&")
    let newUrlList = urlList.map((value, index, array) => {
      if (value.includes("to=now")) {
        // console.log(value);
        return value + timediff
      }
      else if (value.includes("from=now")) {
        // console.log(value);
        return value + timediff
      }
      else {
        return value
      }
    })
    url = newUrlList.join("&")
    console.log("currentPageUrl");
    console.log(currentPageUrl);
    console.log(url);

    // height
    // let screenWidth = parseInt(screen.width) - parseInt(asideEl.offsetWidth);
    // let screenHeight = parseInt(document.documentElement.scrollHeight) - parseInt(headerEl.offsetHeight);

    let screenWidth = parseInt(screen.width);
    let screenHeight = parseInt(screen.height);

    // iframe settings
    grafanaEl.classList.add("h-auto")
    grafanaEl.width = screenWidth
    grafanaEl.height = screenHeight
    grafanaEl.src = url
  } catch (error) {
    alert(String(error))
  }
}

grafanaMain()
