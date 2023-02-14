import { getUrlData, getCookie } from "../../module/globalSettings.js";

const graphContentEl = document.querySelector("#graphContent");
const graphEmptyStateEl = document.querySelector(".graphEmptyState");
const historyDataEl = document.querySelector("#historyData");
const sourceCheckboxesEl = document.querySelector("#sourceCheckboxes");
const noData = document.querySelector(".l-home__empty");
const pagesEl = document.querySelector("#pages");

let alertPk = "";

let historyData = {};
let defaultFilterData = {
  page: 1,
  startDate: "",
  endDate: "",
  idORDescription: "",
  source: [], //"ru1-1", "ran1"
  severity: [], //"critical", "major", "minor"
  acknowledge: ["false"], //"false", "true"
  solved: [], //"false", "true"
};

const handleFilterDoms = () => {
  const formEl = document.querySelector(".c-form");
  const cancelbtnEl = document.querySelector("#cancelForm");
  const applybtnEl = document.querySelector("#applyForm");

  const filterModalEl = document.querySelector("#filterModal");
  const filterModal = new bootstrap.Modal(filterModalEl);

  const tagsWrapperEl = document.querySelector("#tagsWrapper");
  const calenderEl = formEl.querySelector(".c-option__icon");
  const startDateEl = formEl.querySelector("input[name='startDate']");
  const endDateEl = formEl.querySelector("input[name='endDate']");

  const defaultEndDate = moment().format("YYYY-MM-DD");
  const defaultStartDate = moment("2000").format("YYYY-MM-DD");
  const in1Day = defaultEndDate;
  const in1Week = moment().subtract("6", "days").format("YYYY-MM-DD");
  const in1Month = moment().subtract("30", "days").format("YYYY-MM-DD");

  // 初始設定
  let filterData = {
    request: "get",
    type: "notify",
    body: {
      // "startDate": defaultStart, //2022-08-21
      // "endDate": defaultEnd, //2022-09-24
      // "idORDescription": "",
      // "source": [], //"ru1-1", "ru1-2"
      // "severity": [], //"critical", "major", "minor"
      // "acknowledge": [], //"false", "true"
      // "solved": [] //"false", "true"
    },
  };
  return {
    form: formEl,
    bs: filterModal,
    wrapper: tagsWrapperEl,
    cancel: cancelbtnEl,
    apply: applybtnEl,
    date: {
      calender: calenderEl,
      startDate: startDateEl,
      endDate: endDateEl,
      defaultStart: defaultStartDate,
      defaultEnd: defaultEndDate,
      in1Day: in1Day,
      in1Week: in1Week,
      in1Month: in1Month,
    },
    filterData: filterData,
  };
};

const handleCheckboxDoms = (formEl) => {
  const timeEl = formEl.querySelector("input[name='time']:checked");
  const dateIn1DayEl = document.querySelector("#dateIn1Day");
  const dateIn1WeekEl = document.querySelector("#dateIn1Week");
  const dateIn1MonthEl = document.querySelector("#dateIn1Month");

  const idOrDescriptionEl = formEl.querySelectorAll("input[name='IdOrDescription']");
  const sourceEl = formEl.querySelectorAll("input[name='source']:checked");
  const severityEl = formEl.querySelectorAll("input[name='severity']:checked");
  const acknowledgeEl = formEl.querySelectorAll("input[name='acknowledge']:checked");
  const solvedEl = formEl.querySelectorAll("input[name='solved']:checked");

  const sourceEmptyEl = formEl.querySelectorAll("input[name='source']");
  const severityEmptyEl = formEl.querySelectorAll("input[name='severity']");
  const acknowledgeEmptyEl = formEl.querySelectorAll("input[name='acknowledge']");
  const solvedEmptyEl = formEl.querySelectorAll("input[name='solved']");
  return {
    time: timeEl,
    timeRanges: {
      dateIn1Day: dateIn1DayEl,
      dateIn1Week: dateIn1WeekEl,
      dateIn1Month: dateIn1MonthEl,
    },
    arr: {
      idOrDescription: idOrDescriptionEl,
      sources: sourceEl,
      severitys: severityEl,
      acknowledges: acknowledgeEl,
      solveds: solvedEl,
    },
    arrEl: {
      idOrDescription: idOrDescriptionEl,
      sources: sourceEmptyEl,
      severitys: severityEmptyEl,
      acknowledges: acknowledgeEmptyEl,
      solveds: solvedEmptyEl,
    },
  };
};

