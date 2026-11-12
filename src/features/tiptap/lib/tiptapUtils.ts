import type { Node as PMNode } from '@tiptap/pm/model';
import type { Transaction } from '@tiptap/pm/state';
import {
  AllSelection,
  NodeSelection,
  Selection,
  TextSelection,
} from '@tiptap/pm/state';
import { cellAround, CellSelection } from '@tiptap/pm/tables';
import {
  findParentNodeClosestToPos,
  type Editor,
  type NodeWithPos,
} from '@tiptap/react';
import { clsx, type ClassValue } from 'clsx';

/**
 * アップロード可能なファイルの最大サイズ（5MB）。
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * macOSで使用される修飾キーおよび特殊キーの表示記号を定義する。
 *
 * キー名をキーに、対応する記号または表示文字列を保持する。
 * キー名は小文字で定義する。
 *
 * @example
 * MAC_SYMBOLS['command']; // '⌘'
 * MAC_SYMBOLS['shift'];   // '⇧'
 */
export const MAC_SYMBOLS: Record<string, string> = {
  mod: '⌘',
  command: '⌘',
  meta: '⌘',
  ctrl: '⌃',
  control: '⌃',
  alt: '⌥',
  option: '⌥',
  shift: '⇧',
  backspace: 'Del',
  delete: '⌦',
  enter: '⏎',
  escape: '⎋',
  capslock: '⇪',
} as const;

/**
 * スクリーンリーダー専用の要素に適用するスタイル定義。
 *
 * 要素を視覚的には非表示にしつつ、アクセシビリティツリーには残すことで、スクリーンリーダーから読み取れるようにする。
 *
 * 主に、視覚的な表示が不要な補助テキストなどに使用する。
 */
export const SR_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
} as const;

/**
 * 複数のクラス名や条件付きクラス名を結合する。
 *
 * clsxを使用して、文字列・配列・オブジェクトなどのクラス指定を1つの文字列に変換する。
 *
 * @param inputs - 結合するクラス名または条件付きクラス指定
 * @returns 結合されたクラス名の文字列
 *
 * @example
 * cn('button', 'primary'); // 'button primary'
 * cn('button', { active: true, disabled: false }); // 'button active'
 */
export const cn = (...inputs: ClassValue[]): string => {
  return clsx(inputs);
};

/**
 * 現在の実行環境がmacOSであるかを判定する。
 *
 * navigator.platformの値に「mac」が含まれているかを確認する。
 * navigatorが利用できない環境（SSRなど）ではfalseを返す。
 *
 * @returns macOSの場合はtrue、それ以外の場合はfalse
 *
 * @example
 * if (isMac()) {
 *   console.log('macOS環境です');
 * }
 */
export const isMac = (): boolean => {
  return (
    typeof navigator !== 'undefined' &&
    navigator.platform.toLowerCase().includes('mac')
  );
};

/**
 * 実行環境（Macまたは非Mac）に応じてショートカットキーを整形する。
 *
 * Mac環境の場合はキー名に対応する記号（⌘、⌃、⌥、⇧など）に変換する。
 * 対応する記号が存在しない場合は、大文字化の設定に応じてキー名を整形する。
 *
 * 非Mac環境の場合は、キー名の先頭文字を大文字にするかどうかを、
 * capitalizeの設定に従って整形する。
 *
 * @param key - 整形対象のキー名（例: "ctrl", "alt", "shift"）
 * @param isMac - Mac環境かどうかを示すフラグ
 * @param capitalize - キー名を大文字化するかどうか（デフォルト: true）
 * @returns 整形されたショートカットキーの記号または文字列
 *
 * @example
 * formatShortcutKey('ctrl', true);  // '⌃'
 * formatShortcutKey('enter', true); // '⏎'
 * formatShortcutKey('ctrl', false); // 'Ctrl'
 * formatShortcutKey('shift', false, false); // 'shift'
 */
export const formatShortcutKey = (
  key: string,
  isMac: boolean,
  capitalize: boolean = true
) => {
  if (isMac) {
    const lowerKey = key.toLowerCase();
    return MAC_SYMBOLS[lowerKey] || (capitalize ? key.toUpperCase() : key);
  }

  return capitalize ? key.charAt(0).toUpperCase() + key.slice(1) : key;
};

