import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/contexts/settings-context';

function Logo() {
  const { settings } = useSettings();

  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label={`${settings?.siteName || 'BogaRoyal Jewels'} home`}
    >
      {/* <h1 className="font-sans text-xl md:text-2xl text-white tracking-wide">
                {settings?.siteName || 'FORGE & STEEL'}
              </h1> */}
      <Image
        src={'/images/logo/logo-2-white.png'}
        alt={'BogaRoyal Jewels'}
        width={70}
        height={40}
        className="object-contain w-16 h-full sm:w-[70px] sm:h-full"
      />
    </Link>
  );
}
export default Logo;
