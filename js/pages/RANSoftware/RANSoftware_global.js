
//Configuration information 資料設定 (config全資料)
var configInfoContentText = {
  // netconf
  CUIPAddress: "",
  DUIPAddress: "",
  PLMN: "",
  SST: "",
  SD: "",
  TAC: "",
  PCI: "",
  CellID: "",
  frequencySettings: "",
  // restful api
  gNBID: "",
  NRBand: "",
  NRMode: "",
  DLARFCN: "",
  SCS: "",
};

function refreshConfigInfo() {
  // const configInfoContentEl = document.querySelector("#configInfoContent");
  const CUIPAddressTxtEl = document.querySelector("#CUIPAddressTxt");
  const DUIPAddressTxtEl = document.querySelector("#DUIPAddressTxt");
  const CellIDTxtEl = document.querySelector("#CellIDTxt");
  const PCITxtEl = document.querySelector("#PCITxt");
  const NRBandTxtEl = document.querySelector("#NRBandTxt");
  // bind text
  CUIPAddressTxtEl.innerHTML = configInfoContentText["CUIPAddress"];
  DUIPAddressTxtEl.innerHTML = configInfoContentText["DUIPAddress"];
  PCITxtEl.innerHTML = configInfoContentText["PCI"];
  CellIDTxtEl.innerHTML = configInfoContentText["CellID"];
  NRBandTxtEl.innerHTML = configInfoContentText["NRBand"];
}


export {
  configInfoContentText,
  refreshConfigInfo,
}