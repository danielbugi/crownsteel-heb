import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/contexts/settings-context';

type LogoSize = 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg';
type LogoProps = {
  variant?: 'black' | 'white';
  size?: LogoSize;
};

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 60, height: 60 },
  md: { width: 90, height: 90 },
  lg: { width: 120, height: 120 },
  xlg: { width: 150, height: 150 },
  xxlg: { width: 200, height: 200 },
};

function Logo({ variant = 'black', size = 'xlg' }: LogoProps) {
  const { settings } = useSettings();
  const logoSrc =
    variant === 'white'
      ? '/images/logo/crownsteel-white.png'
      : '/images/logo/crownsteel-black.png';
  const safeSize = sizeMap[size] ? size : 'xlg';
  const { width, height } = sizeMap[safeSize];

  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label={`${settings?.siteName || 'Crown Steel'} home`}
    >
      <Image
        src={logoSrc}
        alt={settings?.siteName || 'CrownSteel'}
        width={width}
        height={height}
        className="object-contain"
      />
    </Link>
  );
}
export default Logo;
