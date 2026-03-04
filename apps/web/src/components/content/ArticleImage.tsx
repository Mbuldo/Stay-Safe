import { useState, type ReactNode } from 'react';
import { BookOpenText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ArticleImageProps {
  title: string;
  imageUrl?: string;
  containerClassName?: string;
  imageClassName?: string;
  children?: ReactNode;
}

export default function ArticleImage({
  title,
  imageUrl,
  containerClassName,
  imageClassName,
  children,
}: ArticleImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !failed;

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {showImage ? (
        <img
          src={imageUrl}
          alt={title}
          className={cn('h-full w-full object-cover', imageClassName)}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1f2d63] via-[#6f3d9a] to-[#e84874] px-5 py-6 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45) 0, transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.3) 0, transparent 38%)',
            }}
            aria-hidden
          />
          <div className="relative text-center">
            <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <BookOpenText className="h-5 w-5" />
            </span>
            <p className="mt-3 line-clamp-2 text-sm font-semibold leading-relaxed">{title}</p>
            <p className="mt-1 text-[11px] tracking-[0.12em] text-white/85 uppercase">Stay-Safe Article</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
