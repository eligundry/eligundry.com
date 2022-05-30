import Link, { LinkProps } from 'next/link'
import clsx from 'clsx'

export interface LinkButtonProps extends LinkProps {
  anchorProps?: Omit<
    React.HTMLAttributes<HTMLAnchorElement>,
    'href' | 'children'
  >
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  anchorProps: { className, ...anchorProps } = {},
  ...props
}) => (
  <Link {...props}>
    <a
      className={clsx(
        'bg-primary',
        'rounded-full',
        'text-white',
        'text-center',
        'font-sans',
        className
      )}
      {...anchorProps}
    >
      {children}
    </a>
  </Link>
)

export default LinkButton
