import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react';

// --- Interfaces ---
interface Update {
  id: number;
  update_date: string;
  title: string;
  description: string;
  image_url: string | null;
}

// --- Configuration ---
const API_URL = 'https://geemadhura.braventra.in/api/latestUpdates';

export const Marquee = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Exponential Backoff Configuration
  const maxRetries = 3;
  const initialDelay = 1000;

  // Function to fetch updates with exponential backoff
  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    setError(null);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setUpdates(result.data);
          setLoading(false);
          return;
        } else {
          throw new Error('Invalid data structure received from API.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';

        if (attempt < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error("Failed to fetch updates after all retries:", message);
          setError(`Failed to load updates: ${message}`);
          setLoading(false);
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle click on update title
  const handleUpdateClick = (update: Update) => {
    navigate(`/latest-updates/${update.id}`, { state: { update } });
  };

  // Create duplicated items for seamless marquee effect
  const items = updates.length > 0 ? [...updates, ...updates, ...updates] : [];
  const fastDuration = 35;

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 overflow-hidden relative flex items-center h-10 md:h-12 rounded-lg shadow-lg">
        <div className="flex-shrink-0 z-30 h-full relative">
          <div
            style={{ backgroundColor: '#E8112E' }}

            className="bg-gradient-to-r from-[#F2C445] to-[#FFD700] px-4 md:px-6 h-full flex items-center rounded-l-lg"
          >
            <h2 className="text-[#00283A] text-base md:text-lg font-bold whitespace-nowrap flex items-center gap-2">
              <span>📢</span> Updates
            </h2>
          </div>
        </div>
        <div className="relative flex-grow h-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white/95 shadow-inner flex items-center justify-center pr-8"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          >
            <span className="text-[#00283A]/70 text-xs md:text-sm font-medium animate-pulse">
              Loading updates...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 overflow-hidden relative flex items-center h-10 md:h-12 rounded-lg shadow-lg">
        <div className="flex-shrink-0 z-30 h-full relative">
          <div
            style={{ backgroundColor: '#E8112E' }}

            className=" px-4 md:px-6 h-full flex items-center rounded-l-lg"
          >
            <h2 className="text-[#00283A] text-base md:text-lg font-bold whitespace-nowrap flex items-center gap-2">
              Updates
            </h2>
          </div>
        </div>
        <div className="relative flex-grow h-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white/95 shadow-inner flex items-center justify-center pr-8"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          >
            <span className="text-red-600 text-xs md:text-sm font-medium">
              Failed to load updates
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (updates.length === 0) {
    return (
      <div className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 overflow-hidden relative flex items-center h-10 md:h-12 rounded-lg shadow-lg">
        <div className="flex-shrink-0 z-30 h-full relative">
          <div
            style={{ backgroundColor: '#E8112E' }}

            className="px-4 md:px-6 h-full flex items-center rounded-l-lg"
          >
            <h2 className="text-[#00283A] text-base md:text-lg font-bold whitespace-nowrap flex items-center gap-2">
              Updates
            </h2>
          </div>
        </div>
        <div className="relative flex-grow h-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white/95 shadow-inner flex items-center justify-center pr-8"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          >
            <span className="text-[#00283A]/70 text-xs md:text-sm font-medium">
              No updates available
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 overflow-hidden relative flex items-center h-10 md:h-12 rounded-lg shadow-lg">
      {/* Fixed "Latest Updates" Label */}
      <div className="flex-shrink-0 z-30 h-full relative">
        <div
          style={{ backgroundColor: '#E8112E' }}
          className="bg-gradient-to-r from-[#F2C445] to-[#FFD700] px-4 md:px-6 h-full flex items-center rounded-l-lg"
        >
          <h2 className="text-[#00283A] text-base md:text-lg font-bold whitespace-nowrap flex items-center gap-2">
            Updates
          </h2>
        </div>
      </div>

      {/* Marquee Content Bar */}
      <div  className="relative flex-grow h-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-white/95 shadow-inner flex items-center pr-8"
          style={{ width: '100%', paddingLeft: '2.5rem' }}
        >
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/95 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/95 to-transparent z-10" />

          {/* Animated Marquee Content */}
          <motion.div
            className="flex gap-8 md:gap-12"
            style={{ height: '100%', alignItems: 'center' }}
            animate={{ x: ['0%', '-33.33%'] }}
            transition={{
              duration: fastDuration,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {items.map((item, index) => (
              <motion.button
                key={`${item.id}-${index}`}
                onClick={() => handleUpdateClick(item)}
                className="flex items-center gap-2 md:gap-3 whitespace-nowrap group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {/* Date badge */}
                {/* <div className="flex items-center gap-1 bg-[#F2C445]/20 px-2 py-1 rounded-md">
                  <Calendar size={12} className="text-[#00283A]/60" />
                  <span className="text-[#00283A] text-xs font-semibold">
                    {formatDate(item.update_date)}
                  </span>
                </div> */}

                {/* Update title with hover effect */}
                <span className="text-[#00283A] font-bold text-sm md:text-base group-hover:text-[#F2C445] transition-colors duration-200">
                  {item.title}
                </span>

                {/* Arrow indicator */}
                <ArrowRight size={14} className="text-[#00283A]/40 group-hover:text-[#F2C445] group-hover:translate-x-1 transition-all duration-200" />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// DETAILS PAGE COMPONENT
// This is for the page that opens when clicking an update
// ----------------------------------------------------------------------------

export const UpdateDetailsPage = () => {
  const [update, setUpdate] = useState<Update | null>(null);
  const [allUpdates, setAllUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get update ID from URL
        const pathParts = window.location.pathname.split('/');
        const updateId = parseInt(pathParts[pathParts.length - 1]);

        if (isNaN(updateId)) {
          navigate('/latest-updates');
          return;
        }

        // Fetch all updates
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setAllUpdates(result.data);

          // Find the specific update
          const foundUpdate = result.data.find((u: Update) => u.id === updateId);

          if (foundUpdate) {
            setUpdate(foundUpdate);
          } else {
            navigate('/latest-updates');
          }
        }
      } catch (error) {
        console.error('Error fetching update details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFFF7] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00283A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#00283A] font-medium">Loading update...</p>
        </div>
      </div>
    );
  }

  if (!update) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFFF7] to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#00283A] mb-4">Update Not Found</h2>
          <button
            onClick={() => navigate('/latest-updates')}
            className="bg-[#F2C445] text-[#00283A] px-6 py-2 rounded-lg font-semibold hover:bg-[#00283A] hover:text-white transition-colors duration-300"
          >
            Back to Updates
          </button>
        </div>
      </div>
    );
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFFF7] to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/latest-updates')}
            className="flex items-center gap-2 text-white hover:text-[#F2C445] transition-colors duration-300 mb-6"
          >
            <ArrowRight className="rotate-180" size={20} />
            <span className="font-medium">Back to Updates</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#F2C445]/20 rounded-lg">
              {/* <Calendar className="text-[#F2C445]" size={24} /> */}
            </div>
            <span style={{ fontSize: 12 }} className="text-[#F2C445] font-semibold">
              {formatFullDate(update.update_date)}
            </span>
          </div>

          <h1 className="text-xl md:text-xl lg:text-2xl font-bold text-white mb-6">
            {update.title}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Update Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image */}
            {update.image_url && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[#00283A]/10">
                <div className="relative h-64 md:h-80 lg:h-96">
                  <img
                    src={update.image_url}
                    alt={update.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-[#00283A]/10">
              <h2 className="text-2xl font-bold text-[#00283A] mb-6 pb-4 border-b border-[#00283A]/10">
                Update Details
              </h2>
              <div className="prose prose-lg max-w-none text-[#00283A]/80">
                <p className="whitespace-pre-line leading-relaxed">
                  {update.description}
                </p>
              </div>

              {/* Share buttons */}
              <div className="mt-8 pt-6 border-t border-[#00283A]/10">
                <h3 className="text-lg font-semibold text-[#00283A] mb-4">Share this update</h3>
                <div className="flex gap-3">
                  <button className="bg-[#00283A] text-white px-4 py-2 rounded-lg hover:bg-[#F2C445] hover:text-[#00283A] transition-colors duration-300">
                    Twitter
                  </button>
                  <button className="bg-[#00283A] text-white px-4 py-2 rounded-lg hover:bg-[#F2C445] hover:text-[#00283A] transition-colors duration-300">
                    Facebook
                  </button>
                  <button className="bg-[#00283A] text-white px-4 py-2 rounded-lg hover:bg-[#F2C445] hover:text-[#00283A] transition-colors duration-300">
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - All Updates List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#00283A]/10">
                <h2 className="text-2xl font-bold text-[#00283A] mb-6 pb-4 border-b border-[#00283A]/10 flex items-center gap-2">
                  <span>📰</span> All Updates
                </h2>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {allUpdates.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id !== update.id) {
                          navigate(`/latest-updates/${item.id}`);
                        }
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${item.id === update.id
                          ? 'bg-gradient-to-r from-[#00283A] to-[#00283A]/80 text-white shadow-lg'
                          : 'bg-[#F2C445]/10 hover:bg-[#F2C445]/20 border border-transparent hover:border-[#F2C445]/30'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 p-2 rounded-lg ${item.id === update.id ? 'bg-white/20' : 'bg-white'
                          }`}>
                          <Calendar size={16} className={item.id === update.id ? 'text-white' : 'text-[#00283A]'} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-sm mb-1 ${item.id === update.id ? 'text-white' : 'text-[#00283A]'
                            }`}>
                            {item.title}
                          </h3>

                          {item.id === update.id && (
                            <span className="inline-block mt-2 px-2 py-1 bg-[#F2C445] text-[#00283A] text-xs font-bold rounded">
                              Currently Viewing
                            </span>
                          )}
                        </div>
                        {item.id !== update.id && (
                          <ArrowRight size={16} className="text-[#00283A]/40 mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* View All Button */}
                <div className="mt-6 pt-4 border-t border-[#00283A]/10">
                  <Link
                    to="/latest-updates"
                    className="w-full bg-gradient-to-r from-[#F2C445] to-[#FFD700] text-[#00283A] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                  >
                    <span>View All Updates</span>
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </div>


            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated with Our Latest News
          </h2>
          <p className="text-[#F2C445] mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive regular updates directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white text-[#00283A] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F2C445]"
            />
            <button className="bg-[#F2C445] text-[#00283A] font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// UPDATES LISTING PAGE
// This is the main page that lists all updates
// ----------------------------------------------------------------------------

export const UpdatesListingPage = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setUpdates(result.data);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFFF7] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00283A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#00283A] font-medium">Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFFF7] to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Latest <span className="text-[#F2C445]">Updates</span> & News
          </h1>
          <p className="text-[#F2C445] text-lg md:text-xl max-w-3xl mx-auto">
            Stay informed with our latest announcements, news, and important updates.
          </p>
        </div>
      </div>

      {/* Updates Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {updates.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-[#00283A] mb-4">No Updates Yet</h2>
            <p className="text-[#00283A]/70 max-w-md mx-auto">
              Check back soon for the latest news and updates from our team.
            </p>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {updates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[#00283A]/10 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/latest-updates/${update.id}`)}
                >
                  {/* Image */}
                  {update.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={update.image_url}
                        alt={update.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Update';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-[#F2C445] text-[#00283A] px-3 py-1 rounded-full text-sm font-bold">
                        New
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={14} className="text-[#00283A]/60" />

                    </div>

                    <h3 className="text-xl font-bold text-[#00283A] mb-3 group-hover:text-[#F2C445] transition-colors duration-300">
                      {update.title}
                    </h3>

                    <p className="text-[#00283A]/70 mb-4 line-clamp-3">
                      {update.description.length > 150
                        ? `${update.description.substring(0, 150)}...`
                        : update.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[#00283A] font-semibold text-sm">
                        Read More
                      </span>
                      <ArrowRight size={18} className="text-[#00283A] group-hover:text-[#F2C445] group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-[#00283A] to-[#00283A]/90 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-6">Stay Connected</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold text-[#F2C445] mb-2">{updates.length}</div>
                  <p className="text-white/80">Total Updates</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#F2C445] mb-2">
                    {new Set(updates.map(u => u.update_date.split('-')[0])).size}
                  </div>
                  <p className="text-white/80">Active Years</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#F2C445] mb-2">
                    {updates.filter(u => u.image_url).length}
                  </div>
                  <p className="text-white/80">Featured Updates</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};