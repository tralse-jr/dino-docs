const sanitizeKey = (rawKey: string) => {
  const trimmedKey = rawKey.trim();
  const match = trimmedKey.match(/^\[(.*)\]$/);

  return {
    optional: Boolean(match),
    sanitized: match ? match[1] : trimmedKey,
  };
};

export { sanitizeKey };
