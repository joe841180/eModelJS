import { getCookie, setCookie, clearAllCookies, set_version } from "../../module/globalSettings.js";
//default權限
//權限
const privileges = {
  1: "root",
  2: "admin",
  3: "user",
  4: "Can export/import overview JSON file",
  5: "Can set RAN/RU configuration change", //configuration settings
  6: "Can view 5GC information",
  7: "Can view DU/L1 debugging log",
  8: "Can view CBRS (Settings/log)",
  9: "Can view RU information",
  10: "Can set RAN/RU configuration settings - CU/DU IP", //configuration settings
};
// let root_privileges = ["1", "4", "5", "6", "7", "8"];
let admin_privileges = ["2", "4", "5", "6", "7", "8", "9"];
let user_privileges = ["3", "6", "7", "8", "9"];

// Settings Modal
function handleSettingsDoms() {
  const settingsToggleEls = document.querySelectorAll(".settingsToggle");
  const settingsModalEl = document.querySelector("#settingsModal");
  const bsModal = new bootstrap.Modal(settingsModalEl);
  const cancelEls = settingsModalEl.querySelectorAll(".cancelBtn");
  const contentEls = settingsModalEl.querySelectorAll(".c-modal__wrapper");
  const tabEls = settingsModalEl.querySelectorAll(".c-modal__tab");
  const defaultTabEl = settingsModalEl.querySelector(`[data-target="account"]`);
  const defaultContentEl = settingsModalEl.querySelector(`[data-content="account"]`);
  return {
    toggles: settingsToggleEls,
    modal: settingsModalEl,
    bs: bsModal,
    cancels: cancelEls,
    tabs: tabEls,
    contents: contentEls,
    defaults: {
      tab: defaultTabEl,
      content: defaultContentEl,
    },
  };
}

//users data
let user_name_privileges = "";
let account_list = [];

const handleToggleSettings = (settingsDoms) => {
  const { toggles, bs, cancels } = settingsDoms;
  toggles.forEach((el) => {
    el.addEventListener("click", async () => {
      bs.show();
      await get_all_users_data();

      //account html
      await account_users_table().then((resHtml) => {
        let account = document.querySelector(".c-account");
        account.innerHTML = resHtml;

        handleSettingsEditContent(settingsDoms);
      });

      // const settingsDoms = handleSettingsDoms();
    });
  });

  cancels.forEach((el) => {
    el.addEventListener("click", () => {
      bs.hide();
    });
  });
};

const handleActiveLayout = (allTabs, allContents, activeTab, activeContent) => {
  allTabs.forEach((el) => {
    el.classList.remove("active");
  });
  allContents.forEach((el) => {
    el.classList.add("d-none");
  });
  activeTab.classList.add("active");
  activeContent.classList.remove("d-none");
};

function handleOnHideSettings(settingsDoms) {
  const { bs, tabs, contents, defaults } = settingsDoms;
  const { tab, content } = defaults;
  bs._element.addEventListener("hidden.bs.modal", () => {
    handleActiveLayout(tabs, contents, tab, content);
  });
}

const handleSettingsContent = (settingsDoms) => {
  const { toggle, modal, bs, cancels, contents } = settingsDoms;
  const settingToggles = [{ type: "tab", content: ["account", "users"] }];

  settingToggles.forEach((item) => {
    const { type, content } = item;
    const toggles = modal.querySelectorAll(`.c-modal__${type}`);
    content.forEach((item) => {
      const tabEl = modal.querySelectorAll(`[data-target="${item}"]`);
      const contentEl = modal.querySelector(`[data-content="${item}"]`);
      tabEl.forEach((el) => {
        el.addEventListener("click", () => {
          handleActiveLayout(toggles, contents, el, contentEl);
        });
      });
    });
  });
};

