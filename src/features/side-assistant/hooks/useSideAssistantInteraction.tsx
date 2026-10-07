import { isOpaquePixel } from '@/common/libs/isOpaquePixel';
import { Coordinates } from '@/common/type';
import { useEffect, useRef, useState } from 'react';
import { DraggableData } from 'react-rnd';
import {
  DEFAULT_SIDE_ASSISTANT_CHARACTER,
  GRAB_CHARACTER_SIZE,
  GRAB_POINT,
  GRAB_SIDE_ASSISTANT_CHARACTER,
  SPEECH_ASSETS,
} from '../constants';
import { useSideAsssistant } from './useSideAssistant';
const SPEECH_MAX_HEIGHT = 75;
const PADDING = 10;

/**
 * サイドアシスタントのインタラクション処理一覧
 */
export const useSideAssistantInteraction = () => {
  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Coordinates>();
  const { setSpeechContent } = useSideAsssistant();

  const dragStartPosition = useRef({ x: 0, y: 0 });
  const characterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setPosition({
      x: window.innerWidth - GRAB_CHARACTER_SIZE.width,
      y:
        window.innerHeight -
        GRAB_CHARACTER_SIZE.height *
          (DEFAULT_SIDE_ASSISTANT_CHARACTER.height /
            DEFAULT_SIDE_ASSISTANT_CHARACTER.width),
    });
  }, []);

  const handleDragStart = (e: MouseEvent) => {
    if (
      !isOpaquePixel({
        img: characterRef.current,
        positionX: e.clientX,
        positionY: e.clientY,
      })
    ) {
      return false;
    }

    dragStartPosition.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setIsDragging(false);
  };

  const handleDrag = (e: MouseEvent, d: DraggableData) => {
    const dx = e.clientX - dragStartPosition.current.x;
    const dy = e.clientY - dragStartPosition.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // 5px以上動いたらドラッグ開始
    if (!isDragging && distance >= 5) {
      setIsDragging(true);
      setPosition({
        x: e.clientX - GRAB_CHARACTER_SIZE.width * GRAB_POINT.x,
        y: e.clientY - GRAB_CHARACTER_SIZE.height * GRAB_POINT.y,
      });
    } else if (isDragging) {
      setPosition({
        x: d.x,
        y: d.y,
      });
    }
  };

  const handleDragStop = (e: MouseEvent, d: DraggableData) => {
    if (isDragging) {
      setPosition({
        x: Math.min(
          Math.max(d.x, PADDING),
          window.innerWidth - GRAB_CHARACTER_SIZE.width - PADDING
        ),
        y: Math.min(
          Math.max(d.y, SPEECH_MAX_HEIGHT),
          window.innerHeight -
            GRAB_CHARACTER_SIZE.height *
              (DEFAULT_SIDE_ASSISTANT_CHARACTER.height /
                DEFAULT_SIDE_ASSISTANT_CHARACTER.width) -
            PADDING
        ),
      });

      setIsDragging(false);
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (
      isOpaquePixel({
        img: characterRef.current,
        positionX: e.clientX,
        positionY: e.clientY,
      })
    ) {
      const randowSpeech =
        SPEECH_ASSETS[Math.floor(Math.random() * SPEECH_ASSETS.length)];
      setSpeechContent(randowSpeech);
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    setIsHover(
      isOpaquePixel({
        img: characterRef.current,
        positionX: e.clientX,
        positionY: e.clientY,
      })
    );
  };
  const currentCharacter = isDragging
    ? GRAB_SIDE_ASSISTANT_CHARACTER
    : DEFAULT_SIDE_ASSISTANT_CHARACTER;

  return {
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
  };
};
