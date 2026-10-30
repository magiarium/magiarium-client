import { useIsBreakpoint } from '@/features/tiptap/hooks/useIsBreakpoint';
import { useTiptapEditor } from '@/features/tiptap/hooks/useTiptapEditor';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { BsTable } from 'react-icons/bs';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { CornerDownLeftIcon } from '../../icons/CornerDownLeftIcon';
import { Button, ButtonProps } from '../../ui-primitive/Button';
import { ButtonGroup } from '../../ui-primitive/ButtonGroup';
import { Card, CardBody, CardItemGroup } from '../../ui-primitive/Card';
import { Input } from '../../ui-primitive/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import {
  DEFAULT_TABLE_OPTIONS,
  TableOptions,
  useTable,
  UseTableConfig,
} from './useTable';

export interface TablePopoverProps
  extends Omit<ButtonProps, 'type'>, UseTableConfig {
  text?: string;
  onOpenChange?: (isOpen: boolean) => void;
  autoOpenOnTableActive?: boolean;
  modal?: boolean;
}
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
  tableOptions: TableOptions;
  setTableOptions: React.Dispatch<React.SetStateAction<TableOptions | null>>;
  setTable: () => void;
  isActive: boolean;
}

export const TableMain = ({
  tableOptions,
  setTableOptions,
  setTable,
  isActive,
}: TableMainProps) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setTable();
    }
  };
  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: 'none', border: 0 } : {}),
      }}
    >
      <CardBody
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        <CardItemGroup orientation="horizontal">
          <Input
            type="number"
            placeholder="列数"
            value={tableOptions.cols}
            onChange={(e) =>
              setTableOptions((prev) => {
                return {
                  cols: Number(e.target.value),
                  rows: prev?.rows ?? DEFAULT_TABLE_OPTIONS.rows,
                  withHeaderRow:
                    prev?.withHeaderRow ?? DEFAULT_TABLE_OPTIONS.withHeaderRow,
                };
              })
            }
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="tiptap-table-cols-input"
          />
          ×
          <Input
            type="number"
            placeholder="行数"
            value={tableOptions.rows}
            onChange={(e) =>
              setTableOptions((prev) => {
                return {
                  cols: prev?.cols ?? DEFAULT_TABLE_OPTIONS.cols,
                  rows: Number(e.target.value),
                  withHeaderRow:
                    prev?.withHeaderRow ?? DEFAULT_TABLE_OPTIONS.withHeaderRow,
                };
              })
            }
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="tiptap-table-rows-input"
          />
          <fieldset>
            ヘッダー
            <label>
              あり
              <Input
                type="radio"
                name="table-with-header-row"
                id="table-with-header-row-true"
                checked={tableOptions.withHeaderRow}
                onChange={() =>
                  setTableOptions((prev) => {
                    return {
                      cols: prev?.cols ?? DEFAULT_TABLE_OPTIONS.cols,
                      rows: prev?.rows ?? DEFAULT_TABLE_OPTIONS.rows,
                      withHeaderRow: true,
                    };
                  })
                }
              />
            </label>
            <label>
              なし
              <input
                type="radio"
                name="table-with-header-row"
                id="table-with-header-row-false"
                checked={!tableOptions.withHeaderRow}
                onChange={() =>
                  setTableOptions((prev) => {
                    return {
                      cols: prev?.cols ?? DEFAULT_TABLE_OPTIONS.cols,
                      rows: prev?.rows ?? DEFAULT_TABLE_OPTIONS.rows,
                      withHeaderRow: false,
                    };
                  })
                }
              />
            </label>
          </fieldset>
        </CardItemGroup>
        <ButtonGroup>
          <Button
            type="button"
            onClick={setTable}
            title="Apply link"
            disabled={!tableOptions && !isActive}
            variant="ghost"
          >
            <CornerDownLeftIcon className="tiptap-button-icon" />
          </Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};

export const TablePopover = forwardRef<HTMLButtonElement, TablePopoverProps>(
  (
    {
      editor: providedEditor,
      modal = true,
      text,
      hideWhenUnavailable = false,
      onSetTable,
      onOpenChange,
      autoOpenOnTableActive = true,
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
      setTable,
      label,
      Icon,
    } = useTable({
      editor,
      hideWhenUnavailable,
      onSetTable,
    });

    const shouldAutoOpen =
      autoOpenOnTableActive && !!editor?.isFocused && isActive;

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange]
    );

    const handleSetTable = useCallback(() => {
      setTable();
      setIsOpen(false);
    }, [setTable]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setIsOpen(!isOpen);
      },
      [onClick, isOpen]
    );

    useEffect(() => {
      if (shouldAutoOpen) {
        setIsOpen(true);
      }
    }, [shouldAutoOpen]);

    if (!isVisible) {
      return null;
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
                {text && <span className="tiptap-button-text">{text}</span>}
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </>
            )}
          </TableButton>
        </PopoverTrigger>

        <PopoverContent collisionPadding={10}>
          <TableMain
            tableOptions={tableOptions}
            setTableOptions={setTableOptions}
            setTable={handleSetTable}
            isActive={isActive}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
