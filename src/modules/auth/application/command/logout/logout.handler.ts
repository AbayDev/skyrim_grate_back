import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { UserSessionService } from '../../service/user-session.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private userSessionService: UserSessionService) {}

  execute(command: LogoutCommand): Promise<void> {
    return this.userSessionService.endSession(
      command.userId,
      command.refreshToken,
    );
  }
}
