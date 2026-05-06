/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppContent } from './types';

export const INITIAL_CONTENT: AppContent = {
  projectName: "Parkside Residence",
  logo: "https://picsum.photos/seed/parkside-logo/200/50",
  hero: {
    title: "A Masterpiece of Bespoke Living",
    subtitle: "SETIA FEDERAL HILL — KUALA LUMPUR",
    description: "Discover a sanctuary of architectural excellence and natural tranquility. An address defined by its 5-acre central park and seamless global connectivity.",
    image: "https://picsum.photos/seed/parkside-ultra/1920/1080",
    ctaText: "Arrange Consultation"
  },
  overview: {
    title: "The Zenith of Urban Tranquility",
    description: "Parkside Residence is the crown jewel of the Setia Federal Hill masterplan. A collaboration of mastery between SP Setia and Mitsui Fudosan, this 62-storey beacon of luxury sets a new global benchmark for transit-oriented, sustainable living.",
    image: "https://picsum.photos/seed/parkside-estate/1200/800",
    stats: [
      { label: "COLLECTION", value: "693 Residencies" },
      { label: "LEGACY", value: "Q1 2030" },
      { label: "HEIGHT", value: "62 Storeys" },
      { label: "TENURE", value: "International" }
    ]
  },
  features: [
    {
      id: "f1",
      title: "Botanical Solitude",
      description: "Immediate access to a lush 5-acre Central Park, a rare verdant expanse in the heart of the capital.",
      image: "https://picsum.photos/seed/botanic/600/600"
    },
    {
      id: "f2",
      title: "Global Gateway",
      description: "Seamless sheltered transit to Bangsar LRT and KL Sentral, connecting you to the world via the ERL.",
      image: "https://picsum.photos/seed/gateway/600/600"
    },
    {
      id: "f3",
      title: "Sustainable Mastery",
      description: "Achieving LEED Platinum and GreenRE Gold standards through innovative, planet-conscious design.",
      image: "https://picsum.photos/seed/platinum/600/600"
    },
    {
      id: "f4",
      title: "Private Sky Lounge",
      description: "Exclusive social spaces for residents on the 62nd floor with unobstructed 360° city panoramas.",
      image: "https://picsum.photos/seed/skylounge/600/600"
    },
    {
      id: "f5",
      title: "Artisanal Interiors",
      description: "Curated finishings featuring Italian marble and European oak, crafted for the discerning eye.",
      image: "https://picsum.photos/seed/interior/600/600"
    },
    {
      id: "f6",
      title: "Smart Living Ecosystem",
      description: "State-of-the-art home automation and touchless guest management for effortless security.",
      image: "https://picsum.photos/seed/smart/600/600"
    }
  ],
  facilities: [
    { id: "fac1", title: "Celestial Infinity Pool", icon: "Waves", description: "Swim amidst the stars with panoramic views of the city skyline." },
    { id: "fac2", title: "The Observatory Gym", icon: "Dumbbell", description: "High-altitude fitness center featuring elite training equipment." },
    { id: "fac3", title: "Contemplative Gardens", icon: "Flower2", description: "Bespoke landscaped spaces for mindfulness and meditation." },
    { id: "fac4", title: "Executive Atelier", icon: "Laptop", description: "A sophisticated co-working environment for global professionals." }
  ],
  layouts: [
    { id: "la", type: "Type A", size: "485 sq ft", description: "Modern Studio / 1 Bedroom designed for the minimalist professional.", image: "https://picsum.photos/seed/parkside-a/800/600" },
    { id: "lb", type: "Type B", size: "689 sq ft", description: "Spacious 1 Bedroom residence with expansive floor-to-ceiling vistas.", image: "https://picsum.photos/seed/parkside-b/800/600" },
    { id: "lc1", type: "Type C1", size: "646 sq ft", description: "Bespoke 2 Bedrooms layout crafted for urban dual-living comfort.", image: "https://picsum.photos/seed/parkside-c1/800/600" },
    { id: "lc2", type: "Type C2", size: "732 sq ft", description: "Refined 2 Bedrooms suite offering a perfect balance of space and light.", image: "https://picsum.photos/seed/parkside-c2/800/600" },
    { id: "ld1", type: "Type D1", size: "872 sq ft", description: "Versatile 2+1 Bedrooms family home featuring a dedicated study/utility room.", image: "https://picsum.photos/seed/parkside-d1/800/600" },
    { id: "ld2", type: "Type D2", size: "926 sq ft", description: "Pragmatic 2+1 Bedrooms configuration featuring a private outdoor balcony.", image: "https://picsum.photos/seed/parkside-d2/800/600" },
    { id: "ld3", type: "Type D3", size: "1,012 sq ft", description: "Extensive 2+1 Bedrooms residence with grand living areas for entertainment.", image: "https://picsum.photos/seed/parkside-d3/800/600" },
    { id: "le1", type: "Type E1", size: "1,260 sq ft", description: "Generous 3 Bedrooms family sanctuary with multi-aspect garden views.", image: "https://picsum.photos/seed/parkside-e1/800/600" },
    { id: "le2", type: "Type E2", size: "1,325 sq ft", description: "The ultimate 3 Bedrooms sky residence with uncompromised capital panoramas.", image: "https://picsum.photos/seed/parkside-e2/800/600" }
  ],
  location: {
    title: "The Ultimate Convergence",
    description: "Nestled between the heritage of Bangsar and the pulse of KL Sentral, Parkside Residence offers an unmatched strategic position.",
    mapImage: "https://picsum.photos/seed/parkside-loc/1600/900",
    points: [
      { id: "p1", title: "Bangsar LRT", distance: "400m" },
      { id: "p2", title: "KL Sentral", distance: "One Stop" },
      { id: "p3", title: "Mid Valley City", distance: "Connected" },
      { id: "p4", title: "Global Airport Link", distance: "Direct ERL" }
    ]
  },
  gallery: [
    { id: "g1", url: "https://picsum.photos/seed/luxury-lobby/1200/800", title: "The Arrival Hall" },
    { id: "g2", url: "https://picsum.photos/seed/luxury-view/800/1200", title: "Skyline Vistas" },
    { id: "g3", url: "https://picsum.photos/seed/luxury-bed/1000/1000", title: "Master Suite" },
    { id: "g4", url: "https://picsum.photos/seed/luxury-pool/1400/800", title: "Infinite Serenity" }
  ],
  agent: {
    name: "Yee Woei Shyan",
    ren: "46505",
    agency: "IQI Agency",
    agencyReg: "IQI Holdings SDN BHD",
    whatsapp: "60195598932",
    message: "[PRS] please schedule viewing for Parkside Residence"
  },
  legal: {
    privacyPolicy: "As a premier advisory, your data privacy is paramount. Information is handled strictly according to the Malaysian PDPA 2010.",
    termsConditions: "Visuals are architectural representations. Final specifications are subject to the sales and purchase agreement.",
    disclaimer: "Information provided is for preliminary awareness and does not constitute a legal offer.",
    managementDisclaimer: "This curated collection is managed by Yee Woei Shyan (REN 46505) of IQI Agency. Privately presented for discerning investors."
  },
  seo: {
    title: "Parkside Residence Setia Federal Hill | Luxury Living in Bangsar & KL Sentral",
    description: "Discover Parkside Residence at Setia Federal Hill, Kuala Lumpur. Luxury bespoke apartments in Bangsar starting from RM650k. Experience premium urban living near KL Sentral. Book your private viewing now.",
    keywords: "Parkside Residence, Setia Federal Hill, Bangsar Luxury Condo, KL Sentral Property, SP Setia KL, New Property Bangsar 2024, Kuala Lumpur Real Estate, Elite Homes Malaysia",
    favicon: "https://picsum.photos/seed/parkside-favicon/32/32",
    googleVerification: "",
    ogImage: "https://picsum.photos/seed/parkside-og/1200/630"
  }
};
