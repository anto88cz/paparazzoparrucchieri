import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  href?: string;
  variant?: 'default' | 'service' | 'blog';
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  title,
  description,
  icon,
  image,
  href,
  variant = 'default',
  className = '',
  children,
}: CardProps) {
  const baseStyles = 'group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col';

  const content = (
    <>
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}
      <div className="p-6 flex flex-col h-full">
        {icon && !image && (
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-2xl shadow-lg">
            {icon}
          </div>
        )}
        <h3 className="mb-3 font-display text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mb-4 text-gray-600 leading-relaxed">{description}</p>
        <div className="mt-auto">{children}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${className} block`}>
        {content}
      </Link>
    );
  }

  return <div className={`${baseStyles} ${className}`}>{content}</div>;
}


