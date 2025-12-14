import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  href: string;
  imageSrc: string;
  title: string;
  description?: string;
  showCTA?: boolean;
  priority?: boolean; // Add priority prop for above-the-fold images
}

export function CategoryCard({
  href,
  imageSrc,
  title,
  description,
  showCTA = false,
  priority = false,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden h-[350px] sm:h-[400px] md:h-[680px] rounded-none"
      style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.35)' }}
    >
      <Image
        src={imageSrc}
        alt={`${title} Collection`}
        fill
        priority={priority}
        className="object-cover "
        sizes="(max-width: 768px) 100vw, 33vw"
        quality={95}
      />
      {/* Cinematic Dark Overlay - Masculine Energy */}
      <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/40 to-black-pure/20 group-hover:from-black-pure/90 group-hover:via-black-pure/50 transition-all duration-500"></div>

      {/* Subtle Gold Glow on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-cinematic-xl"></div>

      {/* Content - Minimal & Bold */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 sm:p-8 md:p-10">
        <h3 className="text-white-pure text-2xl sm:text-2xl md:text-4xl font-figtree uppercase font-semibold mb-0 transform transition-all duration-500 drop-shadow-cinematic tracking-widest">
          {title}
        </h3>
      </div>
    </Link>
  );
}