/**
 * ショートカットキーの文字列を解析し、整形済みキー記号の配列に変換する。
 *
 * 指定された区切り文字でショートカットキーを分割し、
 * 各キーの前後にある空白を除去したうえで、
 * 実行環境に応じたキー記号へ変換する。
 *
 * 区切り文字や大文字化の有無はオプションで変更できる。
 * ショートカットキーが未指定または空文字列の場合は空配列を返す。
 *
 * @param props - ショートカットキーの解析オプション
 * @param props.shortcutKeys - 解析対象のショートカットキー文字列
 *   （例: "ctrl-alt-shift"）
 * @param props.delimiter - キーを分割する区切り文字（デフォルト: "+"）
 * @param props.capitalize - キー名を大文字化するかどうか（デフォルト: true）
 * @returns 整形済みショートカットキー記号の配列
 *
 * @example
 * parseShortcutKeys({ shortcutKeys: 'ctrl+alt+shift' });
 * // Mac: ['⌃', '⌥', '⇧']
 * // Windows/Linux: ['Ctrl', 'Alt', 'Shift']
 *
 * @example
 * parseShortcutKeys({
 *   shortcutKeys: 'ctrl-alt-shift',
 *   delimiter: '-',
 *   capitalize: false,
 * });
 */
export const parseShortcutKeys = (props: {
  shortcutKeys: string | undefined;
  delimiter?: string;
  capitalize?: boolean;
}) => {
  const { shortcutKeys, delimiter = '+', capitalize = true } = props;

  if (!shortcutKeys) return [];

  return shortcutKeys
    .split(delimiter)
    .map((key) => key.trim())
    .map((key) => formatShortcutKey(key, isMac(), capitalize));
};

/**
 * エディタのスキーマに指定されたMark（インライン装飾）が存在するかを確認する。
 *
 * エディタインスタンスまたはスキーマが存在しない場合はfalseを返す。
 * スキーマに登録されているMarkの定義を参照し、
 * 指定された名前のMarkが存在するかどうかを判定する。
 *
 * @param markName - 存在を確認するMarkの名前
 * @param editor - 対象となるエディタインスタンス（nullの場合はfalseを返す）
 * @returns 指定されたMarkがスキーマに存在する場合はtrue、それ以外はfalse
 *
 * @example
 * isMarkInSchema('bold', editor);      // true または false
 * isMarkInSchema('italic', editor);    // true または false
 * isMarkInSchema('unknown', editor);   // false
 */
export const isMarkInSchema = (
  markName: string,
  editor: Editor | null
): boolean => {
  if (!editor?.schema) return false;
  return editor.schema.spec.marks.get(markName) !== undefined;
};

/**
 * エディタのスキーマに指定されたNode（ドキュメント構造要素）が存在するかを確認する。
 *
 * エディタインスタンスまたはスキーマが存在しない場合はfalseを返す。
 * スキーマに登録されているNodeの定義を参照し、
 * 指定された名前のNodeが存在するかどうかを判定する。
 *
 * @param nodeName - 存在を確認するNodeの名前
 * @param editor - 対象となるエディタインスタンス（nullの場合はfalseを返す）
 * @returns 指定されたNodeがスキーマに存在する場合はtrue、それ以外はfalse
 *
 * @example
 * isNodeInSchema('paragraph', editor); // true または false
 * isNodeInSchema('heading', editor);   // true または false
 * isNodeInSchema('unknown', editor);   // false
 */
export const isNodeInSchema = (
  nodeName: string,
  editor: Editor | null
): boolean => {
  if (!editor?.schema) return false;
  return editor.schema.spec.nodes.get(nodeName) !== undefined;
};

/**
 * エディタ内のフォーカスを次の選択可能なノードへ移動する。
 *
 * 現在の選択位置から次に選択可能な位置を検索し、
 * 見つかった場合はその位置へ選択範囲を移動する。
 *
 * 次の選択可能な位置が見つからない場合は、ドキュメントの末尾に
 * 新しい段落ノードを追加し、その段落内に選択位置を設定する。
 *
 * スキーマに段落ノードが定義されていない場合は、
 * 警告を出力してfalseを返す。
 *
 * @param editor - 対象となるエディタインスタンス
 * @returns フォーカスの移動に成功した場合はtrue、失敗した場合はfalse
 *
 * @example
 * focusNextNode(editor); // 次の選択可能な位置へ移動
 */
