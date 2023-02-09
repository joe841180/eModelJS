import { getCookie, setCookie, getUrlData } from "../../module/globalSettings.js"
import { confirmCancelDialog, warnRanUpDialog } from "../../module/dialog.js";
import { api, checkSus } from "../../restfulApi.js";

const ruRebootEl = document.querySelector("#ruReboot")
let serverIp = await getCookie("serverIp")
let urlData = getUrlData()
let currentPage = urlData?.pg == undefined ? alert("no page") : urlData.pg
let ruNum = currentPage.replace("RU", "").split("-") //RU號碼
let ranIp = serverIp["RAN"][`RAN${ruNum[0]}`] //RAN IP

const checkServer = async () => {
	let oamApi = new api(currentPage)
	await oamApi.getIP()
	let resRanStatus = await oamApi.ranStatus();
	console.log(resRanStatus);
	// resRanStatus["data"] = "5G system is UP"
	if (resRanStatus["state"] && !resRanStatus["data"].includes("5G system is UP")) return true
	else return false
}

ruRebootEl.addEventListener("click", async () => {
	let setTxt = {
		"title": "Reboot RU",
		"content": `Are you sure you want to reboot RU now?`,
		"confirm": "Reboot"
	}
	console.log("currentPage:" + currentPage);

	confirmCancelDialog(setTxt, async (result) => {
		if (!result.isConfirmed) return Swal.close();
		if (await checkServer()) {
			try {
				console.log("RU-PORT:" + `83${ruNum[1]}`);
				console.log(`RAN${ruNum[0]}-IP:` + ranIp);

				let res = await get({
					"type": "sshpass",
					"request": "rebootRU",
					"body": {
						"port": `83${ruNum[1]}`,
						"ip": ranIp,
					},
				})
				console.log(res);
				if (!checkSus(res)) throw "sshpass fail"
			} catch (error) {
				let setTxt = {
					"title": "Reboot RU fail.",
					"content": String(error)
				}
				warnRanUpDialog(setTxt, () => { });
			}
		}
		else {
			let setTxt = {
				"title": "RAN service is up.",
				"content": `Please stop RAN Service before reboot RU.`
			}
			warnRanUpDialog(setTxt, () => { });
		}
	});
})
