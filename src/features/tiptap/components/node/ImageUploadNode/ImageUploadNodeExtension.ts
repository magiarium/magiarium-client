import { ImageMetadata } from '@magiarium/structure';
import type { NodeType } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import {
  findParentNode,
  mergeAttributes,
  Node,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import { ImageUploadNode as ImageUploadNodeComponent } from './ImageUploadNode';

export type UploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) => Promise<ImageMetadata>;

export interface ImageUploadNodeOptions {
  /**
   * Node種別
   * @default 'image'
   */
  type?: string | NodeType | undefined;
  /**
   * アップロード許可形式
   * @default 'image/*'
   */
  accept?: string;
  /**
   * 一度にアップロードできるファイルの上限数
   * @default 1
   */
  limit?: number;
  /**
   * アップロード可能な最大ファイルサイズ（0は制限なし）
   * @default 0
   */
  maxSize?: number;
  /**
   * アップロード進捗関数
   */
  upload?: UploadFunction;
  /**
   * アップロードエラー時のコールバック関数
   */
  onError?: (error: Error) => void;
  /**
   * アップロード成功時のコールバック関数
   */
  onSuccess?: (url: string) => void;
  /**
   * 画像エレメントに追加するAttributes
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUploadNode: (options?: ImageUploadNodeOptions) => ReturnType;
      deleteImageUploadNode: () => ReturnType;
    };
  }
}

/**
 * 画像アップロードコンポーネントを作成するためのTiptapNodeExtension
 * @see registry/tiptap-node/image-upload-node/image-upload-node
 */
export const ImageUploadNode = Node.create<ImageUploadNodeOptions>({
  name: 'imageUpload',

  group: 'block',

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      type: 'image',
      accept: 'image/*',
      limit: 1,
      maxSize: 0,
      upload: undefined,
      onError: undefined,
      onSuccess: undefined,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      accept: {
        default: this.options.accept,
      },
      limit: {
        default: this.options.limit,
      },
      maxSize: {
        default: this.options.maxSize,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ 'data-type': 'image-upload' }, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadNodeComponent);
  },

  addCommands() {
    return {
      setImageUploadNode:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },

      deleteImageUploadNode:
        () =>
        ({ tr, dispatch, editor }) => {
          const { selection } = tr;
          const imageUploadType = editor.schema.nodes.imageUpload;

          let pos: number | undefined;
          let node;

          // ノードそのものが選択されているケース
          if (
            selection instanceof NodeSelection &&
            selection.node.type === imageUploadType
          ) {
            pos = selection.from;
            node = selection.node;
          } else {
            // selectionの親にimageUploadが存在するケース
            const found = findParentNode((n) => n.type === imageUploadType)(
              selection
            );

            if (found) {
              pos = found.pos;
              node = found.node;
            }
          }

          if (pos === undefined || !node) {
            return false;
          }

          if (dispatch) {
            tr.delete(pos, pos + node.nodeSize).scrollIntoView();
          }

          return true;
        },
    };
  },

  /**
   * アップロードコンポーネントが選択された時、エンターキーでハンドラーが起動するように追加
   */
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { nodeAfter } = selection.$from;

        if (
          nodeAfter &&
          nodeAfter.type.name === 'imageUpload' &&
          editor.isActive('imageUpload')
        ) {
          const nodeEl = editor.view.nodeDOM(selection.$from.pos);
          if (nodeEl && nodeEl instanceof HTMLElement) {
            // NodeViewWrapperはdiv要素でラップされているため、最初の子要素をクリックする必要がある
            const firstChild = nodeEl.firstChild;
            if (firstChild && firstChild instanceof HTMLElement) {
              firstChild.click();
              return true;
            }
          }
        }
        return false;
      },
    };
  },
});

export default ImageUploadNode;
