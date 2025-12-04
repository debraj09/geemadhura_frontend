import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle, Calendar, User } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';

// --- Configuration & Interfaces ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/courses';
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in';

// Interface for the data coming directly from the backend API
interface BackendCourseData {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
}

// Interface for the data used in the component's state
interface DynamicGridCourse {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
}

const Courses = () => {
  // --- State Management ---
  const [courses, setCourses] = useState<DynamicGridCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [hasImage, setHasImage] = useState<string>('all');

  // Format date to "Month Day, Year"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Truncate text to limit words
  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return 'No description available';
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  // --- API Fetch Logic ---
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}`;
      const params = new URLSearchParams();
      
      if (search) {
        params.append('search', search);
      }
      if (hasImage !== 'all') {
        params.append('hasImage', hasImage);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const result = await response.json();
      const courseData: BackendCourseData[] = result.data || [];

      // Map backend data to frontend structure
      const mappedCourses: DynamicGridCourse[] = courseData.map(course => {
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          imageUrl: course.image_url ? `${IMAGE_BASE_URL}${course.image_url}` : null,
          date: course.created_at ? formatDate(course.created_at) : 'Not specified'
        };
      });

      setCourses(mappedCourses);

    } catch (e) {
      console.error('Error fetching courses:', e);
      setError(`Could not load courses. Details: ${(e as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleFilterChange = (value: string) => {
    setHasImage(value);
    fetchCourses();
  };

  // --- Conditional Content Rendering ---
  let content;

  if (isLoading) {
    content = (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '40px 0',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3', 
          borderTop: '4px solid #1a73e8', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          marginRight: '10px'
        }}></div>
        <span style={{ fontSize: '1.2em', color: '#1a73e8' }}>Loading Courses...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  } else if (error) {
    content = (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          padding: '20px', 
          color: '#d32f2f', 
          backgroundColor: '#ffebee', 
          border: '1px solid #ffcdd2', 
          borderRadius: '8px', 
          maxWidth: '600px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              backgroundColor: '#d32f2f', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold' 
            }}>!</div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Error</span>
          </div>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  } else if (courses.length === 0) {
    content = (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 0', 
        color: '#666',
        fontFamily: 'Arial, sans-serif'
      }}>
        No courses found. {search ? 'Try a different search.' : 'Check back later for new courses.'}
      </div>
    );
  } else {
    // --- Box Card Grid Rendering ---
    content = (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '30px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {courses.map((course) => {
          return (
            <div
              key={course.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(26, 115, 232, 0.15)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#1a73e8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <Link 
                to={`/courses/${course.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Image Section */}
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <div style={{ 
                        fontSize: '3em', 
                        color: '#1a73e8',
                        marginBottom: '10px'
                      }}>📚</div>
                      <span style={{ 
                        color: '#666', 
                        fontSize: '0.9em',
                        textAlign: 'center',
                        padding: '0 20px'
                      }}>No Image Available</span>
                    </div>
                  )}
                  
                  {/* Category/Tag Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    backgroundColor: 'rgba(26, 115, 232, 0.9)',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '0.8em',
                    fontWeight: 'bold'
                  }}>
                    Course
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ 
                  padding: '25px', 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Date */}
                  {/* <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px',
                    marginBottom: '15px',
                    fontSize: '0.85em',
                    color: '#666'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} />
                      <span>{course.date}</span>
                    </div>
                  </div> */}

                  {/* Title */}
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: '1.4em', 
                    fontWeight: 'bold',
                    color: '#333',
                    lineHeight: '1.4'
                  }}>
                    {course.title}
                  </h3>

                  {/* Description with fixed height */}
                  <div style={{ 
                    flexGrow: 1,
                    marginBottom: '20px',
                    color: '#555',
                    lineHeight: '1.6',
                    fontSize: '0.95em',
                    minHeight: '72px',
                    overflow: 'hidden'
                  }}>
                    {truncateText(course.description || 'No description available', 20)}
                  </div>

                  {/* View Details Button */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1a73e8',
                    fontWeight: 'bold',
                    fontSize: '0.95em',
                    paddingTop: '10px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <span>View Details</span>
                    <ArrowRight style={{ marginLeft: '8px', transition: 'transform 0.3s ease' }} size={18} />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }

  // --- Final Render ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '60px 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '3em', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#333'
          }}>
            Our Courses
          </h1>
          <p style={{ 
            fontSize: '1.2em', 
            color: '#666', 
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Comprehensive learning resources designed to enhance your skills and knowledge
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={{ 
        padding: '30px 0',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '500px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '10px'
              }}>
                <input
                  type="text"
                  placeholder="Search courses by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: '1',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1em'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1557b0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a73e8'}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Options */}
            <div style={{ 
              display: 'flex', 
              gap: '15px',
              alignItems: 'center'
            }}>
              <span style={{ color: '#666', fontWeight: '500' }}>Filter by:</span>
              <select
                value={hasImage}
                onChange={(e) => handleFilterChange(e.target.value)}
                style={{
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  color: '#333',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Courses</option>
                <option value="true">With Images</option>
                <option value="false">Without Images</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid Section */}
      <div style={{ 
        padding: '60px 0',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Courses;