// 彈窗設定
const commonSettings = Swal.mixin({
  showClass: {
    popup: "animate__animated animate__fadeIn",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOut",
  },
});

// ===how to use===
// let setTxt = {
//   "title": "RAN is up.",
//   "content": `Please stop RAN Service before change profile.`
// }
// warnRanUpDialog(setTxt, loadSettingForm);

function warnRanUpDialog(txtSet, func) {
  commonSettings
    .fire({
      title: txtSet["title"],
      html: txtSet["content"],
      showCancelButton: false,
      confirmButtonText: "OK",
      reverseButtons: true,
      timerProgressBar: false,
      buttonsStyling: false,
      allowOutsideClick: false,
      customClass: {
        container: "c-alert__container",
        popup: "c-alert__popup",
        title: "c-alert__title",
        htmlContainer: "c-alert__content",
        confirmButton: "e-btn e-btn--action c-alert__btn ranToggle",
        cancelButton: "e-btn e-btn--outline c-alert__btn",
      },
    })
    .then(() => {
      func()
    })
    ;
  document.querySelector(".swal2-actions").classList.add("c-alert__action");
  document.querySelector(".swal2-timer-progress-bar-container").classList.add("d-none");
}


// ===how to use===
// let setTxt = {
//   "title": "Shutdown 5GC",
//   "content": `Are you sure you want to shutdown 5GC server now? If 5GC is shutdown all RANs network wont be working.`,
//   "confirm": "Shutdown"
// }
// confirmCancelDialog(setTxt, (result) => {
//   if (!result.isConfirmed) return Swal.close();
// });
function confirmCancelDialog(txtSet, func) {
  commonSettings
    .fire({
      title: txtSet["title"],
      html: txtSet["content"],
      showCancelButton: true,
      confirmButtonText: txtSet["confirm"],
      reverseButtons: true,
      timerProgressBar: false,
      buttonsStyling: false,
      allowOutsideClick: false,
      customClass: {
        container: "c-alert__container",
        popup: "c-alert__popup",
        title: "c-alert__title",
        htmlContainer: "c-alert__content",
        confirmButton: "e-btn e-btn--action c-alert__btn ranToggle",
        cancelButton: "e-btn e-btn--outline c-alert__btn",
      },
    })
    .then((result) => {
      func(result)
    })
    ;
  document.querySelector(".swal2-actions").classList.add("c-alert__action");
  document.querySelector(".swal2-timer-progress-bar-container").classList.add("d-none");
}



export {
  commonSettings,
  warnRanUpDialog,
  confirmCancelDialog
}