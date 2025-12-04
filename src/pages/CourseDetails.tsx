import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import {
    Home,
    ChevronRight,
    List,
    Mail,
    Zap,
    CheckCircle,
    ArrowRight,
    Calendar,
    BookOpen
} from 'lucide-react';
import { useState, useEffect } from 'react';

// --- Configuration & Interfaces ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/courses';
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in';

interface FullBackendCourseData {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    created_at: string;
}

interface CourseDetailData {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    date: string;
}

interface OtherCourseItem {
    id: number;
    title: string;
}

// Hardcoded Course Benefits (similar to services features)
const HARDCODED_COURSE_BENEFITS: string[] = [
    'Comprehensive learning materials and resources included.',
    'Flexible schedule to learn at your own pace.',
    'Practical examples and real-world applications.',
    'Certificate of completion for all finished courses.',
    'Access to community forums and peer discussions.',
    'Regular updates with the latest industry trends.',
    'Expert guidance and support throughout the course.',
    'Interactive quizzes and assessments to test knowledge.',
];

const CourseDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // --- State Management ---
    const [course, setCourse] = useState<CourseDetailData | null>(null);
    const [otherCourses, setOtherCourses] = useState<OtherCourseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOtherCourses, setIsLoadingOtherCourses] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAllCourses, setShowAllCourses] = useState(false);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // --- Fetch Course Detail ---
    useEffect(() => {
        if (!id) return;

        const fetchCourseDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`);

                if (response.status === 404) {
                    setCourse(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch course details: ${response.statusText}`);
                }

                const result = await response.json();
                const courseData: FullBackendCourseData = result.data;

                const fullImageUrl = courseData.image_url ? `${IMAGE_BASE_URL}${courseData.image_url}` : null;

                const mappedDetail: CourseDetailData = {
                    id: courseData.id,
                    title: courseData.title,
                    description: courseData.description || 'No detailed description available.',
                    imageUrl: fullImageUrl,
                    date: courseData.created_at ? formatDate(courseData.created_at) : 'Date not available'
                };

                setCourse(mappedDetail);

            } catch (e) {
                console.error('Error fetching course detail:', e);
                setError(`Could not load course detail. Details: ${(e as Error).message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetail();
    }, [id]);

    // --- Fetch Other Courses ---
    useEffect(() => {
        if (course) {
            fetchOtherCourses();
        }
    }, [course]);

    const fetchOtherCourses = async () => {
        setIsLoadingOtherCourses(true);
        try {
            const response = await fetch(`${API_BASE_URL}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch other courses: ${response.statusText}`);
            }

            const result = await response.json();
            
            // Map API response to OtherCourseItem format
            const allCourses: OtherCourseItem[] = result.data.map((courseItem: any) => ({
                id: courseItem.id,
                title: courseItem.title
            }));

            // Filter out current course from the list
            const filteredCourses = allCourses.filter(otherCourse => 
                course ? otherCourse.id !== course.id : true
            );

            setOtherCourses(filteredCourses);

        } catch (e) {
            console.error('Error fetching other courses:', e);
        } finally {
            setIsLoadingOtherCourses(false);
        }
    };

    const handleCourseClick = (courseId: number) => {
        navigate(`/courses/${courseId}`);
    };

    // --- Conditional Rendering ---
    if (isLoading) {
        return (
            <main style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', paddingTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #1a73e8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ fontSize: '1.2em', color: '#1a73e8' }}>Loading Course Details...</span>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </main>
        );
    }

    if (error) {
        return (
            <main style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', paddingTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ padding: '20px', color: '#d32f2f', backgroundColor: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', maxWidth: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#d32f2f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>!</div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Error</span>
                    </div>
                    <p style={{ margin: 0 }}>{error}</p>
                </div>
            </main>
        );
    }

    if (!course) {
        return <Navigate to="/courses" replace />;
    }

    const displayedCourses = showAllCourses ? otherCourses : otherCourses.slice(0, 5);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', paddingTop: '80px' }}>
            {/* 1. Banner Section */}
            <div
                style={{
                    width: '100%',
                    height: '400px',
                    marginBottom: '20px',
                    backgroundColor: '#f0f0f0',
                    backgroundImage: course.imageUrl ? `url(${course.imageUrl})` : 'url(https://via.placeholder.com/1200x400?text=Course+Banner+Image)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3em',
                    fontWeight: 'bold',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
                }}
            >
                {course.title}
            </div>

            {/* Breadcrumb Navigation */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    fontSize: '0.9em',
                    color: '#555',
                    marginLeft: '60px'
                }}
            >
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <Home size={16} style={{ marginRight: '5px' }} />
                    <span style={{ cursor: 'pointer' }}>Home</span>
                </Link>
                <ChevronRight size={16} style={{ margin: '0 5px' }} />
                <Link to="/courses" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ cursor: 'pointer' }}>Courses</span>
                </Link>
                <ChevronRight size={16} style={{ margin: '0 5px' }} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{course.title}</span>
            </div>

            {/* 2. Main Content Layout (70% and 30% split) */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', paddingLeft: 60, paddingRight: 60 }}>

                {/* Left Side: 70% - Title, Description */}
                <div style={{ flex: '7' }}>
                    {/* Title and Description Section */}
                    <section>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '15px',
                            marginBottom: '15px',
                            color: '#666'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Calendar size={16} />
                                <span>{course.date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <BookOpen size={16} />
                                <span>Educational Resource</span>
                            </div>
                        </div>

                        <h1 style={{ color: '#333', fontSize: '2.5em', marginBottom: '20px', fontWeight: 'bold' }}>
                            {course.title}
                        </h1>

                        <div style={{ 
                            lineHeight: '1.6', 
                            color: '#333', 
                            textAlign: 'justify',
                            fontSize: '1.1em',
                            backgroundColor: '#f9f9f9',
                            padding: '25px',
                            borderRadius: '8px',
                            borderLeft: '4px solid #1a73e8'
                        }}>
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                {course.description}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Side: 30% - Other Courses and Enquiry Form */}
                <div style={{ flex: '3' }}>
                    {/* Other Courses Section */}
                    <div
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: '15px 20px',
                                borderBottom: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <List size={20} color="#333" />
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: '1.1em',
                                    fontWeight: 'bold',
                                    color: '#333',
                                }}
                            >
                                Other Courses
                            </h3>
                        </div>
                        
                        {/* List of course items */}
                        <div>
                            {isLoadingOtherCourses ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    Loading other courses...
                                </div>
                            ) : displayedCourses.length > 0 ? (
                                displayedCourses.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleCourseClick(item.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            textDecoration: 'none',
                                            color: '#333',
                                            padding: '12px 20px',
                                            borderBottom: '1px solid #e0e0e0',
                                            transition: 'all 0.3s ease',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1a73e8';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.paddingLeft = '25px';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#333';
                                            e.currentTarget.style.paddingLeft = '20px';
                                        }}
                                    >
                                        <span style={{ 
                                            fontSize: '0.95em',
                                            transition: 'color 0.3s ease',
                                            fontWeight: '500',
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {item.title}
                                        </span>
                                        <ArrowRight 
                                            size={16} 
                                            style={{
                                                transition: 'all 0.3s ease',
                                                minWidth: '16px'
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    No other courses found
                                </div>
                            )}
                        </div>
                        
                        {/* Show All Courses Button */}
                        {otherCourses.length > 5 && (
                            <div style={{ 
                                padding: '15px', 
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5'
                            }}>
                                <div
                                    onClick={() => setShowAllCourses(!showAllCourses)}
                                    style={{
                                        display: 'inline-block',
                                        color: '#1a73e8',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '0.9em',
                                        padding: '8px 20px',
                                        border: '1px solid #1a73e8',
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1a73e8';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#1a73e8';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {showAllCourses ? 'Show Less Courses' : 'Show All Courses'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enquiry Form Section */}
                    <div
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '20px',
                            marginTop: '30px',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <h3
                            style={{
                                marginTop: 0,
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#333',
                            }}
                        >
                            <Mail size={20} /> Course Enquiry
                        </h3>
                        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
                            Interested in this course? Fill out the form below for more information!
                        </p>
                        <form>
                            <input
                                type="text"
                                placeholder="Your Name"
                                style={{
                                    width: 'calc(100% - 20px)',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                }}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                style={{
                                    width: 'calc(100% - 20px)',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                }}
                                required
                            />
                            <textarea
                                placeholder="Your Message"
                                rows={4}
                                style={{
                                    width: 'calc(100% - 20px)',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                }}
                                required
                            ></textarea>
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#1a73e8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1557b0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a73e8'}
                            >
                                Submit Enquiry
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* 3. Key Benefits Section (Full Width) */}
            <section style={{ 
                padding: '30px 60px', 
                backgroundColor: '#dedee4ff', 
                width: '100%',
                marginTop: '40px'
            }}>
                <h3
                    style={{
                        borderBottom: '2px solid #1a73e8',
                        paddingBottom: '5px',
                        marginBottom: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#333',
                        fontSize: '1.8em'
                    }}
                >
                    <Zap size={28} color="#1a73e8" /> Course Benefits & Features
                </h3>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '20px',
                    }}
                >
                    {HARDCODED_COURSE_BENEFITS.map((benefit, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                borderLeft: '4px solid #00a878',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '15px',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                        >
                            <CheckCircle size={24} color="#00a878" style={{ minWidth: '24px' }} />
                            <span style={{ 
                                color: '#333', 
                                lineHeight: '1.5',
                                fontSize: '0.95em'
                            }}>
                                {benefit}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CourseDetails;