export const focusNextNode = (editor: Editor) => {
  const { state, view } = editor;
  const { doc, selection } = state;

  const nextSel = Selection.findFrom(selection.$to, 1, true);
  if (nextSel) {
    view.dispatch(state.tr.setSelection(nextSel).scrollIntoView());
    return true;
  }

  const paragraphType = state.schema.nodes.paragraph;
  if (!paragraphType) {
    console.warn('No paragraph node type found in schema.');
    return false;
  }

  const end = doc.content.size;
  const para = paragraphType.create();
  let tr = state.tr.insert(end, para);

  // Place the selection inside the new paragraph
  const $inside = tr.doc.resolve(end + 1);
  tr = tr.setSelection(TextSelection.near($inside)).scrollIntoView();
  view.dispatch(tr);
  return true;
};

/**
 * 指定された値が有効な位置情報であるかを判定する。
 *
 * 値がnumber型であり、0以上である場合に有効と判定する。
 * null、undefined、NaN、および負の数は無効とする。
 *
 * TypeScriptの型述語（型ガード）として機能し、
 * 判定後に値がnumber型であることを保証する。
 *
 * @param pos - 判定対象の位置情報
 * @returns 0以上の数値である場合はtrue、それ以外はfalse
 *
 * @example
 * isValidPosition(10);        // true
 * isValidPosition(0);         // true
 * isValidPosition(-1);        // false
 * isValidPosition(null);      // false
 * isValidPosition(undefined); // false
 * isValidPosition(NaN);       // false
 */
export const isValidPosition = (
  pos: number | null | undefined
): pos is number => {
  return typeof pos === 'number' && pos >= 0;
};

/**
 * Tiptapエディタに指定された拡張機能（Extension）が登録されているかを確認する。
 *
 * 単一の拡張機能名、または複数の拡張機能名を受け取り、
 * 指定された拡張機能のうち1つ以上がエディタに登録されているかを判定する。
 *
 * エディタが存在しない場合、または破棄済みの場合はfalseを返す。
 *
 * 指定された拡張機能が1つも見つからず、silentオプションが
 * falseの場合は、設定漏れを通知する警告をコンソールに出力する。
 * 同じ拡張機能名の組み合わせに対する警告は、重複して出力されない。
 *
 * @param editor - 対象となるTiptapエディタインスタンス（nullの場合はfalseを返す）
 * @param extensionNames - 確認対象の拡張機能名、または拡張機能名の配列
 * @param options - 拡張機能の確認オプション
 * @param options.silent - 拡張機能が見つからない場合の警告出力を抑制するかどうか。
 *   trueの場合、警告を出力しない。拡張機能が存在しない状態を正常として扱う場合に使用する。
 *   （デフォルト: false）
 * @returns 指定された拡張機能のうち1つ以上が登録されている場合はtrue、それ以外はfalse
 *
 * @example
 * // 単一の拡張機能を確認
 * isExtensionAvailable(editor, 'bold');
 *
 * @example
 * // 複数の拡張機能のうち1つ以上が登録されているか確認
 * isExtensionAvailable(editor, ['bold', 'italic']);
 *
 * @example
 * // 拡張機能が存在しない場合の警告を抑制
 * isExtensionAvailable(editor, 'bold', { silent: true });
 */
const warnedMissingExtensions = new Set<string>();

export const isExtensionAvailable = (
  editor: Editor | null,
  extensionNames: string | string[],
  options?: {
    /**
     * 対象の拡張機能が見つからない場合の警告出力を抑制する。
     *
     * 呼び出し元で拡張機能が存在しない状態を正常として扱い、
     * その状態を適切に処理できる場合に指定する。
     *
     * 例：hideWhenUnavailableを使用するボタンが、
     * 表示可否を判定するために拡張機能の有無を確認する場合。
     *
     * @default false
     */
    silent?: boolean;
  }
): boolean => {
  if (!editor || editor.isDestroyed) return false;

  const names = Array.isArray(extensionNames)
    ? extensionNames
    : [extensionNames];

  const extensions = editor.extensionManager?.extensions;
  if (!extensions) return false;

  const found = names.some((name) =>
    extensions.some((ext) => ext.name === name)
  );

  if (!found && !options?.silent) {
    const key = names.join(', ');

    if (!warnedMissingExtensions.has(key)) {
      warnedMissingExtensions.add(key);
      console.warn(
        `None of the extensions [${key}] were found in the editor schema. Ensure they are included in the editor configuration.`
      );
    }
  }

  return found;
};

