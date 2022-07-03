import Http from "./httpService";
import config from "../config.json";
import Token from "./tokenService";

export async function searchUser(name) {
  try {
    const { data } = await Http.get(config.apiEndPoint + "/users/search/" + name);
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (erroe) {
    console.log(erroe);
    return [];
  }
}

export async function getUser(id) {
  try {
    const { data } = await Http.get(config.apiEndPoint + "/users/" + id);
    if (!!data.success)
      return data.result

  } catch (erroe) {
    console.log(erroe);
    return {};
  }
}

export async function getAdmins(name) {
  try {
    const { data } = await Http.get(config.apiEndPoint + "/users/admins");
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (erroe) {
    console.log(erroe);
    return [];
  }
}

export async function setAdmin(malliCode) {
  try {
    const { data } = await Http.put(config.apiEndPoint + "/users/setAdmin/" + malliCode);

  } catch (erroe) {
    console.log(erroe)
  }
}

export async function unSetAdmin(malliCode) {
  try {
    const { data } = await Http.put(config.apiEndPoint + "/users/unSetAdmin/" + malliCode);

  } catch (erroe) {
    console.log(erroe)
  }
}

export async function updateUser(id, obj) {
  try {
    const { data } = await Http.put(config.apiEndPoint + "/users/" + id, obj);
  } catch (erroe) {
    console.log(erroe)
  }

}

export default {
  searchUser,
  getAdmins,
  setAdmin,
  unSetAdmin,
  updateUser
};
