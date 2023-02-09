import { getCookie, setCookie, clearAllCookies } from "../../module/globalSettings.js";


const appendAccountHtml = async () => {
  let current_privileges = await getCookie("user_privileges"); //cookies
  let current_user = "";

  if (current_privileges.includes("1")) {
    current_user = "1";
  } else if (current_privileges.includes("2")) {
    current_user = "2";
  } else if (current_privileges.includes("3")) {
    current_user = "3";
  }
  let disabled = "";
  if (current_user == "1") {
    disabled = "";
  } else if (current_user == "2") {
    disabled = "";
  } else if (current_user == "3") {
    disabled = "disabled";
  }

  const url = document.location.href;
  const currentPageUrl = url.slice(url.lastIndexOf("/"), url.length);

  let css = currentPageUrl.includes("overview") || currentPageUrl.includes("AlertManagement") ? "aside" : "home";
  const accountManagementHtml = `
<div class="modal c-modal c-modal--${css}" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered c-modal__dialog">
    <div class="modal-content c-modal__content">
      <div class="modal-body c-modal__body">
        <aside class="c-modal__aside">
          <h2 class="c-modal__title">
            Settings
          </h2>
          <ul class="c-modal__list">
            <li class="c-modal__item">
              <button type="button" class="c-modal__tab active" data-target="account">
                <i class="c-modal__icon" data-icon="account"></i>
                Account
              </button>
            </li>
            <li class="c-modal__item">
              <button type="button" id="usersAndPermissionsID" class="c-modal__tab" data-target="users">
                <i class="c-modal__icon" data-icon="permissions"></i>
                Users and permissions
              </button>
            </li>
          </ul>
        </aside>
        <main class="c-modal__main">
          <div class="c-modal__wrapper" data-content="account">
            <div class="c-modal__top">
              <h2 class="c-modal__title">
                Account
              </h2>
              <i class="c-modal__avatar">
                H
              </i>
              <div class="c-info">
                <div class="c-info__set">
                  <h5 class="c-info__subtitle">ID name</h5>
                  <h6 class="c-info__text">Holly Huang</h6>
                </div>

              </div>

            </div>
            <div class="c-modal__btns">
              <button type="button" class="c-modal__btn e-btn e-btn--outline me-0">Sign out</button>
            </div>
          </div>
          <div class="c-modal__wrapper d-none" data-content="users">
            <div class="c-modal__top">
              <h2 class="c-modal__title">
                Users and permissions
              </h2>
              <p class="c-modal__text">Manage users who can see and do in your OAM</p>
              <button type="button" class="c-modal__btn e-btn e-btn--outline e-btn--light" data-target="create" ${disabled}>Create
                new
                account</button>
              <div class="c-account">

              </div>
            </div>
          </div>
          <div class="c-modal__wrapper d-none" data-content="create">
            <div class="c-modal__top">
              <h2 class="c-modal__title">
                Create an account
              </h2>
              <form class="c-form">
                <div class="c-form__set c-form__set--row">
                  <label for="IDName" class="c-form__label c-form__label--muted">ID name</label>
                  <input type="text" name="ID name" id="IDName" class="c-form__input c-form__input--outline"
                    placeholder="" autocomplete="off">
                </div>
              </form>
              <div class="c-permission">
                <div class="c-permission__set">
                  <input type="radio" class="c-permission__input form-check-input" name="createType"
                    id="createAdminRadio" checked>
                  <label for="createAdminRadio" class="c-permission__label">
                    <div class="c-permission__icon">
                      <img src="./img/new-ui/icon/asset_admin.svg" alt="admin">
                    </div>
                    <div class="c-permission__content">
                      <h5 class="c-permission__title">Admin</h5>
                      <ul class="c-permission__list c-list">
                        <li class="c-permission__item c-list__item">・Can view 5GC/RAN/RU
                          information</li>
                        <li class="c-permission__item c-list__item">
                          ・Can view RAN/DU/L1 debugging log
                        </li>
                        <li class="c-permission__item c-list__item">・Can set RAN/RU
                          configuration change</li>
                      </ul>
                    </div>
                  </label>
                </div>
                <div class="c-permission__set">
                  <input type="radio" class="c-permission__input form-check-input" name="createType"
                    id="createGeneralUserRadio">
                  <label for="createGeneralUserRadio" class="c-permission__label">
                    <div class="c-permission__icon">
                      <img src="./img/new-ui/icon/asset_general_user.svg" alt="general_user">
                    </div>
                    <div class="c-permission__content">
                      <h5 class="c-permission__title">General User</h5>
                      <ul class="c-permission__list c-list">
                        <li class="c-permission__item c-list__item">・Can view 5GC/RAN/RU
                          information</li>
                      </ul>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div class="c-modal__btns">
              <button type="button" class="c-modal__btn e-btn e-btn--outline cancelBtn">Cancel</button>
              <button type="button" class="c-modal__btn e-btn e-btn--action e-btn-create-user">Create</button>
            </div>
          </div>
          <div class="c-modal__wrapper d-none" data-content="edit">
            <div class="c-modal__top">
              <h2 class="c-modal__title">
                Edit permissions
              </h2>
              <div class="c-account c-account--edit">
                <div class="c-account__wrapper">
                  <i class="c-account__avatar">H</i>
                  <div class="c-account__info">
                    <h6 id="jctest" class="c-account__title">Holly Huang</h6>
                    <span class="c-account__text">Last logn time was 14 Jun 2022, 16:30PM
                      GMT+8</span>
                    <button type="button" class="c-account__btn e-btn e-btn--outline e-btn--light">Delete
                      account</button>
                  </div>
                </div>
              </div>
              <div class="c-permission">
                <div class="c-permission__set">
                  <input type="radio" class="c-permission__input form-check-input" name="editType" id="editAdminRadio"
                    checked>
                  <label for="editAdminRadio" class="c-permission__label">
                    <div class="c-permission__icon">
                      <img src="./img/new-ui/icon/asset_admin.svg" alt="admin">
                    </div>
                    <div class="c-permission__content">
                      <h5 class="c-permission__title">Admin</h5>
                      <ul class="c-permission__list c-list">
                        <li class="c-permission__item c-list__item">・Can view 5GC/RAN/RU
                          information</li>
                        <li class="c-permission__item c-list__item">
                          ・Can view RAN/DU/L1 debugging log
                        </li>
                        <li class="c-permission__item c-list__item">・Can set RAN/RU
                          configuration change</li>
                      </ul>
                    </div>
                  </label>
                </div>
                <div class="c-permission__set">
                  <input type="radio" class="c-permission__input form-check-input" name="editType"
                    id="editGeneralUserRadio">
                  <label for="editGeneralUserRadio" class="c-permission__label">
                    <div class="c-permission__icon">
                      <img src="./img/new-ui/icon/asset_general_user.svg" alt="general_user">
                    </div>
                    <div class="c-permission__content">
                      <h5 class="c-permission__title">General User</h5>
                      <ul class="c-permission__list c-list">
                        <li class="c-permission__item c-list__item">・Can view 5GC/RAN/RU
                          information</li>
                      </ul>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div class="c-modal__btns">
              <button type="button" class="c-modal__btn e-btn e-btn--outline cancelBtn">Cancel</button>
              <button type="button" id="e-btn--edit" class="c-modal__btn e-btn e-btn--action ">Apply</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</div>
`;

  const accountManagementEl = document.querySelector("#accountManagement");
  accountManagementEl.innerHTML = accountManagementHtml;
};

appendAccountHtml();
