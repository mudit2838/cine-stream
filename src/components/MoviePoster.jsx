'use client';
import Image from 'next/image';
import { useState } from 'react';
import PosterFallback from './PosterFallback';
import { getPosterUrl } from '@/lib/posters';
export default function MoviePoster({ path, title, priority = false }) {
  const [failed, setFailed] = useState(false);
  const src = getPosterUrl(path);
  return !src || failed ? (
    <PosterFallback title={title} />
  ) : (
    <Image
      src={src}
      alt={`${title} poster`}
      fill
      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 220px"
      priority={priority}
      onError={() => setFailed(true)}
      className="object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}
