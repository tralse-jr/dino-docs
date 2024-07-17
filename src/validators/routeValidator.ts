const isValidRoutePath = (path: string) => {
  const routePathRegex =
    /^\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+)*\/?$/;
  return routePathRegex.test(path);
};

export { isValidRoutePath };
