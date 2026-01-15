import React, { useState, useCallback } from 'react';
import {
    Search, CheckCircle, XCircle, Clock, AlertCircle,
    FileText, User, Mail, Phone, Building, Calendar,
    Shield, Download, Printer, Copy, ExternalLink,
    Loader2, Home, ChevronRight, Check, X, MapPin, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- BASE URL CONFIGURATION ---
const BASE_URL: string = 'https://geemadhura.braventra.in';
const API_ENDPOINT: string = `${BASE_URL}/api/serviceApplications`;
// ----------------------------------------

// --- TYPESCRIPT INTERFACES ---
interface Application {
    id: number;
    application_id: string;
    service_id: number;
    service_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string | null;
    customer_city: string | null;
    customer_state: string | null;
    customer_pincode: string | null;
    business_name: string | null;
    business_type: string | null;
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_more_info';
    admin_notes: string | null;
    assigned_to: string | null;
    created_at: string;
    updated_at: string;
}

interface Document {
    id: number;
    document_name: string;
    file_path: string;
    file_type: string;
    verified: boolean;
}

interface HistoryItem {
    id: number;
    status: string;
    notes: string;
    changed_at: string;
}

interface VerificationResponse {
    status: number;
    data: {
        application: Application;
        documents: Document[];
        history: HistoryItem[];
    };
    message?: string;
}

// --- STATUS BADGE COMPONENT ---
const StatusBadge: React.FC<{ status: Application['status'] }> = ({ status }) => {
    const statusConfig = {
        pending: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: <Clock size={16} />,
            label: 'Pending Review',
            description: 'Your application is awaiting initial review by our team.'
        },
        under_review: {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: <AlertCircle size={16} />,
            label: 'Under Review',
            description: 'Our team is currently reviewing your application.'
        },
        approved: {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: <CheckCircle size={16} />,
            label: 'Approved',
            description: 'Congratulations! Your certificate has been approved.'
        },
        rejected: {
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: <XCircle size={16} />,
            label: 'Rejected',
            description: 'Your application has been rejected. Please check notes for details.'
        },
        needs_more_info: {
            color: 'bg-orange-100 text-orange-800 border-orange-200',
            icon: <FileText size={16} />,
            label: 'Needs More Information',
            description: 'Additional information is required to process your application.'
        }
    };

    const config = statusConfig[status];

    return (
        <div className={`inline-flex flex-col items-start p-4 rounded-xl border-2 ${config.color}`}>
            <div className="flex items-center space-x-2">
                {config.icon}
                <span className="font-bold text-lg">{config.label}</span>
            </div>
            <p className="mt-2 text-sm opacity-90">{config.description}</p>
        </div>
    );
};

