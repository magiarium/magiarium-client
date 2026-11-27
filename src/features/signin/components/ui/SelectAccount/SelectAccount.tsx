import { useUserData } from '@/features/auth/hooks/useUserData';
import { AccountIcon } from '@/features/signin/components/ui-primitive/AccountIcon/AccountIcon';
import { LinkButton } from '@/features/signin/components/ui-primitive/LinkButton/LinkButton';
import { useAuthStep } from '@/features/signin/hooks/useAuthStep';
import { useSignin } from '@/features/signin/hooks/useSignin';
import classNames from 'classnames';
import { BsChevronRight } from 'react-icons/bs';
import './SelectAccount.scss';

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
              <AccountIcon id={targetAccount.id} name={targetAccount.name} />
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
