// export const api_address = "http://localhost:5002";
// export const client_address = "http://localhost:3000";
// export const ws_address = "ws://localhost:5002";
export const ws_address = "wss://chatwskul.herokuapp.com";
export const api_address = "https://chatwskul.herokuapp.com";
export const client_address = "https://chatwskul.herokuapp.com";
// export const api_address = "192.168.222.178:5002";
// export const client_address = "192.168.222.178:3000";

export const get = async (endpoint, signal) => {
  return await fetch(api_address + endpoint, {
    method: "GET",
    signal: signal,
    headers: {
      authorization: localStorage.getItem("token") || "",
    },
  }).then((res) => res.json());
};

export const post = async (endpoint, data) => {
  console.log(data);
  return await fetch(api_address + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token") || "",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
