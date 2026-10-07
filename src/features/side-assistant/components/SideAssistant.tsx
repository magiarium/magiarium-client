'use client';
import { useAppState } from '@/features/app-controller/hooks/useAppState';
import classNames from 'classnames';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Rnd } from 'react-rnd';
import { GRAB_CHARACTER_SIZE, SPEECH_TAIL_POSITION } from '../constants';
import { useSideAsssistant } from '../hooks/useSideAssistant';
import { useSideAssistantInteraction } from '../hooks/useSideAssistantInteraction';
import './SideAssistant.scss';
import { Speech } from './Speech';

/**
 * サイドアシスタント
 */
export const SideAssistant = (): ReactNode => {
  const { appState } = useAppState();
  const { sideAssistant } = useSideAsssistant();

  const {
    isHover,
    isDragging,
    currentCharacter,
    position,
    characterRef,
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleClick,
    handleMouseMove,
  } = useSideAssistantInteraction();

  if (appState === 'INITIAL' || appState === 'LOCKED') {
    return null;
  }
  return (
    <Rnd
      className="side-assistant"
      position={position}
      size={{
        width: GRAB_CHARACTER_SIZE.width,
        height: GRAB_CHARACTER_SIZE.height,
      }}
      style={{ cursor: 'default' }}
      enableResizing={false}
      bounds="parent"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    >
      {!isDragging && (
        <div className="side-assistant__speech">
          <Speech tailPosition={SPEECH_TAIL_POSITION}>
            {sideAssistant.speechContent}
          </Speech>
        </div>
      )}

      <div
        className={classNames(
          'side-assistant__character',
          isHover && !isDragging && 'side-assistant__character--hover',
          isDragging && 'side-assistant__character--grabbing'
        )}
      >
        <Image
          ref={characterRef}
          src={currentCharacter.path}
          alt={currentCharacter.alt}
          width={currentCharacter.width}
          height={currentCharacter.height}
          loading="eager"
        />
      </div>
    </Rnd>
  );
};
