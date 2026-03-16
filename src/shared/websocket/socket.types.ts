import type { Socket } from 'socket.io';

export type AppSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  AppSocketData
>;

type AppSocketData = {
  userId: string;
};
