# Geeemadhura Innovations - Corporate Website

Premium dark-red & black brochure-style corporate website built with React, Vite, TailwindCSS, Framer Motion, and GSAP.

## Project Overview

This is a complete corporate website featuring:
- Full-width hero slider with advanced animations
- Breaking news marquee
- Live updates section
- Services showcase with dynamic routing
- Testimonials slider
- Newsletter subscription
- FAQ accordion
- Blog system with list and detail pages
- Responsive design across all devices

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Component animations
- **GSAP** - Advanced hero animations
- **React Router** - Routing
- **Shadcn UI** - Component library

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed
- [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd geeemadhura-innovations

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

## Design System

### Color Palette

The website uses a sophisticated dark theme with strategic color accents:

- **Brand Red** (#DB1D30) - Primary brand color for headings and CTAs
- **Brand Black** (#000000) - Background and base color
- **Accent Yellow** (#FFD200) - CTA button text and highlights
- **Golden Yellow** (#F2C94C) - Marquee text and accents
- **Overlay Black** (#260526 @ 50%) - Hero overlays

### Typography

- **Headings**: Poppins (Google Fonts)
- **Body**: Inter (Google Fonts)
- All `<h2>` elements automatically use the brand red color

### Button Styling

All CTAs follow the brand guidelines:
- Default: Red background, yellow text
- Hover: Yellow background, red text
- Smooth transitions with transform effects

## Pages

1. **Home** (`/`) - Complete landing page with all key sections
2. **About** (`/about`) - Company story, values, and statistics
3. **Services** (`/services`) - Services grid overview
4. **Service Details** (`/services/:slug`) - Individual service pages
5. **Blog** (`/blog`) - Blog list page
6. **Blog Post** (`/blog/:slug`) - Individual blog posts
7. **Contact** (`/contact`) - Contact form and information
8. **404** - Custom error page

## Data Management

Dynamic content is managed through JSON files in `src/data/`:

- `updates.json` - Breaking news items
- `services.json` - Service offerings
- `testimonials.json` - Client testimonials
- `blog.json` - Blog posts

To update content, simply edit these JSON files and the changes will reflect across the site.

## Key Features

### Hero Slider
- 500px height (responsive on mobile/tablet)
- 3 slides with GSAP parallax and Framer Motion text animations
- Autoplay with pause on hover
- Keyboard navigation support
- Background overlay with brand colors

### Marquee
- Auto-scrolling news ticker
- Golden yellow text on red background
- Pause on hover
- Gradient edge masks for smooth appearance

### Animations
- Entrance animations using Framer Motion
- Scroll-triggered animations with viewport detection
- GSAP-powered hero transitions
- Smooth hover effects throughout

### Accessibility
- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Alt text for all images
- Focus states for interactive elements

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and configure the build
4. Your site will be live in minutes

### Other Platforms

The built static files in the `dist` folder after running `npm run build` can be deployed to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## Customization

### Adding New Services

1. Add service data to `src/data/services.json`
2. Service detail pages are automatically generated via dynamic routing

### Adding Blog Posts

1. Add post data to `src/data/blog.json`
2. Blog detail pages are automatically generated via dynamic routing

### Updating Colors

Edit color variables in `src/index.css` and `tailwind.config.ts` to maintain design system consistency.

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Header.tsx` and `src/components/Footer.tsx`

## Performance

- Lazy-loaded images
- Optimized animations
- Tree-shaken component library
- Code splitting via React Router
- Minimal bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

© 2025 Geeemadhura Innovations. All rights reserved.

## Support

For questions or support, contact: info@geeemadhura.com
