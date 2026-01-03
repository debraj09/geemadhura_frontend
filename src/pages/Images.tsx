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
import { ImageIcon, Loader2, AlertCircle, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
}

const BASE_URL = 'https://geemadhura.braventra.in';

export default function ImagesGallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/galleryRoutes`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.status === 200 && Array.isArray(data.data)) {
          setImages(data.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const getFullImageUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#FFFFF7]">
        <Loader2 className="h-10 w-10 animate-spin text-[#00283A]" />
        <p className="text-[#00283A] text-sm font-medium tracking-tight">Loading gallery...</p>
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
          <span className="font-semibold text-[#00283A]">Images</span>
        </div>

        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#00283A] tracking-tight">
           <span className="text-[#F2C445]"></span> IMAGES
          </h1>
          <div className="h-1 w-20 bg-[#00283A] rounded-full mt-3" />
          {/* <p className="mt-4 text-sm text-[#00283A]/60 max-w-2xl">
            A collection of cherished moments and special memories from our journey
          </p> */}
        </div>

        {images.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {images.map((item, index) => (
                <CarouselItem key={item.id || index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="border-none bg-transparent group overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                      <CardContent className="p-0 relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                        {/* Image */}
                        <img
                          src={getFullImageUrl(item.image_url)}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x450?text=Image+Not+Found';
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#F2C445] text-[#00283A] text-xs font-bold px-3 py-1 rounded-full">
                              PHOTO
                            </span>
                          </div>
                          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-white/80 text-xs mt-1 font-light">
                            {new Date(item.created_at).toLocaleDateString('en-US', {
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
            <ImageIcon className="mx-auto h-12 w-12 text-[#00283A]/30 mb-4" />
            <p className="text-[#00283A] font-medium text-base">No images available</p>
            <p className="text-[#00283A]/50 text-sm mt-2">Check back later for updates</p>
          </div>
        )}
      </div>
    </section>
  );
}