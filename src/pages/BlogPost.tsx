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

        console.log ('Current Post:', currentPost); // Debugging log  
        
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

  // Generate Schema.org markup
  const generateSchemaMarkup = () => {
    if (!post) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.short_description,
      "image": post.banner_image ? `https://geemadhura.braventra.in${post.banner_image}` : '',
      "datePublished": post.publish_date,
      "dateModified": post.publish_date,
      "author": {
        "@type": "Person",
        "name": post.author || 'Admin'
      },
      "publisher": {
        "@type": "Organization",
        "name": "Geemadhura",
        "logo": {
          "@type": "ImageObject",
          "url": "https://geemadhura.braventra.in/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://geemadhura.braventra.in/blog/${post.slug}`
      }
    };

    return {
      __html: JSON.stringify(schema)
    };
  };

  // Clean and render HTML content from Jodit Editor
  const renderHTMLContent = () => {
    if (!post || !post.full_content) {
      return <p className="text-muted-foreground leading-relaxed text-lg">No content available.</p>;
    }

    // Function to clean Jodit HTML
    const cleanHTML = (html: string) => {
      return html
        .replace(/<p>\s*&nbsp;\s*<\/p>/g, '') // Remove empty paragraphs with &nbsp;
        .replace(/<p>\s*<br>\s*<\/p>/g, '') // Remove paragraphs containing only <br>
        .replace(/<p><\/p>/g, '') // Remove completely empty paragraphs
        .replace(/<br>\s*<br>/g, '</p><p>') // Convert double line breaks to paragraph breaks
        .trim();
    };

    const cleanedContent = cleanHTML(post.full_content);

    if (!cleanedContent) {
      return <p className="text-muted-foreground leading-relaxed text-lg">No content available.</p>;
    }

    return (
      <div 
        className="blog-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: cleanedContent }}
      />
    );
  };

  // Add styles for Jodit editor content
  const joditStyles = `
    .blog-content {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.7;
      color: #374151;
    }
    
    .blog-content h1,
    .blog-content h2,
    .blog-content h3,
    .blog-content h4 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-weight: 700;
      line-height: 1.3;
      color: #111827;
    }
    
    .blog-content h1 { font-size: 2.25rem; }
    .blog-content h2 { font-size: 1.875rem; }
    .blog-content h3 { font-size: 1.5rem; }
    .blog-content h4 { font-size: 1.25rem; }
    
    .blog-content p {
      margin-bottom: 1.5rem;
      font-size: 1.125rem;
    }
    
    .blog-content ul,
    .blog-content ol {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
    }
    
    .blog-content li {
      margin-bottom: 0.5rem;
      font-size: 1.125rem;
    }
    
    .blog-content ul li {
      list-style-type: disc;
    }
    
    .blog-content ol li {
      list-style-type: decimal;
    }
    
    .blog-content strong,
    .blog-content b {
      font-weight: 700;
      color: #111827;
    }
    
    .blog-content em,
    .blog-content i {
      font-style: italic;
    }
    
    .blog-content u {
      text-decoration: underline;
    }
    
    .blog-content a {
      color: #2563eb;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease;
    }
    
    .blog-content a:hover {
      border-bottom-color: #2563eb;
    }
    
    .blog-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.75rem;
      margin: 2rem 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .blog-content blockquote {
      border-left: 4px solid #2563eb;
      padding-left: 1.5rem;
      margin: 2rem 0;
      font-style: italic;
      color: #4b5563;
    }
    
    .blog-content code {
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.875rem;
    }
    
    .blog-content pre {
      background-color: #1f2937;
      color: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.75rem;
      overflow-x: auto;
      margin: 2rem 0;
    }
    
    .blog-content pre code {
      background-color: transparent;
      padding: 0;
      color: inherit;
      font-size: 0.875rem;
    }
    
    .blog-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
    }
    
    .blog-content th,
    .blog-content td {
      border: 1px solid #e5e7eb;
      padding: 0.75rem;
      text-align: left;
    }
    
    .blog-content th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    
    .blog-content tr:nth-child(even) {
      background-color: #f9fafb;
    }
    
    @media (max-width: 768px) {
      .blog-content h1 { font-size: 1.875rem; }
      .blog-content h2 { font-size: 1.5rem; }
      .blog-content h3 { font-size: 1.25rem; }
      .blog-content h4 { font-size: 1.125rem; }
      .blog-content p,
      .blog-content li {
        font-size: 1rem;
      }
    }
  `;

  // Get category from tags
  const getCategory = () => {
    if (!post?.tags) return 'General';
    const tagsArray = post.tags.split(',');
    return tagsArray[0]?.trim() || 'General';
  };

  if (notFound) {
    return <Navigate to="/blog" replace />;
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        {/* Schema markup for loading state */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Geemadhura Blog",
            "description": "Loading blog post..."
          })}
        </script>
        
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

  const category = getCategory();

  return (
    <>
      {/* Add schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSchemaMarkup()}
      />
      
      {/* Add breadcrumb schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://geemadhura.braventra.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://geemadhura.braventra.in/blog"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": post.title,
              "item": `https://geemadhura.braventra.in/blog/${post.slug}`
            }
          ]
        })}
      </script>
      
      {/* Add Jodit editor styles */}
      <style>{joditStyles}</style>
      
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

                {post.short_description && (
                  <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                    {post.short_description}
                  </p>
                )}
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
              <div className="relative rounded-2xl mb-12 overflow-hidden shadow-xl">
                {post.banner_image ? (
                  <img
                    src={`https://geemadhura.braventra.in${post.banner_image}`}
                    alt={post.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.className = 
                        'relative h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-12 flex items-center justify-center';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = 
                        '<div class="text-6xl text-muted-foreground/30">📝</div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-6xl text-muted-foreground/30">📝</div>
                  </div>
                )}
              </div>

              {/* Article Body with Jodit Editor Content */}
              <div className="mt-12">
                {renderHTMLContent()}
              </div>

              {/* Tags Section */}
              {post.tags && post.tags.trim() && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 mr-2">Tags:</span>
                    {post.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
    </>
  );
};

export default BlogPost;