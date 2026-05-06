/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Facility {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface LayoutType {
  id: string;
  type: string;
  size: string;
  description: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
}

export interface LocationPoint {
  id: string;
  title: string;
  distance: string;
}

export interface AgentDetails {
  name: string;
  ren: string;
  agency: string;
  agencyReg: string;
  whatsapp: string;
  message: string;
}

export interface LegalContent {
  privacyPolicy: string;
  termsConditions: string;
  disclaimer: string;
  managementDisclaimer: string;
}

export interface AppContent {
  projectName: string;
  logo: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    ctaText: string;
  };
  overview: {
    title: string;
    description: string;
    image: string;
    stats: { label: string; value: string }[];
  };
  features: Feature[];
  facilities: Facility[];
  layouts: LayoutType[];
  location: {
    title: string;
    description: string;
    mapImage: string;
    points: LocationPoint[];
  };
  gallery: GalleryImage[];
  agent: AgentDetails;
  legal: LegalContent;
  seo: {
    title: string;
    description: string;
    keywords: string;
    favicon: string;
    googleVerification: string;
    ogImage: string;
  };
}
