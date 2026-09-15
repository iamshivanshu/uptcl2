import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import AboutLeague from "@/components/about/AboutLeague";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import Whyupdtcl from "@/components/why-updtcl/WhyUpdtcl";
import Registration from "@/components/registration/Registration";
import FAQFooter from "@/components/faq-footer/FAQFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050806] text-[#f4f6ef]">
      <Navbar />
      <Hero />
      <AboutLeague />
      <HowItWorks />
      <Whyupdtcl />
      <Registration/>
      <FAQFooter />
    </main>
  );
}