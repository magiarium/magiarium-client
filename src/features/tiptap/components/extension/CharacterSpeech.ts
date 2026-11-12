import { CharacterSpeechNode } from '@/features/tiptap/components/node/CharacterSpeechNode';
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

// コマンドの型定義
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    characterSpeech: {
      insertCharacterSpeech: () => ReturnType;
      setCharacterSpeech: (attributes: CharacterSpeechAttributes) => ReturnType;
      removeCharacterSpeech: () => ReturnType;
    };
  }
}

export type CharacterSpeechPosition = 'left' | 'right';

export interface CharacterSpeechOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface CharacterSpeechAttributes {
  characterIcon?: string | null;
  frameColor?: string | null;
  characterName?: string | null;
  characterPosition?: string | null;
}

export const CharacterSpeech = Node.create<CharacterSpeechOptions>({
  name: 'characterSpeech',

  group: 'block',

  content: 'paragraph+',

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      characterIcon: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-character-icon'),
        renderHTML: (attributes) =>
          attributes.characterIcon
            ? { 'data-character-icon': attributes.characterIcon }
            : {},
      },
      characterName: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-character-name'),
        renderHTML: (attributes) =>
          attributes.characterName
            ? { 'data-character-name': attributes.characterName }
            : {},
      },
      frameColor: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-frame-color'),
        renderHTML: (attributes) =>
          attributes.frameColor
            ? { 'data-frame-color': attributes.frameColor }
            : {},
      },
      characterPosition: {
        default: 'left',
        parseHTML: (element) => {
          const position = element.getAttribute('data-character-position');

          return position === 'right' ? 'right' : 'left';
        },
        renderHTML: (attributes) => ({
          'data-character-position': attributes.characterPosition,
        }),
      },
    };
  },

  addCommands() {
    return {
      insertCharacterSpeech:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attributes: {},
            content: [{ type: 'paragraph' }],
          });
        },
      setCharacterSpeech:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
      removeCharacterSpeech:
        () =>
        ({ commands }) => {
          return commands.deleteNode(this.name);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CharacterSpeechNode);
  },
});
