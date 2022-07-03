import Http from "./httpService";
import config from "../config.json";
import Token from "./tokenService";
import { getCurrentUser } from "./authService"

async function getData(id) {
  try {
    const { data } = await Http.get(config.apiEndPoint + "/elections" + (!!id ? `/${id}` : ""));
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
    return [];
  }

}

export function getElections() {
  return getData("");
}

export function getElectionById(id) {
  return getData(id);
}
export async function getActiveElections(id) {
  try {
    const { data } = await Http.get(config.apiEndPoint + "/elections/actives");
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
    return [];
  }

}

export async function vote(id, condidates) {
  try {
    var userId = getCurrentUser()._id;
    const { data } = await Http.post(config.apiEndPoint + "/vote/" + id, { condidates, userId });
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
  }
}

export async function addElection(electionData) {
  try {
    const { data } = await Http.post(config.apiEndPoint + "/elections", { ...electionData });
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
  }
}

export async function editElection(id, electionData) {
  try {
    const { data } = await Http.put(config.apiEndPoint + "/elections/" + id, { ...electionData });
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
  }
}


export async function deleteElection(id) {
  try {
    const { data } = await Http.delete(config.apiEndPoint + "/elections/" + id);
    console.log(data);
    if (!!data.success)
      return data.result

  } catch (error) {
    console.log(error);
  }
}

export default {
  getElections,
  getElectionById,
  editElection,
  getActiveElections,
  deleteElection,
  vote
};
