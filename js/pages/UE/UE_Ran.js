import { getUrlData, getCookie } from "../../module/globalSettings.js";

const tabsContainer = document.querySelector(".c-tabs");

let serverIp = await getCookie("serverIp");
let get_ran = serverIp['RAN']
let ran_count = 0;
for (let key in get_ran) {
    if (get_ran.hasOwnProperty(key)) {
        ran_count++;
    }
}
// 動態生成標籤
for (let i = 1; i <= ran_count; i++) {
    tabsContainer.innerHTML += `<a class="c-tabs__tab" href="./UE-RAN.html?ranNum=${i}">RAN${i}</a>`
}
//get url value
let page_number = getUrlData()

const tabs = tabsContainer.querySelectorAll(".c-tabs__tab");

for (let x = 0; x < tabs.length; x++) {
    if (page_number['ranNum'] == String(x + 1)) {

        tabs[x].classList.add("active");

    } else if (page_number['ranNum'] == undefined) {
        tabs[0].classList.add("active");
    }
    else {
        tabs[x].classList.remove("active")
    }
}
