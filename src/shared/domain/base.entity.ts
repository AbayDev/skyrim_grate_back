export abstract class BaseEntity<Props extends Record<string, any>> {
  constructor(protected props: Props) {}

  public toPrimitives() {
    return {
      ...this.props,
    };
  }
}
