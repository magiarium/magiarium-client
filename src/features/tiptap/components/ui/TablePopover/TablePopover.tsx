import { Button as MagiariumButton } from '@/common/components/Button';
import { forwardRef, useCallback, useState } from 'react';

// --- Hooks ---
import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';

// --- Icons ---
import { ChevronDownIcon } from '@/features/tiptap/components/icons/ChevronDownIcon';
import { BsTable } from 'react-icons/bs';

// --- Tiptap UI ---
import {
  TableOptions,
  useTable,
  UseTableConfig,
} from '@/features/tiptap/components/ui/TablePopover';

// --- UI Primitives ---
import {
  Button,
  ButtonProps,
} from '@/features/tiptap/components/ui-primitive/Button';
import { ButtonGroup } from '@/features/tiptap/components/ui-primitive/ButtonGroup';
import {
  Card,
  CardBody,
  CardItemGroup,
} from '@/features/tiptap/components/ui-primitive/Card';
import { Input } from '@/features/tiptap/components/ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/tiptap/components/ui-primitive/Popover';

// --- Style
import './TablePopover.scss';

export interface TablePopoverProps
  extends Omit<ButtonProps, 'type'>, UseTableConfig {
  /**
   * 追加時アイコンの横に表示する補足テキスト(任意)
   */
  insertText?: string;
  /**
   * 削除時アイコンの横に表示する補足テキスト(任意)
   */
  deleteText?: string;
  /**
   * ポップオーバー開閉時のコールバック関数
   * @param isOpen 開閉状態
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * ポップオーバーをモーダルにするか
   * @default false
   */
  modal?: boolean;
}

/**
 * テーブルボタン
 */
export const TableButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        type="button"
        className={className}
        variant="ghost"
        role="button"
        tabIndex={-1}
        aria-label="Link"
        tooltip="Link"
        ref={ref}
        {...props}
      >
        {children || <BsTable className="tiptap-button-icon" />}
      </Button>
    );
  }
);

export interface TableMainProps {
  /**
   * テーブルオプション
   */
  tableOptions: TableOptions;

  /**
   * テーブルオプション更新用関数
   */
  setTableOptions: React.Dispatch<React.SetStateAction<TableOptions>>;

  /**
   * エディター内にテーブルを設定するための関数
   */
  insertTable: () => void;

  /**
   * エディター内のテーブルを削除するための関数
   */
  deleteTable: () => void;

  /**
   * エディターに対して、現在テーブルがアクティブ状態か否か
   * @default false
   */
  isActive: boolean;
}

/**
 * テーブルポップオーバーのメインコンテンツ
 */
export const TableMain = ({
  tableOptions,
  setTableOptions,
  insertTable,
  isActive,
}: TableMainProps) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      insertTable();
    }
  };

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: 'none', border: 0 } : {}),
      }}
    >
      <CardBody
        className="tiptap-table-popover__content-container"
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        <CardItemGroup
          className="tiptap-table-popover__group"
          orientation="horizontal"
        >
          <label>
            行：
            <Input
              type="number"
              placeholder="行数"
              disabled={isActive}
              value={tableOptions.rows}
              onChange={(e) =>
                setTableOptions((prev) => {
                  return {
                    ...prev,
                    rows: Number(e.target.value),
                  };
                })
              }
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="tiptap-table-popover__input"
            />
          </label>
          ×
          <label>
            列：
            <Input
              type="number"
              placeholder="列数"
              disabled={isActive}
              value={tableOptions.cols}
              onChange={(e) =>
                setTableOptions((prev) => {
                  return {
                    ...prev,
                    cols: Number(e.target.value),
                  };
                })
              }
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="tiptap-table-popover__input"
            />
          </label>
        </CardItemGroup>
        <CardItemGroup
          className="tiptap-table-popover__group"
          orientation="horizontal"
        >
          <label className="tiptap-table-popover__with-header-selector">
            ヘッダー:
            <select
              value={String(tableOptions.withHeaderRow)}
              onChange={(event) => {
                setTableOptions((prev) => {
                  return {
                    ...prev,
                    withHeaderRow: JSON.parse(event.target.value),
                  };
                });
              }}
            >
              <option value="true">あり</option>
              <option value="false">なし</option>
            </select>
          </label>
        </CardItemGroup>
        <ButtonGroup className="tiptap-table-popover__group">
          <MagiariumButton type="button" onClick={insertTable}>
            テーブル追加
          </MagiariumButton>
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};

/**
 * Tiptapエディターのテーブルポップオーバーコンポーネント
 *
 * カスタムボタンを実装する場合は、代わりに `useTable` フックを使用してください。
 */
export const TablePopover = forwardRef<HTMLButtonElement, TablePopoverProps>(
  (
    {
      editor: providedEditor,
      modal = true,
      insertText,
      deleteText,
      hideWhenUnavailable = false,
      onSetTable,
      onOpenChange,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {
      isVisible,
      canSet,
      isActive,
      tableOptions,
      setTableOptions,
      insertTable,
      deleteTable,
      label,
      Icon,
    } = useTable({
      editor,
      hideWhenUnavailable,
      onSetTable,
    });

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );

    const handleSetTable = useCallback(() => {
      insertTable();
      setIsOpen(false);
    }, [insertTable]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setIsOpen(!isOpen);
      },
      [onClick, isOpen]
    );

    if (!isVisible) {
      return null;
    }

    if (isActive) {
      return (
        <TableButton
          disabled={!canSet}
          data-active-state={isActive ? 'on' : 'off'}
          data-disabled={!canSet}
          aria-label={label}
          aria-pressed={isActive}
          onClick={deleteTable}
          {...buttonProps}
          ref={ref}
        >
          {children ?? (
            <>
              <Icon className="tiptap-button-icon" />
              {deleteText && (
                <span className="tiptap-button-text">{deleteText}</span>
              )}
            </>
          )}
        </TableButton>
      );
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOnOpenChange} modal={modal}>
        <PopoverTrigger asChild>
          <TableButton
            disabled={!canSet}
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canSet}
            aria-label={label}
            aria-pressed={isActive}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? (
              <>
                <Icon className="tiptap-button-icon" />
                {insertText && (
                  <span className="tiptap-button-text">{insertText}</span>
                )}
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </>
            )}
          </TableButton>
        </PopoverTrigger>

        <PopoverContent collisionPadding={10}>
          <TableMain
            tableOptions={tableOptions}
            setTableOptions={setTableOptions}
            insertTable={handleSetTable}
            deleteTable={deleteTable}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
