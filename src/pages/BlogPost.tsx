// BlogPost.tsx
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/BlogCard';
import { useEffect, useState } from 'react';

interface BlogPostData {
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
}

interface RelatedBlogPost {
  id: number;
  title: string;
  short_description: string;
  banner_image: string;
  publish_date: string;
  author: string;
  tags: string;
  slug: string;
}

const API_BASE_URL = 'https://geemadhura.braventra.in/api';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const fetchAllBlogs = async (): Promise<BlogPostData[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }
      
      const data = await response.json();
      
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

  const fetchBlogById = async (id: string | number): Promise<BlogPostData | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        ...data.data,
        slug: generateSlug(data.data.title),
        date: data.data.publish_date,
        category: data.data.tags ? data.data.tags.split(',')[0] : 'General'
      };
    } catch (error) {
      console.error(`Error fetching blog ID ${id}:`, error);
      return null;
    }
  };

  const fetchBlogBySlug = async (slug: string): Promise<BlogPostData | null> => {
    try {
      const allBlogs = await fetchAllBlogs();
      return allBlogs.find(blog => blog.slug === slug) || null;
    } catch (error) {
      console.error(`Error fetching blog by slug ${slug}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        
        // Load the current post
        const currentPost = await fetchBlogBySlug(slug);
        
        if (!currentPost) {
          setNotFound(true);
          return;
        }

        setPost(currentPost);

        // Load all posts to find related ones
        const allPosts = await fetchAllBlogs();
        const related = allPosts
          .filter(p => p.id !== currentPost.id)
          .slice(0, 3)
          .map(post => ({
            id: post.id,
            title: post.title,
            short_description: post.short_description,
            banner_image: post.banner_image,
            publish_date: post.publish_date,
            author: post.author,
            tags: post.tags || '',
            slug: post.slug
          }));
        
        setRelatedPosts(related);
      } catch (error) {
        console.error('Error loading blog post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (notFound) {
    return <Navigate to="/blog" replace />;
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/blog">
            <Button variant="ghost" className="hover:text-primary">
              <ArrowLeft className="mr-2" size={20} />
              Back to Blog
            </Button>
          </Link>
        </div>

        <article className="pb-16 md:pb-24">
          <header className="relative py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-background mb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto animate-pulse">
                <div className="h-8 bg-muted rounded-lg w-32 mb-6"></div>
                <div className="h-12 bg-muted rounded-lg w-3/4 mb-6"></div>
                <div className="flex gap-6">
                  <div className="h-6 bg-muted rounded-lg w-40"></div>
                  <div className="h-6 bg-muted rounded-lg w-32"></div>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto animate-pulse">
              <div className="h-96 bg-muted rounded-2xl mb-12"></div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-full"></div>
                <div className="h-6 bg-muted rounded w-full"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </article>
      </main>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // FIXED: Safe tag splitting with null check
  const getCategory = () => {
    if (!post.tags) return 'General';
    const tagsArray = post.tags.split(',');
    return tagsArray[0]?.trim() || 'General';
  };

  const category = getCategory();

  // FIXED: Safe content splitting
  const getContentParagraphs = () => {
    if (!post.full_content) return [];
    return post.full_content.split('\n\n').filter(para => para.trim());
  };

  const contentParagraphs = getContentParagraphs();

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
                    {category}
                  </span>
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>{formatDate(post.publish_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span>{post.author || 'Admin'}</span>
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
            {/* Featured Image */}
            <div className="relative h-96 rounded-2xl mb-12 overflow-hidden">
              {post.banner_image ? (
                <img
                  src={`https://geemadhura.braventra.in${post.banner_image}`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.className = 
                      'relative h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-12 flex items-center justify-center';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = 
                      '<div class="text-6xl text-muted-foreground/30">📝</div>';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-6xl text-muted-foreground/30">📝</div>
                </div>
              )}
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-muted-foreground leading-relaxed mb-6 text-lg"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {post.short_description || 'No content available.'}
                </p>
              )}
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
                <BlogCard
                  key={relatedPost.id}
                  id={relatedPost.id}
                  title={relatedPost.title}
                  short_description={relatedPost.short_description}
                  banner_image={relatedPost.banner_image}
                  publish_date={relatedPost.publish_date}
                  author={relatedPost.author}
                  tags={relatedPost.tags || ''}
                  slug={relatedPost.slug}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default BlogPost;