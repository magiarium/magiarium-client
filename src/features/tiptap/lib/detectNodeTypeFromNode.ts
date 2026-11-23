import { Node } from '@tiptap/pm/model';
import { Editor } from '@tiptap/react';

/** ノード種別ごとのプレースホルダー */
export const NODE_TYPE_PLACEHOLDERS = {
  undefined: 'ノードブロックを選択してください。',
  inlineLink: 'リンクテキストを入力してください。',
  codeBlock: 'コードブロックの内容を入力してください。',
  blockquote: '引用要素の本文を入力してください。',
  heading: '見出しを入力してください。',
  list: 'リストアイテムの内容を入力してください。',
  characterSpeech: 'キャラクターのセリフを入力してください。',
  tips: 'Tipsの内容を入力してください。',
  linkCard: 'リンクカードの内容を入力してください。',
  table: 'テーブルの内容を入力してください。',
  tableHeaderCell: 'ヘッダーの内容を入力してください。',
  tableRowCell: '行の内容を入力してください。',
  tableFigure: 'テーブルの内容を入力してください。',
  tableRow: '行の内容を入力してください。',
  tableHeader: 'ヘッダーの内容を入力してください。',
  caption: 'キャプションを入力してください。',
  image: '画像の内容を入力してください。',
  imageFigure: '画像を挿入してください。',
  youtube: 'YouTube動画の内容を入力してください。',
  youtubeFigure: 'YouTube動画を挿入してください。',
  paragraph: '本文を入力してください。',
} as const;

/** ノード種別 */
export type NodeType = keyof typeof NODE_TYPE_PLACEHOLDERS;

/** ノード種別情報 */
export type NodeTypeInfo = {
  type: NodeType;
  placeholder: (typeof NODE_TYPE_PLACEHOLDERS)[NodeType];
};

/**
 * 現在ノードの種別情報を検索する処理
 *
 * @param node ノード
 * @param pos ポジション
 * @param editor Tiptapエディターのインスタンス
 * @returns ノード種別情報
 */
export const detectNodeTypeFromNode = (
  node: Node,
  pos?: number,
  editor?: Editor | null
): NodeTypeInfo => {
  const getNodeTypeInfo = (type: NodeType): NodeTypeInfo => ({
    type,
    placeholder: NODE_TYPE_PLACEHOLDERS[type],
  });

  if (!node) return getNodeTypeInfo('undefined');

  // 対象node自身と親階層のnode typeを取得
  const nodeTypes = new Set<string>();

  nodeTypes.add(node.type.name);

  if (editor && typeof pos === 'number') {
    const { doc, selection } = editor.state;
    if (pos < 0 || pos > doc.content.size) {
      return getNodeTypeInfo('undefined');
    }

    const resolvePos = doc.resolve(pos);

    // 祖先 Node
    for (let depth = resolvePos.depth; depth >= 0; depth--) {
      nodeTypes.add(resolvePos.node(depth).type.name);
    }

    // pos の位置にある Node
    const nodeAtPos = doc.nodeAt(pos);

    if (nodeAtPos) {
      nodeTypes.add(nodeAtPos.type.name);

      // Node に付与された Mark
      nodeAtPos.marks.forEach((mark) => {
        nodeTypes.add(mark.type.name);
      });
    }

    // 現在の Selection に適用されている Mark
    selection.$from.marks().forEach((mark) => {
      nodeTypes.add(mark.type.name);
    });

    // 選択範囲内の Node / Mark
    if (!selection.empty) {
      doc.nodesBetween(selection.from, selection.to, (n) => {
        nodeTypes.add(n.type.name);

        n.marks.forEach((mark) => {
          nodeTypes.add(mark.type.name);
        });
      });
    }
  }

  const has = (type: string) => nodeTypes.has(type);

  // コードブロック
  if (has('codeBlock')) return getNodeTypeInfo('codeBlock');

  // 引用ブロック
  if (has('blockquote')) return getNodeTypeInfo('blockquote');

  // 見出し
  if (has('heading')) return getNodeTypeInfo('heading');

  // リスト
  if (has('bulletList') || has('orderedList')) {
    return getNodeTypeInfo('list');
  }

  // キャラクタースピーチ
  if (has('characterSpeech')) {
    return getNodeTypeInfo('characterSpeech');
  }

  // Tips
  if (has('tips')) return getNodeTypeInfo('tips');

  // インラインリンク
  if (has('inlineLink')) return getNodeTypeInfo('inlineLink');

  // リンクカード
  if (has('linkCard')) return getNodeTypeInfo('linkCard');

  // テーブル
  if (has('tableFigure')) {
    if (has('caption')) return getNodeTypeInfo('caption');
    if (has('tableRow')) {
      if (has('tableHeader')) {
        if (has('tableCell')) return getNodeTypeInfo('tableHeaderCell');
        return getNodeTypeInfo('tableHeader');
      }

      if (has('tableCell')) return getNodeTypeInfo('tableRowCell');

      return getNodeTypeInfo('tableRow');
    }
    if (has('table')) return getNodeTypeInfo('table');

    return getNodeTypeInfo('tableFigure');
  }

  // 画像
  if (has('imageFigure')) {
    if (has('image')) return getNodeTypeInfo('image');
    if (has('caption')) return getNodeTypeInfo('caption');

    return getNodeTypeInfo('imageFigure');
  }

  // YouTube
  if (has('youtubeFigure')) {
    if (has('youtube')) return getNodeTypeInfo('youtube');
    if (has('caption')) return getNodeTypeInfo('caption');

    return getNodeTypeInfo('youtubeFigure');
  }

  // Paragraph
  if (has('paragraph')) return getNodeTypeInfo('paragraph');

  return getNodeTypeInfo('undefined');
};
