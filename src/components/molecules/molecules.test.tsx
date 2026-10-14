// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { cleanup, fireEvent, render as renderComponent, screen } from '@testing-library/react';
import { MembersProvider } from '../../members.js';
import type { Slot } from '../../types.js';
import { MatrixRow } from './MatrixRow.js';
import { MatrixTable } from './MatrixTable.js';
import { SlotCard } from './SlotCard.js';
import { StageTrack } from './StageTrack.js';

const members = {
  dan: { id: 'dan', name: '댄', required: true },
  jessie: { id: 'jessie', name: '제시', required: false },
};

function render(ui: ReactElement) {
  return renderComponent(ui, {
    wrapper: ({ children }) => <MembersProvider members={members}>{children}</MembersProvider>,
  });
}

afterEach(cleanup);

const slot: Slot & { id: string } = {
  id: 'mon16', day: '월요일', date: '7월 13일', time: '16:00 – 17:00', room: '회의룸 B',
};
const slots = [
  slot,
  { ...slot, id: 'thu15', day: '목요일', time: '15:00 – 16:00' },
  { ...slot, id: 'fri10', day: '금요일', time: '10:00 – 11:00' },
];

describe('SlotCard', () => {
  it('renders the reserved hero slot without response controls', () => {
    const { container } = render(<SlotCard slot={slot} variant="hero" />);
    expect(container.firstElementChild?.className).toBe('slotcard slotcard--hero');
    expect(screen.getByText('회의룸 B 예약됨')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.querySelector('.slotcard__gauge')).toBeNull();
  });

  it('forwards response choices and updates only when the parent supplies a value', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <SlotCard slot={slot} variant="respond" myValue="ok" preset onChange={onChange} />,
    );
    expect(container.firstElementChild?.classList.contains('slotcard--preset')).toBe(true);
    expect(screen.getByText('캘린더 기준 제안 — 확인해주세요')).toBeTruthy();
    fireEvent.click(screen.getByText('어려움'));
    expect(onChange).toHaveBeenCalledWith('hard');
    expect(container.querySelector('.seg__item--ok')?.textContent).toBe('가능');
    rerender(<SlotCard slot={slot} variant="respond" myValue="hard" onChange={onChange} />);
    expect(container.querySelector('.seg__item--hard')?.textContent).toBe('어려움');
    expect(container.querySelector('.slotcard--preset')).toBeNull();
    fireEvent.click(screen.getByText('가능'));
    expect(onChange).toHaveBeenLastCalledWith('ok');
  });

  it('defaults to a clickable tally and keeps personal state separate from the team gauge', () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <SlotCard slot={slot} okCount={4} total={6} myValue="hard" best onClick={onClick} />,
    );
    expect(screen.getByText('지금 1순위')).toBeTruthy();
    expect(container.querySelector('.chip--danger')?.textContent).toBe('어려워요');
    expect(container.querySelector<HTMLElement>('.slotcard__gauge i')?.style.width).toBe('67%');
    expect(screen.getByText('팀원 4명이 가능하대요')).toBeTruthy();
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<SlotCard slot={slot} okCount={0} total={0} myValue="ok" />);
    expect(container.querySelector<HTMLElement>('.slotcard__gauge i')?.style.width).toBe('0%');
    expect(screen.getByText('아직 응답을 모으는 중이에요')).toBeTruthy();
    expect(container.querySelector('.chip--success')?.textContent).toBe('가능해요');
    expect(screen.queryByText('지금 1순위')).toBeNull();
    rerender(<SlotCard slot={slot} okCount={0} total={6} />);
    expect(container.querySelector('.slotcard__meta')?.textContent).toBe('');
  });
});

describe('Matrix', () => {
  it('maps responses to original marks and uses absence only for unanswered cells', () => {
    const { container, rerender } = render(
      <MatrixRow id="dan" slots={slots} responses={{ mon16: 'ok', thu15: 'hard' }} />,
    );
    const cells = () => Array.from(container.querySelectorAll('.matrix__cell'));
    expect(cells().map((cell) => cell.textContent)).toEqual(['✓', '✕', '–']);
    expect(cells().map((cell) => cell.className)).toEqual([
      'matrix__cell matrix__cell--ok', 'matrix__cell matrix__cell--hard', 'matrix__cell matrix__cell--none',
    ]);
    expect(container.querySelector('.matrix__role--req')?.textContent).toBe('필');
    rerender(
      <MatrixRow id="dan" slots={slots} responses={{ mon16: 'ok', thu15: 'hard' }} required={false} absent />,
    );
    expect(cells().map((cell) => cell.textContent)).toEqual(['✓', '✕', '불참']);
    expect(cells()[2].classList.contains('matrix__cell--none')).toBe(true);
    expect(container.querySelector('.matrix__role')?.textContent).toBe('선');
    expect(container.querySelector('.matrix__role--req')).toBeNull();
  });

  it('renders supplied order, header labels and controlled table updates', () => {
    const { container, rerender } = render(
      <MatrixTable slots={slots} memberIds={['jessie', 'dan']} responses={{ jessie: { mon16: 'hard' } }} />,
    );
    expect(container.firstElementChild?.className).toBe('matrix matrix--table');
    expect(Array.from(container.querySelectorAll('.matrix__cell--head'), (cell) => cell.textContent))
      .toEqual(['월 16:00', '목 15:00', '금 10:00']);
    const rows = () => Array.from(container.querySelectorAll('.matrix__row:not(.matrix__row--head)'));
    expect(rows().map((row) => row.querySelector('.matrix__nametext')?.textContent)).toEqual(['제시선', '댄필']);
    expect(rows()[0].querySelector('.matrix__cell--hard')?.textContent).toBe('✕');
    rerender(
      <MatrixTable slots={[slots[1], slots[0]]} memberIds={['dan', 'jessie']}
        responses={{ dan: { thu15: 'ok' } }} requiredIds={[]} outMembers={['jessie']} />,
    );
    expect(rows().map((row) => row.querySelector('.matrix__nametext')?.textContent)).toEqual(['댄선', '제시선']);
    expect(Array.from(rows()[0].querySelectorAll('.matrix__cell'), (cell) => cell.textContent)).toEqual(['✓', '–']);
    expect(Array.from(rows()[1].querySelectorAll('.matrix__cell'), (cell) => cell.textContent)).toEqual(['불참', '불참']);
  });
});

describe('StageTrack', () => {
  it.each([0, 1, 2, 3] as const)('maps phase %i to past, now and default pills', (phase) => {
    const { container } = render(<StageTrack phase={phase} />);
    expect(container.firstElementChild?.className).toBe('judge__stages');
    const pills = Array.from(container.querySelectorAll('.judge__stage'));
    expect(pills.map((pill) => pill.textContent)).toEqual(['T0', 'T1', 'T2', 'T3']);
    expect(pills).toHaveLength(4);
    pills.forEach((pill, index) => {
      expect(pill.classList.contains('judge__stage--now')).toBe(index === phase);
      expect(pill.classList.contains('judge__stage--past')).toBe(index < phase);
    });
  });
});
