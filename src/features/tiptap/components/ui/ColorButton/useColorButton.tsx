import { HighlightMode } from '@/features/tiptap/components/ui/ColorHighlightButton';
import { Editor } from '@tiptap/react';

const COLORS = [
  {
    label: 'Red',
    font: {
      value: 'var(--tt-color-text-red)',
      colorValue: '#d32f2f',
      border: 'var(--tt-color-text-red-contrast)',
    },
    highlight: {
      value: 'var(--tt-color-highlight-yellow)',
      colorValue: '#fef9c3',
      border: 'var(--tt-color-highlight-yellow-contrast)',
    },
  },
];

export interface UseColorConfig {
  editor?: Editor | null;

  font: {
    color?: string;
    label?: string;
    onApplied?: ({ color, label }: { color: string; label: string }) => void;
  };

  highlight: {
    color?: string;
    label?: string;
    onApplied?: ({
      color,
      label,
      mode,
    }: {
      color: string;
      label: string;
      mode: HighlightMode;
    }) => void;
  };

  hideWhenUnavailable?: boolean;

  useColorValue?: boolean;
}

export type Color = (typeof COLORS)[number];

export type ColorDefinition = {
  fontColor: string;
  highlightColor: string;
};

export const pickColorByValue = (values: ColorDefinition[]): Color[] => {
  const colorMap = new Map(
    COLORS.map((color) => [
      `${color.font.value}:${color.highlight.value}`,
      color,
    ])
  );

  return values
    .map(({ fontColor, highlightColor }) =>
      colorMap.get(`${fontColor}:${highlightColor}`)
    )
    .filter((color): color is Color => !!color);
};
