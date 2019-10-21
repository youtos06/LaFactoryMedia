import http from "./httpService";
import { ApiBackend } from "../../config.json";

const apiEndpoint = ApiBackend + "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.email,
    name: user.name,
    password: user.password,
    role: user.role
  });
}
export function getUsers() {
  return http.get(apiEndpoint);
}
export function getUser(_id) {
  return http.get(apiEndpoint + "/" + _id);
}

export function deleteUser(_id) {
  return http.delete(apiEndpoint + "/" + _id);
}

export async function forgetPassword(email) {
  return http.post(apiEndpoint + "/forgetPassword", {
    email: email
  });
}
export async function resetPassword(password, jwt) {
  //console.log(password);
  return http.post(apiEndpoint + "/forgetPassword/" + jwt, {
    password: password
  });
}
