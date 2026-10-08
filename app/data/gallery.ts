// Photos shown in the "Off the clock" section.
//
// 1. Drop your images in `public/gallery/` (jpg / webp, ~1600px wide is plenty)
// 2. Add one entry per image below — order here = order on the site
//
//  src      path from /public, e.g. '/gallery/annecy.jpg'
//  alt      what's in the picture, for screen readers (required)
//  caption  optional short text shown on hover and in the lightbox
//  size     optional 'wide' (2 columns) or 'tall' (2 rows) for variety

export interface GalleryItem {
  src: string
  alt: string
  caption?: string
  size?: 'wide' | 'tall'
}

export const gallery: GalleryItem[] = [
  // { src: '/gallery/annecy.jpg', alt: 'Lake Annecy at sunrise', caption: 'Annecy, 2025', size: 'wide' },
  // { src: '/gallery/setup.jpg', alt: 'My desk setup with two monitors', caption: 'Where it happens' },
]
