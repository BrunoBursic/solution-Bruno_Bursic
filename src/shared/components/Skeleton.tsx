import type { HTMLAttributes } from 'react'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-skeleton="true"
      className={`rounded-md bg-gray-200 motion-safe:animate-pulse dark:bg-gray-800 ${className}`}
      {...props}
    />
  )
}
