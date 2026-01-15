// Blog.tsx
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/BlogCard';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
      console.log('Fetched blog data:', data);
      
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
      <main className="min-h-screen">
        <section className="relative py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-10 bg-muted rounded-lg w-3/4 mx-auto mb-4"></div>
                <div className="h-5 bg-muted rounded-lg w-full mb-3"></div>
                <div className="h-5 bg-muted rounded-lg w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white/95 rounded-xl overflow-hidden border border-[#00283A]/20">
                    <div className="h-48 bg-muted"></div>
                    <div className="p-5">
                      <div className="h-3 bg-muted rounded w-16 mb-3"></div>
                      <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center animate-pulse">
              <div className="h-12 bg-muted rounded-lg w-48 mx-auto"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <section className="relative py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div  className="max-w-4xl mx-auto text-center">
              <h1 style={{color: '#00283A',marginTop:-30}} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Recent Stories From Our Blog</h1>
              <div className="bg-red-100 border border-red-400 rounded-lg p-5">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-5 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: '#00283A',
                    color: '#F2C445'
                  }}
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

  // Show only first 6 blogs on home page
  const displayBlogs = blogs.slice(0, 6);

  return (
    <main className="min-h-screen">
      {/* Hero Section - Reduced padding */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 style={{color: '#00283A',marginTop:-50}} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Recent Stories From Our Blog</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Stay informed with the latest trends, insights, and best practices in digital
              transformation and business technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid - Reduced padding */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {displayBlogs.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📝</div>
              <h3 style={{color: '#00283A'}} className="text-xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">Check back soon for new insights and updates!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayBlogs.map((post, index) => (
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
              
              {/* View All Blogs Button - Only show if there are more than 6 blogs */}
              {blogs.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-12 text-center"
                >
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:gap-3 hover:shadow-lg"
                    style={{
                      backgroundColor: '#00283A',
                      color: '#F2C445'
                    }}
                  >
                    View All Blogs
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;