import { Node, mergeAttributes } from '@tiptap/core';

export type CharacterSpeechPosition = 'left' | 'right';

export interface CharacterSpeechOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface CharacterSpeechAttributes {
  image: string | null;
  text: string;
  position: CharacterSpeechPosition;
}

export const CharacterSpeech = Node.create<CharacterSpeechOptions>({
  name: 'characterSpeech',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      image: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-image'),
        renderHTML: (attributes) =>
          attributes.image ? { 'data-image': attributes.image } : {},
      },

      text: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-text') ?? '',
        renderHTML: (attributes) => ({
          'data-text': attributes.text,
        }),
      },

      position: {
        default: 'left',
        parseHTML: (element) => {
          const position = element.getAttribute('data-position');

          return position === 'right' ? 'right' : 'left';
        },
        renderHTML: (attributes) => ({
          'data-position': attributes.position,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="character-speech"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'character-speech',
        class: 'character-speech',
      }),
    ];
  },
});
