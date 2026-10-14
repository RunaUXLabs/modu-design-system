import React from 'react';
import JudgeBar from '../features/simulation/JudgeBar.jsx';
import ChatRoom from './components/ChatRoom.jsx';

export default function MeetingPage() {
  return (
        <div className="layout">
          <aside className="layout__side">
            <h1 className="layout__title">모두의 시간</h1>
            <p className="layout__tagline">
              응답이 서로 달라도 회의가 확정되는, 팀 채팅방 안의 일정 시스템
            </p>
            <ol className="layout__how">
              <li>시스템이 먼저 시간을 골라 <b>잠정 확정</b>해요. 침묵은 동의예요.</li>
              <li>누군가 어렵다고 하면 그때만 <b>조율 모드</b>가 열려요.</li>
              <li>마감이 지나면 무응답도 처리돼요
                <small> — 선택은 불참으로, 필참은 주최자에게.</small></li>
            </ol>
            <JudgeBar />
            <a className="layout__storybook"
              href={import.meta.env.DEV ? 'http://localhost:6006/' : './storybook/'}
              target="_blank" rel="noreferrer">
              디자인 시스템 · Storybook ↗
            </a>
          </aside>
          <div className="layout__stage">
            <ChatRoom />
          </div>
        </div>
  );
}
