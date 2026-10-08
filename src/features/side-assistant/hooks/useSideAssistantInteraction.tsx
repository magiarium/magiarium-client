import { isOpaquePixel } from '@/common/libs/isOpaquePixel';
import { Coordinates } from '@/common/type';
import { useAnimationController } from '@/features/animation/hooks/useAnimationController';
import { useEffect, useRef, useState } from 'react';
import { DraggableData } from 'react-rnd';
import {
  DEFAULT_SIDE_ASSISTANT_CHARACTER,
  GRAB_CHARACTER_SIZE,
  GRAB_POINT,
  GRAB_SIDE_ASSISTANT_CHARACTER,
  SIDE_ASSISTANT_SPEECH_ANIMATION_ID,
  SPEECH_ASSETS,
} from '../constants';
import { useSideAsssistant } from './useSideAssistant';
const SPEECH_MAX_HEIGHT = 75;
const PADDING = 10;

/**
 * サイドアシスタントのインタラクション処理用hook
 */
export const useSideAssistantInteraction = () => {
  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Coordinates>();
  const { setSpeechContent, sideAssistant } = useSideAsssistant();
  const { getAnimationControllerState, finishAnimationController } =
    useAnimationController();

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

  /**
   * ドラッグ開始処理ハンドラー
   *
   * @param e マウスイベント
   */
  const handleDragStart = (e: MouseEvent): void => {
    if (
      !isOpaquePixel({
        img: characterRef.current,
        positionX: e.clientX,
        positionY: e.clientY,
      })
    ) {
      return;
    }

    dragStartPosition.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setIsDragging(false);
  };

  /**
   * ドラッグ処理ハンドラー
   *
   * @param e マウスイベント
   * @param d ドラッグデータ
   */
  const handleDrag = (e: MouseEvent, d: DraggableData): void => {
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

  /**
   * ドラッグ停止処理ハンドラー
   *
   * @param e マウスイベント
   * @param d ドラッグデータ
   */
  const handleDragStop = (e: MouseEvent, d: DraggableData): void => {
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

  /**
   * クリックハンドラー
   *
   * @param e マウスイベント
   */
  const handleClick = (e: MouseEvent): void => {
    if (
      isOpaquePixel({
        img: characterRef.current,
        positionX: e.clientX,
        positionY: e.clientY,
      })
    ) {
      const state = getAnimationControllerState(
        SIDE_ASSISTANT_SPEECH_ANIMATION_ID
      );
      if (state === 'RUNNING') {
        finishAnimationController(SIDE_ASSISTANT_SPEECH_ANIMATION_ID);
      } else {
        const availableSpeeches = SPEECH_ASSETS.filter(
          (speech) => speech !== sideAssistant.speechContent
        );

        const randomSpeech =
          availableSpeeches[
            Math.floor(Math.random() * availableSpeeches.length)
          ];

        setSpeechContent(randomSpeech);
      }
    }
  };

  /**
   * マウス移動ハンドラー
   *
   * @param e マウスイベント
   */
  const handleMouseMove = (e: MouseEvent): void => {
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