const handleSettingsEditContent = (settingsDoms) => {
  const { toggle, modal, bs, cancels, contents } = settingsDoms;
  const settingToggles = [{ type: "action", content: ["create", "edit"] }];

  settingToggles.forEach((item) => {
    const { type, content } = item;
    const toggles = modal.querySelectorAll(`.c-modal__${type}`);
    content.forEach((item) => {
      const tabEl = modal.querySelectorAll(`[data-target="${item}"]`);
      const contentEl = modal.querySelector(`[data-content="${item}"]`);
      tabEl.forEach((el) => {
        el.addEventListener("click", () => {
          handleActiveLayout(toggles, contents, el, contentEl);
          let user_name_edit = contentEl.querySelector(".c-account__title");
          let user_first_word_edit = contentEl.querySelector(".c-account__avatar");
          let user_lastlongtime_edit = contentEl.querySelector(".c-account__text");

          if (item == "edit") {
            let id_value = el.id;
            let user_privileges = account_list[id_value]["privileges"]
            //set edit input checked
            if (user_privileges.includes("2")) {
              let editAdminRadio = document.querySelector("#editAdminRadio")
              editAdminRadio.click()
            } else if (user_privileges.includes("3")) {
              let editGeneralUserRadio = document.querySelector("#editGeneralUserRadio")
              editGeneralUserRadio.click()
            }

            user_name_privileges = account_list[id_value]["user_name"];
            user_name_edit.innerHTML = account_list[id_value]["user_name"];
            user_first_word_edit.innerHTML = account_list[id_value]["user_name"].slice(0, 1);
            user_lastlongtime_edit.innerHTML = account_list[id_value]["lastLognTime"];
          }
        });
      });
    });
  });
};

async function account_users_table() {
  let current_privileges = await getCookie("user_privileges"); //cookies
  let user_name = await getCookie("user_name");
  return new Promise((resolve, reject) => {
    let current_user = "";
    if (current_privileges.includes("1")) {
      current_user = "1";
    } else if (current_privileges.includes("2")) {
      current_user = "2";
    } else if (current_privileges.includes("3")) {
      current_user = "3";
    }

    let users_table_html = "";
    for (let [index, el] of account_list.entries()) {
      let first_word = el["user_name"].slice(0, 1);
      let privileges_list = el["privileges"];
      let user_type = Math.min(...privileges_list);
      let user_type_str = "";
      if (user_type == "1") {
        user_type_str = "Root";
      } else if (user_type == "2") {
        user_type_str = "Admin";
      } else if (user_type == "3") {
        user_type_str = "User";
      }

      //set button disabled
      let disabled = "";

      if (current_user == "1") {
        if (user_type == "1") {
          disabled = "disabled";
        }
      } else if (current_user == "2") {
        if (user_type == "1") {
          disabled = "disabled";
        } else if (user_name == el["user_name"]) {
          disabled = "disabled";
        }
      } else if (current_user == "3") {
        disabled = "disabled";
      }
      users_table_html += `
        <div class="c-account__set">
        <div class="c-account__wrapper">
            <i class="c-account__avatar">${first_word}</i>
            <div class="c-account__info">
                <h5 class="c-account__subtitle">${user_type_str}</h5>
                <h6 class="c-account__title">${el["user_name"]}</h6>
                <span class="c-account__text">${el["lastLognTime"]}</span>
            </div>
        </div>
        <button type="button" id="${index}" class="c-account__action e-btn e-btn--outline e-btn--light"
            data-target="edit" ${disabled}>Edit</button>
        </div>
  `;
    }
    resolve(users_table_html);
  });
}

async function create_user() {
  let create_idname_input = document.getElementById("IDName");
  let create_admin_radio = document.getElementById("createAdminRadio");
  let create_general_user_radio = document.getElementById("createGeneralUserRadio");
  let button = document.querySelector(".e-btn-create-user");
  let current_privileges = await getCookie("user_privileges");



  if (current_privileges.includes("3")) {
    button.addEventListener("click", errorMsg);
  } else {
    button.addEventListener("click", sendMsg);
  }

  function errorMsg() {
    alert("You do not have permission")
  }

  async function sendMsg() {
    let idname_input = create_idname_input.value;
    let admin_radio = create_admin_radio.checked;
    let user_radio = create_general_user_radio.checked;

    let privileges = [];

    if (admin_radio == true) {
      privileges = admin_privileges;
    } else if (user_radio == true) {
      privileges = user_privileges;
    }

    let data = {
      request: "creat",
      type: "account",
      body: {
        userName: idname_input,
        privileges: privileges,
      },
    };

    if (idname_input.trim() == "" || idname_input == null) {
      alert("ID Name is empty");
    } else {
      let response_data = await get(data);

      if (response_data["body"]["status"] == "Success") {
        alert(response_data["body"]["response"]);

        window.location.replace("./overview.html");
      } else if (response_data["body"]["status"] == "fail") {
        alert(response_data["body"]["response"]);
      }
    }
  }
}
function edit_user_privileges() {
  let edit_admin_radio = document.getElementById("editAdminRadio");
  let edit_general_user_radio = document.getElementById("editGeneralUserRadio");
  let user_edit_button = document.getElementById("e-btn--edit");
  user_edit_button.addEventListener("click", sendMsg);

  async function sendMsg() {
    let idname_input = user_name_privileges;
    let admin_radio = edit_admin_radio.checked;
    let user_radio = edit_general_user_radio.checked;

    let privileges = [];

    if (admin_radio == true) {
      privileges = admin_privileges;
    } else if (user_radio == true) {
      privileges = user_privileges;
    }

    let data = {
      request: "userEditPrivileges",
      type: "account",
      body: {
        userName: idname_input,
        privileges: privileges,
      },
    };

    let msg = confirm("Are you sure to modify?");

    if (msg == true) {
      let response_data = await get(data);

      if (response_data["body"]["status"] == "Success") {
        alert("Successfully modified");
        window.location.replace("./overview.html");
      } else {
        alert(response_data["body"]["status"]);
      }
    }
  }
}

