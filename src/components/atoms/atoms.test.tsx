import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MembersProvider } from '../../members.js';
import { Avatar } from './Avatar.js';
import { Button } from './Button.js';
import { NameFlow } from './NameFlow.js';
import { SegButton } from './SegButton.js';
import { Field } from './Field.js';
import { Board } from './Board.js';

describe('documented behavior', () => {
  it.each(['primary', 'secondary', 'ghost'] as const)('blocks disabled %s button clicks', (variant) => {
    const onClick = vi.fn();
    render(<Button variant={variant} disabled onClick={onClick}>확인</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('uses member order to wrap avatar colors after six entries', () => {
    const members = Object.fromEntries(Array.from({ length: 7 }, (_, index) => [`id${index}`, { id: `id${index}`, name: `멤버${index}` }]));
    render(<MembersProvider members={members}><Avatar id="id0" /><Avatar id="id6" size="sm" dimmed /></MembersProvider>);
    expect(screen.getByLabelText('멤버0')).toHaveStyle('--avatar-bg: var(--user-1)');
    expect(screen.getByLabelText('멤버6')).toHaveStyle('--avatar-bg: var(--user-1)');
    expect(screen.getByLabelText('멤버6')).toHaveClass('avatar--sm', 'avatar--dimmed');
  });

  it('renders no name list for empty ids without requiring member data', () => {
    const { container } = render(<NameFlow ids={[]} suffix="님" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows only requested member names and the deadline in a clickable board', () => {
    const onClick = vi.fn();
    render(<MembersProvider members={{ dan: { id: 'dan', name: '댄' }, mara: { id: 'mara', name: '마라' } }}>
      <Board waiting={['mara', 'dan']} suffix="님 확인이 필요해요" deadline="오늘 18:00" onClick={onClick} />
    </MembersProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('마라, 댄님 확인이 필요해요오늘 18:00');
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports controlled keyboard selection and focus in the response group', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SegButton value="ok" onChange={onChange} />);
    const ok = screen.getByRole('radio', { name: '가능' });
    const hard = screen.getByRole('radio', { name: '어려움' });
    ok.focus();
    fireEvent.keyDown(ok, { key: 'ArrowRight' });
    expect(hard).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('hard');
    rerender(<SegButton value="hard" onChange={onChange} />);
    expect(hard).toHaveAttribute('aria-checked', 'true');
    expect(hard).toHaveAttribute('tabindex', '0');
    expect(ok).toHaveAttribute('tabindex', '-1');
  });

  it('disables both response choices', () => {
    const onChange = vi.fn();
    render(<SegButton disabled onChange={onChange} />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
      fireEvent.click(radio);
      fireEvent.keyDown(radio, { key: 'ArrowRight' });
    }
    expect(onChange).not.toHaveBeenCalled();
  });

  it('hides field provenance when requested and calls the value action', () => {
    const onClick = vi.fn();
    render(<Field label="제목" value="개선안 회의" source="대화에서 읽었어요" showSource={false} onClick={onClick} />);
    expect(screen.queryByText('대화에서 읽었어요')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '제목' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
