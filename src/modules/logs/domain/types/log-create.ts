import { LogProps } from './log-props';

export type LogCreate = Omit<LogProps, 'id' | 'createdAt'>;
