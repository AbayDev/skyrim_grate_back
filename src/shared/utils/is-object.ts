export const isObject = <Return extends Record<string, unknown>>(
  value: unknown,
): value is Return => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
