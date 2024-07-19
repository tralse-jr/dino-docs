export enum Methods {
  get = "get",
  post = "post",
  put = "put",
  patch = "patch",
  delete = "delete",
}

export const isValidMethod = (method: string) => {
  const parsedMethod = method.toLowerCase();
  return Object.keys(Methods).find((method) => parsedMethod === method);
};
