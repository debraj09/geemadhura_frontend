import { motion } from 'framer-motion';
import { BlogCard } from '@/components/BlogCard';
import blog from '@/data/blog.json';

const Blog = () => {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Insights & Updates</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Stay informed with the latest trends, insights, and best practices in digital
              transformation and business technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blog.map((post, index) => (
              <BlogCard key={post.id} {...post} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