/**
 * 指定されたドキュメント位置に存在するノードを取得する。
 *
 * 指定された位置からドキュメント内のノードを検索する。
 * ノードが見つからない場合は警告を出力してnullを返す。
 *
 * ノードの取得中に例外が発生した場合は、エラー内容を
 * コンソールに出力し、nullを返す。
 *
 * @param editor - 対象となるTiptapエディタインスタンス
 * @param position - ノードを検索するドキュメント内の位置
 * @returns 指定された位置に存在するノード。ノードが見つからない場合、
 *   または取得中にエラーが発生した場合はnull
 *
 * @example
 * // 指定位置のノードを取得
 * const node = findNodeAtPosition(editor, 10);
 *
 * @example
 * // ノードの取得結果を確認
 * const node = findNodeAtPosition(editor, 10);
 * if (node) {
 *   console.log(node.type.name);
 * }
 */
export const findNodeAtPosition = (editor: Editor, position: number) => {
  try {
    const node = editor.state.doc.nodeAt(position);
    if (!node) {
      console.warn(`No node found at position ${position}`);
      return null;
    }
    return node;
  } catch (error) {
    console.error(`Error getting node at position ${position}:`, error);
    return null;
  }
};

/**
 * ドキュメント内から指定されたノードを検索し、その位置とノードインスタンスを取得する。
 *
 * ノードインスタンスまたはドキュメント内の位置を指定して検索する。
 * 両方が指定された場合は、まずノードインスタンスの一致による検索を行い、
 * 見つからなかった場合は指定された位置からノードを取得する。
 *
 * ノードインスタンスによる検索では、ドキュメント内の各ノードを走査し、
 * 参照が一致するノードを検索する。
 *
 * ノードが指定されていない場合、またはノードが見つからなかった場合は、
 * 有効な位置情報があれば、その位置に存在するノードを取得する。
 *
 * エディタまたはドキュメントが存在しない場合、
 * あるいは有効な検索条件が指定されていない場合はnullを返す。
 *
 * @param props - ノード検索に必要な情報
 * @param props.editor - 対象となるTiptapエディタインスタンス（nullの場合は検索しない）
 * @param props.node - 検索対象のノードインスタンス（nodePosが指定されている場合は省略可能）
 * @param props.nodePos - 検索対象のドキュメント内の位置（nodeが指定されている場合は省略可能。0も有効な位置として扱う）
 * @returns 検索に成功した場合はノードの位置（pos）とノードインスタンス（node）を含むオブジェクト、見つからない場合はnull
 *
 * @example
 * // ノードインスタンスを指定して検索
 * findNodePosition({ editor, node });
 *
 * @example
 * // ドキュメント内の位置を指定して検索
 * findNodePosition({ editor, nodePos: 10 });
 *
 * @example
 * // ノードと位置の両方を指定して検索
 * findNodePosition({ editor, node, nodePos: 10 });
 */
export const findNodePosition = (props: {
  editor: Editor | null;
  node?: PMNode | null;
  nodePos?: number | null;
}): { pos: number; node: PMNode } | null => {
  const { editor, node, nodePos } = props;

  if (!editor || !editor.state?.doc) return null;

  // 位置が0の場合も有効な検索位置として扱う
  const hasValidNode = node !== undefined && node !== null;
  const hasValidPos = isValidPosition(nodePos);

  if (!hasValidNode && !hasValidPos) {
    return null;
  }

  // ノードが指定されている場合は、まずドキュメント内から該当するノードを検索する
  if (hasValidNode) {
    let foundPos = -1;
    let foundNode: PMNode | null = null;

    editor.state.doc.descendants((currentNode, pos) => {
      // TODO:必要に応じて、ノードの型名による比較も検討する
      // if (currentNode.type && currentNode.type.name === node!.type.name) {
      if (currentNode === node) {
        foundPos = pos;
        foundNode = currentNode;
        return false;
      }
      return true;
    });

    if (foundPos !== -1 && foundNode !== null) {
      return { pos: foundPos, node: foundNode };
    }
  }

  // 有効な位置が指定されている場合は、その位置からノードを取得する
  if (hasValidPos) {
    const nodeAtPos = findNodeAtPosition(editor, nodePos!);
    if (nodeAtPos) {
      return { pos: nodePos!, node: nodeAtPos };
    }
  }

  return null;
};

