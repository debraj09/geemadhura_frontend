import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Loader2, AlertCircle, ChevronRight, Youtube } from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  youtube_video_id: string;
  enable_home_page: boolean;
  created_at: string;
}

const BASE_URL = 'https://geemadhura.braventra.in';

export default function VideosGallery() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

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

        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#00283A] tracking-tight">
            VIDEOS
          </h1>
         
        </div>

        {videos.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {videos.map((video, index) => (
                <CarouselItem key={video.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="border-none bg-transparent group overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                      <CardContent className="p-0 relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                        {/* Video Thumbnail with Play Button */}
                        <div className="relative w-full h-full">
                          <img
                            src={getYouTubeThumbnail(video.youtube_video_id)}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;
                            }}
                          />
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                          
                          {/* YouTube Logo */}
                          <div className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-lg">
                            <Youtube className="h-5 w-5" />
                          </div>
                          
                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <a
                              href={getYouTubeUrl(video.youtube_video_id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300"
                              onClick={(e) => {
                                e.preventDefault();
                                setPlayingVideo(video.youtube_video_id);
                              }}
                            >
                              <PlayCircle className="h-12 w-12 text-white" fill="white" />
                            </a>
                          </div>
                        </div>
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#F2C445] text-[#00283A] text-xs font-bold px-3 py-1 rounded-full">
                                VIDEO
                              </span>
                              {video.enable_home_page && (
                                <span className="bg-[#00283A] text-white text-xs font-bold px-3 py-1 rounded-full">
                                  FEATURED
                                </span>
                              )}
                            </div>
                          </div>
                          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-white/80 text-xs mt-1 font-light">
                            {new Date(video.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
              <div className="flex gap-3">
                <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border border-[#00283A]/20 bg-white text-[#00283A] hover:bg-[#00283A] hover:text-white shadow-md transition-all hover:scale-105" />
                <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border border-[#00283A]/20 bg-white text-[#00283A] hover:bg-[#00283A] hover:text-white shadow-md transition-all hover:scale-105" />
              </div>
              <div className="hidden md:block">
                <p className="text-[#00283A]/50 text-xs font-medium uppercase tracking-wider">
                  Swipe to navigate
                </p>
              </div>
            </div>
          </Carousel>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#00283A]/20">
            <PlayCircle className="mx-auto h-12 w-12 text-[#00283A]/30 mb-4" />
            <p className="text-[#00283A] font-medium text-base">No videos available</p>
            <p className="text-[#00283A]/50 text-sm mt-2">Check back later for updates</p>
          </div>
        )}

        {/* Video Player Modal */}
        {playingVideo && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setPlayingVideo(null)}
          >
            <div 
              className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                onClick={() => setPlayingVideo(null)}
              >
                ✕
              </button>
              <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 bg-black text-white">
                <p className="text-sm opacity-75">Now playing...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}