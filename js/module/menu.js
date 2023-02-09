//cookies
import { getCookie, setCookie, getUrlData } from "./globalSettings.js";

const show5gcEl = document.querySelector("#sidebar5gcControl");
const showRuListEl = document.querySelector("#sidebarHeadingRU");

async function process() {
  const showRanEl = document.querySelector("#sidebarRanControl");
  const showRanCollapseEl = document.querySelector("#sidebarCollapseRAN");

  const showRuEl = document.querySelector("#sidebarRuControl");
  const showRuCollapseEl = document.querySelector("#sidebarCollapseRU");

  const showOverviewEl = document.querySelector("#sidebarOverviewControl");
  const showAlertManagementEl = document.querySelector("#sidebarAlertManagementControl");
  const show5gcEl = document.querySelector("#sidebar5gcControl");
  const showUEEl = document.querySelector("#sidebarUEControl");

  const url = document.location.href;
  const currentPageUrl = url.slice(url.lastIndexOf("/"), url.lastIndexOf("html") + 4);
  let currentPG = getUrlData()

  // let RanPages = ["RAN1"]; //RAN數量
  // let RuPages = ["RU1-1"]; //RAN數量

  let serverIp = await getCookie("serverIp")
  let RanPages = Object.keys(serverIp["RAN"]).length !== 0 ? Object.keys(serverIp["RAN"]) : []; //RAN數量
  let RuPages = Object.keys(serverIp["RU"]).length !== 0 ? Object.keys(serverIp["RU"]) : []; //RAN數量
  // RanPages = ["RAN1", "RAN2"]
  console.log(RanPages);
  console.log(RuPages);

  //=============sidebar Others==============
  let pageEls = {
    Overview: {
      el: showOverviewEl,
      path: ["/overview.html"],
    },
    "Alert Management": {
      el: showAlertManagementEl,
      path: ["/AlertManagement.html"],
    },
    "5GC": {
      el: show5gcEl,
      path: ["/5GC-software.html"],
    },
    UE: {
      el: showUEEl,
      path: [
        "/UE-RAN.html",
      ]
    },
    // UE2: {
    //   el: showUEEl,
    //   path: "/UE-RAN2.html",
    // },
  };

  //跳頁處理
  for (let [k, page] of Object.entries(pageEls)) {
    // let pageText = page["el"].querySelector(".c-sidebar__text");
    page["el"].addEventListener("click", () => {
      // let allpage = ["Overview","Alert Management","5GC","UE","RAN","RU"]
      // setCookie("currentPage", pageText.innerHTML.trim());

      let url = document.location.href;
      url = url.slice(0, url.lastIndexOf("/"));
      window.location.href = url + page["path"][0];
    });
  }


  //============= RAN ==============
  //RAN - 顯示RAN數量、highlight
  let mutiRan = ""; //html
  let ranTabsUrl = ["/RAN-software.html", "/RAN-performance.html", "/RAN-system.html"]
  console.log(currentPageUrl);

  for (let i of RanPages.keys()) {
    let activeControl = currentPG?.pg == RanPages[i] ? "active" : ""

    mutiRan += `
      <a class="c-sidebar__sub-btn ${activeControl}" href="./RAN-software.html?pg=${RanPages[i]}">
        <i class="c-sidebar__icon" data-icon="ran"></i>
        <div id="futureRAN" class="c-sidebar__text">
          ${RanPages[i]}
        </div>
      </a>
      `;

    // RAN TAB分頁路徑
    if (ranTabsUrl.find(url => url == currentPageUrl) && activeControl == "active") {
      let ranTabs = document.querySelector("#ranTabs").children
      for (const j of Array(ranTabs.length).keys()) {
        ranTabs[j].href = `.${ranTabsUrl[j]}?pg=${RanPages[i]}`
      }
    }
  }
  showRanEl.innerHTML = mutiRan;

  //RAN - 展開列表
  if (currentPageUrl.slice(1, 4) == "RAN") {
    showRanEl.classList.remove("collapsed");
    showRanCollapseEl.classList.add("show");
  }

  //============= RU ==============
  //build RU
  let mutiRu = ""; //html
  let ruTabsUrl = ["/RU-software.html", "/RU-performance.html"]
  console.log();
  if (RuPages.length == 0) {
    showRuListEl.classList.add("d-none")
  } else {
    for (let i of RuPages.keys()) {
      let activeControl = currentPG?.pg == RuPages[i] ? "active" : "" //highlight

      mutiRu += `
      <a class="c-sidebar__sub-btn ${activeControl}" href="./RU-software.html?pg=${RuPages[i]}">
        <i class="c-sidebar__icon" data-icon="router"></i>
        <div id="futureRU" class="c-sidebar__text">
          ${RuPages[i]}
        </div>
      </a>
      `;

      // RU TAB分頁路徑
      if (ruTabsUrl.find(url => url == currentPageUrl) && activeControl == "active") {
        let ruTabs = document.querySelector("#ruTabs").children
        for (const j of Array(ruTabs.length).keys()) {
          ruTabs[j].href = `.${ruTabsUrl[j]}?pg=${RuPages[i]}`
          console.log(ruTabs[j].href);
        }
      }
    }
    showRuEl.innerHTML = mutiRu;
  }


  //展開RU列表
  if (currentPageUrl.slice(1, 3) == "RU") {
    showRuEl.classList.remove("collapsed");
    showRuCollapseEl.classList.add("show");
  }
}

async function menuMain() {
  //權限設定
  let userPrivileges = await getCookie("user_privileges");
  console.log(userPrivileges);
  if (userPrivileges.includes("6")) {
    show5gcEl.classList.remove("d-none")
  }
  if (userPrivileges.includes("9")) {
    showRuListEl.classList.remove("d-none")
  }
  // 跳頁處理
  process();
}

menuMain();
