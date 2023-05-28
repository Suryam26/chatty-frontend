// eslint-disable-next-line
import { AxiosRequestHeaders } from "axios";

export default function authHeader(): any {
  const localstorageUser = localStorage.getItem("user");
  if (!localstorageUser) {
    return {};
  }
  const user = JSON.parse(localstorageUser);
  if (user && user.token) {
    return { Authorization: `Token ${user.token}` };
  }
  return {};
}
