import clsx from 'clsx'
import styles from './Paper.module.scss'

export interface PaperProps extends React.HTMLAttributes<HTMLElement> {
  element?: 'div' | 'article' | 'section' | 'figure'
  transparent?: boolean
  noPadding?: boolean
}

const Paper: React.FC<PaperProps> = ({
  element = 'div',
  className,
  transparent = false,
  noPadding,
  ...props
}) => {
  const Component = element

  return (
    <Component
      className={clsx(
        styles.paper,
        transparent ? styles.transparent : styles.notTransparent,
        className
      )}
      {...props}
    />
  )
}

export default Paper
