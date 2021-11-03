export const removeUserFromUsersOnline = (item, array) => {
  let arr = [];
  array.forEach((el) => {
    if (item !== el) {
      arr.push(el);
    }
  });
  return arr;
};

export const getValueFromKey = (url, key) => {
  let parts = url.split("?");
  if (parts.length === 0) {
    return;
  }

  let pairs = parts[1].split("&");
  for (let i = 0; i < pairs.length; i++) {
    let parts = pairs[i].split("=");
    if (parts[0] === key) {
      return parts[1];
    }
  }
  return;
};