const filterDoms = handleFilterDoms();

const jumpPage = (passData, page, maxPage) => {
  passData["page"] = page;
  console.log(passData);
  console.log("page:" + page);
  console.log("maxPage:" + maxPage);
  passData = Object.entries(passData).map(([k, v]) => `${k}=${v.toString()}`);

  if (page < 1 || page > maxPage) return;

  let url = document.location.href;
  url = url.slice(0, url.lastIndexOf("html") + 4);
  window.location.href = url + "?" + passData.join("&");
};

//送出資料(TAG不會增加)
const handleSendFilter = async (filterData) => {
  let ranruList = [];

  console.log(filterData);
  await get(filterData).then((res) => {
    console.log("getHistoryData");
    console.log(res);
    try {
      if (res.errorType != 0) throw res.errorMessage;

      if (res["body"]["count"] > 0) {
        // // === 頁數 ===
        // let pageCount = Math.ceil(res["body"]["count"] / 50)
        // console.log("pageCount:" + String(pageCount));
        // pagesEl.innerHTML = ""
        // pagesEl.innerHTML += `<button name="pageBtnShortcut" type="button" class="btn btn-outline-primary"><</button>`
        // for (let i of Array(pageCount).keys()) {
        //   console.log(i);
        //   let active = currentPage == i + 1 ? "btn-primary" : "btn-outline-primary"
        //   pagesEl.innerHTML += `<button name="pageBtn" type="button" class="btn ${active}">${i + 1}</button>`
        // }
        // pagesEl.innerHTML += `<button name="pageBtnShortcut" type="button" class="btn btn-outline-primary">></button>`

        // let pageNumEl = pagesEl.querySelectorAll(`button[name='pageBtn']`);
        // let ShortcutEl = pagesEl.querySelectorAll(`button[name='pageBtnShortcut']`);
        // // 點擊反應 - 快速跳轉頁數
        // ShortcutEl[0].addEventListener("click", () => jumpPage(filterData["body"], 1))
        // ShortcutEl[1].addEventListener("click", () => jumpPage(filterData["body"], pageNumEl.length))

        // // 點擊反應 - 頁數
        // for (let i of Array(pageNumEl.length).keys()) {
        //   pageNumEl[i].addEventListener("click", () => jumpPage(filterData["body"], i + 1))
        // }

        // ==================================================================
        // === 頁數 ===
        let currentPage = filterData["body"]["page"];
        let maxPage = Math.ceil(res["body"]["count"] / 50);
        pagesEl.innerHTML = `${currentPage}/${maxPage} `;
        pagesEl.innerHTML += `<button name="pageBtnShortcut" type="button" class="btn btn-outline-primary"><</button>`;
        pagesEl.innerHTML += `<button name="pageBtnShortcut" type="button" class="btn btn-outline-primary">></button>`;

        // 點擊反應 - 上一頁/下一頁
        let ShortcutEl = pagesEl.querySelectorAll(`button[name='pageBtnShortcut']`);
        ShortcutEl[0].addEventListener("click", () => jumpPage(filterData["body"], currentPage - 1, maxPage));
        ShortcutEl[1].addEventListener("click", () => jumpPage(filterData["body"], currentPage + 1, maxPage));

        // === 資料 ===
        historyData = res["body"]["data"];
        handleShowAlertData();
        noData.classList.add("d-none"); //hide no data message
      } else {
        console.log("noData");
        historyDataEl.innerHTML = ""; //clear html
        noData.classList.remove("d-none"); //show no data message
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  });
};

// build alert html
const handleShowAlertData = async () => {
  // settings
  let { form } = filterDoms;
  let checkboxDoms = handleCheckboxDoms(form);
  let { arrEl } = checkboxDoms;
  let { acknowledges, solveds } = arrEl;
  // console.log("handleShowAlertData");

  historyDataEl.innerHTML = "";
  // value[1]["pk"] = pk
  let sortedMap = Object.entries(historyData).sort(function (a, b) {
    return new Date(b[1]["time_open"]) - new Date(a[1]["time_open"]);
  });
  console.log("historyData");
  console.log(historyData);
  // console.log("sortedMap");
  // return

  for (let [key, data] of sortedMap) {
    //setting
    let pk = data["pk"];
    let online = alertPk == String(pk) ? "online" : "";
    let time = moment(data["time_open"]).format("YYYY-MM-DD HH:mm:ss");
    time = time.split(" ");
    let id = String(data["fault_id"]);
    let source = data["netconf"];
    let severity = data["fault_severity"];
    let faultSource = source.includes("ru") ? `/${data["fault_source"]}` : "";
    let description = data["fault_text"];
    let acknowledge = data["acknowledge"] == "true" ? "checked" : "";
    let solved = data["solved"] == "true" ? "checked" : "";
    let suggestion = "";
    if (source.includes("ru")) {
      suggestion = ruNotifyContentMap[id] ? ruNotifyContentMap[id]["suggestion"] : suggestion;
    } else {
      suggestion = ranNotifyContentMap[id] ? ranNotifyContentMap[id]["suggestion"] : suggestion;
    }

    historyDataEl.innerHTML += `
    <div id="alertMsg${pk}" class="l-home__block ${online}">
      <div class="l-home__wrapper">
        <div class="l-home__table c-table">
          <div class="l-home__row c-table__row c-table__row--head" data-row="1">
            <div class="l-home__col c-table__col">Time</div>
            <div class="l-home__col c-table__col">ID/Name</div>
            <div class="l-home__col c-table__col">Source</div>
            <div class="l-home__col c-table__col">Severity</div>
            <div class="l-home__col c-table__col">Description</div>
          </div>
          <div class="l-home__row c-table__row" data-row="1">
            <div class="l-home__col c-table__col">${time[0]}\n${time[1]}</div>
            <div class="l-home__col c-table__col">${id}</div>
            <div class="l-home__col c-table__col">${source}${faultSource}</div>
            <div class="l-home__col c-table__col">${severity}</div>
            <div class="l-home__col c-table__col">${description}</div>
          </div>
        </div>
        <div class="l-home__table c-table">
          <div class="l-home__row c-table__row c-table__row--head" data-row="2">
            <div class="l-home__col c-table__col">Trigger</div>
            <div class="l-home__col c-table__col">Suggestions</div>
          </div>
          <div class="l-home__row c-table__row" data-row="2">
            <div class="l-home__col c-table__col">Tx Path 0 loopback EVM > -30 dB or loopback measured power diff
              >
              12 dB
            </div>
            <div class="l-home__col c-table__col">
            ${suggestion}
            </div>
          </div>
        </div>
      </div>
      <div class="l-home__checkbox c-checkbox c-checkbox--right">
        <div class="c-checkbox__set">
          <label class="c-checkbox__label" for="ackownledgeCheckbox${key}">
            Ackownledge
          </label>
          <input class="form-check-input c-checkbox__input" type="checkbox" value="Ackownledge"
            id="ackownledgeCheckbox${key}" ${acknowledge}>
        </div>
        <div class="c-checkbox__set">
          <label class="c-checkbox__label" for="solvedCheckbox${key}">
            Solved
          </label>
          <input class="form-check-input c-checkbox__input" type="checkbox" value="Solved" id="solvedCheckbox${key}"
          ${solved}>
        </div>
      </div>
    </div>
    `;
  }

  // 跳轉
  if (alertPk != "") {
    try {
      console.log(alertPk);
      let highlightAlert = document.querySelector(`#alertMsg${alertPk}`);
      highlightAlert.scrollIntoView();
    } catch (error) {
      console.log("can't find pk in current case");
    }
  }

  //上傳勾取項目資料
  for (let key of Object.keys(historyData)) {
    let changedData = {};
    changedData[key] = historyData[key];

    let ackownledgeCheckboxEl = document.querySelector(`#ackownledgeCheckbox${key}`);
    let solvedCheckboxEl = document.querySelector(`#solvedCheckbox${key}`);

    ackownledgeCheckboxEl.addEventListener("change", async (e) => {
      console.log("ackownledgeCheckboxEl");
      changedData[key]["acknowledge"] = String(e.target.checked);
      // console.log(changedData);

      let resAckownledge = await get({
        request: "set",
        type: "notify",
        body: changedData,
      }).then((res) => {
        console.log(res);
        // fail - 回朔check box
        if (!res["body"]["status"].includes("Success")) {
          e.target.checked = !e.target.checked;
        }
        // // success - instantly remove alert
        // else {
        //   let checked = !e.target.checked ? "check" : "unchecked"
        //   let findCheck = [...acknowledges].filter((v, i) => v.value == checked && v.checked)
        //   if (findCheck.length != 0) {
        //     let checkedAlert = document.querySelector(`#alertMsg${key}`);
        //     checkedAlert.remove()
        //   }
        // }
      });
    });

    solvedCheckboxEl.addEventListener("change", async (e) => {
      console.log("solvedCheckboxEl");
      changedData[key]["solved"] = String(e.target.checked);

      let resSolved = await get({
        request: "set",
        type: "notify",
        body: changedData,
      }).then((res) => {
        console.log(res);
        // fail - 回朔check box
        if (!res["body"]["status"].includes("Success")) {
          e.target.checked = !e.target.checked;
        }
        // success - remove alert
        else {
          // console.log([...solveds]);
          let checked = !e.target.checked ? "check" : "unchecked";
          let findCheck = [...solveds].filter((v, i) => v.value == checked && v.checked);
          // console.log(findCheck);

          if (findCheck.length != 0) {
            let checkedAlert = document.querySelector(`#alertMsg${key}`);
            // console.log(checkedAlert);
            // console.log(key);
            checkedAlert.remove();
          }
        }
      });
    });
  }
};

const handleRemoveTag = (filterData) => {
  const { date, form } = filterDoms;
  const { defaultStart, defaultEnd } = date;
  const checkboxDoms = handleCheckboxDoms(form);
  const { time, arr, arrEl, timeRanges } = checkboxDoms;
  const { idOrDescription, acknowledges, solveds } = arr;

  console.log("filterData 3");
  console.log(filterData);
  const tagBtnEls = document.querySelectorAll(".tagBtn");
  tagBtnEls.forEach((tagBtnEl) => {
    tagBtnEl.addEventListener("click", async (e) => {
      console.log("===handleRemoveTag ST===");
      alertPk = "";
      let tagName = e.target.name.split(": ")[0];
      let dealingList = filterData["body"][tagName];
      console.log("BEFORE filterData");
      console.log(filterData);
      console.log("tagName:");
      console.log(tagName);
      console.log("dealingList:");
      console.log(dealingList);

      // resend filter
      if (tagName == "source" || tagName == "severity") {
        filterData["body"][tagName] = dealingList.filter((item) => {
          item != tagName;
        });
      } else if (tagName == "acknowledge" || tagName == "solved") {
        let tagValue = e.target.name.split(": ")[1];
        tagValue = tagValue == "check" ? "true" : "false";
        filterData["body"][tagName] = dealingList.filter((item) => item != tagValue);
      } else if (tagName == "filterDate") {
        filterData["body"]["startDate"] = defaultStart;
        filterData["body"]["endDate"] = defaultEnd;
      }

      console.log("AFTER filterData");
      console.log(filterData);
      console.log("===handleRemoveTag ED===");
      await handleSendFilter(filterData);
      e.target.parentNode.remove();
    });
  });
};

const handleAddTag = (tags) => {
  // settings
  const { form, wrapper, date } = filterDoms;
  const { startDate, endDate, defaultStart, defaultEnd } = date;
  const checkboxDoms = handleCheckboxDoms(form);
  const { time } = checkboxDoms;

  //起始日期-終止日期
  if (time === null) {
    // 不設定日期條件則不顯示tag
    console.log("startDate:" + startDate.value);
    console.log("endDate:" + endDate.value);
    console.log(startDate.value == defaultStart);
    console.log(endDate.value == defaultEnd);
    if (!(startDate.value == defaultStart && endDate.value == defaultEnd)) {
      const handleDateFormat = (date) => {
        return date.replaceAll("-", ".");
      };
      wrapper.innerHTML += `
        <div class="l-home__tag c-tag e-btn">
          ${handleDateFormat(startDate.value)}-${handleDateFormat(endDate.value)}
          <button name="filterDate" type="button" class="c-tag__action tagBtn"></button>
        </div>
        `;
    }
  }
  //時段勾選
  else {
    wrapper.innerHTML += `
      <div class="l-home__tag c-tag e-btn">
        ${time.value}
        <button name="filterDate" type="button" class="c-tag__action tagBtn"></button>
      </div>
    `;
  }
  //日期以外勾選項目
  for (let item of tags) {
    if (item["value"] !== "") {
      let tagName = item["type"] + ": " + item["value"];
      let tag = item["value"] == "check" ? tagName : item["value"];
      tag = item["type"] == "solved" || item["type"] == "acknowledge" ? `${item["type"]}:${item["value"]}` : tag;
      wrapper.innerHTML += `
      <div class="l-home__tag c-tag e-btn">
        ${tag}
        <button name="${tagName}" type="button" class="c-tag__action tagBtn"></button>
      </div>
      `;
    } else {
      wrapper.innerHTML += "";
    }
  }
};

const handleChangeTag = async (data) => {
  // settings
  const { form, bs, apply, wrapper, date, filterData } = filterDoms;
  const checkboxDoms = handleCheckboxDoms(form);
  const { time, arrEl, timeRanges } = checkboxDoms;

  console.log(data);

  filterData["body"] = data;
  handleGetAlert();
};

const handleGetAlert = async () => {
  // settings
  const { form, bs, wrapper, date, filterData } = filterDoms;
  const { startDate, endDate } = date;
  const checkboxDoms = handleCheckboxDoms(form);
  const { time, arr } = checkboxDoms;
  const { idOrDescription, sources, severitys, acknowledges, solveds } = arr;
  const arrs = [...sources, ...severitys, ...acknowledges, ...solveds];

  console.log(arrs);
  const tags = arrs.map((item) => {
    let tagMap = {};
    tagMap["type"] = item.name;
    tagMap["value"] = item.value;
    return tagMap;
  });
  console.log(filterData);
  console.log(tags);

  await handleSendFilter(filterData);
  handleAddTag(tags);
  console.log("filterData 2");
  console.log(filterData);
  handleRemoveTag(filterData);
};

// filter 視窗預設值
const reset = () => {
  // settings
  const { form, bs, apply, wrapper, date, filterData } = filterDoms;
  const checkboxDoms = handleCheckboxDoms(form);
  const { time, arrEl, timeRanges } = checkboxDoms;
  const { idOrDescription, sources, severitys, acknowledges, solveds } = arrEl;
  const { dateIn1Day, dateIn1Week, dateIn1Month } = timeRanges;
  const { startDate, endDate, defaultStart, defaultEnd } = date;

  // sources
  [...sources].filter((item) => {
    item.checked = item.value == "RAN1" ? true : false;
  });
  // severity
  let severityList = [...severitys];
  severityList[0].checked = true;
  // acknowledge
  let acknowledgeList = [...acknowledges];
  acknowledgeList[1].checked = true;
  // solved
  let solvedList = [...solveds];
  solvedList[1].checked = true;
  dateIn1Day.click();
};

// apply btn
const handleApplyBtn = async () => {
  // settings
  const { form, bs, wrapper, date, filterData } = filterDoms;
  const { startDate, endDate } = date;
  const checkboxDoms = handleCheckboxDoms(form);
  const { time, arr } = checkboxDoms;
  const { idOrDescription, sources, severitys, acknowledges, solveds } = arr;
  wrapper.innerHTML = "";

  const arrs = [...sources, ...severitys, ...acknowledges, ...solveds];
  console.log(arrs);
  // const tags = arrs.map((item) => item.value);
  const tags = arrs.map((item) => {
    let tagMap = {};
    tagMap["type"] = item.name;
    tagMap["value"] = item.value;
    return tagMap;
  });

  // 處理資料 - 1過濾
  let sourceList = tags.filter((item) => item.type == "source");
  let severityList = tags.filter((item) => item.type == "severity");
  let acknowledgeList = tags.filter((item) => item.type == "acknowledge");
  let solvedList = tags.filter((item) => item.type == "solved");
  console.log(acknowledgeList);
  // 處理資料 - 2轉換
  sourceList = sourceList.map((item) => item.value.toLowerCase());
  severityList = severityList.map((item) => item.value);
  acknowledgeList = acknowledgeList.map((item) => (item.value == "check" ? "true" : "false"));
  solvedList = solvedList.map((item) => (item.value == "check" ? "true" : "false"));

  //跳轉頁面傳值
  let passData = {
    first_name: "",
    last_name: "",
    email: "333@333.com",
    phone: "3",
    portrait: null, //integer
    is_public: true,
    case_available: true,
    phone_public: false,
    nickname: "",
    spare_email: null, //string
    gender: null,
    blood_type: null,
    birth: null,
    id_code: null,
    country: null,
    city: null,
    district: null,
    address: null,
    height: 0,
    weight: 0,
    constellation: null,
    chest: 0,
    cup: null,
    waist: 0,
    hips: 0,
    cloth_size: null,
    shoe_unit_type: null,
    shoe_size: 0,
    pupil_color: null,
    hair_length: null,
    skin_color: null,
    professional: null,
    experience: "0",
    case_location_1st: null,
    case_location_2nd: null,
    case_location_3rd: null,
    feature_description: "",
    detailed_experience: "",
    self_introduction: "",
    case_message: true,
    system_message: true,
    allow_manager_edit: false,
    featured_images: [],
  };

  // await handleSendFilter(filterData)
  // handleAddTag(tags)
  // handleRemoveTag(filterData);
  // bs.hide();
};

// 根據filter設定，載入資料
const handleForm = async (filterDoms) => {
  console.log("handleForm");
  // settings
  const { form, bs, wrapper, date, cancel, apply } = filterDoms;
  const { startDate, endDate, defaultStart, defaultEnd, in1Day, in1Week, in1Month } = date;

  const checkboxDoms = handleCheckboxDoms(form);
  const { timeRanges } = checkboxDoms;
  const { dateIn1Day, dateIn1Week, dateIn1Month } = timeRanges;
  let timeList = [dateIn1Day, dateIn1Week, dateIn1Month];

  // filter - apply btn
  apply.addEventListener("click", async (e) => {
    e.preventDefault();
    handleApplyBtn();
  });

  // filter - cancel btn
  cancel.addEventListener("click", async (e) => {
    bs.hide();
    form.reset();
  });

  //filter 顯示時
  bs._element.addEventListener("show.bs.modal", () => {
    form.reset();
    reset();
  });
  // //filter 關閉時
  // bs._element.addEventListener('hidden.bs.modal', () => {
  //   reset();
  // });
};

const defaultAction = async () => {
  let passedData = getUrlData();
  let pageNum = passedData?.page == undefined ? 1 : parseInt(passedData.page);
  console.log("pageNum: " + String(pageNum));

  if (Object.keys(passedData).length > 1) {
    console.log(passedData);
    try {
      console.log(alertPk);

      let data = {};
      // list 處理
      data.source = passedData?.source?.split(",");
      data.severity = passedData?.severity.split(",");
      data.acknowledge = passedData?.acknowledge.split(",");
      data.solved = passedData?.solved.split(",");
      data = Object.entries(data).map(([k, v]) => (v == undefined || v == "" ? [k, []] : [k, v]));
      data = Object.fromEntries(new Map(data));

      // 非 list 處理
      data.page = pageNum;
      data.idORDescription = passedData?.idORDescription == undefined ? "" : passedData.idORDescription;
      data.startDate = passedData?.startDate == undefined ? "" : passedData.startDate;
      data.endDate = passedData?.endDate == undefined ? "" : passedData.endDate;
      // console.log(data.startDate);
      // console.log(data.endDate);
      console.log(data);
      handleChangeTag(data);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  } else {
    //進頁面時，未指定範圍，欲顯示之通知
    handleChangeTag(defaultFilterData);
  }
};

handleForm(filterDoms);
defaultAction();
