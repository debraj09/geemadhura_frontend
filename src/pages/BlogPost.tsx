import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/BlogCard';
import blog from '@/data/blog.json';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blog.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blog.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main className="min-h-screen pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/blog">
          <Button variant="ghost" className="hover:text-primary">
            <ArrowLeft className="mr-2" size={20} />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="pb-16 md:pb-24">
        <header className="relative py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-background mb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-full">
                  <Tag size={16} className="text-primary-foreground" />
                  <span className="text-sm font-semibold text-primary-foreground">
                    {post.category}
                  </span>
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{post.author}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Article Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Featured Image Placeholder */}
            <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-12" />

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="text-muted-foreground leading-relaxed mb-6 text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Related Articles</h2>
              <p className="text-muted-foreground text-lg">
                Continue exploring our insights and updates
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <BlogCard key={relatedPost.id} {...relatedPost} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default BlogPost;
