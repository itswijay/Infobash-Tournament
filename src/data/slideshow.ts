export interface Slide {
  id: string
  imageUrl: string
  alt: string
}

// Get configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const storageBucket = import.meta.env.VITE_STORAGE_BUCKET

// Build image URLs using environment variables
const buildImageUrl = (filename: string) => {
  if (!supabaseUrl || !storageBucket) {
    console.warn('Missing environment variables for slideshow images')
    return `/placeholder-${filename}.jpg` // Fallback to local placeholder
  }
  return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${filename}`
}

// Slideshow images with dynamic URLs
export const slideshowImages: Slide[] = [
  {
    id: '1',
    imageUrl: buildImageUrl('1.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '2',
    imageUrl: buildImageUrl('2.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '3',
    imageUrl: buildImageUrl('3.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '4',
    imageUrl: buildImageUrl('4.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '5',
    imageUrl: buildImageUrl('5.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '6',
    imageUrl: buildImageUrl('6.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '7',
    imageUrl: buildImageUrl('7.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '8',
    imageUrl: buildImageUrl('8.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '9',
    imageUrl: buildImageUrl('9.jpg'),
    alt: 'Previous Tournament Highlights',
  },
  {
    id: '10',
    imageUrl: buildImageUrl('10.jpg'),
    alt: 'Previous Tournament Highlights',
  },
]

// Configuration for the slideshow
export const slideshowConfig = {
  autoPlay: true,
  interval: 4000, // 4 seconds per slide
  showDots: true,
  showArrows: true,
  pauseOnHover: true,
}
