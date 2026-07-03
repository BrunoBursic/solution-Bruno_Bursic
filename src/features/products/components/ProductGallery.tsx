import { useMemo, useState } from 'react'

interface ProductGalleryProps {
  title: string
  thumbnail: string
  images: string[]
}

function getGalleryImages(thumbnail: string, images: string[]): string[] {
  return Array.from(new Set([thumbnail, ...images].filter(Boolean)))
}

export function ProductGallery({ title, thumbnail, images }: ProductGalleryProps) {
  const galleryImages = useMemo(() => getGalleryImages(thumbnail, images), [images, thumbnail])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = galleryImages[selectedIndex] ?? thumbnail

  const goToPrevious = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1,
    )
  }

  const goToNext = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1,
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (galleryImages.length <= 1) {
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPrevious()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNext()
    }
  }

  return (
    <div
      className="space-y-3"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`${title} image gallery`}
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <img
          src={selectedImage}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5">
          {galleryImages.map((image, index) => {
            const isSelected = index === selectedIndex

            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show ${title} image ${index + 1}`}
                aria-pressed={isSelected}
                className={
                  isSelected
                    ? 'aspect-square overflow-hidden rounded-md ring-2 ring-gray-900 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:ring-gray-100 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950'
                    : 'aspect-square overflow-hidden rounded-md ring-1 ring-gray-200 transition hover:ring-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none dark:ring-gray-700 dark:hover:ring-gray-400 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950'
                }
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
