export const isObject = <Return extends Record<string, unknown>>(
  value: unknown,
): value is Return => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return true;
  }

  return false;
};
