import type { Member, MatrixSlot, MatrixResponses } from '@design-system';

// Preview data only; the package never imports this module.
export const members: Record<string, Member> = {
  runa: { id: 'runa', name: '루나', required: true, desc: '주최자' },
  dan: { id: 'dan', name: '댄', required: true, desc: '필참' },
  mara: { id: 'mara', name: '마라', required: true, desc: '필참 · 수요일 외근' },
  jessie: { id: 'jessie', name: '제시', required: false, desc: '선택 참석' },
  bibi: { id: 'bibi', name: '비비', required: false, desc: '선택 참석' },
  william: { id: 'william', name: '윌리엄', required: false, desc: '선택 참석' },
};
export const memberIds = Object.keys(members).slice(0, 6);
export const slots: MatrixSlot[] = [
  { id: 'mon16', day: '월요일', date: '7월 13일', time: '16:00 – 17:00', room: '회의룸 B' },
  { id: 'thu15', day: '목요일', date: '7월 16일', time: '15:00 – 16:00', room: '회의룸 A' },
  { id: 'fri10', day: '금요일', date: '7월 17일', time: '10:00 – 11:00', room: '회의룸 C' },
];
export const responses: Record<string, MatrixResponses> = {
  runa: { mon16: 'ok', thu15: 'ok', fri10: 'ok' },
  dan: { mon16: 'hard', thu15: 'ok' },
  mara: { mon16: 'hard', thu15: 'ok', fri10: 'hard' },
  jessie: { mon16: 'hard', thu15: 'ok', fri10: 'ok' },
  bibi: { mon16: 'ok', thu15: 'ok', fri10: 'hard' },
};

export function guide(file: string, summary: string) {
  return `${summary}\n\n[디자인 가이드라인](./guidelines/${file})\n\n가이드의 Source와 코드 발췌는 서비스의 설계 근거입니다. 현재 내부 모듈 API는 아래 Controls 및 타입 정의를 기준으로 확인합니다.`;
}
