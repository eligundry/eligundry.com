import clsx from 'clsx'

interface Props {
  src: string
  alt: string
  className?: string
}

const DemoVideo: React.FC<Props> = ({ src, alt, className }) => (
  <video autoPlay loop alt={alt} muted className={clsx('mx-auto', className)}>
    <source src={src} />
  </video>
)

export default DemoVideo
