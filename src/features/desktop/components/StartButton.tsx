import Image from 'next/image';
import './StartButton.scss';
export const StartButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="start-button" onClick={onClick}>
      <Image
        src={'/assets/images/start-menu.svg'}
        alt="スタート"
        width={515}
        height={515}
      />
    </button>
  );
};
