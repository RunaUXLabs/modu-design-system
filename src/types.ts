export type ResponseValue = 'ok' | 'hard';

export interface Slot {
  id?: string;
  day: string;
  date: string;
  time: string;
  room: string;
}

export interface Member {
  id: string;
  name: string;
  desc?: string;
  required?: boolean;
}
