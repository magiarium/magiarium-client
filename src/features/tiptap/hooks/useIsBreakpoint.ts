'use client';

import { useEffect, useState } from 'react';

type BreakpointMode = 'min' | 'max';

/**
 * 現在のビューポートが指定されたブレークポイントの条件に一致するかどうかを判定するフック。
 *
 * Example:
 *   useIsBreakpoint("max", 768)   // 幅が768px未満の場合に true
 *   useIsBreakpoint("min", 1024)  // 幅が1024px以上の場合に true
 *
 * @param mode - ブレークポイントの判定モード。"max" は指定幅未満、"min" は指定幅以上を判定する。
 *               @default "max"
 * @param breakpoint - 判定に使用するビューポートの幅（px）。
 *                     @default 768
 * @returns 現在のビューポートが指定されたブレークポイントの条件に一致する場合は true、
 *          それ以外の場合は false
 */
export function useIsBreakpoint(
  mode: BreakpointMode = 'max',
  breakpoint = 768
) {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const query =
      mode === 'min'
        ? `(min-width: ${breakpoint}px)`
        : `(max-width: ${breakpoint - 1}px)`;

    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // 初期値設定
    setMatches(mql.matches);

    // listener追加
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode, breakpoint]);

  return !!matches;
}
