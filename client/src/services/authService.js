import Http from "./httpService";
import config from "../config.json";
import jwtDecode from "jwt-decode";
import Token from "./tokenService";

Http.setJwt(getJwt());

export async function loginUser(obj) {
  try {
    const { data } = await Http.post(config.apiEndPoint + "/auth/login", obj);
    console.log(data);
    if (!!data.success)
      Token.set(data.result.jwtToken);

  } catch (erroe) {
    console.log(erroe)
  }

}

export function logOut() {
  Token.del();
}

export function getCurrentUser() {
  try {
    const jwt = getJwt();
    //console.log(jwt);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function getJwt() {
  return Token.get();
}

export async function regUser(data) {
  try {
    await Http.post(config.apiEndPoint + "/auth/register", data);
  } catch (ex) {
    return ex;
  }
  //login if success hapend
}

// export async function UpdateUser(id, data) {
//   return await Http.put(config.apiEndPoint+"/employee/"+id, data);
// }

export default {
  loginUser,
  logOut,
  getCurrentUser,
  getJwt,
  regUser,
};
