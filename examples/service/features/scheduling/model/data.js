/* ============================================================
   시나리오 데이터 — 앱 내 '오늘'은 2026-07-09(목)로 고정.
   테스터가 언제 열어도 깨지지 않도록 실제 시계와 분리한다.
   ============================================================ */

export const TODAY_LABEL = '2026년 7월 9일 목요일';

export const MEMBERS = {
  runa: { id: 'runa', name: '루나', role: 'host', required: true, desc: '주최자 · 필참' },
  dan: { id: 'dan', name: '댄', role: 'member', required: true, desc: '필참' },
  mara: { id: 'mara', name: '마라', role: 'member', required: true, desc: '필참 · 수요일 외근' },
  jessie: { id: 'jessie', name: '제시', role: 'member', required: false, desc: '선택 참석' },
  bibi: { id: 'bibi', name: '비비', role: 'member', required: false, desc: '선택 참석' },
  william: { id: 'william', name: '윌리엄', role: 'member', required: false, desc: '선택 참석' },
};
// MEMBERS 각 항목에서 `color: '#...'` 필드 삭제 (아바타에서만 쓰였음)
export const MEMBER_IDS = Object.keys(MEMBERS);
export const REQUIRED_IDS = MEMBER_IDS.filter((id) => MEMBERS[id].required);
export const OPTIONAL_IDS = MEMBER_IDS.filter((id) => !MEMBERS[id].required);

/* 유저 아바타 컬러 — 6색을 인덱스로 round-robin 배정 (정체성 ≠ 색).
   DS: primitive/user/1~6 · CSS: --user-1~6 와 값 동기화. */
export const USER_COLORS = ['#3182f6', '#7048e8', '#0ca678', '#f59f00', '#e64980', '#495057'];
export const userColorVar = (i) => `var(--user-${(i % USER_COLORS.length) + 1})`;
export const userColorOf = (id) => userColorVar(MEMBER_IDS.indexOf(id));

/* 계층 1 — 시스템이 잠정 확정한 슬롯 */
export const PROPOSAL_SLOT = {
  id: 'tue13',
  day: '화요일',
  date: '7월 14일',
  time: '13:00 – 14:00',
  room: '회의룸 A',
};

/* 계층 2 — 조율 모드 후보 슬롯 (화 13:00 이의로 제외, 수요일은 마라 외근으로 소거) */
export const COORD_SLOTS = [
  { id: 'mon16', day: '월요일', date: '7월 13일', time: '16:00 – 17:00', room: '회의룸 B' },
  { id: 'thu15', day: '목요일', date: '7월 16일', time: '15:00 – 16:00', room: '회의룸 A' },
  { id: 'fri10', day: '금요일', date: '7월 17일', time: '10:00 – 11:00', room: '회의룸 C' },
];

/* 교집합 붕괴 시 '기간 넓히기'로 재산출되는 슬롯 (다다음 주) */
export const WIDENED_SLOTS = [
  { id: 'n_mon10', day: '월요일', date: '7월 20일', time: '10:00 – 11:00', room: '회의룸 A' },
  { id: 'n_wed14', day: '수요일', date: '7월 22일', time: '14:00 – 15:00', room: '회의룸 B' },
];

/* 캘린더 연동 프리셋 — '확정'이 아닌 '제안'. 응답 시트에 미리 채워지고 확인 탭을 요구한다 (FGI F8) */
export const CALENDAR_PRESET = {
  runa: { mon16: 'ok', thu15: 'ok', fri10: 'ok', n_mon10: 'ok', n_wed14: 'ok' },
  dan: { mon16: 'hard', thu15: 'ok', fri10: 'ok', n_mon10: 'ok', n_wed14: 'ok' },
  mara: { mon16: 'hard', thu15: 'ok', fri10: 'hard', n_mon10: 'ok', n_wed14: 'ok' },
  jessie: { mon16: 'hard', thu15: 'ok', fri10: 'ok', n_mon10: 'ok', n_wed14: 'ok' },
  bibi: { mon16: 'ok', thu15: 'ok', fri10: 'hard', n_mon10: 'ok', n_wed14: 'ok' },
  william: { mon16: 'ok', thu15: 'ok', fri10: 'ok', n_mon10: 'ok', n_wed14: 'ok' },
};

/* ============================================================
   기본 행동 — "테스터가 건드리지 않은 팀원만 기본 행동을 수행한다"
   테스터가 해당 팀원으로 어떤 행동이든 하면 그 팀원의 기본 행동은 취소된다.
   ============================================================ */
