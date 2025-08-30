export class LogoutCommand {
  constructor(
    readonly userId: string,
    readonly refreshToken: string,
  ) {}
}
