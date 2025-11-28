import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

// --- Configuration & Interfaces ---
const API_BASE_URL = 'https://geemadhura.braventra.in/api/services'; 
// --- ADDED BASE DOMAIN FOR IMAGE PREFIXING ---
const IMAGE_BASE_URL = 'https://geemadhura.braventra.in'; 
// ---------------------------------------------

// This interface matches the 'SELECT *' result from the database
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

// Interface for the data used in the component's state
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

const ServiceDetail = () => {
    const { slug } = useParams<{ slug: string }>(); 
    
    // --- State Management ---
    const [service, setService] = useState<ServiceDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- API Fetch Logic ---
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

                // --- IMAGE URL PREFIXING LOGIC APPLIED HERE ---
                const fullBannerUrl = serviceData.banner_image_url ? `${IMAGE_BASE_URL}${serviceData.banner_image_url}` : '';
                const fullMainImageUrl = serviceData.image_url ? `${IMAGE_BASE_URL}${serviceData.image_url}` : '';
                // ----------------------------------------------

                // --- DATA MAPPING ---
                const mappedDetail: ServiceDetailData = {
                    id: serviceData.id,
                    title: serviceData.name,
                    slug: serviceData.slug,
                    icon: serviceData.icon_name || 'Zap',
                    shortDescription: serviceData.description || 'No summary provided.',
                    fullDescription: serviceData.scope_content || 'The detailed scope of work is not yet defined for this service.',
                    scopeTitle: serviceData.scope_title || 'Service Details',
                    features: [
                        'Consultation and Strategy', 
                        'Implementation and Integration', 
                        'Maintenance and Support'
                    ], 
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

    // --- Conditional Rendering (Unchanged) ---
    if (isLoading) {
        return (
            <main className="min-h-screen pt-20 flex justify-center items-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin text-primary" />
                <span className="text-xl text-primary">Loading Service Details...</span>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen pt-20 container mx-auto flex justify-center items-center">
                <div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg max-w-lg">
                    <AlertCircle className="mr-3 h-6 w-6 flex-shrink-0 inline-block" />
                    <span className="font-medium">Error: {error}</span>
                </div>
            </main>
        );
    }

    if (!service) {
        return <Navigate to="/services" replace />;
    }

    // Safely get the Icon Component (kept for fallback)
    const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Zap;

    return (
        <main className="min-h-screen pt-20">
            {/* Back Button */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/services">
                    <Button variant="ghost" className="hover:text-primary">
                        <ArrowLeft className="mr-2" size={20} />
                        Back to Services
                    </Button>
                </Link>
            </div>

            {/* Hero Section - Banner Image */}
            <section className="relative py-16 md:py-20 bg-gradient-to-br from-background via-muted/20 to-background">
                {/* --- BANNER IMAGE LOGIC --- */}
                {service.bannerImageUrl && (
                    <img 
                        src={service.bannerImageUrl} 
                        alt={`${service.title} Banner`} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 lg:opacity-20" 
                    />
                )}
                {/* -------------------------- */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6">
                            <IconComponent className="text-primary" size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{service.title}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            {service.shortDescription}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* --- MAIN IMAGE (from image_url) --- */}
                            {service.mainImageUrl && (
                                <motion.img
                                    src={service.mainImageUrl}
                                    alt={`${service.title} Illustration`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7 }}
                                    className="w-full h-auto object-cover rounded-xl shadow-xl mb-8"
                                />
                            )}
                            {/* ----------------------------------- */}
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.scopeTitle}</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                                    {service.fullDescription}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">Key Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="flex items-start gap-3 bg-card border border-border rounded-xl p-4"
                                        >
                                            <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={24} />
                                            <span className="text-foreground font-medium">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-card border border-border rounded-2xl p-8 sticky top-24"
                            >
                                <h3 className="text-2xl font-bold mb-6">Get Started</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Ready to transform your business with our {service.title.toLowerCase()} solutions?
                                </p>
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground mb-4"
                                >
                                    <Link to="/contact">Contact Us</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-border hover:border-primary"
                                >
                                    <Link to="/services">View All Services</Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ServiceDetail;