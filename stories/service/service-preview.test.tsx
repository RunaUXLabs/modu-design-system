import { StrictMode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ServicePreview } from './service-preview.jsx';

afterEach(cleanup);

describe('actual service previews', () => {
  it('edits meeting metadata through the real ComposeSheet', () => {
    render(<StrictMode><ServicePreview scenario="composeSheet" /></StrictMode>);
    fireEvent.click(screen.getByRole('button', { name: /다음 주 개선안 회의/ }));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '디자인 시스템 검토' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByRole('button', { name: /디자인 시스템 검토/ })).toBeTruthy();
  });
  it('keeps proposal controls specific to required and optional members', () => {
    const { rerender } = render(<ServicePreview scenario="proposalRequired" />);
    expect(screen.getByRole('button', { name: '확인하기' })).toBeTruthy();
    rerender(<ServicePreview scenario="proposalOptional" />);
    expect(screen.getByRole('button', { name: '응답하기' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '확인하기' })).toBeNull();
  });
  it('saves controlled responses through the service reducer', () => {
    render(<ServicePreview scenario="responsePreset" />);
    const choice = screen.getAllByRole('radio', { name: '가능' })[0];
    fireEvent.click(choice);
    expect(choice.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '응답 저장' }));
    expect(screen.getByRole('button', { name: '내 응답 수정하기' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '응답 저장' })).toBeNull();
  });
  it('opens an existing response without the preset state', () => {
    const { container } = render(<ServicePreview scenario="responseEdit" />);
    expect(screen.getByRole('button', { name: '수정 저장' })).toBeTruthy();
    expect(container.querySelector('.slotcard--preset')).toBeNull();
  });
  it('seeds deadline escalation and leaves processing in OrganizerSheet', () => {
    render(<ServicePreview scenario="organizer" />);
    expect(screen.getByText('댄 — 필참인데 마감까지 무응답이에요')).toBeTruthy();
    expect(screen.getByRole('button', { name: '다시 요청' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '마감 연장하고 기다리기' })).toBeTruthy();
  });
  it('renders confirmation only after service approval actions', () => {
    render(<ServicePreview scenario="confirmed" />);
    expect(screen.getByText('회의가 확정됐어요')).toBeTruthy();
    expect(screen.getByText('이의 없이 그대로 확정됐어요')).toBeTruthy();
  });
  it('recovers from no-slot using the actual WIDEN transition', () => {
    render(<ServicePreview scenario="noSlot" />);
    fireEvent.click(screen.getByRole('button', { name: '기간을 넓혀 다시 찾기' }));
    expect(screen.getByText('기간을 넓혀 다시 조율하고 있어요')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '기간을 넓혀 다시 찾기' })).toBeNull();
  });
  it('opens a sheet from a reused bubble composition', () => {
    render(<ServicePreview scenario="compose" view="bubble" />);
    fireEvent.click(screen.getByRole('button', { name: '회의 만들기' }));
    expect(screen.getByRole('button', { name: '이 조건으로 시간 찾기' })).toBeTruthy();
  });
});
