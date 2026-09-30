import classNames from 'classnames';
import { BsChevronRight } from 'react-icons/bs';
import { useUserData } from '../../auth/hooks/useUserData';
import { UNKNOWN_USER_ICON } from '../define';
import { useAuthStep } from '../hooks/useAuthStep';
import { useSignin } from '../hooks/useSignin';
import './SelectUserAccount.scss';
import { LinkButton } from './common/LinkButton';
import { UserIcon } from './common/UserIcon';

/**
 * ユーザーアカウント選択画面
 */
export const SelectUserAccount = () => {
  const { availableAccounts, currentAccount } = useUserData();
  const { signinBySelectUser } = useSignin();
  const { setAuthStep } = useAuthStep();

  return (
    <div className="select-user-account">
      <div className="select-user-account__accounts">
        {availableAccounts.map((targetAccount, index) => {
          const isCurrentAccount = targetAccount.id === currentAccount.id;
          return (
            <button
              className={classNames(
                'select-user-account__button',
                isCurrentAccount && 'select-user-account__button--active'
              )}
              key={`user-account-${index}`}
              onClick={async () => {
                const result = await signinBySelectUser(targetAccount);
                setAuthStep(result);
              }}
            >
              <UserIcon icon={targetAccount.icon} name={targetAccount.name} />
            </button>
          );
        })}
      </div>
      <div className="select-user-account__footer">
        <LinkButton
          onClick={() => {
            setAuthStep({
              type: 'SIGNIN_OTHER_ACCOUNT',
              name: '',
              icon: UNKNOWN_USER_ICON,
            });
          }}
        >
          他のアカウント
          <BsChevronRight />
        </LinkButton>
      </div>
    </div>
  );
};