export const DEFAULTS = {
  /* T0 → 진행: 잠정 확정에 대한 반응 */
  proposal: {
    mara: { type: 'ok' },
    bibi: { type: 'objection', reason: '점심 직후는 어려워요' },
    /* 댄·제시·윌리엄: 침묵 (댄은 필참이라 확인 필요 → 에스컬레이션 경로) */
  },
  /* 조율 모드 진입 시(T1): 빠른 응답자들 */
  coordEnter: {
    jessie: { mon16: 'hard', thu15: 'ok', fri10: 'ok' },
    bibi: { mon16: 'ok', thu15: 'ok', fri10: 'hard' },
  },
  /* T1 → T2: 마라의 유동적 양보 (집계를 보고 목요일로 합류) */
  coordT2: {
    mara: { mon16: 'hard', thu15: 'ok', fri10: 'hard' },
  },
  /* 재요청 후 댄의 응답 */
  danAfterRerequest: { mon16: 'hard', thu15: 'ok', fri10: 'ok' },
};

export const STAGES = [
  { key: 'T0', label: 'T0', title: '생성 · 잠정 확정', desc: '주최자가 조건을 정하면 시스템이 시간을 골라 잠정 확정. 침묵은 동의로.' },
  { key: 'T1', label: 'T1', title: '조율 모드', desc: '이의 발생 → 후보 조율로 전환 (폴백)' },
  { key: 'T2', label: 'T2', title: '마감 임박', desc: '미응답자에게만 타겟 푸시' },
  { key: 'T3', label: 'T3', title: '마감 이후', desc: '무응답 처리: 선택→불참, 필참→에스컬레이션' },
];

export const COMPOSE_HINT =
  '루나 시점에서 [회의 만들기]로 필참자를 직접 정해보세요. 그냥 시간을 진행하면 기본 조건(댄·마라 필참)으로 자동 생성돼요.';

export const HINTS = {
  0: '비비로 전환해 [어려워요]를 눌러보거나, 그대로 시간을 진행해보세요.',
  1: '팀원을 전환해 직접 응답해보세요. 응답하지 않은 팀원은 시간이 지나면 각자의 사정대로 움직여요.',
  2: '댄과 윌리엄이 아직 무응답이에요. 시간을 진행해 마감을 넘겨보세요.',
  3: '루나로 전환해 현황판에서 마무리하세요. 필참자와 선택 참석자의 무응답은 다르게 처리돼요.',
};

/* ============================================================
   회의 메타 초기값 — 시스템이 대화·캘린더를 읽고 미리 채운 값.
   '어디서 왔는지'를 반드시 함께 보여준다 (프로비넌스 라이팅).
   ============================================================ */
export const MEETING_DEFAULT = {
  title: '다음 주 개선안 회의',
  duration: '1시간',
  period: '7/13(월) – 7/17(금)',
  deadline: '7/10(금) 18:00',
};

export const MEETING_FIELDS = [
  {
    key: 'title',
    label: '제목',
    type: 'text',
    source: '이 채팅방의 대화에서 “개선안 논의”를 읽고 적어뒀어요',
  },
  {
    key: 'duration',
    label: '길이',
    type: 'select',
    options: ['30분', '1시간', '90분'],
    source: '루나님이 “한 시간 잡을게요”라고 하셨어요',
  },
  {
    key: 'period',
    label: '기간',
    type: 'select',
    options: ['7/13(월) – 7/17(금)', '7/20(월) – 7/24(금)'],
    source: '“다음 주”라고 하셔서 다음 주 평일로 잡았어요',
  },
  {
    key: 'deadline',
    label: '응답 마감',
    type: 'select',
    options: ['7/10(금) 18:00', '7/13(월) 10:00'],
    source: '회의 전날까지 하루 여유가 남도록 정했어요',
  },
];

export const REQUIRED_SOURCE =
  '개선안 스레드에 참여한 댄, 마라님을 필참으로 제안해뒀어요 — 눌러서 바꿀 수 있어요';

/* 채팅방 분위기용 고정 메시지 */
export const INTRO_MESSAGES = [
  { from: 'jessie', text: '지난주 리서치 정리본 공유드렸어요! 확인 부탁드려요 🙌' },
  { from: 'dan', text: '확인했어요. 개선안 논의는 모여서 하는 게 좋겠네요.' },
  { from: 'runa', text: '좋아요, 다음 주에 한 시간 잡을게요.' },
];

/* 버블 게시 이후의 대화 — 제안이 대화에 밀려 올라가는 현실 재현.
   그래서 버블은 확정 전까지 상단에 핀으로 고정된다 (딥리서치 2.1) */
export const TRAILING_MESSAGES = [
  { from: 'mara', text: '아 맞다, 지난 워크숍 사진 정리해서 올릴게요 📸' },
  { from: 'jessie', text: '오 좋아요, 기대돼요 ㅎㅎ' },
];