/**
 * 現在の選択範囲に、指定されたノードタイプ名またはグループ名に一致するノードが
 * 含まれているかどうかを判定する。
 *
 * ノードのタイプ名が指定された名前と一致する場合、または
 * ノードがSchema上で指定されたグループに属している場合に一致と判定する。
 *
 * 例えば、"image" を指定した場合、共通のimageグループに属する
 * ノードであれば、実際のノードタイプ名に関係なく一致する。
 *
 * checkAncestorNodesがtrueの場合は、選択範囲の開始位置から
 * 親ノードを階層的にたどり、一致するノードが存在するかを確認する。
 *
 * エディタが存在しない場合、選択範囲が空の場合、
 * または条件に一致するノードが存在しない場合はfalseを返す。
 *
 * @param editor - 対象となるTiptapエディタインスタンス（nullの場合はfalseを返す）
 * @param nodeTypeNames - 照合対象となるノードタイプ名またはグループ名の配列
 * @param checkAncestorNodes - 親ノードを階層的にたどって照合するかどうか（デフォルト: false）
 * @returns 選択範囲内のノード、またはその親ノードが指定された条件に一致する場合はtrue、それ以外はfalse
 *
 * @example
 * // 選択されたノードがimageタイプまたはimageグループに属するか確認
 * isNodeTypeSelected(editor, ['image']);
 *
 * @example
 * // 親ノードも含めてheadingまたはparagraphに一致するか確認
 * isNodeTypeSelected(editor, ['heading', 'paragraph'], true);
 */
export const isNodeTypeSelected = (
  editor: Editor | null,
  nodeTypeNames: string[] = [],
  checkAncestorNodes: boolean = false
): boolean => {
  if (!editor || !editor.state.selection) return false;

  const { selection } = editor.state;
  if (selection.empty) return false;

  // ノードタイプ名またはSchema上のグループ名が一致するかを判定する
  const matches = (node: PMNode) =>
    nodeTypeNames.some(
      (name) => node.type.name === name || node.type.isInGroup(name)
    );

  // ノード選択の場合は、選択されているノード自体を確認する
  if (selection instanceof NodeSelection) {
    const selectedNode = selection.node;
    return selectedNode ? matches(selectedNode) : false;
  }

  // オプションが有効な場合は、選択位置から親ノードを階層的にたどって確認する
  if (checkAncestorNodes) {
    const { $from } = selection;
    for (let depth = $from.depth; depth > 0; depth--) {
      if (matches($from.node(depth))) {
        return true;
      }
    }
  }

  return false;
};

/**
 * 現在の選択範囲が、指定されたノードタイプのみで構成されているかを判定する。
 *
 * 選択の種類に応じて、次の方法で判定する。
 *
 * - NodeSelectionの場合：選択されているノードのタイプ名を確認する。
 * - TextSelectionまたはAllSelectionの場合：選択範囲内に含まれる
 *   すべてのテキストブロックが、許可されたノードタイプであることを確認する。
 *
 * 選択範囲内に許可されていないテキストブロックが存在する場合は、
 * その時点で検証を終了し、falseを返す。
 *
 * エディタが存在しない場合、または許可するノードタイプが指定されていない場合は、
 * falseを返す。
 *
 * @param editor - 対象となるTiptapエディタインスタンス
 * @param types - 選択範囲内で許可するノードタイプ名の配列（デフォルト: 空配列）
 * @returns 選択されたノード、または選択範囲内のすべてのテキストブロックが
 *   許可されたノードタイプである場合はtrue、それ以外はfalse
 *
 * @example
 * // paragraphとheadingのみで構成された選択範囲か確認
 * selectionWithinConvertibleTypes(editor, ['paragraph', 'heading']);
 *
 * @example
 * // imageのみを許可する場合
 * selectionWithinConvertibleTypes(editor, ['image']);
 */
export const selectionWithinConvertibleTypes = (
  editor: Editor,
  types: string[] = []
): boolean => {
  if (!editor || types.length === 0) return false;

  const { state } = editor;
  const { selection } = state;
  const allowed = new Set(types);

  // ノード選択の場合は、選択されているノードのタイプ名を確認する
  if (selection instanceof NodeSelection) {
    const nodeType = selection.node?.type?.name;
    return !!nodeType && allowed.has(nodeType);
  }

  // テキスト選択または全選択の場合は、選択範囲内のテキストブロックを検証する
  if (selection instanceof TextSelection || selection instanceof AllSelection) {
    let valid = true;
    state.doc.nodesBetween(selection.from, selection.to, (node) => {
      if (node.isTextblock && !allowed.has(node.type.name)) {
        valid = false;
        return false; // 不許可のノードが見つかった時点で走査を終了する
      }
      return valid;
    });
    return valid;
  }

  return false;
};

