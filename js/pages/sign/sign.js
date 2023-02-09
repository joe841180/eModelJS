
async function main(params) {
  // 取json
  let test = {
    request: "get",
    type: "json",
    body: {}
  }
  let getServerJson = await get(test)

  let setGlobalData = {
    "serverJson": (checkSus(getServerJson)) ? getServerJson["body"]["data"] : {}
  }

  console.log(setGlobalData);
  console.log(checkSus(getServerJson));

}

main();

window.onload = function () {
};