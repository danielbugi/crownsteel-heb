import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  href: string;
  imageSrc: string;
  title: string;
  description?: string;
  showCTA?: boolean;
}

export function CategoryCard({
  href,
  imageSrc,
  title,
  description,
  showCTA = false,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden h-[350px] sm:h-[400px] md:h-[500px] rounded-none hover-masculine"
      style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.35)' }}
    >
      <Image
        src={imageSrc}
        alt={`${title} Collection`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
        quality={95}
      />
      {/* Cinematic Dark Overlay - Masculine Energy */}
      <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/40 to-black-pure/20 group-hover:from-black-pure/90 group-hover:via-black-pure/50 transition-all duration-500"></div>

      {/* Subtle Gold Glow on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-cinematic-xl"></div>

      {/* Content - Minimal & Bold */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
        <h3 className="text-white-pure text-3xl sm:text-4xl md:text-5xl uppercase font-cinzel font-bold mb-0 transform transition-all duration-500 group-hover:translate-y-[-8px] group-hover:text-gold-elegant drop-shadow-cinematic tracking-widest">
          {title}
        </h3>
        {description && (
          <p className="text-sm sm:text-base text-gray-300 mt-3 leading-relaxed font-light">
            {description}
          </p>
        )}
        {showCTA && (
          <div className="flex items-center gap-2 text-gold-elegant font-semibold text-sm sm:text-base mt-4 uppercase tracking-wider">
            <span>Explore</span>
            <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-2" />
          </div>
        )}
      </div>
    </Link>
  );
}
