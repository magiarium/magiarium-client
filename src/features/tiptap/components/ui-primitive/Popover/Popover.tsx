import { cn } from '@/features/tiptap/lib/tiptapUtils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import './Popover.scss';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  portal = false,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  portal?: boolean;
}) {
  const content = (
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn('tiptap-popover', className)}
      onCloseAutoFocus={(e) => e.preventDefault()}
      {...props}
    />
  );

  return portal ? (
    <PopoverPortal {...(typeof portal === 'object' ? portal : {})}>
      {content}
    </PopoverPortal>
  ) : (
    content
  );
}

function PopoverPortal({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Portal>) {
  return <PopoverPrimitive.Portal {...props} />;
}

export { Popover, PopoverContent, PopoverPortal, PopoverTrigger };
