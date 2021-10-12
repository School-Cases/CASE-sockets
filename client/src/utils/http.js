export const api_address = "http://localhost:5002";
export const client_address = "http://localhost:3000";

export const get = async (endpoint, signal) => {
  return await fetch(api_address + endpoint, {
    method: "GET",
    signal: signal,
  }).then((res) => res.json());
};

export const post = async (endpoint, data) => {
  return await fetch(api_address + endpoint, {
    method: "POST",
    // mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "http://localhost:3000",
      // "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(data),
    // body: data.json(),
  }).then((res) => {
    res.json();
    // console.log(res);
  });
};
