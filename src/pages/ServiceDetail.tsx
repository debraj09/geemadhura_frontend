import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import {
    Home,
    ChevronRight,
    List,
    Mail,
    Zap,
    CheckCircle,
    ArrowRight,
    Upload,
    FileText,
    User,
    Phone,
    MapPin,
    Building,
    Briefcase
} from 'lucide-react';
import { useState, useEffect } from 'react';

// --- Configuration & Interfaces ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/services';
const APPLICATIONS_API_URL = 'https://geemadhura.braventra.in/api/serviceApplications';
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

// Service-Specific Required Documents (can be moved to backend API call)
const serviceDocuments = {
    'Homestay Registration': ['Property Ownership Proof', 'Address Proof', 'ID Proof', 'Property Photos'],
    'Trade License': ['Business Address Proof', 'Owner ID Proof', 'Property Tax Receipt', 'NOC from Property Owner'],
    'FoSTaC Trainings and Certification': ['Applicant ID Proof', 'Educational Certificates', 'Passport Size Photos'],
    'GST & Business Registration': ['PAN Card', 'Aadhaar Card', 'Business Address Proof', 'Bank Account Details'],
    'ISO Certifications': ['Company Registration Certificate', 'PAN Card', 'Process Documentation', 'Quality Manual'],
    'Pollution Certificate': ['Industry Registration', 'Layout Plan', 'Water & Air Consent Application'],
    'Factory License': ['Building Plan Approval', 'Stability Certificate', 'Fire NOC', 'Machinery List'],
    'Fire Safety NOC': ['Building Plan', 'Fire Fighting Equipment List', 'Emergency Exit Plan'],
    'Bar License': ['Premises Ownership Proof', 'Police Verification', 'Health Department NOC'],
    'FSSAI License': ['Form-B', 'Food Safety Management Plan', 'Proof of Possession of Premises']
};

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
    
    // --- Application Form States ---
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [formData, setFormData] = useState({
        service_id: 0,
        service_name: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_city: '',
        customer_state: '',
        customer_pincode: '',
        business_name: '',
        business_type: '',
        application_details: {}
    });
    const [documents, setDocuments] = useState<File[]>([]);
    const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
    const [additionalDetails, setAdditionalDetails] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [applicationId, setApplicationId] = useState<string>('');

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
                    features: HARDCODED_KEY_FEATURES,
                    bannerImageUrl: fullBannerUrl,
                    mainImageUrl: fullMainImageUrl,
                };

                setService(mappedDetail);
                
                // Initialize form data with service info
                setFormData(prev => ({
                    ...prev,
                    service_id: serviceData.id,
                    service_name: serviceData.name
                }));
                
                // Set required documents based on service name
                const docs = serviceDocuments[serviceData.name as keyof typeof serviceDocuments] || [];
                setRequiredDocs(docs);

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
            
            const allServices: OtherServiceItem[] = result.data.map((serviceItem: any) => ({
                id: serviceItem.id,
                title: serviceItem.name,
                slug: serviceItem.slug
            }));

            const filteredServices = allServices.filter(otherService => 
                service ? otherService.id !== service.id : true
            );

            setOtherServices(filteredServices);

        } catch (e) {
            console.error('Error fetching other services:', e);
        } finally {
            setIsLoadingOtherServices(false);
        }
    };

    // --- Form Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setDocuments(prev => [...prev, ...newFiles]);
        }
    };

    const removeDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleAdditionalDetailChange = (key: string, value: string) => {
        setAdditionalDetails(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleServiceClick = (serviceSlug: string) => {
        navigate(`/services/${serviceSlug}`);
    };

    // --- Form Submission with Fetch API ---
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
        setSubmitError('Please fill in all required fields (Name, Email, Phone)');
        return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
        // Prepare form data with application details
        const completeFormData = {
            ...formData,
            application_details: {
                ...additionalDetails,
                documents_requested: requiredDocs,
                submitted_at: new Date().toISOString()
            }
        };

        // Create FormData for file upload
        const formDataToSend = new FormData();
        
        // Append all text data as JSON
        formDataToSend.append('applicationData', JSON.stringify(completeFormData));
        
        // FIXED: Append each document with field name 'documents' (Multer expects this)
        // Changed from: formDataToSend.append(`documents[${index}]`, file);
        documents.forEach((file) => {
            formDataToSend.append('documents', file); // JUST 'documents', not 'documents[0]'
        });

        // Submit to backend API using Fetch
        const response = await fetch(`${APPLICATIONS_API_URL}/submit-application`, {
            method: 'POST',
            body: formDataToSend,
        });

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();

            if (response.ok && result.status === 201) {
                setSubmitSuccess(true);
                setApplicationId(result.data.applicationId || result.data.applicationNumber || 'N/A');
                
                // Reset form after successful submission
                setTimeout(() => {
                    setShowApplicationForm(false);
                    setFormData({
                        service_id: service?.id || 0,
                        service_name: service?.title || '',
                        customer_name: '',
                        customer_email: '',
                        customer_phone: '',
                        customer_address: '',
                        customer_city: '',
                        customer_state: '',
                        customer_pincode: '',
                        business_name: '',
                        business_type: '',
                        application_details: {}
                    });
                    setDocuments([]);
                    setAdditionalDetails({});
                    setSubmitSuccess(false);
                }, 5000);
            } else {
                throw new Error(result.error || result.message || 'Failed to submit application');
            }
        } else {
            // Server returned HTML error page instead of JSON
            const text = await response.text();
            console.error('Server returned HTML error:', text);
            throw new Error('Server error occurred. Please try again.');
        }

    } catch (error: any) {
        console.error('Error submitting application:', error);
        setSubmitError(
            error.message || 
            'Failed to submit application. Please try again.'
        );
    } finally {
        setIsSubmitting(false);
    }
};

    // --- Render Loading State ---
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

                        {/* Apply Now Button */}
                        <div style={{ marginTop: '30px' }}>
                            <button
                                onClick={() => setShowApplicationForm(true)}
                                style={{
                                    padding: '12px 30px',
                                    backgroundColor: '#1a73e8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1.1em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0d62d9';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1a73e8';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <FileText size={20} />
                                Apply Now for {service.title}
                            </button>
                        </div>
                    </section>
                </div>

                {/* Right Side: 30% - Other Services and Application Form */}
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

                    {/* Application Form Section */}
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
                            <Mail size={20} /> Apply for {service.title}
                        </h3>
                        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
                            Fill out the form below to apply for this service. Our team will contact you shortly.
                        </p>
                        
                        {/* Success Message */}
                        {submitSuccess && (
                            <div style={{
                                padding: '15px',
                                backgroundColor: '#d4edda',
                                border: '1px solid #c3e6cb',
                                borderRadius: '4px',
                                color: '#155724',
                                marginBottom: '15px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <CheckCircle size={20} />
                                    <strong>Application Submitted Successfully!</strong>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9em' }}>
                                    Your application ID: <strong>{applicationId}</strong>
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.85em' }}>
                                    Our team will contact you within 24 hours.
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {submitError && (
                            <div style={{
                                padding: '15px',
                                backgroundColor: '#f8d7da',
                                border: '1px solid #f5c6cb',
                                borderRadius: '4px',
                                color: '#721c24',
                                marginBottom: '15px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#721c24', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>!</div>
                                    <strong>Error</strong>
                                </div>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>{submitError}</p>
                            </div>
                        )}

                        {/* Application Form */}
                        {!submitSuccess && (
                            <form onSubmit={handleSubmitApplication}>
                                {/* Personal Information */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={16} /> Personal Information
                                    </h4>
                                    
                                    <input
                                        type="text"
                                        name="customer_name"
                                        placeholder="Full Name *"
                                        value={formData.customer_name}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: 'calc(100% - 20px)',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    
                                    <input
                                        type="email"
                                        name="customer_email"
                                        placeholder="Email Address *"
                                        value={formData.customer_email}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: 'calc(100% - 20px)',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    
                                    <input
                                        type="tel"
                                        name="customer_phone"
                                        placeholder="Phone Number *"
                                        value={formData.customer_phone}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: 'calc(100% - 20px)',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                {/* Address Information */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={16} /> Address Details
                                    </h4>
                                    
                                    <textarea
                                        name="customer_address"
                                        placeholder="Full Address"
                                        value={formData.customer_address}
                                        onChange={handleInputChange}
                                        rows={2}
                                        style={{
                                            width: 'calc(100% - 20px)',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input
                                            type="text"
                                            name="customer_city"
                                            placeholder="City"
                                            value={formData.customer_city}
                                            onChange={handleInputChange}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        
                                        <input
                                            type="text"
                                            name="customer_state"
                                            placeholder="State"
                                            value={formData.customer_state}
                                            onChange={handleInputChange}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                    
                                    <input
                                        type="text"
                                        name="customer_pincode"
                                        placeholder="Pincode"
                                        value={formData.customer_pincode}
                                        onChange={handleInputChange}
                                        style={{
                                            width: 'calc(100% - 20px)',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                {/* Business Information */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Building size={16} /> Business Details
                                    </h4>
                                    
                                    <input
                                        type="text"
                                        name="business_name"
                                        placeholder="Business/Company Name"
                                        value={formData.business_name}
                                        onChange={handleInputChange}
                                        style={{
                                            width: 'calc(100% - 20px)',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    
                                    <select
                                        name="business_type"
                                        value={formData.business_type}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        <option value="">Select Business Type</option>
                                        <option value="proprietorship">Proprietorship</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="llp">LLP</option>
                                        <option value="private_limited">Private Limited</option>
                                        <option value="public_limited">Public Limited</option>
                                        <option value="trust">Trust</option>
                                        <option value="society">Society</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Service-Specific Additional Details */}
                                {service.title === 'GST & Business Registration' && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Briefcase size={16} /> GST Registration Details
                                        </h4>
                                        
                                        <input
                                            type="text"
                                            placeholder="PAN Number"
                                            onChange={(e) => handleAdditionalDetailChange('pan_number', e.target.value)}
                                            style={{
                                                width: 'calc(100% - 20px)',
                                                padding: '10px',
                                                marginBottom: '10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        
                                        <input
                                            type="text"
                                            placeholder="Expected Turnover (₹)"
                                            onChange={(e) => handleAdditionalDetailChange('expected_turnover', e.target.value)}
                                            style={{
                                                width: 'calc(100% - 20px)',
                                                padding: '10px',
                                                marginBottom: '10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Document Upload */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Upload size={16} /> Required Documents
                                    </h4>
                                    
                                    {requiredDocs.length > 0 && (
                                        <div style={{ marginBottom: '10px', fontSize: '0.85em', color: '#666' }}>
                                            <p style={{ margin: '0 0 5px 0' }}>Please upload:</p>
                                            <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                                {requiredDocs.map((doc, index) => (
                                                    <li key={index} style={{ marginBottom: '3px' }}>{doc}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleDocumentChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            marginBottom: '10px',
                                            border: '1px dashed #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                            backgroundColor: 'white',
                                        }}
                                    />
                                    
                                    {/* Uploaded Files List */}
                                    {documents.length > 0 && (
                                        <div style={{ fontSize: '0.85em', color: '#555' }}>
                                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Uploaded files:</p>
                                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                                {documents.map((file, index) => (
                                                    <li key={index} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '5px',
                                                        backgroundColor: '#f0f0f0',
                                                        borderRadius: '3px',
                                                        marginBottom: '3px'
                                                    }}>
                                                        <span style={{ fontSize: '0.8em' }}>{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDocument(index)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#d32f2f',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9em'
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: isSubmitting ? '#ccc' : '#1a73e8',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </form>
                        )}
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