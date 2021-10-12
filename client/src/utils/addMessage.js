export function addMessage(user, message, date) {
  // to do: validate arguments...

  // template clone
  let tpl = document.querySelector("#message").cloneNode(true);
  tpl = tpl.content;
  tpl.querySelector("span").textContent = user;
  tpl.querySelector("p").textContent = message;
  tpl.querySelector("time").textContent = formatDate(date);
  tpl.querySelector("time").setAttribute("datetime", date.toISOString());

  return document.body.querySelector("#conversation").append(tpl);
}

/**
 * get datetime in HH:MM:ss
 *
 * @export
 * @param {*} date
 * @return {*}
 */
export function formatDate(date) {
  if (date instanceof Date !== true) {
    return "";
  }

  // pad leading 0
  let hours = date.getHours();
  hours = hours < 10 ? "0" + hours : hours;

  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let seconds = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // HH:MM:ss
  return hours + ":" + minutes + ":" + seconds;
}
