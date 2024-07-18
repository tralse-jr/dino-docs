export const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
export const routePathRegex =
  /^\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+)*\/?$/;
export const dinoDocsBodyRegex =
  /^\{([^{}]*)\}\s*([\w.\[\]]+)\s*(?:-\s*([^()]*))?\s*(\([^)]*\))?$/;
