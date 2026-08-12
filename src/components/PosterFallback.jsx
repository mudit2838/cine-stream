import { Film } from 'lucide-react';

export default function PosterFallback({ title = 'Untitled' }) {
  return (
    <div className="w-full h-full aspect-[2/3] bg-slate-900/90 border-b border-slate-800 flex flex-col items-center justify-center p-4 text-center text-slate-500 select-none">
      <Film className="w-10 h-10 text-slate-600 mb-1" />
      <span className="text-xs font-semibold text-slate-400 line-clamp-2 px-1">
        {title}
      </span>
      <span className="text-[11px] text-slate-500 font-medium mt-1">
        No Poster Available
      </span>
    </div>
  );
}
