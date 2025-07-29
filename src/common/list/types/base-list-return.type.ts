export type BaseListReturn<T extends Record<string, any>> = {
  items: T[];
  total: number;
};
