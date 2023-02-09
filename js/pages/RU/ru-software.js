import { getCookie, setCookie, getUrlData } from "../../module/globalSettings.js"

const ip_address = document.querySelector("#ip_address")
const Band = document.querySelector("#Band")
const SyncStatus = document.querySelector("#SyncStatus")
const PTPProfile = document.querySelector("#PTPProfile")
const RRH_TX_ATTENUATION = document.querySelector("#RRH_TX_ATTENUATION")
const RRH_RX_ATTENUATION = document.querySelector("#RRH_RX_ATTENUATION")
const RRH_LO_FREQUENCY_KHZ = document.querySelector("#RRH_LO_FREQUENCY_KHZ")
const RRH_C_PLANE_VLAN_TAG = document.querySelector("#RRH_C_PLANE_VLAN_TAG")
const RRH_U_PLANE_VLAN_TAG = document.querySelector("#RRH_U_PLANE_VLAN_TAG")
const RRH_UL_INIT_SYM_ID = document.querySelector("#RRH_UL_INIT_SYM_ID")
const RRH_MAX_PRB_TX = document.querySelector("#RRH_MAX_PRB-TX")
const RRH_MAX_PRB_RX = document.querySelector("#RRH_MAX_PRB-RX")

async function getInfo() {
	let urlData = getUrlData()
	let current_page = urlData?.pg == undefined ? "RU1-1" : urlData.pg
	console.log(current_page);

	try {
		let serverIp = await getCookie("serverIp");
		console.log(serverIp);
		ip_address.innerHTML = serverIp["RU"][current_page]["IP"]
	} catch (error) {
		ip_address.innerHTML = "error ip"
	}

	try {
		let data = await get({
			"request": "get",
			"type": "netconf",
			"body": {
				"netconf": current_page.toLowerCase(),
			}
		});
		console.log(data);
		if (data["errorType"] != 0) alert(data["errorMessage"])

		data = data["body"]
		console.log(data);
		Band.innerHTML = data["Band"]
		SyncStatus.innerHTML = data["SyncStatus"]
		PTPProfile.innerHTML = data["PTPProfile"]
		RRH_TX_ATTENUATION.innerHTML = data["RRH_TX_ATTENUATION"]
		RRH_RX_ATTENUATION.innerHTML = data["RRH_RX_ATTENUATION"]
		RRH_LO_FREQUENCY_KHZ.innerHTML = data["RRH_LO_FREQUENCY_KHZ"]
		RRH_C_PLANE_VLAN_TAG.innerHTML = data["RRH_C_U_PLANE_VLAN_TAG"]["RRH_C_PLANE_VLAN_TAG"]
		RRH_U_PLANE_VLAN_TAG.innerHTML = data["RRH_C_U_PLANE_VLAN_TAG"]["RRH_U_PLANE_VLAN_TAG"]
		RRH_UL_INIT_SYM_ID.innerHTML = data["RRH_UL_INIT_SYM_ID"]
		RRH_MAX_PRB_TX.innerHTML = data["RRH_MAX_PRB-TX"]
		RRH_MAX_PRB_RX.innerHTML = data["RRH_MAX_PRB-RX"]
	} catch (error) {
		let noData = "no data"
		Band.innerHTML = noData
		SyncStatus.innerHTML = noData
		PTPProfile.innerHTML = noData
		RRH_TX_ATTENUATION.innerHTML = noData
		RRH_RX_ATTENUATION.innerHTML = noData
		RRH_LO_FREQUENCY_KHZ.innerHTML = noData
		RRH_C_PLANE_VLAN_TAG.innerHTML = noData
		RRH_U_PLANE_VLAN_TAG.innerHTML = noData
		RRH_UL_INIT_SYM_ID.innerHTML = noData
		RRH_MAX_PRB_TX.innerHTML = noData
		RRH_MAX_PRB_RX.innerHTML = noData

	}
}

getInfo();