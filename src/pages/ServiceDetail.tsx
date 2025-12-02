import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import {
    Home,
    ChevronRight,
    List,
    Mail,
    Zap,
    CheckCircle,
    ArrowRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// --- Configuration & Interfaces ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/services'; 
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in'; 

interface FullBackendServiceData {
    id: number;
    name: string;
    slug: string;
    description: string;
    scope_title: string;
    scope_content: string;
    image_url: string; 
    banner_image_url: string;
    is_active: 0 | 1;
    icon_name?: string; 
}

interface ServiceDetailData {
    id: number;
    title: string;
    slug: string;
    icon: string;
    shortDescription: string;
    fullDescription: string;
    scopeTitle: string;
    features: string[];
    bannerImageUrl: string;
    mainImageUrl: string;
}

interface OtherServiceItem {
    id: number;
    title: string;
    slug: string;
}

// Hardcoded Key Features (as requested)
const HARDCODED_KEY_FEATURES: string[] = [
    'Seamless integration with existing systems and platforms.',
    '24/7 priority customer support included with all plans.',
    'Scalable architecture designed for high traffic and future growth.',
    'Industry-leading security protocols and full compliance certifications.',
    'Flexible pricing models to fit any size business operation.',
];

const ServiceDetail = () => {
    const { slug } = useParams<{ slug: string }>(); 
    const navigate = useNavigate();
    
    // --- State Management ---
    const [service, setService] = useState<ServiceDetailData | null>(null);
    const [otherServices, setOtherServices] = useState<OtherServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOtherServices, setIsLoadingOtherServices] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAllServices, setShowAllServices] = useState(false);

    // --- Fetch Service Detail ---
    useEffect(() => {
        if (!slug) return;

        const fetchServiceDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/by-slug/${slug}`); 

                if (response.status === 404) {
                    setService(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch service details: ${response.statusText}`);
                }

                const result = await response.json();
                const serviceData: FullBackendServiceData = result.data;

                const fullBannerUrl = serviceData.banner_image_url ? `${IMAGE_BASE_URL}${serviceData.banner_image_url}` : '';
                const fullMainImageUrl = serviceData.image_url ? `${IMAGE_BASE_URL}${serviceData.image_url}` : '';

                const mappedDetail: ServiceDetailData = {
                    id: serviceData.id,
                    title: serviceData.name,
                    slug: serviceData.slug,
                    icon: serviceData.icon_name || 'Zap',
                    shortDescription: serviceData.description || 'No summary provided.',
                    fullDescription: serviceData.scope_content || 'The detailed scope of work is not yet defined for this service.',
                    scopeTitle: serviceData.scope_title || 'Service Details',
                    features: HARDCODED_KEY_FEATURES, // Using hardcoded features
                    bannerImageUrl: fullBannerUrl,
                    mainImageUrl: fullMainImageUrl,
                };

                setService(mappedDetail);

            } catch (e) {
                console.error('Error fetching service detail:', e);
                setError(`Could not load service detail. Details: ${(e as Error).message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServiceDetail();
    }, [slug]);

    // --- Fetch Other Services ---
    useEffect(() => {
        if (service) {
            fetchOtherServices();
        }
    }, [service]);

    const fetchOtherServices = async () => {
        setIsLoadingOtherServices(true);
        try {
            const response = await fetch(`${API_BASE_URL}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch other services: ${response.statusText}`);
            }

            const result = await response.json();
            
            // Map API response to OtherServiceItem format
            const allServices: OtherServiceItem[] = result.data.map((serviceItem: any) => ({
                id: serviceItem.id,
                title: serviceItem.name,
                slug: serviceItem.slug
            }));

            // Filter out current service from the list
            const filteredServices = allServices.filter(otherService => 
                service ? otherService.id !== service.id : true
            );

            setOtherServices(filteredServices);

        } catch (e) {
            console.error('Error fetching other services:', e);
            // Don't show error for other services - just leave empty
        } finally {
            setIsLoadingOtherServices(false);
        }
    };

    const handleServiceClick = (serviceSlug: string) => {
        navigate(`/services/${serviceSlug}`);
    };

    // --- Conditional Rendering ---
    if (isLoading) {
        return (
            <main style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', paddingTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #1a73e8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ fontSize: '1.2em', color: '#1a73e8' }}>Loading Service Details...</span>
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

    if (!service) {
        return <Navigate to="/services" replace />;
    }

    const displayedServices = showAllServices ? otherServices : otherServices.slice(0, 5);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* 1. Banner Section */}
            <div
                style={{
                    width: '100%',
                    height: '400px',
                    marginBottom: '20px',
                    backgroundColor: '#f0f0f0',
                    backgroundImage: service.bannerImageUrl ? `url(${service.bannerImageUrl})` : 'url(https://via.placeholder.com/1200x400?text=Service+Banner+Image)',
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
                {service.title}
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
                <Link to="/services" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ cursor: 'pointer' }}>Services</span>
                </Link>
                <ChevronRight size={16} style={{ margin: '0 5px' }} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{service.title}</span>
            </div>

            {/* 2. Main Content Layout (70% and 30% split) */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', paddingLeft: 60, paddingRight: 60 }}>

                {/* Left Side: 70% - Title, Description */}
                <div style={{ flex: '7' }}>
                    {/* Title and Description Section */}
                    <section>
                        <h1 style={{ color: '#333', fontSize: '2.5em', marginBottom: '10px', fontWeight: 'bold' }}>
                            {service.title}
                        </h1>

                        <div style={{ lineHeight: '1.6', color: '#333', textAlign: 'justify', justifyContent: "center" }}>
                            <p>{service.shortDescription}</p>
                            
                            
                            <h2 style={{ fontSize: '1.8em', margin: '30px 0 15px 0', color: '#333', fontWeight: 'bold' }}>
                                {service.scopeTitle}
                            </h2>
                            <p style={{ whiteSpace: 'pre-wrap' }}>
                                {service.fullDescription}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Side: 30% - Other Services and Enquiry Form */}
                <div style={{ flex: '3' }}>
                    {/* Other Services Section */}
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
                                Other Services
                            </h3>
                        </div>
                        
                        {/* List of service items */}
                        <div>
                            {isLoadingOtherServices ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    Loading other services...
                                </div>
                            ) : displayedServices.length > 0 ? (
                                displayedServices.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleServiceClick(item.slug)}
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
                                            fontWeight: '500'
                                        }}>
                                            {item.title}
                                        </span>
                                        <ArrowRight 
                                            size={16} 
                                            color="#666"
                                            style={{
                                                transition: 'all 0.3s ease',
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    No other services found
                                </div>
                            )}
                        </div>
                        
                        {/* Show All Services Button */}
                        {otherServices.length > 5 && (
                            <div style={{ 
                                padding: '15px', 
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5'
                            }}>
                                <div
                                    onClick={() => setShowAllServices(!showAllServices)}
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
                                    {showAllServices ? 'Show Less Services' : 'Show All Services'}
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
                            <Mail size={20} /> Enquiry Form
                        </h3>
                        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
                            Have a question? Fill out the form below and we'll get back to you!
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
                                }}
                            >
                                Submit Enquiry
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* 3. Key Points Section (Full Width, below the 70/30 split) */}
            <section style={{ padding: '30px', backgroundColor: '#dedee4ff', width: '100%' }}>
                <h3
                    style={{
                        borderBottom: '2px solid #1a73e8',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#333',
                    }}
                >
                    <Zap size={24} color="#1a73e8" /> Key Features & Benefits
                </h3>
                <ul
                    style={{
                        listStyleType: 'none',
                        padding: 0,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        justifyContent: 'space-between',
                    }}
                >
                    {service.features.map((point, index) => (
                        <li
                            key={index}
                            style={{
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                color: '#333',
                                width: '45%',
                            }}
                        >
                            <CheckCircle size={20} color="#00a878" style={{ marginRight: '10px', minWidth: '20px' }} />
                            {point}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default ServiceDetail;