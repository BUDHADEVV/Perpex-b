import { client } from "@/sanity/lib/client";
import { HERO_QUERY, EXPERTS_QUERY, ROADMAP_QUERY, FAQ_QUERY, PROGRAM_QUERY } from "@/sanity/lib/queries";
import Hero from "@/components/Hero";
import ProgramFeatures from "@/components/ProgramFeatures";
import Brochure from "@/components/Brochure";
import Roadmap from "@/components/Roadmap";
import ExpertTalk from "@/components/ExpertTalk";
import ExpertMentors from "@/components/ExpertMentors";
import Pitch from "@/components/Pitch";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import BookingModal from "@/components/BookingModal";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  const heroData = await client.fetch(HERO_QUERY);
  const expertsData = await client.fetch(EXPERTS_QUERY);
  const roadmapData = await client.fetch(ROADMAP_QUERY);
  const faqData = await client.fetch(FAQ_QUERY);
  const programData = await client.fetch(PROGRAM_QUERY);

  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Hero data={heroData} />
      <ProgramFeatures data={programData} />
      <Brochure />
      <Roadmap data={roadmapData} />
      <ExpertTalk />
      <ExpertMentors data={expertsData} />
      <Pitch />
      <FAQ data={faqData} />
      <CTA />

      {/* Global Components */}
      <BookingModal />
    </main>
  );
}
