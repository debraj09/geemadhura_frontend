import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { SecondaryHeader } from "@/components/SecondaryHeader";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DetailsPage from "./pages/DetailsPage";
import Box from "./pages/Box";
import OurStory from "./pages/OurStory";
import { FirstScrollbar } from "./components/FirstScrollbar";
import { FAQ } from "./components/FAQ";
import VerifyCertificate from "./pages/VerifyCertificate";
import Images from "./pages/Images";
import Videos from "./pages/Videos";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Chatbot />
        
        <div className="flex flex-col min-h-screen">
          {/* Secondary Header - Fixed at top */}
          <SecondaryHeader />
          
          {/* Main Header - Fixed below secondary header */}
          <Header />
          
          {/* Main Content - Add padding to account for both headers */}
          <div className="flex-1 pt-24"> {/* 40px secondary + 64px main header = 104px */}
            <Routes>
              <Route path="/" element={
                <>
                  <FirstScrollbar />
                  <Home />
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/verify-certificate" element={<VerifyCertificate />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/DetailsPage" element={<DetailsPage />} />
              <Route path="/Box" element={<Box />} />
              <Route path="/OurStory" element={<OurStory />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/gallery/images" element={<Images />} />
              <Route path="/gallery/videos" element={<Videos />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;