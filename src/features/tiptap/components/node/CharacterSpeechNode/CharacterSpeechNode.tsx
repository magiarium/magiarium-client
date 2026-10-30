import { Speech } from '@/features/side-assistant/components/Speech';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import classNames from 'classnames';
import Image from 'next/image';

export const CharacterSpeechNode = ({ node }: NodeViewProps) => {
  const { image, text, position } = node.attrs;
  return (
    <NodeViewWrapper className="character-speech">
      <Image
        className={classNames(
          'character-speech__icon',
          position === 'left'
            ? 'character-speech__icon--left'
            : 'character-speech__icon--right'
        )}
        src={image ?? '/assets/user/icons/unknown.webp'}
        alt={'キャラクターアイコン'}
        width={515}
        height={515}
      />
      <Speech
        tailPosition={position === 'left' ? { x: 0, y: 50 } : { x: 100, y: 50 }}
      >
        {text}
      </Speech>
    </NodeViewWrapper>
  );
};
