import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, Loader2, AlertCircle, ChevronRight, Youtube, 
  Grid, List, ChevronDown, X, Maximize2, ChevronLeft, ChevronRight as RightChevron
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoItem {
  id: number;
  title: string;
  youtube_video_id: string;
  enable_home_page: boolean;
  created_at: string;
  description?: string;
}

const BASE_URL = 'https://geemadhura.braventra.in';
const ITEMS_PER_VIEW = 8; // Number of items to show initially

export default function VideosGallery() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAll, setShowAll] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/videos`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.status === 200 && Array.isArray(data.data)) {
          setVideos(data.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getYouTubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const displayVideos = showAll ? videos : videos.slice(0, ITEMS_PER_VIEW);

  const openPlayer = (video: VideoItem, index: number) => {
    setSelectedVideo(video);
    setPlayerIndex(index);
    setPlayerOpen(true);
  };

  const navigatePlayer = (direction: 'prev' | 'next') => {
    const currentIndex = videos.findIndex(vid => vid.id === selectedVideo?.id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
    }
    
    setSelectedVideo(videos[newIndex]);
    setPlayerIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#FFFFF7]">
        <Loader2 className="h-10 w-10 animate-spin text-[#00283A]" />
        <p className="text-[#00283A] text-sm font-medium tracking-tight">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-red-500 bg-[#FFFFF7] p-8">
        <AlertCircle size={32} />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section className="bg-[#FFFFF7] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-[#00283A]/70">
          <span className="font-medium">Gallery</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-semibold text-[#00283A]">Videos</span>
        </div>

        {/* Title and Controls Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#00283A] tracking-tight">
              VIDEOS <span className="text-[#F2C445]">GALLERY</span>
            </h1>
            <div className="h-1 w-20 bg-[#00283A] rounded-full mt-3" />
            <p className="mt-4 text-sm text-[#00283A]/60 max-w-2xl">
              Watch our collection of videos and tutorials
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-[#00283A]/10">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-[#F2C445] text-[#00283A]' : 'text-[#00283A]/60'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 ${viewMode === 'list' ? 'bg-[#F2C445] text-[#00283A]' : 'text-[#00283A]/60'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>

        {videos.length > 0 ? (
          <>
            {/* Videos Content */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
              <AnimatePresence>
                {displayVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => openPlayer(video, index)}
                  >
                    {viewMode === 'grid' ? (
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#00283A]/10 group-hover:border-[#F2C445]/50">
                        {/* Video Thumbnail Container */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={getYouTubeThumbnail(video.youtube_video_id)}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;
                            }}
                          />
                          
                          {/* YouTube Logo */}
                          <div className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-lg">
                            <Youtube className="h-4 w-4" />
                          </div>
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              <PlayCircle className="h-8 w-8 text-white" fill="white" />
                            </div>
                          </div>
                        </div>

                        {/* Title & Description OUTSIDE the thumbnail */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#00283A]/10 text-[#00283A] text-xs font-bold px-3 py-1 rounded-full">
                                VIDEO
                              </span>
                              {video.enable_home_page && (
                                <span className="bg-[#F2C445] text-[#00283A] text-xs font-bold px-3 py-1 rounded-full">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#00283A]/50">
                              {new Date(video.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-[#00283A] text-base mb-2 line-clamp-2 group-hover:text-[#F2C445] transition-colors">
                            {video.title}
                          </h3>
                          
                          {video.description && (
                            <p className="text-[#00283A]/60 text-sm line-clamp-3">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* List View */
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#00283A]/10 group-hover:border-[#F2C445]/50 flex">
                        <div className="relative w-32 md:w-48 aspect-square overflow-hidden flex-shrink-0">
                          <img
                            src={getYouTubeThumbnail(video.youtube_video_id)}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;
                            }}
                          />
                          {/* YouTube Logo in List View */}
                          <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded">
                            <Youtube className="h-3 w-3" />
                          </div>
                          {/* Play Button in List View */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="h-8 w-8 text-white/80" fill="white" />
                          </div>
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#00283A]/10 text-[#00283A] text-xs font-bold px-3 py-1 rounded-full">
                                VIDEO
                              </span>
                              {video.enable_home_page && (
                                <span className="bg-[#F2C445] text-[#00283A] text-xs font-bold px-3 py-1 rounded-full">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#00283A]/50">
                              {new Date(video.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="font-bold text-[#00283A] text-base mb-2 group-hover:text-[#F2C445] transition-colors">
                            {video.title}
                          </h3>
                          {video.description && (
                            <p className="text-[#00283A]/60 text-sm line-clamp-2">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Show More/Less Button */}
            {videos.length > ITEMS_PER_VIEW && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  className="border-[#00283A]/20 hover:border-[#F2C445] hover:bg-[#F2C445]/10 text-[#00283A] font-medium px-8 py-6 rounded-xl transition-all duration-300 group"
                  onClick={() => setShowAll(!showAll)}
                >
                  <span className="flex items-center gap-2">
                    {showAll ? 'Show Less' : `View All (${videos.length} Videos)`}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
                  </span>
                </Button>
              </div>
            )}

            {/* Video Count */}
            <div className="text-center mt-8 text-sm text-[#00283A]/50">
              Showing {displayVideos.length} of {videos.length} videos
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#00283A]/20">
            <PlayCircle className="mx-auto h-12 w-12 text-[#00283A]/30 mb-4" />
            <p className="text-[#00283A] font-medium text-base">No videos available</p>
            <p className="text-[#00283A]/50 text-sm mt-2">Check back later for updates</p>
          </div>
        )}

        {/* Video Player Modal */}
        <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
          <DialogContent className="max-w-6xl w-[95vw] p-0 bg-transparent border-none shadow-none">
            <div className="relative bg-white rounded-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => setPlayerOpen(false)}
                className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200 shadow-lg"
              >
                <X className="h-5 w-5 text-[#00283A]" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePlayer('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors duration-200 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6 text-[#00283A]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePlayer('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors duration-200 shadow-lg"
              >
                <RightChevron className="h-6 w-6 text-[#00283A]" />
              </button>

              {selectedVideo && (
                <div className="flex flex-col lg:flex-row">
                  {/* Video Player */}
                  <div className="lg:w-2/3 relative">
                    <div className="relative pt-[56.25%] bg-black"> {/* 16:9 Aspect Ratio */}
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedVideo.youtube_video_id}?autoplay=1&rel=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:w-1/3 p-6 lg:p-8 bg-white">
                    <DialogHeader>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-[#F2C445] text-[#00283A] text-xs font-bold px-3 py-1 rounded-full">
                          VIDEO
                        </span>
                        {selectedVideo.enable_home_page && (
                          <span className="bg-[#00283A] text-white text-xs font-bold px-3 py-1 rounded-full">
                            FEATURED
                          </span>
                        )}
                        <span className="text-xs text-[#00283A]/50">
                          {new Date(selectedVideo.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <DialogTitle className="text-2xl font-bold text-[#00283A] mb-4">
                        {selectedVideo.title}
                      </DialogTitle>
                      <DialogDescription className="text-[#00283A]/70">
                        {selectedVideo.description || "No description available"}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 pt-6 border-t border-[#00283A]/10">
                      <div className="flex items-center justify-between text-sm text-[#00283A]/50">
                        <span>Video {playerIndex + 1} of {videos.length}</span>
                        <a
                          href={getYouTubeUrl(selectedVideo.youtube_video_id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F2C445] hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Watch on YouTube
                          <Youtube className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}