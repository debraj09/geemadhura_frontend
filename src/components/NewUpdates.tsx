import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

// --- Configuration ---
const API_URL = 'https://geemadhura.braventra.in/api/latestUpdates';

// --- Component ---

export default () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    
    // Updates structure: { id: number, update_date: string, title: string, description: string }
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Exponential Backoff Configuration
    const maxRetries = 3;
    const initialDelay = 1000; // 1 second

    // Function to fetch updates with exponential backoff
    const fetchUpdates = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({}));
                    // Use standard Error object to contain status for debugging
                    throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success && Array.isArray(result.data)) {
                    // Filter or map data here if necessary, assuming it contains the fields needed
                    setUpdates(result.data.slice(0, 4)); // Show maximum 4 updates
                    setLoading(false);
                    return; // Success, exit function
                } else {
                    throw new Error('Invalid data structure received from API.');
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'An unknown error occurred.';
                
                if (attempt < maxRetries - 1) {
                    // Calculate delay with jitter
                    const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 500;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    // Final attempt failed
                    console.error("Failed to fetch updates after all retries:", message);
                    setError(`Failed to load updates: ${message}. Please check API endpoint.`);
                    setLoading(false);
                    return;
                }
            }
        }
    }, []);

    useEffect(() => {
        fetchUpdates();
    }, [fetchUpdates]);
    
    // --- Custom Styles for Pulse Glow Effect (Tailwind doesn't have this by default) ---
    const customStyles = `
        /* Utility classes replacement using standard colors: */
        /* bg-background -> bg-gray-50 */
        /* text-muted-foreground -> text-gray-500 */
        /* bg-card -> bg-white */
        /* border-border -> border-gray-200 */
        /* text-foreground -> text-gray-900 */
        /* text-primary -> text-indigo-600 */
        /* accent-yellow -> text-yellow-500 */

        @keyframes pulse-glow {
            0%, 100% {
                text-shadow: 0 0 5px rgba(251, 191, 36, 0.5); /* Yellow-400 equivalent */
            }
            50% {
                text-shadow: 0 0 10px rgba(251, 191, 36, 1);
            }
        }
        .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
        }
    `;

    return (
        <section ref={ref} className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
            <style>{customStyles}</style>
            
            {/* Background Animations */}
            <motion.div
                className="absolute top-20 right-10 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [90, 0, 90],
                }}
                transition={{ duration: 12, repeat: Infinity }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : {}}
                        transition={{ duration: 0.8, type: 'spring', bounce: 0.6 }}
                        className="inline-block mb-4"
                    >
                        <Sparkles className="text-yellow-500 animate-pulse-glow" size={48} />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Latest Updates</h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.3 }}
                        className="text-gray-500 text-lg max-w-2xl mx-auto"
                    >
                        Stay informed with our latest news and announcements
                    </motion.p>
                </motion.div>

                {/* Content Area: Loading, Error, or Data */}
                {loading && (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                        <p className="ml-3 text-lg text-gray-600">Fetching latest updates...</p>
                    </div>
                )}
                
                {error && (
                    <div className="p-6 bg-red-100 border border-red-400 rounded-xl text-red-700 max-w-xl mx-auto flex items-center space-x-3">
                        <AlertTriangle size={24} />
                        <div>
                            <h3 className="font-semibold text-lg">Error Loading Data</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && updates.length === 0 && !error && (
                    <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-xl text-yellow-800 max-w-xl mx-auto text-center">
                        <p className="font-medium">No updates available at this time.</p>
                    </div>
                )}

                {!loading && updates.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {updates.map((update, index) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 100, rotate: -10, scale: 0.5 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
                                        : {}
                                }
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.15,
                                    type: 'spring',
                                    bounce: 0.5,
                                }}
                                whileHover={{
                                    y: -15,
                                    rotate: [0, -2, 2, 0],
                                    scale: 1.05,
                                    transition: { duration: 0.3 },
                                }}
                                className="perspective-card bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-indigo-600 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '200%' }}
                                    transition={{ duration: 0.6 }}
                                />

                                <motion.div
                                    className="flex items-center gap-2 text-yellow-500 text-sm mb-3"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Clock size={16} className="animate-pulse-glow" />
                                    <span>{new Date(update.update_date).toLocaleDateString()}</span>
                                </motion.div>

                                <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {/* @ts-ignore: We know 'update' has a title property */}
                                    {update.title.split(' ').map((word, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block mr-1"
                                            whileHover={{ y: -5, color: '#F59E0B' /* Tailwind yellow-500 */ }}
                                            transition={{ type: 'spring', bounce: 0.6 }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </h3>

                                {/* @ts-ignore: We know 'update' has a description property */}
                                <p className="text-gray-500 text-sm leading-relaxed">{update.description}</p>

                                <motion.div
                                    className="absolute top-0 right-0 w-20 h-20 bg-indigo-600/10 rounded-bl-full"
                                    animate={{ rotate: [0, 90, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

; // Added the default export