/**
 * 画像ファイルをアップロードし、進捗状況の通知とアップロードのキャンセルに対応する。
 *
 * アップロード開始前にファイルの存在とサイズを検証する。
 * アップロード中は進捗状況をコールバック関数で通知し、
 * AbortSignalによるキャンセル要求があった場合は処理を中断する。
 *
 * 現在の実装では、デモ・テスト用としてアップロードの進捗を
 * 0%から100%まで10%刻みでシミュレートする。
 * 本番環境で使用する場合は、実際のアップロード処理に置き換える必要がある。
 *
 * @param file - アップロード対象の画像ファイル
 * @param onProgress - アップロードの進捗状況を通知するコールバック関数。
 *   進捗率を0〜100の数値で受け取る。
 * @param abortSignal - アップロードのキャンセルを制御するAbortSignal（省略可能）
 * @returns アップロードされた画像のURLを解決するPromise
 * @throws {Error} ファイルが指定されていない場合
 * @throws {Error} ファイルサイズが最大許容サイズを超えている場合
 * @throws {Error} アップロードがキャンセルされた場合
 *
 * @example
 * // 画像をアップロードし、進捗状況を取得する
 * await handleImageUpload(file, ({ progress }) => {
 *   console.log(`アップロード進捗: ${progress}%`);
 * });
 *
 * @example
 * // AbortControllerを使用してアップロードをキャンセルする
 * const controller = new AbortController();
 *
 * handleImageUpload(file, onProgress, controller.signal);
 *
 * // アップロードをキャンセル
 * controller.abort();
 */
export const handleImageUpload = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  // アップロード対象のファイルが指定されているか確認する
  if (!file) {
    throw new Error('No file provided');
  }

  // ファイルサイズが最大許容サイズを超えていないか確認する
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`
    );
  }

  // デモ・テスト用としてアップロードの進捗状況をシミュレートする。
  // 本番環境では、以下の処理を実際のファイルアップロード処理に置き換える。
  for (let progress = 0; progress <= 100; progress += 10) {
    if (abortSignal?.aborted) {
      throw new Error('Upload cancelled');
    }
    // 500ミリ秒待機してから進捗状況を通知する
    await new Promise((resolve) => setTimeout(resolve, 500));
    onProgress?.({ progress });
  }

  return '/images/tiptap-ui-placeholder-image.jpg';
};

/**
 * 登録するプロトコルの設定を定義する型。
 */
type ProtocolOptions = {
  /**
   * 登録するプロトコルのスキーム名。
   *
   * @default ''
   * @example 'ftp'
   * @example 'git'
   */
  scheme: string;

  /**
   * プロトコルの後に続くスラッシュ（//）を省略可能にするかどうか。
   *
   * @default false
   * @example true
   */
  optionalSlashes?: boolean;
};

/**
 * プロトコル設定の配列を定義する型。
 *
 * プロトコル名を文字列で直接指定するか、
 * ProtocolOptions型のオブジェクトで詳細な設定を指定できる。
 *
 * @example
 * ['ftp', 'git']
 *
 * @example
 * [
 *   'ftp',
 *   { scheme: 'git', optionalSlashes: true }
 * ]
 */
type ProtocolConfig = Array<ProtocolOptions | string>;

/**
 * URIから除去する空白文字および制御文字の正規表現。
 *
 * ASCII制御文字、通常の空白、改行、各種Unicode空白文字などを対象とする。
 *
 * 正規表現内で制御文字の範囲を指定するため、
 * ESLintのno-control-regexルールを無効化している。
 */
const ATTR_WHITESPACE =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g;

/**
 * 指定されたURIが許可されたプロトコルを使用しているかを判定する。
 *
 * 標準で許可されているプロトコルに加え、
 * 引数で追加のプロトコルを指定できる。
 *
 * 判定前にURI内の空白文字および制御文字を除去し、
 * 正規表現を使用してURIの先頭部分が安全な形式であるかを確認する。
 *
 * URIが未指定または空文字列の場合はtrueを返す。
 *
 * @param uri - 検証対象のURI文字列（undefinedの場合はtrueを返す）
 * @param protocols - 追加で許可するプロトコルの設定（省略可能）。
 *   プロトコル名の文字列、またはスキーム名などを指定した設定オブジェクトを受け取る。
 * @returns URIが許可された形式である場合はtrue、それ以外はfalse
 *
 * @example
 * // 標準で許可されているHTTPプロトコル
 * isAllowedUri('https://example.com'); // true
 *
 * @example
 * // 標準で許可されていないプロトコル
 * isAllowedUri('javascript:alert(1)'); // false
 *
 * @example
 * // 独自のプロトコルを追加して許可
 * isAllowedUri('git://example.com/repo', ['git']); // true
 *
 * @example
 * // 複数の独自プロトコルを追加
 * isAllowedUri('custom://example.com', [
 *   'git',
 *   { scheme: 'custom', optionalSlashes: true },
 * ]);
 */
export const isAllowedUri = (
  uri: string | undefined,
  protocols?: ProtocolConfig
) => {
  const allowedProtocols: string[] = [
    'http',
    'https',
    'ftp',
    'ftps',
    'mailto',
    'tel',
    'callto',
    'sms',
    'cid',
    'xmpp',
  ];

  if (protocols) {
    protocols.forEach((protocol) => {
      const nextProtocol =
        typeof protocol === 'string' ? protocol : protocol.scheme;

      if (nextProtocol) {
        allowedProtocols.push(nextProtocol);
      }
    });
  }

  return (
    !uri ||
    uri.replace(ATTR_WHITESPACE, '').match(
      new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^(?:(?:${allowedProtocols.join('|')}):|[^a-z]|[a-z0-9+.\-]+(?:[^a-z+.\-:]|$))`,
        'i'
      )
    )
  );
};

