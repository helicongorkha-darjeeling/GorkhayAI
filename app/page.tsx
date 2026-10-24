import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Insights } from "@/components/sections/Insights";
import { Proof } from "@/components/sections/Proof";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <Services />
      <HowItWorks />
      <Insights />
      <About />
      <Contact />
    </>
  );
}
