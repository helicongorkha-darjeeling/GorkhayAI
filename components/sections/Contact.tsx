import { SectionHeading } from "@/components/ui/SectionHeading";
import { site, whatsappLink } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 overflow-hidden band py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-1/4 h-[420px] w-[420px] rounded-full bg-ember/10 blur-[120px]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title="Let's fill your rooms"
            intro="Tell us about your property and we'll set up a call to show you what we'd build."
          />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.7-1.2 2.2 2.2 0 00.2-1.2c-.1-.1-.3-.2-.5-.3z" />
              </svg>
              WhatsApp us
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Website enquiry")}`} className="btn btn-ghost">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              {site.email}
            </a>
          </div>
          <p className="mt-8 text-sm text-haze">Based in {site.location}. Working with properties across the hills and beyond.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
