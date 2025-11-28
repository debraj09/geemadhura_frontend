import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  thumbnail: string;
  index?: number;
}

export const BlogCard = ({
  slug,
  title,
  excerpt,
  author,
  date,
  category,
  thumbnail,
  index = 0,
}: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/blog/${slug}`}>
        <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative h-48 bg-muted overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full">
              <span className="text-xs font-semibold text-primary-foreground">{category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-1">
              {excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{author}</span>
              </div>
            </div>

            {/* Read More */}
            <div className="flex items-center text-primary group-hover:text-accent-yellow transition-colors font-semibold">
              <span>Read Article</span>
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={18} />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};
