import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import {
  isMarkInSchema,
  isNodeTypeSelected,
} from '@/features/tiptap/lib/tiptapUtils';
import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { BsPalette } from 'react-icons/bs';

export const FONT_COLORS = [
  {
    label: 'Red',
    value: 'var(--tt-color-text-red)',
    colorValue: '#d32f2f',
    border: 'var(--tt-color-text-red-contrast)',
  },
];

export type FontColor = (typeof FONT_COLORS)[number];

export interface UseFontColorConfig {
  editor?: Editor | null;

  fontColor?: string;

  label?: string;

  hideWhenUnavailable?: boolean;

  useColorValue?: boolean;

  onApplied?: ({ color, label }: { color: string; label: string }) => void;
}

export const pickFontColorByValue = (values: string[]) => {
  const colorMap = new Map(FONT_COLORS.map((color) => [color.value, color]));

  return values
    .map((value) => colorMap.get(value))
    .filter((color): color is (typeof FONT_COLORS)[number] => !!color);
};

export const canFontColor = (editor: Editor | null): boolean => {
  if (!editor || !editor.isEditable) return false;

  if (
    !isMarkInSchema('textStyle', editor) ||
    isNodeTypeSelected(editor, ['image'])
  ) {
    return false;
  }

  return editor.can().setColor('test');
};

export const getFontColorValue = (
  color: string,
  useColorValue: boolean
): string => {
  if (!useColorValue) return color;

  const colorItem = FONT_COLORS.find(
    (c) => c.value === color || c.colorValue === color
  );

  return colorItem?.colorValue || color;
};

export const isFontColorActive = (
  editor: Editor | null,
  fontColor?: string
): boolean => {
  if (!editor || !editor.isEditable) return false;

  return fontColor
    ? editor.isActive('fontStyle', { color: fontColor })
    : editor.isActive('fontStyle');
};

export const shouldShowButton = (props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean => {
  const { editor, hideWhenUnavailable } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  if (!isMarkInSchema('textStyle', editor)) return false;

  if (!editor.isActive('code')) {
    return canFontColor(editor);
  }

  return true;
};

export const setFontColor = (
  editor: Editor | null,
  fontColor: string
): boolean => {
  if (!editor || editor.isDestroyed || editor?.isEditable) return false;
  if (!canFontColor(editor)) return false;

  return editor.chain().focus().setColor(fontColor).run();
};

export const removeFontColor = (editor: Editor | null) => {
  if (!editor || !editor.isEditable) return false;
  if (!canFontColor(editor)) return false;

  return editor.chain().focus().unsetColor().run();
};

export const useFontColor = (config: UseFontColorConfig) => {
  const {
    editor: providedEditor,
    label,
    fontColor,
    hideWhenUnavailable = false,
    useColorValue = false,
    onApplied,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canFontColorState = canFontColor(editor);
  const actualColor = fontColor
    ? getFontColorValue(fontColor, useColorValue)
    : fontColor;
  const isActive = isFontColorActive(editor, actualColor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleFontColor = useCallback(() => {
    if (!actualColor || !label) {
      return false;
    }
    const succsess = setFontColor(editor, actualColor);
    if (succsess) {
      onApplied?.({ color: actualColor, label });
    }
    return succsess;
  }, [canFontColorState, actualColor, editor, label, onApplied]);

  const handleRemoveFontColor = useCallback(() => {
    const success = removeFontColor(editor);
    if (success) {
      onApplied?.({ color: '', label: 'Remove FontColor' });
    }
    return success;
  }, [editor, onApplied]);

  return {
    isVisible,
    isActive,
    handleFontColor,
    handleRemoveFontColor,
    canFontColor: canFontColorState,
    label: label,
    Icon: BsPalette,
  };
};
