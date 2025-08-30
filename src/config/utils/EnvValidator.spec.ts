import { EnvError, EnvValidator, envValidator } from './env-validator';

describe('EnvValidator', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // сбрасываем кеш модулей
    process.env = { ...OLD_ENV }; // клонируем окружение
  });

  afterAll(() => {
    process.env = OLD_ENV; // восстанавливаем окружение
  });

  describe('getEnvString', () => {
    it('должен вернуть строку, если переменная существует', () => {
      process.env.TEST_VAR = 'hello';
      expect(envValidator.getEnvString('TEST_VAR')).toBe('hello');
    });

    it('должен выбросить ошибку, если переменной нет', () => {
      delete process.env.TEST_VAR;
      expect(() => envValidator.getEnvString('TEST_VAR')).toThrow(EnvError);
    });

    it('должен триммить значение', () => {
      process.env.TEST_VAR = '  hello  ';
      expect(envValidator.getEnvString('TEST_VAR')).toBe('hello');
    });
  });

  describe('getEnvNumber', () => {
    it('должен вернуть число', () => {
      process.env.NUM_VAR = '42';
      expect(envValidator.getEnvNumber('NUM_VAR')).toBe(42);
    });

    it('должен кинуть ошибку при NaN', () => {
      process.env.NUM_VAR = 'not-a-number';
      expect(() => envValidator.getEnvNumber('NUM_VAR')).toThrow(EnvError);
    });
  });

  describe('getEnvBoolean', () => {
    it.each(EnvValidator.TRUE_VALUES)('должен вернуть true для "%s"', (val) => {
      process.env.BOOL_VAR = val;
      expect(envValidator.getEnvBoolean('BOOL_VAR')).toBe(true);
    });

    it.each(EnvValidator.FALSE_VALUES)(
      'должен вернуть false для "%s"',
      (val) => {
        process.env.BOOL_VAR = val;
        expect(envValidator.getEnvBoolean('BOOL_VAR')).toBe(false);
      },
    );

    it('должен кинуть ошибку для неправильного значения', () => {
      process.env.BOOL_VAR = 'maybe';
      expect(() => envValidator.getEnvBoolean('BOOL_VAR')).toThrow(EnvError);
    });
  });

  describe('getEnvEnum', () => {
    const values = ['one', 'two', 'three'] as const;

    it('должен вернуть значение, если оно входит в enum', () => {
      process.env.ENUM_VAR = 'two';
      expect(envValidator.getEnvEnum('ENUM_VAR', values)).toBe('two');
    });

    it('должен кинуть ошибку, если значение не входит в enum', () => {
      process.env.ENUM_VAR = 'four';
      expect(() => envValidator.getEnvEnum('ENUM_VAR', values)).toThrow(
        EnvError,
      );
    });
  });

  describe('defaults', () => {
    it('getEnvStringDefault должен вернуть дефолт при отсутствии', () => {
      expect(envValidator.getEnvStringDefault('NO_VAR', 'default')).toBe(
        'default',
      );
    });

    it('getEnvNumberDefault должен вернуть дефолт при отсутствии', () => {
      expect(envValidator.getEnvNumberDefault('NO_VAR', 123)).toBe(123);
    });

    it('getEnvBooleanDefault должен вернуть дефолт при отсутствии', () => {
      expect(envValidator.getEnvBooleanDefault('NO_VAR', true)).toBe(true);
    });

    it('getEnvEnumDefault должен вернуть дефолт при отсутствии', () => {
      const values = ['a', 'b', 'c'] as const;
      expect(envValidator.getEnvEnumDefault('NO_VAR', values, 'b')).toBe('b');
    });
  });
});
