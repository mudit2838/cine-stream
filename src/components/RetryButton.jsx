'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
export default function RetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
      className="inline-block rounded-lg bg-red-600 px-5 py-2 disabled:opacity-50"
    >
      {pending ? 'Retrying...' : 'Try again'}
    </button>
  );
}
