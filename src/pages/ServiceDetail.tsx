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
    Briefcase,
    Menu,
    X,
    ChevronDown,
    ChevronUp
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

// Service-Specific Required Documents
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

// Helper function to sanitize and render HTML
const sanitizeHTML = (html: string) => {
    return { __html: html };
};

// Component to render HTML content with proper styling
const HTMLContent: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div
            className="html-content"
            dangerouslySetInnerHTML={sanitizeHTML(content)}
        />
    );
};

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
    const [isHideSection, setIsHideSection] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

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

    // Check for mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const clickFunction = () => {
        setIsHideSection(false);
    };

    // Toggle accordion
    const toggleAccordion = (section: string) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

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
                    fullDescription: serviceData.scope_content || '<p>The detailed scope of work is not yet defined for this service.</p>',
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
        setIsMenuOpen(false);
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

            // Append each document with field name 'documents'
            documents.forEach((file) => {
                formDataToSend.append('documents', file);
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
            <main className="loading-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span className="loading-text">Loading Service Details...</span>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="error-container">
                <div className="error-box">
                    <div className="error-header">
                        <div className="error-icon">!</div>
                        <span className="error-title">Error</span>
                    </div>
                    <p className="error-message">{error}</p>
                </div>
            </main>
        );
    }

    if (!service) {
        return <Navigate to="/services" replace />;
    }

    const displayedServices = showAllServices ? otherServices : otherServices.slice(0, 5);

    return (
        <div className="service-detail-container">
            {/* Mobile Menu Button (only on mobile) */}
            {isMobile && (
                <button
                    className="mobile-menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            {/* 1. Banner Section */}
            <div
                className="service-banner"
                style={{
                    backgroundImage: service.bannerImageUrl ? `url(${service.bannerImageUrl})` : 'url(https://via.placeholder.com/1200x400?text=Service+Banner+Image)',
                }}
            >
                <div >
                    <h1 className="banner-title">{service.title}</h1>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="breadcrumb-container">
                <Link to="/" className="breadcrumb-link">
                    <Home size={isMobile ? 14 : 16} />
                    <span>Home</span>
                </Link>
                <ChevronRight size={isMobile ? 14 : 16} />
                <Link to="/services" className="breadcrumb-link">
                    <span>Services</span>
                </Link>
                <ChevronRight size={isMobile ? 14 : 16} />
                <span className="breadcrumb-current">{service.title}</span>
            </div>

            {/* 2. Main Content Layout */}
            <div className="main-content-layout">
                {/* Left Side: Title, Description */}
                <div className="main-content-left">
                    {/* Title and Description Section */}
                    <section className="service-description-section">
                        <h1 className="service-title">{service.title}</h1>

                        <div className="service-short-description">
                            <HTMLContent content={service.shortDescription} />
                        </div>

                        {/* Scope Title and Content Section */}
                        {/* {service.scopeTitle && (
                            <div className="scope-section">
                                <h2 className="scope-title">{service.scopeTitle}</h2>
                                <div className="scope-content">
                                    <HTMLContent content={service.fullDescription} />
                                </div>
                            </div>
                        )} */}
                    </section>
                </div>

                {/* Right Side: Other Services and Application Form */}
                <div className={`sidebar-content ${isMobile && isMenuOpen ? 'sidebar-open' : ''}`}>
                    {/* Close button for mobile sidebar */}
                    {isMobile && isMenuOpen && (
                        <button
                            className="close-sidebar-button"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    )}

                    {/* Other Services Section */}
                    <div className="other-services-container">
                        <div className="other-services-header">
                            <List size={20} />
                            <h3>Other Services</h3>
                        </div>

                        {/* List of service items */}
                        <div className="other-services-list">
                            {isLoadingOtherServices ? (
                                <div className="loading-services">
                                    Loading other services...
                                </div>
                            ) : displayedServices.length > 0 ? (
                                displayedServices.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleServiceClick(item.slug)}
                                        className="other-service-item"
                                    >
                                        <span className="service-item-title">{item.title}</span>
                                        <ArrowRight size={16} />
                                    </div>
                                ))
                            ) : (
                                <div className="no-services">No other services found</div>
                            )}
                        </div>

                        {/* Show All Services Button */}
                        {otherServices.length > 5 && (
                            <div className="show-all-button-container">
                                <div
                                    onClick={() => setShowAllServices(!showAllServices)}
                                    className="show-all-button"
                                >
                                    {showAllServices ? 'Show Less Services' : 'Show All Services'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Apply Now Button */}
                    <div className="apply-now-container">
                        <button
                            onClick={clickFunction}
                            className="apply-now-button"
                        >
                            <FileText size={20} />
                            Apply Now for {service.title}
                        </button>
                    </div>

                    {!isHideSection && (
                        <div className="application-form-container">
                            <h3 className="application-form-title">
                                <Mail size={20} /> Apply for {service.title}
                            </h3>
                            <p className="application-form-subtitle">
                                Fill out the form below to apply for this service. Our team will contact you shortly.
                            </p>

                            {/* Success Message */}
                            {submitSuccess && (
                                <div className="success-message">
                                    <div className="success-header">
                                        <CheckCircle size={20} />
                                        <strong>Application Submitted Successfully!</strong>
                                    </div>
                                    <p className="success-details">
                                        Your application ID: <strong>{applicationId}</strong>
                                    </p>
                                    <p className="success-note">
                                        Our team will contact you within 24 hours.
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {submitError && (
                                <div className="error-message-form">
                                    <div className="error-header-form">
                                        <div className="error-icon-form">!</div>
                                        <strong>Error</strong>
                                    </div>
                                    <p className="error-text-form">{submitError}</p>
                                </div>
                            )}

                            {/* Application Form */}
                            {!submitSuccess && (
                                <form onSubmit={handleSubmitApplication} className="application-form">
                                    {/* Personal Information Accordion */}
                                    <div className="form-section">
                                        <div
                                            className="accordion-header"
                                            onClick={() => isMobile && toggleAccordion('personal')}
                                        >
                                            <h4>
                                                <User size={16} /> Personal Information
                                            </h4>
                                            {isMobile && (
                                                <span className="accordion-icon">
                                                    {activeAccordion === 'personal' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`accordion-content ${isMobile && activeAccordion !== 'personal' ? 'collapsed' : ''}`}>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                placeholder="Full Name *"
                                                value={formData.customer_name}
                                                onChange={handleInputChange}
                                                required
                                                className="form-input"
                                            />

                                            <input
                                                type="email"
                                                name="customer_email"
                                                placeholder="Email Address *"
                                                value={formData.customer_email}
                                                onChange={handleInputChange}
                                                required
                                                className="form-input"
                                            />

                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                placeholder="Phone Number *"
                                                value={formData.customer_phone}
                                                onChange={handleInputChange}
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Information Accordion */}
                                    <div className="form-section">
                                        <div
                                            className="accordion-header"
                                            onClick={() => isMobile && toggleAccordion('address')}
                                        >
                                            <h4>
                                                <MapPin size={16} /> Address Details
                                            </h4>
                                            {isMobile && (
                                                <span className="accordion-icon">
                                                    {activeAccordion === 'address' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`accordion-content ${isMobile && activeAccordion !== 'address' ? 'collapsed' : ''}`}>
                                            <textarea
                                                name="customer_address"
                                                placeholder="Full Address"
                                                value={formData.customer_address}
                                                onChange={handleInputChange}
                                                rows={2}
                                                className="form-textarea"
                                            />

                                            <div className="form-row">
                                                <input
                                                    type="text"
                                                    name="customer_city"
                                                    placeholder="City"
                                                    value={formData.customer_city}
                                                    onChange={handleInputChange}
                                                    className="form-input-half"
                                                />

                                                <input
                                                    type="text"
                                                    name="customer_state"
                                                    placeholder="State"
                                                    value={formData.customer_state}
                                                    onChange={handleInputChange}
                                                    className="form-input-half"
                                                />
                                            </div>

                                            <input
                                                type="text"
                                                name="customer_pincode"
                                                placeholder="Pincode"
                                                value={formData.customer_pincode}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Business Information Accordion */}
                                    <div className="form-section">
                                        <div
                                            className="accordion-header"
                                            onClick={() => isMobile && toggleAccordion('business')}
                                        >
                                            <h4>
                                                <Building size={16} /> Business Details
                                            </h4>
                                            {isMobile && (
                                                <span className="accordion-icon">
                                                    {activeAccordion === 'business' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`accordion-content ${isMobile && activeAccordion !== 'business' ? 'collapsed' : ''}`}>
                                            <input
                                                type="text"
                                                name="business_name"
                                                placeholder="Business/Company Name"
                                                value={formData.business_name}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            />

                                            <select
                                                name="business_type"
                                                value={formData.business_type}
                                                onChange={handleInputChange}
                                                className="form-select"
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
                                    </div>

                                    {/* Service-Specific Additional Details */}
                                    {service.title === 'GST & Business Registration' && (
                                        <div className="form-section">
                                            <div
                                                className="accordion-header"
                                                onClick={() => isMobile && toggleAccordion('gst')}
                                            >
                                                <h4>
                                                    <Briefcase size={16} /> GST Registration Details
                                                </h4>
                                                {isMobile && (
                                                    <span className="accordion-icon">
                                                        {activeAccordion === 'gst' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`accordion-content ${isMobile && activeAccordion !== 'gst' ? 'collapsed' : ''}`}>
                                                <input
                                                    type="text"
                                                    placeholder="PAN Number"
                                                    onChange={(e) => handleAdditionalDetailChange('pan_number', e.target.value)}
                                                    className="form-input"
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Expected Turnover (₹)"
                                                    onChange={(e) => handleAdditionalDetailChange('expected_turnover', e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Document Upload Accordion */}
                                    <div className="form-section">
                                        <div
                                            className="accordion-header"
                                            onClick={() => isMobile && toggleAccordion('documents')}
                                        >
                                            <h4>
                                                <Upload size={16} /> Required Documents
                                            </h4>
                                            {isMobile && (
                                                <span className="accordion-icon">
                                                    {activeAccordion === 'documents' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`accordion-content ${isMobile && activeAccordion !== 'documents' ? 'collapsed' : ''}`}>
                                            {requiredDocs.length > 0 && (
                                                <div className="required-docs-list">
                                                    <p>Please upload:</p>
                                                    <ul>
                                                        {requiredDocs.map((doc, index) => (
                                                            <li key={index}>{doc}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleDocumentChange}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                                                className="file-input"
                                            />

                                            {/* Uploaded Files List */}
                                            {documents.length > 0 && (
                                                <div className="uploaded-files">
                                                    <p>Uploaded files:</p>
                                                    <ul>
                                                        {documents.map((file, index) => (
                                                            <li key={index} className="uploaded-file-item">
                                                                <span>{file.name}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeDocument(index)}
                                                                    className="remove-file-button"
                                                                >
                                                                    ×
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="submit-button"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="submit-spinner"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Key Points Section */}
            {service.scopeTitle && (
                <section className="key-features-section">
                    <h3 className="key-features-title">
                        <Zap size={24} /> {service.scopeTitle}
                    </h3>
                    <div className="key-features-content">
                        <CheckCircle size={20} className="feature-icon" />
                        <span style={{ color: 'white', fontWeight: 'normal',marginTop:'2px'  }} className="feature-description">
                            <HTMLContent content={service.fullDescription} />
                        </span>
                    </div>
                </section>
            )}

            {/* CSS Styles */}
            <style>{`
                /* Global Styles */
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                }

                .service-detail-container {
                    min-height: 100vh;
                    padding-top: 80px;
                }

                /* Loading and Error States */
                .loading-container {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .loading-spinner {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #00283A;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .loading-text {
                    font-size: 1.2em;
                    color: #00283A;
                }

                .error-container {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .error-box {
                    padding: 20px;
                    color: #d32f2f;
                    background-color: #ffebee;
                    border: 1px solid #ffcdd2;
                    border-radius: 8px;
                    max-width: 600px;
                }

                .error-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .error-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: #d32f2f;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                .error-title {
                    font-weight: bold;
                    font-size: 1.1em;
                }

                .error-message {
                    margin: 0;
                }

                /* Banner Section */
                .service-banner {
    width: 100%;
    height: 400px;
    margin-top: -80px; /* Moves banner to start from top */
    margin-bottom: 20px;
    background-color: #f0f0f0;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 8px 8px; /* Only bottom rounded corners */
}

@media (max-width: 768px) {
    .service-banner {
        height: 300px;
        margin-top: -70px; /* Adjust for mobile header */
    }
}

@media (max-width: 480px) {
    .service-banner {
        height: 200px;
        margin-top: -60px; /* Adjust for smaller mobile */
    }
}

                .banner-overlay {
                    background: rgba(0, 0, 0, 0.5);
                    padding: 20px;
                    border-radius: 8px;
                }

                .banner-title {
                    color: white;
                    font-size: 2.5em;
                    font-weight: bold;
                    text-align: center;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                }

                /* Breadcrumb */
                .breadcrumb-container {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    font-size: 0.9em;
                    color: #555;
                    padding: 0 20px;
                    flex-wrap: wrap;
                }

                .breadcrumb-link {
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    cursor: pointer;
                }

                .breadcrumb-current {
                    font-weight: bold;
                    color: #333;
                }

                /* Main Content Layout */
                .main-content-layout {
                    display: flex;
                    gap: 30px;
                    margin-bottom: 40px;
                    padding: 0 20px;
                }

                .main-content-left {
                    flex: 7;
                }

                .sidebar-content {
                    flex: 3;
                    position: relative;
                }

                /* Mobile Menu Button */
                .mobile-menu-button {
                    position: fixed;
                    top: 90px;
                    right: 20px;
                    z-index: 1000;
                    background: #00283A;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }

                .close-sidebar-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: #333;
                    cursor: pointer;
                    z-index: 1001;
                }

                /* Service Description */
                .service-title {
                    color: #333;
                    font-size: 2em;
                    margin-bottom: 10px;
                    font-weight: bold;
                }

                .service-short-description {
                    line-height: 1.6;
                    color: #333;
                    text-align: justify;
                    margin-bottom: 30px;
                }

                .scope-section {
                    margin-top: 30px;
                }

                .scope-title {
                    font-size: 1.8em;
                    margin: 0 0 15px 0;
                    color: #333;
                    font-weight: bold;
                }

                .scope-content {
                    margin-bottom: 30px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                }

                /* Other Services */
                .other-services-container {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #f5f5f5;
                    overflow: hidden;
                    margin-bottom: 20px;
                }

                .other-services-header {
                    background-color: #f5f5f5;
                    padding: 15px 20px;
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .other-services-header h3 {
                    margin: 0;
                    font-size: 1.1em;
                    font-weight: bold;
                    color: #333;
                }

                .other-services-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .other-service-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    text-decoration: none;
                    color: #333;
                    padding: 12px 20px;
                    border-bottom: 1px solid #e0e0e0;
                    transition: all 0.3s ease;
                    background-color: transparent;
                    cursor: pointer;
                }

                .other-service-item:hover {
                    background-color: #00283A;
                    color: white;
                    padding-left: 25px;
                }

                .service-item-title {
                    font-size: 0.95em;
                    transition: color 0.3s ease;
                    font-weight: 500;
                }

                .loading-services,
                .no-services {
                    padding: 20px;
                    text-align: center;
                    color: #666;
                }

                .show-all-button-container {
                    padding: 15px;
                    text-align: center;
                    background-color: #f5f5f5;
                }

                .show-all-button {
                    display: inline-block;
                    color: #00283A;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 0.9em;
                    padding: 8px 20px;
                    border: 1px solid #00283A;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .show-all-button:hover {
                    background-color: #00283A;
                    color: white;
                    transform: scale(1.05);
                }

                /* Apply Now Button */
                .apply-now-container {
                    margin-top: 20px;
                }

                .apply-now-button {
                    width: 100%;
                    padding: 12px;
                    background-color: #00283A;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }

                .apply-now-button:hover {
                    background-color: #0c455fff;
                    transform: translateY(-2px);
                }

                /* Application Form */
                .application-form-container {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 30px;
                    background-color: #f9f9f9;
                }

                .application-form-title {
                    margin-top: 0;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }

                .application-form-subtitle {
                    font-size: 0.9em;
                    color: #666;
                    margin-bottom: 15px;
                }

                /* Success/Error Messages */
                .success-message {
                    padding: 15px;
                    background-color: #d4edda;
                    border: 1px solid #c3e6cb;
                    border-radius: 4px;
                    color: #155724;
                    margin-bottom: 15px;
                }

                .success-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 5px;
                }

                .success-details {
                    margin: 0;
                    font-size: 0.9em;
                }

                .success-note {
                    margin: 5px 0 0 0;
                    font-size: 0.85em;
                }

                .error-message-form {
                    padding: 15px;
                    background-color: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 4px;
                    color: #721c24;
                    margin-bottom: 15px;
                }

                .error-header-form {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .error-icon-form {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: #721c24;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                .error-text-form {
                    margin: 5px 0 0 0;
                    font-size: 0.9em;
                }

                /* Form Styles */
                .application-form {
                    width: 100%;
                }

                .form-section {
                    margin-bottom: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    overflow: hidden;
                }

                .accordion-header {
                    background-color: #f8f9fa;
                    padding: 12px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }

                .accordion-header h4 {
                    margin: 0;
                    color: #555;
                    font-size: 0.95em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .accordion-content {
                    padding: 15px;
                    background-color: white;
                }

                .accordion-content.collapsed {
                    display: none;
                }

                .form-input,
                .form-textarea,
                .form-select {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .form-row {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .form-input-half {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                .file-input {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px dashed #ccc;
                    border-radius: 4px;
                    background-color: white;
                }

                /* Required Documents */
                .required-docs-list {
                    margin-bottom: 10px;
                    font-size: 0.85em;
                    color: #666;
                }

                .required-docs-list p {
                    margin: 0 0 5px 0;
                }

                .required-docs-list ul {
                    margin: 0;
                    padding-left: 20px;
                }

                .required-docs-list li {
                    margin-bottom: 3px;
                }

                /* Uploaded Files */
                .uploaded-files {
                    font-size: 0.85em;
                    color: #555;
                }

                .uploaded-files p {
                    margin: 0 0 5px 0;
                    font-weight: bold;
                }

                .uploaded-files ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .uploaded-file-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px;
                    background-color: #f0f0f0;
                    border-radius: 3px;
                    margin-bottom: 3px;
                }

                .uploaded-file-item span {
                    font-size: 0.8em;
                }

                .remove-file-button {
                    background: none;
                    border: none;
                    color: #d32f2f;
                    cursor: pointer;
                    font-size: 1.2em;
                }

                /* Submit Button */
                .submit-button {
                    width: 100%;
                    padding: 12px;
                    background-color: #00283A;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }

                .submit-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .submit-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #fff;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                /* Key Features Section */
                .key-features-section {
                    padding: 30px 20px;
                    background-color: #00283A;
                    width: 100%;
                }

                .key-features-title {
                    border-bottom: 2px solid #F2C445;
                    padding-bottom: 5px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                }

                .key-features-list {
                    list-style-type: none;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: space-between;
                }

                .key-feature-item {
                    margin-bottom: 10px;
                    display: flex;
                    align-items: flex-start;
                    color: white;
                    width: 100%;
                }

                .feature-icon {
                    margin-right: 10px;
                    min-width: 20px;
                    color: #F2C445;
                }

                /* HTML Content Styling */
                .html-content h1,
                .html-content h2,
                .html-content h3,
                .html-content h4,
                .html-content h5,
                .html-content h6 {
                    color: #333;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    font-weight: bold;
                }

                .html-content h1 { font-size: 2em; }
                .html-content h2 { font-size: 1.8em; }
                .html-content h3 { font-size: 1.6em; }
                .html-content h4 { font-size: 1.4em; }
                .html-content h5 { font-size: 1.2em; }
                .html-content h6 { font-size: 1em; }

                .html-content p {
                    margin-bottom: 1em;
                    line-height: 1.6;
                }

                .html-content ul,
                .html-content ol {
                    margin-left: 1.5em;
                    margin-bottom: 1em;
                }

                .html-content li {
                    margin-bottom: 0.5em;
                }

                .html-content strong,
                .html-content b {
                    font-weight: bold;
                }

                .html-content em,
                .html-content i {
                    font-style: italic;
                }

                .html-content u {
                    text-decoration: underline;
                }

                .html-content a {
                    color: #00283A;
                    text-decoration: none;
                }

                .html-content a:hover {
                    text-decoration: underline;
                }

                .html-content blockquote {
                    border-left: 4px solid #00283A;
                    padding-left: 1em;
                    margin-left: 0;
                    font-style: italic;
                    color: #666;
                }

                /* Animations */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .service-detail-container {
                        padding-top: 70px;
                    }

                    .service-banner {
                        height: 200px;
                        margin-bottom: 15px;
                    }

                    .banner-title {
                        font-size: 1.8em;
                    }

                    .main-content-layout {
                        flex-direction: column;
                        gap: 20px;
                        padding: 0 15px;
                    }

                    .main-content-left {
                        width: 100%;
                    }

                    .sidebar-content {
                        width: 100%;
                        position: fixed;
                        top: 0;
                        right: -100%;
                        height: 100vh;
                        background: white;
                        z-index: 999;
                        padding: 60px 20px 20px;
                        overflow-y: auto;
                        transition: right 0.3s ease;
                    }

                    .sidebar-content.sidebar-open {
                        right: 0;
                        box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                    }

                    .other-services-container {
                        margin-bottom: 15px;
                    }

                    .apply-now-container {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: white;
                        padding: 15px;
                        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                        z-index: 998;
                    }

                    .apply-now-button {
                        width: 100%;
                    }

                    .key-features-list {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .key-feature-item {
                        width: 100%;
                    }

                    .form-row {
                        flex-direction: column;
                        gap: 10px;
                    }

                    .form-input-half {
                        width: 100%;
                    }

                    .breadcrumb-container {
                        padding: 0 15px;
                        font-size: 0.8em;
                    }

                    .service-title {
                        font-size: 1.8em;
                    }

                    .scope-title {
                        font-size: 1.5em;
                    }
                }

                @media (max-width: 480px) {
                    .service-banner {
                        height: 150px;
                    }

                    .banner-title {
                        font-size: 1.5em;
                    }

                    .service-title {
                        font-size: 1.5em;
                    }

                    .scope-title {
                        font-size: 1.3em;
                    }

                    .key-features-section {
                        padding: 20px 15px;
                    }

                    .key-features-title {
                        font-size: 1.2em;
                    }

                    .application-form-container {
                        padding: 15px;
                    }

                    .form-input,
                    .form-textarea,
                    .form-select {
                        padding: 8px;
                        font-size: 13px;
                    }

                    .accordion-header {
                        padding: 10px;
                    }
                }

                /* Desktop specific */
                @media (min-width: 769px) {
                    .accordion-header {
                        cursor: default;
                    }
                    
                    .accordion-icon {
                        display: none;
                    }
                    
                    .accordion-content.collapsed {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};

export default ServiceDetail;