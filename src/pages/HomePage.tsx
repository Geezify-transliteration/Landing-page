import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  AnnouncementBar,
  FaqSection,
  FeatureGridSection,
  FinalCtaSection,
  HeroSection,
  HowItWorksSection,
  ProductSuiteSection,
  TrustSection,
} from "@/components/marketing/HomeSections";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-plum-50/60">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <ProductSuiteSection />
        <FeatureGridSection />
        <HowItWorksSection />
        <TrustSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
