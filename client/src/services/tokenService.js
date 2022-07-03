import jwtDecode from "jwt-decode";

export function set(jwt) {
  localStorage.setItem("token", jwt);
}

export function del() {
  localStorage.removeItem("token");
}

export function get() {
  var token = localStorage.getItem("token");
  return token ? token : "";
}

export function decodeToken() {
  var token = get("token");
  if (!!token) {
    var user = jwtDecode(token);
    console.log(user);
    return user
  } else {
    return null;
  }
}

export default {
  del,
  get,
  set,
  decodeToken
}