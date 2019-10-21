import http from "../Services/httpService";
import config from "../../config.json";

export function allProjects() {
  return http.get(config.ApiBackend + "/projects");
}

export function getProject(_id) {
  return http.get(config.ApiBackend + "/projects/" + _id);
}
export function deleteProject(_id) {
  return http.delete(config.ApiBackend + "/projects/" + _id);
}
