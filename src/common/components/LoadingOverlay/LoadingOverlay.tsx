import './LoadingOverlay.scss';

/**
 * ローディング時に未完成のコンポーネントが見えないようにするオーバーレイ
 *
 * @param params.isLoading ローディング状態(true: ローディング中、false: ローディング完了)
 * @param params.overlayColor オーバーレイカラー ※`black` or `white`
 */
export const LoadingOverlay = ({
  isLoading,
  overlayColor,
}: {
  isLoading: boolean;
  overlayColor: 'white' | 'black';
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={`loading-overlay loading-overlay--${overlayColor}`}
      role="status"
      aria-label="読み込み中"
    />
  );
};