/**
 * URLを正規化し、許可されたプロトコルであることを検証したうえで安全なURLを返す。
 *
 * 入力されたURLと基準URLを使用してURLオブジェクトを生成する。
 * 相対URLが指定された場合は、基準URLをもとに絶対URLへ変換する。
 *
 * 生成したURLが許可されたプロトコルを使用している場合は、
 * 正規化されたURL文字列を返す。
 *
 * URLの生成に失敗した場合、または許可されていないプロトコルの場合は、
 * '#' を返す。
 *
 * @param inputUrl - 検証対象のURL文字列
 * @param baseUrl - 相対URLを解決する際の基準となるURL
 * @param protocols - 追加で許可するプロトコルの設定（省略可能）
 * @returns 検証に成功した場合は正規化されたURL文字列、失敗した場合は'#'
 *
 * @example
 * // 絶対URLを検証
 * sanitizeUrl('https://example.com', 'https://example.com');
 *
 * @example
 * // 相対URLを絶対URLに変換
 * sanitizeUrl('/images/sample.png', 'https://example.com');
 * // 'https://example.com/images/sample.png'
 *
 * @example
 * // 独自プロトコルを許可
 * sanitizeUrl('git://example.com/repo', 'https://example.com', ['git']);
 *
 * @example
 * // 許可されていないプロトコルの場合
 * sanitizeUrl('javascript:alert(1)', 'https://example.com');
 * // '#'
 */
export const sanitizeUrl = (
  inputUrl: string,
  baseUrl: string,
  protocols?: ProtocolConfig
): string => {
  try {
    const url = new URL(inputUrl, baseUrl);

    if (isAllowedUri(url.href, protocols)) {
      return url.href;
    }
  } catch {
    // If URL creation fails, it's considered invalid
  }
  return '#';
};

/**
 * 複数のノードに対して、単一の属性を更新する。
 *
 * @param tr - 変更を適用するトランザクション
 * @param targets - { node, pos } の配列
 * @param attrName - 更新する属性のキー
 * @param next - 新しい値、または以前の値を受け取る更新関数
 *               `undefined` を渡すと、その属性を削除する。
 * @returns 少なくとも1つのノードが更新された場合は true、
 *          それ以外の場合は false
 */