function delete_user() {
  let user_edit_button = document.querySelector(".c-account__btn");
  user_edit_button.addEventListener("click", sendMsg);

  async function sendMsg() {
    let idname_input = user_name_privileges;

    let data = {
      request: "deleteUser",
      type: "account",
      body: {
        userName: idname_input,
      },
    };

    let msg = confirm("Are you sure to delete account?");

    if (msg == true) {
      let response_data = await get(data);

      if (response_data["body"]["status"] == "Success") {
        alert("Account deleted");
        window.location.replace("./overview.html");
      } else {
        alert(response_data["body"]["status"]);
      }
    }
  }
}
async function account_information() {
  let id_name = document.querySelector(".c-info__text");
  let account_pages_avatar = document.querySelector(".c-modal__avatar");
  let dropdown_button_avatar = document.querySelector(".c-dropdown__toggle--btn");
  let dropdown_icon_avatar = document.querySelector(".c-dropdown__icon--bg");
  let dropdown_item_user_name = document.querySelector(".dropdown-item_name div");
  let users_and_permissions_button = document.getElementById("usersAndPermissionsID");
  let dropdown_item_version = document.querySelector(".c-dropdown__text");

  let get_id_name = await getCookie("user_name");
  let current_privileges = await getCookie("user_privileges");

  if (current_privileges.includes("3")) {
    users_and_permissions_button.classList.add("d-none")
  }
  let avatar_str = get_id_name.slice(0, 1);
  //account pages information
  id_name.innerHTML = get_id_name;
  account_pages_avatar.innerHTML = avatar_str;
  //dropdown pages infomation
  dropdown_button_avatar.innerHTML = avatar_str;
  dropdown_icon_avatar.innerHTML = avatar_str;
  dropdown_item_user_name.innerHTML = get_id_name;
  //set dropdown version

  dropdown_item_version.innerHTML = 'Version ' + set_version

}

function sign_out() {
  let sign_out_button = document.querySelector(".me-0");

  sign_out_button.addEventListener("click", sendMsg);

  function sendMsg() {
    clearAllCookies();
    window.location.replace("./index.html");
  }
}

function settings_sign_out() {
  let sign_out_button = document.querySelector(".dropdown-item--out");
  sign_out_button.addEventListener("click", sendMsg);

  function sendMsg() {
    clearAllCookies();
    window.location.replace("./index.html");
  }
}

async function get_all_users_data() {
  let data = {
    request: "userAllData",
    type: "account",
    body: [],
  };
  let current_privileges = await getCookie("user_privileges"); //cookies
  let user_name = await getCookie("user_name");
  let current_user = "";
  if (current_privileges.includes("1")) {
    current_user = "1";
  } else if (current_privileges.includes("2")) {
    current_user = "2";
  } else if (current_privileges.includes("3")) {
    current_user = "3";
  }

  let response_data = await get(data);
  let response_body = response_data["body"];
  account_list = [];
  response_body.forEach(function (item) {
    let user_list = {
      user_name: item["user_name"],
      privileges: item["privileges"],
      lastLognTime: item["lastLognTime"],
    };
    if (current_user == "3") {
      if (item["user_name"] == user_name) {
        account_list.push(user_list);
      }
    }
    else if (current_user == "1") {
      account_list.push(user_list);
    }
    else if (current_user == "2") {
      if ((item["privileges"].includes("2") == true) || (item["privileges"].includes("3") == true)) {
        account_list.push(user_list);
      }
    }

  });
  return account_list;
}

async function main() {
  // let accountManagementEl = document.querySelector("#accountManagement");
  // accountManagementEl.innerHTML = html;
  // $("#accountManagement").load("accountManagement.html");

  const settingsDoms = handleSettingsDoms();
  handleToggleSettings(settingsDoms);
  handleSettingsContent(settingsDoms);
  handleOnHideSettings(settingsDoms);
}

main();
create_user();
account_information();
sign_out();
edit_user_privileges();
delete_user();
settings_sign_out();
