import Http from "./httpService";
import config from "../config.json";
import Token from "./tokenService";

export async function getCondidateById(id) {
  try {
    const { data } = await Http.get(config.apiEndPoint + "/condidates/" + id);
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (erroe) {
    console.log(erroe);
    return [];
  }
}

export async function addCondid(condidData) {
  try {
    const { data } = await Http.post(config.apiEndPoint + "/condidates", { ...condidData });
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
  }
}

export async function editCondid(id, condidData) {
  try {
    const { data } = await Http.put(config.apiEndPoint + "/condidates/" + id, { ...condidData });
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
  }
}

export async function deleteCondid(id) {
  try {
    const { data } = await Http.delete(config.apiEndPoint + "/condidates/" + id);
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
  }
}

export default {
  getCondidateById,
  addCondid,
  editCondid,
  deleteCondid
};