// --- VERIFICATION RESULT CARD ---
const VerificationResultCard: React.FC<{
    application: Application;
    documents: Document[];
    history: HistoryItem[];
    onReset: () => void;
}> = ({ application, documents, history, onReset }) => {
    const [copied, setCopied] = useState(false);

    const copyApplicationId = () => {
        navigator.clipboard.writeText(application.application_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const downloadCertificate = () => {
        if (application.status === 'approved') {
            // In a real implementation, this would download the actual certificate
            alert(`Certificate for ${application.application_id} would be downloaded.`);
            // window.open(`${BASE_URL}/certificates/${application.application_id}.pdf`, '_blank');
        } else {
            alert('Certificate is only available for approved applications.');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Result Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                    <Shield size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Verified</h2>
                <p className="text-gray-600">
                    Application ID: <span className="font-mono font-bold">{application.application_id}</span>
                </p>
            </div>

            {/* Main Status Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {application.service_name}
                        </h3>
                        <p className="text-gray-600">
                            Applied on {formatDate(application.created_at)}
                        </p>
                    </div>
                    <div className="mt-4 lg:mt-0">
                        <StatusBadge status={application.status} />
                    </div>
                </div>

                {/* Application ID Copy */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Application ID</p>
                            <p className="font-mono text-lg font-bold text-gray-800">
                                {application.application_id}
                            </p>
                        </div>
                        <button
                            onClick={copyApplicationId}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
                        >
                            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                            <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                        </button>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-xl p-5">
                        <h4 className="font-bold text-gray-700 mb-4 flex items-center">
                            <User size={18} className="mr-2" />
                            Applicant Details
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <User size={16} className="text-gray-500 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-800">{application.customer_name}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail size={16} className="text-gray-500 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-800">{application.customer_email}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Phone size={16} className="text-gray-500 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-800">{application.customer_phone}</p>
                                </div>
                            </div>
                            {application.customer_address && (
                                <div className="flex items-start">
                                    <MapPin size={16} className="text-gray-500 mt-0.5 mr-3" />
                                    <div>
                                        <p className="font-medium text-gray-800">{application.customer_address}</p>
                                        <p className="text-sm text-gray-600">
                                            {application.customer_city}, {application.customer_state} - {application.customer_pincode}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-5">
                        <h4 className="font-bold text-gray-700 mb-4 flex items-center">
                            <Building size={18} className="mr-2" />
                            Business Details
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <Building size={16} className="text-gray-500 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {application.business_name || 'Not Provided'}
                                    </p>
                                    <p className="text-sm text-gray-600">Business Name</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Package size={16} className="text-gray-500 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {application.business_type || 'Not Specified'}
                                    </p>
                                    <p className="text-sm text-gray-600">Business Type</p>
                                </div>
                            </div>
                            {application.admin_notes && (
                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-sm font-medium text-yellow-800 mb-1">Admin Notes:</p>
                                    <p className="text-sm text-yellow-700">{application.admin_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Timeline */}
                <div className="mb-8">
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center">
                        <Calendar size={18} className="mr-2" />
                        Application Timeline
                    </h4>
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                        {history.slice(0, 5).map((item, index) => (
                            <div key={item.id} className="relative mb-6">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                                <div className="ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {item.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <p className="mt-2 text-gray-700">{item.notes}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(item.changed_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                    <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-gray-600">
                            Last updated: {formatDate(application.updated_at)}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={onReset}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 font-medium"
                        >
                            Verify Another
                        </button>
                        {application.status === 'approved' && (
                            <button
                                onClick={downloadCertificate}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 font-medium flex items-center"
                            >
                                <Download size={18} className="mr-2" />
                                Download Certificate
                            </button>
                        )}
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-medium flex items-center"
                        >
                            <Printer size={18} className="mr-2" />
                            Print Details
                        </button>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

// --- MAIN VERIFICATION PAGE ---
const VerifyCertificate: React.FC = () => {
    const [applicationId, setApplicationId] = useState<string>('');
    const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerification = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!applicationId.trim()) {
            setError('Please enter your Application ID');
            return;
        }

        // Simple validation - just check it's not empty
        const trimmedId = applicationId.trim().toUpperCase();

        setLoading(true);
        setError(null);
        setVerificationResult(null);

        try {
            // Call your backend API
            const response = await fetch(`${API_ENDPOINT}/admin/application/${trimmedId}`);

            // Check response status
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Application ID not found. Please check and try again.');
                }
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            // Parse the response
            const result = await response.json();

            // Check if response has successful status
            if (result.status === 200 && result.data) {
                setVerificationResult(result);
            } else {
                throw new Error(result.message || result.error || 'Failed to fetch application details');
            }

        } catch (err) {
            console.error('Verification error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, [applicationId]);

    const handleReset = () => {
        setVerificationResult(null);
        setApplicationId('');
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <Link to="/" className="flex items-center text-gray-800 hover:text-blue-600">
                                <Home size={20} className="mr-2" />
                                <span className="font-bold text-xl">Geemadhura</span>
                            </Link>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Link to="/" className="hover:text-blue-600">Home</Link>
                                <ChevronRight size={12} className="mx-2" />
                                <span className="font-medium text-gray-700">Tracking Application</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Shield size={24} className="text-blue-600" />
                            <span className="font-medium text-gray-700">Secure Verification Portal</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
                            <Shield size={40} className="text-blue-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Verify Your Application Status
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Enter your Application ID below to check the status of your certification application.
                            Track progress, view details, and download your certificate when approved.
                        </p>
                    </div>

                    {/* Verification Card */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
                        <div className="p-8">
                            {!verificationResult ? (
                                // Verification Form
                                <div className="max-w-2xl mx-auto">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                                            <Search size={28} className="text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            Enter Your Application ID
                                        </h2>
                                        <p className="text-gray-600">
                                            You can find your Application ID in your confirmation email
                                        </p>
                                    </div>

                                    <form onSubmit={handleVerification} className="space-y-6">
                                        <div>
                                            <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
                                                Application ID
                                            </label>
                                            <input
                                                type="text"
                                                id="applicationId"
                                                value={applicationId}
                                                onChange={(e) => {
                                                    setApplicationId(e.target.value.toUpperCase());
                                                    setError(null);
                                                }}
                                                placeholder="Enter your Application ID (e.g., APP25125D36DE)"
                                                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono transition duration-150"
                                                disabled={loading}
                                            />
                                            <p className="mt-2 text-sm text-gray-500">
                                                Enter the Application ID you received in your confirmation email
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                                <div className="flex items-center">
                                                    <AlertCircle size={20} className="text-red-500 mr-2" />
                                                    <p className="text-red-700 font-medium">{error}</p>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading || !applicationId.trim()}
                                            style={{backgroundColor:'#00283A'}}
                                            className="w-full py-4  text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-150 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={22} className="animate-spin mr-3" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield size={22} className="mr-3" />
                                                    Application Management Status
                                                </>
                                            )}
                                        </button>
                                    </form>

                                 
                                </div>
                            ) : (
                                // Verification Result
                                <VerificationResultCard
                                    application={verificationResult.data.application}
                                    documents={verificationResult.data.documents}
                                    history={verificationResult.data.history}
                                    onReset={handleReset}
                                />
                            )}
                        </div>
                    </div>

                 
                </div>
            </main>


        </div>
    );
};

export default VerifyCertificate;