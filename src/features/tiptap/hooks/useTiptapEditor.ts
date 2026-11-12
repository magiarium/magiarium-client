import type { Editor } from '@tiptap/react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { useEffect, useState } from 'react';

/**
 * エディターのストレージから、現在アクティブなページエディターを取得する。
 *
 * @param editor - メインのTiptapエディターインスタンス
 * @returns アクティブなページエディター。存在しない場合は null
 */
const getActivePageEditor = (editor: Editor): Editor | null => {
  const storage = editor.storage as unknown as Record<string, unknown>;
  const pages = storage.pages as { activeEditor?: Editor | null } | undefined;
  if (!pages || !('activeEditor' in pages)) return null;
  return pages.activeEditor ?? null;
};

/**
 * 現在使用するTiptapエディターとその状態を取得するカスタムフック。
 *
 * 明示的にエディターが渡された場合はそれを優先し、
 * 渡されていない場合はコンテキストからメインエディターを取得する。
 *
 * ページエディターが存在する場合は、アクティブなページエディターを使用する。
 * メインエディターの更新や選択範囲の変更を監視し、
 * アクティブなページエディターを同期する。
 *
 * また、ページエディターの破棄時には参照をクリアする。
 *
 * @param providedEditor - 任意で指定するTiptapエディターインスタンス
 * @returns 以下の情報を含むオブジェクト
 * - editor: 現在使用するエディターインスタンス。存在しない場合は null
 * - editorState: 現在のエディターの状態
 * - canCommand: コマンドの実行可否を確認する関数
 */
export const useTiptapEditor = (
  providedEditor?: Editor | null
): {
  editor: Editor | null;
  editorState?: Editor['state'];
  canCommand?: Editor['can'];
} => {
  const { editor: coreEditor } = useCurrentEditor();
  const mainEditor = providedEditor ?? coreEditor;

  const [storageEditor, setStorageEditor] = useState<Editor | null>(null);

  useEffect(() => {
    if (!mainEditor) {
      setStorageEditor(null);
      return;
    }

    const updateHandler = () =>
      setStorageEditor(getActivePageEditor(mainEditor));

    updateHandler();

    mainEditor.on('update', updateHandler);
    mainEditor.on('selectionUpdate', updateHandler);

    return () => {
      mainEditor.off('update', updateHandler);
      mainEditor.off('selectionUpdate', updateHandler);
    };
  }, [mainEditor]);

  useEffect(() => {
    if (!storageEditor) return;

    const handleDestroy = () => setStorageEditor(null);

    storageEditor.on('destroy', handleDestroy);
    return () => {
      storageEditor.off('destroy', handleDestroy);
    };
  }, [storageEditor]);

  const editorState = useEditorState({
    editor: storageEditor ?? mainEditor,
    selector(context) {
      if (!context.editor) {
        return { editor: null, editorState: undefined, canCommand: undefined };
      }

      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can,
      };
    },
  });

  return editorState ?? { editor: null };
};
