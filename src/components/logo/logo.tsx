import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/contexts/settings-context';

function Logo() {
  const { settings } = useSettings();

  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label={`${settings?.siteName || 'Crown Steel'} home`}
    >
      {/* <h1 className="font-sans text-xl md:text-2xl text-white tracking-wide">
                {settings?.siteName || 'FORGE & STEEL'}
              </h1> */}
      <Image
        src={'/images/logo/crownsteel-black.png'}
        alt={'CrownSteel'}
        width={150}
        height={150}
        className="object-contain w-28 h-full sm:w-[120px] sm:h-full"
      />
    </Link>
  );
}
export default Logo;
