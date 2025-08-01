'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface BackButtonProps {
  className?: string;
  hidden?: boolean;
}

export default function BackButton({ className, hidden }: BackButtonProps) {
  const router = useRouter();
  if (hidden) return null;
  return (
    <button
      onClick={() => router.back()}
      className={twMerge(
        'flex items-center gap-1 text-sm text-gray-500 dark:text-gray-300 hover:text-primary-500',
        className
      )}
    >
      <ArrowLeftIcon className="w-5 h-5" />
      Back
    </button>
  );
}