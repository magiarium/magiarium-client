import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageNode } from '../node/ImageNode/ImageNode';

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      originalWidth: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-original-width'),

        renderHTML: (attributes) =>
          attributes.originalWidth
            ? {
                'data-original-width': attributes.originalWidth,
              }
            : {},
      },

      originalHeight: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-original-height'),

        renderHTML: (attributes) =>
          attributes.originalHeight
            ? {
                'data-original-height': attributes.originalHeight,
              }
            : {},
      },

      uploadedAt: {
        default: null,

        parseHTML: (element) => element.getAttribute('data-uploaded-at'),

        renderHTML: (attributes) =>
          attributes.uploadedAt
            ? {
                'data-uploaded-at': attributes.uploadedAt,
              }
            : {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },
});
