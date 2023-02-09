class api {
  constructor() {
    this.host = "http://192.168.0.101:8000";
  }

  async logIn(data) {
    let url = this.host + "/account/login/";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        } else {
          let response = {
            state: true,
            data: await res.json(),
          };
          return response;
        }
      })
      .catch(async (err) => {
        let res = {
          state: false,
        };
        try {
          res["data"] = JSON.parse(err?.message)["message"];
        } catch (error) {
          res["data"] = String(err);
        }
        return res;
      });
  }
}

export { api };
