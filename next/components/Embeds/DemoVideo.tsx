import clsx from 'clsx'

interface Props {
  src: string
  alt: string
  className?: string
}

const DemoVideo: React.FC<Props> = ({ src, alt, className }) => (
  <a href={src}>
    <video autoPlay loop muted className={clsx('mx-auto', className)}>
      <source src={src} />
      {alt}
    </video>
  </a>
)

export default DemoVideo
