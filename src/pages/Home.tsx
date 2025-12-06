import { HeroSlider } from '@/components/HeroSlider';
import { Marquee } from '@/components/Marquee';
import NewUpdates  from '@/components/NewUpdates';
import { ServicesGrid } from '@/components/ServicesGrid';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';
import { FAQ } from '@/components/FAQ';
import  Box  from '@/pages/Box';
import OurStory from './OurStory';
import Blog from './Blog';

const Home = () => {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      <Marquee />
      {/* <NewUpdates /> */}
      <Box />
      <OurStory />
      <ServicesGrid />
      <Blog />
      <Testimonials />
      <Newsletter />
      <FAQ />
    </main>
  );
};

export default Home;
