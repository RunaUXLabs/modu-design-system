import type { MouseEventHandler } from 'react';
import type { Slot, ResponseValue } from '../../types.js';
import { Chip } from '../atoms/Chip.js';
import { SegButton } from '../atoms/SegButton.js';

export type SlotCardProps = { slot: Slot } & (
  | { variant: 'hero' }
  | {
      variant: 'respond';
      myValue?: ResponseValue;
      preset?: boolean;
      onChange: (value: ResponseValue) => void;
    }
  | {
      variant?: 'tally';
      okCount: number;
      total: number;
      myValue?: ResponseValue;
      best?: boolean;
      onClick?: MouseEventHandler<HTMLButtonElement>;
    }
);

export function SlotCard(props: SlotCardProps) {
  const { slot } = props;

  if (props.variant === 'hero') {
    return (
      <div className="slotcard slotcard--hero">
        <div className="slotcard__day">{slot.day}</div>
        <div className="slotcard__main">
          <span className="slotcard__date">{slot.date}</span>
          <span className="slotcard__time">{slot.time}</span>
        </div>
        <div className="slotcard__room">{slot.room} 예약됨</div>
      </div>
    );
  }

  if (props.variant === 'respond') {
    return (
      <div className={`slotcard slotcard--respond ${props.preset ? 'slotcard--preset' : ''}`}>
        <div className="slotcard__info">
          <span className="slotcard__date">{slot.day} {slot.date}</span>
          <span className="slotcard__time">{slot.time} · {slot.room}</span>
          {props.preset && (
            <span className="slotcard__presetlabel">캘린더 기준 제안 — 확인해주세요</span>
          )}
        </div>
        <SegButton value={props.myValue} onChange={props.onChange} />
      </div>
    );
  }

  const { okCount, total, myValue, best = false, onClick } = props;
  const gaugeText = okCount > 0 ? `팀원 ${okCount}명이 가능하대요` : '아직 응답을 모으는 중이에요';

  return (
    <button type="button" className="slotcard slotcard--tally" onClick={onClick}>
      {best && (
        <span className="slotcard__flag"><Chip tone="neutral">지금 1순위</Chip></span>
      )}
      <div className="slotcard__info">
        <span className="slotcard__date">{slot.day} {slot.date}</span>
        <span className="slotcard__time">{slot.time} · {slot.room}</span>
      </div>
      <div className="slotcard__meta">
        {myValue === 'ok' && <Chip tone="success">가능해요</Chip>}
        {myValue === 'hard' && <Chip tone="danger">어려워요</Chip>}
      </div>
      <span className="slotcard__gauge" aria-hidden="true">
        <i style={{ width: `${total ? Math.round(((okCount || 0) / total) * 100) : 0}%` }} />
        <em className="slotcard__gaugetext">{gaugeText}</em>
      </span>
    </button>
  );
}
