// components/BlogCard.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';

interface BlogCardProps {
  id: number;
  title: string;
  short_description: string;
  banner_image: string;
  publish_date: string;
  author: string;
  tags: string;
  slug: string;
  index: number;
}

export const BlogCard = ({
  id,
  title,
  short_description,
  banner_image,
  publish_date,
  author,
  tags,
  slug,
  index
}: BlogCardProps) => {
  // Format date properly
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if date is invalid
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original string on error
    }
  };

  // Get first tag as category
  const category = tags ? tags.split(',')[0].trim() : 'General';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link to={`/blog/${slug}`} className="block h-full">
        <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
          {/* Blog Image */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex-shrink-0">
            {banner_image ? (
              <img
                src={`https://geemadhura.braventra.in${banner_image}`}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-xs font-semibold text-primary-foreground">
                  {category}
                </span>
              </span>
            </div>
          </div>

          {/* Blog Content */}
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>{formatDate(publish_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span>{author || 'Admin'}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-grow-0">
              {title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
              {short_description}
            </p>
            
            <div className="mt-auto pt-4 border-t border-border/50">
              <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                Read More
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};