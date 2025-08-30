class EnvError extends Error {
  constructor(message: string) {
    super(`[ENV ERROR]: ${message}, пожалуйста заполните настройку в .env`);
  }
}

class EnvValidator {
  static readonly TRUE_VALUES = ['1', 'true', 'yes', 'enabled'];
  static readonly FALSE_VALUES = ['0', 'false', 'no', 'disabled'];

  private isEnvValueEmpty(value: unknown): value is undefined | null | '' {
    return value === undefined || value === null || value === '';
  }

  private getEnvVar(name: string): string {
    const value = process.env[name];

    if (this.isEnvValueEmpty(value)) {
      throw new EnvError(`переменная ${name} является обязательной`);
    }

    return value.trim();
  }

  public getEnvString(name: string): string {
    return this.getEnvVar(name);
  }

  public getEnvNumber(name: string): number {
    const value = this.getEnvVar(name);
    const numbered = Number(value);

    if (Number.isNaN(numbered)) {
      throw new EnvError(
        `переменная ${name} должна быть числовой, но получено ${JSON.stringify(value)}`,
      );
    }

    return numbered;
  }

  public getEnvBoolean(name: string): boolean {
    const value = this.getEnvVar(name).toLowerCase();

    const isTrue = EnvValidator.TRUE_VALUES.includes(value);

    if (isTrue) {
      return true;
    }

    const isFalse = EnvValidator.FALSE_VALUES.includes(value);

    if (isFalse) {
      return false;
    }

    throw new EnvError(
      `переменная ${name} должна быть из (${EnvValidator.TRUE_VALUES.join(', ')}, ${EnvValidator.FALSE_VALUES.join(', ')}), но получено ${JSON.stringify(value)}`,
    );
  }

  public isEnum<T extends string>(value: string, enums: T[]): value is T {
    return enums.includes(value as T);
  }

  public getEnvEnum<T extends string>(name: string, enums: T[]): T {
    const value = this.getEnvVar(name);

    if (!this.isEnum(value, enums)) {
      throw new EnvError(
        `переменная ${name} должна быть из ${enums.join(', ')}, но получено ${JSON.stringify(value)}`,
      );
    }

    return value;
  }

  private withDefault<T>(name: string, getter: () => T, defaultValue: T): T {
    const value = process.env[name];

    if (this.isEnvValueEmpty(value)) {
      return defaultValue;
    }

    return getter();
  }

  public getEnvStringDefault(name: string, defaultValue: string) {
    return this.withDefault(name, () => this.getEnvString(name), defaultValue);
  }

  public getEnvNumberDefault(name: string, defaultValue: number): number {
    return this.withDefault(name, () => this.getEnvNumber(name), defaultValue);
  }

  public getEnvBooleanDefault(name: string, defaultValue: boolean): boolean {
    return this.withDefault(name, () => this.getEnvBoolean(name), defaultValue);
  }

  public getEnvEnumDefault<T extends string>(
    name: string,
    enums: T[],
    defaultValue: T,
  ): T {
    return this.withDefault(
      name,
      () => this.getEnvEnum(name, enums),
      defaultValue,
    );
  }
}

export const envValidator = new EnvValidator();
