// src/common/utils/__tests__/is-object.spec.ts
import { isObject } from './is-object';

describe('isObject', () => {
  it('должен вернуть true для простого объекта', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it('должен вернуть false для null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('должен вернуть false для массива', () => {
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('должен вернуть false для примитивов', () => {
    expect(isObject(123)).toBe(false);
    expect(isObject('строка')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(Symbol('s'))).toBe(false);
  });

  it('должен вернуть true для объектов, созданных через class', () => {
    class TestClass {
      a = 5;
    }
    expect(isObject(new TestClass())).toBe(true);
  });
});