export const updateNodesAttr = <A extends string = string, V = unknown>(
  tr: Transaction,
  targets: readonly NodeWithPos[],
  attrName: A,
  next: V | ((prev: V | undefined) => V | undefined)
): boolean => {
  if (!targets.length) return false;

  let changed = false;

  for (const { pos } of targets) {
    // 常にトランザクションの現在のドキュメントから再取得する
    const currentNode = tr.doc.nodeAt(pos);
    if (!currentNode) continue;

    const prevValue = (currentNode.attrs as Record<string, unknown>)[
      attrName
    ] as V | undefined;
    const resolvedNext =
      typeof next === 'function'
        ? (next as (p: V | undefined) => V | undefined)(prevValue)
        : next;

    if (prevValue === resolvedNext) continue;

    const nextAttrs: Record<string, unknown> = { ...currentNode.attrs };
    if (resolvedNext === undefined) {
      // null を設定するのではなく、キー自体を完全に削除する
      delete nextAttrs[attrName];
    } else {
      nextAttrs[attrName] = resolvedNext;
    }

    tr.setNodeMarkup(pos, undefined, nextAttrs);
    changed = true;
  }

  return changed;
};

/**
 * 選択範囲が空の場合、現在のブロックノードのコンテンツ全体を選択する。
 * 選択範囲が空でない場合は、何も処理しない。
 * @param editor Tiptapのエディターインスタンス
 */
export const selectCurrentBlockContent = (editor: Editor) => {
  const { selection, doc } = editor.state;

  if (!selection.empty) return;

  const $pos = selection.$from;
  let blockNode = null;
  let blockPos = -1;

  for (let depth = $pos.depth; depth >= 0; depth--) {
    const node = $pos.node(depth);
    const pos = $pos.start(depth);

    if (node.isBlock && node.textContent.trim()) {
      blockNode = node;
      blockPos = pos;
      break;
    }
  }

  if (blockNode && blockPos >= 0) {
    const from = blockPos;
    const to = blockPos + blockNode.nodeSize - 2; // 閉じタグを除外するために -2 する

    if (from < to) {
      const $from = doc.resolve(from);
      const $to = doc.resolve(to);
      const newSelection = TextSelection.between($from, $to, 1);

      if (newSelection && !selection.eq(newSelection)) {
        editor.view.dispatch(editor.state.tr.setSelection(newSelection));
      }
    }
  }
};

/**
 * 現在の選択範囲から、指定されたタイプのノードをすべて取得する。
 * @param selection 現在のエディターの選択範囲
 * @param allowedNodeTypes 検索対象とするノードタイプ名の配列（例: ["image", "table"]）
 * @returns ノードとその位置を含むオブジェクトの配列
 */
export const getSelectedNodesOfType = (
  selection: Selection,
  allowedNodeTypes: string[]
): NodeWithPos[] => {
  const results: NodeWithPos[] = [];
  const allowed = new Set(allowedNodeTypes);

  if (selection instanceof CellSelection) {
    selection.forEachCell((node: PMNode, pos: number) => {
      if (allowed.has(node.type.name)) {
        results.push({ node, pos });
      }
    });
    return results;
  }

  if (selection instanceof NodeSelection) {
    const { node, from: pos } = selection;
    if (node && allowed.has(node.type.name)) {
      results.push({ node, pos });
    }
    return results;
  }

  const { $anchor } = selection;
  const cell = cellAround($anchor);

  if (cell) {
    const cellNode = selection.$anchor.doc.nodeAt(cell.pos);
    if (cellNode && allowed.has(cellNode.type.name)) {
      results.push({ node: cellNode, pos: cell.pos });
      return results;
    }
  }

  // フォールバック：許可されたタイプに該当する親ノードを検索する
  const parentNode = findParentNodeClosestToPos($anchor, (node) =>
    allowed.has(node.type.name)
  );

  if (parentNode) {
    results.push({ node: parentNode.node, pos: parentNode.pos });
  }

  return results;
};

/**
 * 値を最小値と最大値の範囲内に収める。
 *
 * @param value - 範囲内に収める値
 * @param min - 最小値
 * @param max - 最大値
 * @returns min 以上 max 以下に制限された値
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

/**
 * 現在のエディターの選択範囲に含まれるブロックノードをすべて取得する。
 *
 * @param editor - Tiptapのエディターインスタンス
 * @returns 選択範囲内のブロックノードの配列
 */
export const getSelectedBlockNodes = (editor: Editor): PMNode[] => {
  const { doc } = editor.state;
  const { from, to } = editor.state.selection;

  const blocks: PMNode[] = [];
  const seen = new Set<number>();

  doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isBlock) return;

    if (!seen.has(pos)) {
      seen.add(pos);
      blocks.push(node);
    }

    return false;
  });

  return blocks;
};
