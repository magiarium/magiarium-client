import { Editor } from '@tiptap/react';

export const detectEditorType = (editor: Editor) => {
  if (!editor) return 'undefined';

  if (editor.isActive('codeBlock')) return 'codeBlock';
  if (editor.isActive('blockquote')) return 'blockquote';
  if (editor.isActive('heading')) return 'heading';
  if (editor.isActive('bulletList') || editor.isActive('orderedList'))
    return 'list';

  if (editor.isActive('characterSpeech')) return 'characterSpeech';

  if (editor.isActive('tips')) return 'tips';
  if (editor.isActive('linkCard')) return 'linkCard';

  if (editor.isActive('table')) return 'table';
  if (editor.isActive('image')) return 'image';

  if (editor.isActive('youtube')) return 'youtube';
  if (editor.isActive('paragraph')) return 'paragraph';

  return 'undefined';
};
