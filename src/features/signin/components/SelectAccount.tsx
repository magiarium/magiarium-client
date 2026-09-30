import classNames from 'classnames';
import { BsChevronRight } from 'react-icons/bs';
import { useUserData } from '../../auth/hooks/useUserData';
import { useAuthStep } from '../hooks/useAuthStep';
import { useSignin } from '../hooks/useSignin';
import './SelectAccount.scss';
import { UserIcon } from './common/AccountIcon';
import { LinkButton } from './common/LinkButton';

/**
 * ユーザーアカウント選択画面
 */
export const SelectAccount = () => {
  const { availableAccounts, currentAccount } = useUserData();
  const { signinByAccountInfo } = useSignin();
  const { setAuthStep } = useAuthStep();

  return (
    <div className="select-account">
      <div className="select-account__accounts">
        {availableAccounts.map((targetAccount, index) => {
          const isCurrentAccount = targetAccount.id === currentAccount.id;
          return (
            <button
              className={classNames(
                'select-account__button',
                isCurrentAccount && 'select-account__button--active'
              )}
              key={`user-account-${index}`}
              onClick={async () => {
                const result = await signinByAccountInfo(targetAccount);
                setAuthStep(result);
              }}
            >
              <UserIcon id={targetAccount.id} name={targetAccount.name} />
            </button>
          );
        })}
      </div>
      <div className="select-account__footer">
        <LinkButton
          onClick={() => {
            setAuthStep({
              type: 'SIGNIN_OTHER_ACCOUNT',
              accountId: '',
              accountName: '',
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
