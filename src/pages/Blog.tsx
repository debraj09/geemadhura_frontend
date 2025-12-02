// Blog.tsx
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/BlogCard';
import { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  short_description: string;
  full_content: string;
  banner_image: string;
  publish_date: string;
  tags: string;
  author: string;
  slug: string;
  category: string;
  date: string;
}

const API_BASE_URL = 'https://geemadhura.braventra.in/api';

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const fetchAllBlogs = async (): Promise<BlogPost[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the data to include slug
      return data.data.map((blog: any) => ({
        ...blog,
        slug: generateSlug(blog.title),
        date: blog.publish_date,
        category: blog.tags ? blog.tags.split(',')[0] : 'General'
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const data = await fetchAllBlogs();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-12 bg-muted rounded-lg w-3/4 mx-auto mb-6"></div>
                <div className="h-6 bg-muted rounded-lg w-full mb-4"></div>
                <div className="h-6 bg-muted rounded-lg w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-card rounded-xl overflow-hidden border border-border">
                    <div className="h-64 bg-muted"></div>
                    <div className="p-6">
                      <div className="h-4 bg-muted rounded w-20 mb-4"></div>
                      <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-20">
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Insights & Updates</h1>
              <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
                <p className="text-destructive">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

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
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">Check back soon for new insights and updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, index) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  short_description={post.short_description}
                  banner_image={post.banner_image}
                  publish_date={post.publish_date}
                  author={post.author}
                  tags={post.tags}
                  slug={post.slug}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;