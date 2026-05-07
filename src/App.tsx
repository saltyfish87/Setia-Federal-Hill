import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, MapPin, Layout, Images, MessageSquare, Phone, 
  Menu, X, ExternalLink, ArrowRight, Star, Shield, 
  Waves, Dumbbell, Flower2, Laptop, Pencil, MessageCircle
} from 'lucide-react';
import { useAdmin } from './context/AdminContext';
import { AdminPanel } from './components/AdminPanel';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { INITIAL_CONTENT } from './constants';

const iconMap: Record<string, any> = {
  Waves, Dumbbell, Flower2, Laptop
};

export default function App() {
  const { content, loading, isAdmin, user } = useAdmin();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLayoutId, setSelectedLayoutId] = useState(content.layouts[0]?.id);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-prestige-cream">
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="text-prestige-gold font-serif text-3xl tracking-[0.2em] font-light"
        >
          PARKSIDE
        </motion.div>
      </div>
    );
  }

  const displayLayouts = content.layouts.length >= 9 ? content.layouts : INITIAL_CONTENT.layouts;
  const selectedLayout = displayLayouts.find(l => l.id === selectedLayoutId) || displayLayouts[0];
  const whatsappUrl = `https://wa.me/${content.agent.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(content.agent.message)}`;

  return (
    <HelmetProvider>
      <div className="relative overflow-x-hidden selection:bg-prestige-gold selection:text-white">
        <Helmet>
          <title>{content.seo.title}</title>
          <meta name="description" content={content.seo.description} />
          <meta name="keywords" content={content.seo.keywords} />
          <link rel="icon" type="image/png" href={content.seo.favicon} />
          <meta name="google-site-verification" content={content.seo.googleVerification || INITIAL_CONTENT.seo.googleVerification} />
          
          {/* Open Graph / Social */}
          <meta property="og:title" content={content.seo.title} />
          <meta property="og:description" content={content.seo.description} />
          <meta property="og:image" content={content.seo.ogImage} />
          <meta property="og:type" content="website" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={content.seo.title} />
          <meta name="twitter:description" content={content.seo.description} />
          <meta name="twitter:image" content={content.seo.ogImage} />
        </Helmet>

        {/* Navbar */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4' 
            : 'bg-transparent py-6'
        }`}>
          <div className="max-w-screen-2xl mx-auto px-8 md:px-16 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {content.logo ? (
                <img 
                  src={content.logo} 
                  alt={content.projectName} 
                  className={`h-10 w-auto object-contain transition-all duration-700 ${!isScrolled ? 'brightness-0 invert' : ''}`} 
                />
              ) : (
                <div className={`flex items-center gap-4 transition-colors duration-700 ${isScrolled ? 'text-prestige-onyx' : 'text-white'}`}>
                  <div className={`w-10 h-10 border rounded-full flex items-center justify-center overflow-hidden ${isScrolled ? 'border-prestige-gold/30' : 'border-white/30'}`}>
                    <Building2 className={isScrolled ? 'text-prestige-gold w-5 h-5' : 'text-white w-5 h-5'} />
                  </div>
                  <span className="font-serif text-2xl tracking-tighter uppercase font-light translate-y-0.5">{content.projectName}</span>
                </div>
              )}
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-12">
              {['Overview', 'Features', 'Facilities', 'Layouts', 'Gallery', 'Location'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className={`text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 ${
                    isScrolled ? 'text-gray-400 hover:text-prestige-gold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item}
                </a>
              ))}
              <a 
                href={whatsappUrl} 
                className={`text-[10px] uppercase tracking-[0.4em] font-bold px-8 py-4 transition-all duration-700 ${
                  isScrolled 
                    ? 'bg-prestige-onyx text-white hover:bg-prestige-gold' 
                    : 'bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white hover:text-prestige-onyx'
                }`}
              >
                Schedule Viewing
              </a>
            </div>

            {/* Mobile Toggle */}
            <button className={`lg:hidden p-2 transition-colors duration-700 ${isScrolled ? 'text-prestige-onyx' : 'text-white'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
              >
                <div className="flex flex-col p-8 gap-6 text-center">
                  {['Overview', 'Features', 'Facilities', 'Layouts', 'Gallery', 'Location'].map((item) => (
                    <a key={item} onClick={() => setIsMobileMenuOpen(false)} href={`#${item.toLowerCase()}`} className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                      {item}
                    </a>
                  ))}
                  <a href={whatsappUrl} className="luxury-button py-4">Inquire Now</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="h-screen relative flex items-center overflow-hidden">
            <motion.div 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0 cursor-zoom-in"
              onClick={() => { setSelectedGalleryImg({ url: content.hero.image, title: content.hero.title }); setIsGalleryOpen(true); }}
            >
              <div className="absolute inset-0 bg-prestige-onyx/30 z-10" />
              <img 
                src={content.hero.image || null} 
                alt="Parkside Residence Hero" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                fetchPriority="high"
                decoding="async"
              />
            </motion.div>

          <div className="relative z-20 w-full px-8 md:px-16 lg:px-32 pt-24 md:pt-0">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              >
                <p className="text-white/70 uppercase tracking-[0.5em] text-[10px] mb-8 font-semibold flex items-center gap-4">
                  <span className="w-12 h-px bg-prestige-gold" /> {content.hero.subtitle}
                </p>
                <h1 className="text-7xl md:text-9xl text-white mb-10 leading-[0.9] font-serif font-light">
                  {content.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 font-serif italic mb-12 max-w-xl leading-relaxed">
                  {content.hero.description}
                </p>
                <div className="flex items-center gap-12">
                  <a href="#inquire" className="group flex items-center gap-6 text-white text-[10px] uppercase tracking-[0.4em] font-medium transition-all hover:text-prestige-gold">
                    Begin Journey <span className="p-4 border border-white/20 rounded-full group-hover:border-prestige-gold transition-colors"><ArrowRight className="w-4 h-4" /></span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="absolute right-12 bottom-12 z-20 hidden lg:block">
            <div className="vertical-text">ESTABLISHED 2026 — MALAYSIA</div>
          </div>
        </section>

        {/* Overview Editorial */}
        <section id="overview" className="section-padding bg-prestige-cream relative overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-32">
              <div className="lg:col-span-5 text-center lg:text-left mb-12 lg:mb-0">
                <motion.div
                  whileInView={{ opacity: [0, 1], y: [30, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <span className="text-prestige-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">— THE ART OF ARRIVAL</span>
                  <h2 className="text-5xl md:text-7xl font-serif mb-10 leading-tight font-light">{content.overview.title}</h2>
                  <div className="h-px w-24 bg-prestige-onyx/20 mb-10 mx-auto lg:mx-0" />
                  <p className="text-gray-500 font-serif italic text-xl mb-12 leading-relaxed">
                    {content.overview.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-x-12 gap-y-16 justify-items-center lg:justify-items-start">
                    {content.overview.stats.map((stat, i) => (
                      <div key={i} className="group text-center lg:text-left">
                        <p className="text-prestige-onyx font-serif text-3xl mb-2 transition-transform duration-500 group-hover:translate-x-1">{stat.value}</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-prestige-gold font-bold opacity-60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <div className="lg:col-span-6 lg:col-start-7 relative flex justify-center">
                <motion.div
                  whileInView={{ opacity: [0, 1], scale: [1.05, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                  className="cursor-zoom-in w-full max-w-md lg:max-w-none"
                  onClick={() => { setSelectedGalleryImg({ url: content.overview.image, title: content.overview.title }); setIsGalleryOpen(true); }}
                >
                  <img 
                    src={content.overview.image || null} 
                    alt="Lush surroundings" 
                    className="w-full h-[500px] md:h-[700px] object-cover rounded-none oval-mask"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-prestige-onyx text-white p-12 hidden lg:block max-w-md">
                    <p className="font-serif italic text-2xl mb-2">“A rare fusion of emerald landscapes and architectural precision.”</p>
                    <span className="text-[10px] uppercase tracking-widest opacity-50">Architectural Digest Review</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features: The Pillars of Excellence */}
        <section id="features" className="section-padding bg-white overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
            <div className="text-center mb-32">
              <span className="text-prestige-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-8 block underline underline-offset-8 decoration-prestige-gold/30">THE PINNACLE EXPERIENCE</span>
              <h2 className="text-5xl md:text-7xl font-serif font-light">Key Features</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 items-start">
              {content.features.map((feature, i) => (
                <motion.div 
                  key={feature.id}
                  whileInView={{ opacity: [0, 1], y: [40, 0] }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center group"
                  onClick={() => { setSelectedGalleryImg({ url: feature.image, title: feature.title }); setIsGalleryOpen(true); }}
                >
                  <div className="relative mb-10 cursor-zoom-in">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-prestige-gold/20 transition-all duration-700 group-hover:scale-105 group-hover:border-prestige-gold">
                      <img 
                        src={feature.image || null} 
                        alt={feature.title} 
                        className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-prestige-onyx text-white rounded-full flex items-center justify-center font-serif text-sm border border-prestige-gold/30">
                      0{i+1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-prestige-gold transition-colors">{feature.title}</h3>
                  <p className="text-gray-500 font-serif italic text-base leading-relaxed max-w-xs">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities: The Private Club Feel */}
        <section id="facilities" className="section-padding bg-prestige-forest text-white">
          <div className="max-w-8xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-2xl">
                <span className="text-prestige-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">EXCLUSIVITY REIMAGINED</span>
                <h2 className="text-5xl md:text-7xl font-serif font-light">The Private <br/>Amenities Collective</h2>
              </div>
              <p className="text-white/40 max-w-sm text-sm uppercase tracking-widest leading-loose">
                Designed to prioritize solitude and sophistication. A world-class suite of amenities for the discerning few.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {content.facilities.map((fac, i) => {
                const Icon = iconMap[fac.icon] || Building2;
                return (
                  <motion.div 
                    key={fac.id}
                    whileInView={{ opacity: [0, 1] }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="p-16 bg-prestige-forest hover:bg-white/5 transition-all duration-700 group cursor-default"
                  >
                    <div className="mb-12 relative">
                      <div className="w-16 h-16 border border-prestige-gold/20 rounded-full flex items-center justify-center transition-all duration-700 group-hover:border-prestige-gold group-hover:scale-110">
                        <Icon className="w-6 h-6 text-prestige-gold" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-serif mb-6 group-hover:text-prestige-gold transition-colors">{fac.title}</h4>
                    <p className="text-white/50 text-[11px] uppercase tracking-[0.2em] leading-relaxed transition-opacity">
                      {fac.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Layouts Section: Minimal & Elegant */}
        <section id="layouts" className="section-padding bg-prestige-champagne">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-prestige-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">BESPOKE RESIDENCES</span>
              <h2 className="text-5xl font-serif font-light">Conceptual Living</h2>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-32 items-center">
              <div className="w-full lg:w-1/3 space-y-2">
                {displayLayouts.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setSelectedLayoutId(layout.id)}
                    className={`group w-full text-center lg:text-left py-4 px-4 border-b border-black/5 transition-all duration-700 ${
                      selectedLayoutId === layout.id 
                        ? 'opacity-100 border-prestige-gold' 
                        : 'opacity-30 hover:opacity-100'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-[0.4em] text-prestige-gold block mb-1">{layout.size}</span>
                    <h4 className="font-serif text-xl md:text-2xl font-light group-hover:italic transition-all">{layout.type}</h4>
                  </button>
                ))}
              </div>
              
              <div className="w-full lg:w-2/3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedLayoutId}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white p-12 md:p-24 shadow-sm border border-black/5 flex flex-col items-center"
                  >
                    <img 
                      src={selectedLayout.image || null} 
                      alt={selectedLayout.type} 
                      className="max-w-full h-auto object-contain max-h-[500px] mb-16 grayscale hover:grayscale-0 transition-all duration-1000 cursor-zoom-in"
                      onClick={() => { setSelectedGalleryImg({ url: selectedLayout.image, title: `${selectedLayout.type} - ${selectedLayout.size}` }); setIsGalleryOpen(true); }}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="text-center">
                      <p className="font-serif text-2xl italic mb-4">“{selectedLayout.description}”</p>
                      <a 
                        href={`https://wa.me/${content.agent.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`[PRS] Hi Admin, I am interested in ${selectedLayout.type} - ${selectedLayout.size}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase tracking-[0.5em] font-bold text-prestige-gold border-b border-prestige-gold pb-2 hover:opacity-70 transition-opacity"
                      >
                         Request Floorplan
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Location: Strategic Convergence */}
        <section id="location" className="section-padding bg-white relative overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="text-center lg:text-left">
                <span className="text-prestige-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">CONNECTIVITY UNMATCHED</span>
                <h2 className="text-5xl md:text-7xl font-serif font-light mb-10 leading-tight">
                  The Epicenter of <br className="hidden md:block" />Bangsar Prestige
                </h2>
                <p className="text-gray-500 font-serif italic text-xl mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {content.location.description}
                </p>
                
                <div className="space-y-8 max-w-md mx-auto lg:mx-0">
                  {content.location.points.map((point, i) => (
                    <div key={point.id} className="flex items-center justify-between border-b border-gray-100 pb-6 group">
                      <span className="font-serif text-2xl group-hover:text-prestige-gold transition-colors">{point.title}</span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-prestige-gold font-bold opacity-60">{point.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative flex justify-center">
                <motion.div 
                   whileInView={{ opacity: [0, 1], scale: [1.1, 1] }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.5 }}
                   className="relative z-10 cursor-zoom-in w-full max-w-lg lg:max-w-none"
                   onClick={() => { setSelectedGalleryImg({ url: content.location.mapImage, title: "Strategic Map - Setia Federal Hill" }); setIsGalleryOpen(true); }}
                >
                  <img 
                    src={content.location.mapImage || null} 
                    alt="Strategic Location" 
                    className="w-full h-[400px] md:h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 border-[16px] md:border-[24px] border-prestige-cream/30 pointer-events-none" />
                </motion.div>
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-prestige-gold/5 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery: Immersive Visuals */}
        <section id="gallery" className="bg-prestige-onyx py-32 overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-8">
             <div className="flex justify-between items-center mb-16">
                <h2 className="text-white font-serif text-4xl md:text-6xl font-light tracking-wide">Gallery</h2>
                <div className="flex gap-4">
                  <div className="h-px w-32 bg-white/20 self-center" />
                  <span className="text-prestige-gold uppercase tracking-[0.3em] text-[10px] font-bold">DISCOVER PARKSIDE</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {content.gallery.map((item, i) => (
                 <motion.div 
                  key={item.id}
                  whileInView={{ opacity: [0, 1], y: [40, 0] }}
                  transition={{ delay: i * 0.15, duration: 1 }}
                  viewport={{ once: true }}
                  onClick={() => { setSelectedGalleryImg(item); setIsGalleryOpen(true); }}
                  className="aspect-[4/5] overflow-hidden group cursor-pointer relative"
                 >
                   <img 
                    src={item.url || null} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                    loading="lazy"
                    decoding="async"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-12">
                     <p className="text-white font-serif text-xl italic">{item.title}</p>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>
        </section>

        {/* Inquire: The Final Call */}
        <section id="inquire" className="section-padding bg-prestige-cream relative flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <span className="text-prestige-gold uppercase tracking-[0.6em] text-[10px] font-bold mb-12 block">ACQUISITION</span>
            <h2 className="text-6xl md:text-8xl font-serif font-light mb-12">Claim Your Place</h2>
            <p className="text-gray-500 font-serif italic text-xl mb-16 opacity-80 leading-relaxed">
              Residences of this caliber are limited. Secure your private viewing of the masterplan and discover the future of Setia Federal Hill.
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <a href={whatsappUrl} className="luxury-button scale-125 hover:px-14">
                Arrange A Consultation
              </a>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
                Direct Inquiry: {content.agent.whatsapp}
              </p>
            </div>
          </div>
        </section>

        {/* Deep Footer */}
        <footer className="bg-prestige-onyx text-white/40 py-32 px-8 border-t border-white/5">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid md:grid-cols-4 gap-24 mb-32">
              <div className="col-span-2">
                <span className="font-serif text-3xl text-white tracking-widest uppercase mb-10 block">{content.projectName}</span>
                <p className="max-w-md text-xs uppercase tracking-widest leading-loose mb-12">
                  A collaborative expression of architectural excellence by SP Setia & Mitsui Fudosan. Defined by a 5-acre central park within Kuala Lumpur's most prestigious transit-oriented township.
                </p>
              </div>
              
              <div className="space-y-8">
                <div>
                   <h5 className="text-prestige-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Concierge</h5>
                   <p className="text-white font-serif italic text-xl">{content.agent.name}</p>
                   <p className="text-[10px] uppercase tracking-widest mt-2">Registration No: {content.agent.ren}</p>
                </div>
                <div>
                   <h5 className="text-prestige-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Agency</h5>
                   <p className="text-white font-serif text-lg">{content.agent.agency}</p>
                   <p className="text-[10px] uppercase tracking-widest mt-2">{content.agent.agencyReg}</p>
                </div>
              </div>

              <div>
                <h5 className="text-prestige-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Legal</h5>
                <p className="text-[10px] uppercase tracking-[0.2em] leading-relaxed italic">
                  {content.legal.managementDisclaimer}
                </p>
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-[9px] uppercase tracking-[0.3em]">
                 &copy; 2026 {content.projectName} — All Rights Reserved.
               </div>
               <div className="flex gap-12 text-[9px] uppercase tracking-[0.4em] font-bold">
                 <button className="hover:text-prestige-gold transition-colors">Privacy Policy</button>
                 <button className="hover:text-prestige-gold transition-colors">Terms of Use</button>
               </div>
            </div>
            
            <p className="mt-16 text-[8px] uppercase tracking-[0.3em] leading-loose max-w-4xl opacity-30 text-center mx-auto">
              {content.legal.disclaimer}
            </p>
          </div>
        </footer>

        {/* Gallery Modal */}
        <AnimatePresence>
          {isGalleryOpen && selectedGalleryImg && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-prestige-onyx/95 backdrop-blur-xl flex items-center justify-center p-8 md:p-24"
              onClick={() => setIsGalleryOpen(false)}
            >
              <button 
                className="absolute top-12 right-12 text-white p-4 hover:bg-white/10 rounded-full transition-all"
                onClick={() => setIsGalleryOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="relative max-w-6xl w-full flex flex-col items-center">
                <motion.img 
                  initial={{ y: 20, scale: 0.95 }}
                  animate={{ y: 0, scale: 1 }}
                  src={selectedGalleryImg.url || null} 
                  alt={selectedGalleryImg.title} 
                  className="max-w-full max-h-[70vh] object-contain shadow-2xl mb-12"
                />
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   className="text-center"
                >
                  <p className="text-prestige-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4">View Gallery</p>
                  <h3 className="text-white font-serif text-4xl font-light italic">{selectedGalleryImg.title}</h3>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin floating button */}
        {(!user || isAdmin || window.location.hostname.includes('ais-dev') || window.location.hostname === 'localhost') && (
          <button 
            onClick={() => setIsAdminPanelOpen(true)}
            className="fixed bottom-12 right-12 z-50 p-6 bg-prestige-onyx text-white border border-white/10 hover:bg-prestige-gold transition-all duration-500 shadow-2xl"
          >
            <Pencil className="w-6 h-6" />
          </button>
        )}

        {/* WhatsApp Fixed Button */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-12 right-32 z-50 p-6 bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-all duration-500 border border-white/10"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Admin Panel Drawer */}
        <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
      </div>
    </HelmetProvider>
  );
}
