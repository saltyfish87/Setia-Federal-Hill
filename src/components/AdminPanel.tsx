import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, LogOut, LogIn, Save, Upload, Plus, Trash2, X, MessageCircle, Shield } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AppContent } from '../types';
import { INITIAL_CONTENT } from '../constants';

export const AdminPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, isAdmin, content, setContent, login, logout, uploadImage } = useAdmin();
  const [editedContent, setEditedContent] = React.useState<AppContent>(content);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'general' | 'hero' | 'overview' | 'features' | 'facilities' | 'layouts' | 'gallery' | 'location' | 'agent'>('general');

  React.useEffect(() => {
    setEditedContent(content);
  }, [content]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setContent(editedContent);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save changes. Make sure you are logged in as admin.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...editedContent };
    let current: any = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setEditedContent(newContent);
  };

  const updateItemInList = (listKey: keyof AppContent, id: string, field: string, value: any) => {
    const list = editedContent[listKey] as any[];
    let newList = list.map(item => item.id === id ? { ...item, [field]: value } : item);

    // Automation: If updating URL in Gallery, try to extract title from URL
    if (listKey === 'gallery' && field === 'url' && value) {
      try {
        const urlStr = value as string;
        const decoded = decodeURIComponent(urlStr);
        const fileName = decoded.substring(decoded.lastIndexOf('/') + 1);
        const baseName = fileName.split('.')[0] || '';
        const cleanTitle = baseName
          .split(/[-_]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/\d+x\d+/, '') // Remove dimensions like 600x400
          .trim();
        
        if (cleanTitle && cleanTitle.length > 2) {
          newList = newList.map(item => item.id === id ? { ...item, title: cleanTitle } : item);
        }
      } catch (e) {
        console.error("Could not parse title from URL", e);
      }
    }

    setEditedContent({ ...editedContent, [listKey]: newList });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        callback(url);
      } catch (err) {
        console.error(err);
        alert('Upload failed');
      }
    }
  };

  const ImageUploadControl: React.FC<{ url: string; onChange: (url: string) => void }> = ({ url, onChange }) => (
    <div className="space-y-3">
      <div className="flex gap-4 items-center p-4 bg-gray-50 border border-dashed border-gray-200">
        <img src={url || null} className="w-16 h-12 object-cover" alt="preview" />
        <label className="flex-1 cursor-pointer text-center text-[10px] font-bold uppercase tracking-widest text-prestige-gold hover:opacity-70 transition-opacity">
          <Upload className="w-4 h-4 inline mr-2" /> Upload
          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, onChange)} />
        </label>
      </div>
      <div className="relative">
        <label className="block text-[8px] font-bold uppercase text-gray-400 mb-1">Or Paste Image URL</label>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => onChange(e.target.value)}
          className="luxury-input text-[10px] py-2"
          placeholder="https://..."
        />
      </div>
    </div>
  );

  const TabButton: React.FC<{ id: typeof activeTab; label: string }> = ({ id, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 ${
        activeTab === id ? 'border-prestige-gold text-prestige-gold' : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-[100] flex flex-col"
    >
      <div className="p-8 border-b flex justify-between items-center bg-prestige-cream/30">
        <div>
          <h2 className="text-2xl font-serif font-bold text-prestige-onyx">Content Manager</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Parkside Residence CMS</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <Settings className="w-16 h-16 text-prestige-gold/20 mb-6" />
          <h3 className="text-xl font-serif mb-4">Secure Authentication Required</h3>
          <p className="mb-8 text-gray-500 max-w-xs">Please sign in with your authorized credentials to access the property management system.</p>
          <button onClick={login} className="luxury-button flex items-center justify-center gap-2 w-full max-w-sm">
            <LogIn className="w-4 h-4" /> Sign In with Google
          </button>
        </div>
      ) : !isAdmin ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-red-600">
          <Shield className="w-16 h-16 mb-6 opacity-20" />
          <h3 className="text-xl font-serif mb-4">Unauthorized Access</h3>
          <p className="mb-8 opacity-70 max-w-xs">Your account does not have administrative privileges for this residence.</p>
          <button onClick={logout} className="luxury-button flex items-center justify-center gap-2 w-full max-w-sm bg-red-600 text-white">
            <LogOut className="w-4 h-4" /> Disconnect Session
          </button>
        </div>
      ) : (
        <>
          <div className="flex overflow-x-auto no-scrollbar bg-gray-50 border-b px-4">
            <TabButton id="general" label="General" />
            <TabButton id="hero" label="Hero" />
            <TabButton id="overview" label="Overview" />
            <TabButton id="features" label="Features" />
            <TabButton id="facilities" label="Facilities" />
            <TabButton id="layouts" label="Layouts" />
            <TabButton id="gallery" label="Gallery" />
            <TabButton id="location" label="Location" />
            <TabButton id="agent" label="Concierge" />
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
            {activeTab === 'general' && (
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold border-b pb-4">Global Identity</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Project Name</label>
                    <input type="text" value={editedContent.projectName} onChange={(e) => updateField('projectName', e.target.value)} className="luxury-input" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Proprietary Logo</label>
                    <ImageUploadControl url={editedContent.logo} onChange={(url) => updateField('logo', url)} />
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-prestige-gold mb-4">Search Optimization</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">SEO Title</label>
                        <input type="text" value={editedContent.seo.title} onChange={(e) => updateField('seo.title', e.target.value)} className="luxury-input" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">SEO Description (Meta Narrative)</label>
                        <textarea value={editedContent.seo.description} onChange={(e) => updateField('seo.description', e.target.value)} className="luxury-input min-h-[100px]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">SEO Keywords</label>
                        <input type="text" value={editedContent.seo.keywords} onChange={(e) => updateField('seo.keywords', e.target.value)} className="luxury-input" placeholder="Luxury, Bangsar, Condo..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Favicon Portal (Icon)</label>
                          <ImageUploadControl url={editedContent.seo.favicon} onChange={(url) => updateField('seo.favicon', url)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Social Preview (OG Image)</label>
                          <ImageUploadControl url={editedContent.seo.ogImage} onChange={(url) => updateField('seo.ogImage', url)} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Google Search Console Verification</label>
                        <input type="text" value={editedContent.seo.googleVerification} onChange={(e) => updateField('seo.googleVerification', e.target.value)} className="luxury-input" placeholder=" वेरिफिकेशन कोड..." />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-prestige-gold/5 border border-prestige-gold/20 rounded-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-prestige-gold mb-2">Rapid Content Synchronization</h4>
                    <p className="text-[9px] text-gray-500 mb-4 font-serif italic">This will automatically populate the 9 authentic floorplan layouts (Types A-J) for Parkside Residence as requested.</p>
                    <button 
                      onClick={() => {
                        if (window.confirm("This will replace your current layouts with the 9 authentic Parkside Residence types. Proceed?")) {
                          updateField('layouts', INITIAL_CONTENT.layouts);
                        }
                      }}
                      className="text-[10px] uppercase font-bold text-prestige-onyx border border-prestige-onyx/20 px-4 py-2 hover:bg-prestige-onyx hover:text-white transition-all w-full"
                    >
                      Sync 9 Authentic Layouts
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'hero' && (
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold border-b pb-4">Hero Exhibition</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Tagline (Subtitle)</label>
                    <input type="text" value={editedContent.hero.subtitle} onChange={(e) => updateField('hero.subtitle', e.target.value)} className="luxury-input" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Main Heading</label>
                    <input type="text" value={editedContent.hero.title} onChange={(e) => updateField('hero.title', e.target.value)} className="luxury-input" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Narrative</label>
                    <textarea value={editedContent.hero.description} onChange={(e) => updateField('hero.description', e.target.value)} className="luxury-input min-h-[100px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Cinematic Image</label>
                    <ImageUploadControl url={editedContent.hero.image} onChange={(url) => updateField('hero.image', url)} />
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'overview' && (
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold border-b pb-4">Project Overview</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Heading</label>
                    <input type="text" value={editedContent.overview.title} onChange={(e) => updateField('overview.title', e.target.value)} className="luxury-input" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Detailed Narrative</label>
                    <textarea value={editedContent.overview.description} onChange={(e) => updateField('overview.description', e.target.value)} className="luxury-input min-h-[150px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {editedContent.overview.stats.map((stat, i) => (
                      <div key={i} className="p-4 bg-gray-50 border border-gray-100">
                        <input 
                          value={stat.label} 
                          onChange={(e) => {
                            const newStats = [...editedContent.overview.stats];
                            newStats[i].label = e.target.value;
                            updateField('overview.stats', newStats);
                          }}
                          className="w-full bg-transparent text-[8px] uppercase tracking-widest font-bold text-gray-400 mb-1 border-none focus:ring-0 p-0"
                        />
                        <input 
                          value={stat.value} 
                          onChange={(e) => {
                            const newStats = [...editedContent.overview.stats];
                            newStats[i].value = e.target.value;
                            updateField('overview.stats', newStats);
                          }}
                          className="w-full bg-transparent font-serif text-lg text-prestige-onyx border-none focus:ring-0 p-0"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Overview Visual Asset</label>
                    <ImageUploadControl url={editedContent.overview.image} onChange={(url) => updateField('overview.image', url)} />
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'features' && (
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold border-b pb-4">Key Features</h3>
                <div className="space-y-8">
                  {editedContent.features.map((feature, i) => (
                    <div key={feature.id} className="p-6 bg-gray-50 border border-gray-100 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400">PILLAR {i + 1}</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Feature Title & Sync Description</label>
                        <input 
                          value={feature.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Sync description with title as requested
                            const list = editedContent.features;
                            const newList = list.map(item => item.id === feature.id ? { ...item, title: val, description: val } : item);
                            setEditedContent({ ...editedContent, features: newList });
                          }}
                          className="luxury-input font-bold"
                          placeholder="Feature Title"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Custom Description (Optional Edit)</label>
                        <textarea 
                          value={feature.description}
                          onChange={(e) => updateItemInList('features', feature.id, 'description', e.target.value)}
                          className="luxury-input text-xs min-h-[80px]"
                          placeholder="Description"
                        />
                      </div>
                      <ImageUploadControl url={feature.image} onChange={(url) => updateItemInList('features', feature.id, 'image', url)} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'facilities' && (
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold border-b pb-4">The Amenities Collective</h3>
                <div className="grid grid-cols-1 gap-6">
                  {editedContent.facilities.map((fac) => (
                    <div key={fac.id} className="p-6 border border-gray-100 space-y-4">
                      <input 
                        value={fac.title}
                        onChange={(e) => updateItemInList('facilities', fac.id, 'title', e.target.value)}
                        className="luxury-input font-serif text-lg"
                      />
                      <textarea 
                        value={fac.description}
                        onChange={(e) => updateItemInList('facilities', fac.id, 'description', e.target.value)}
                        className="luxury-input text-xs min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'layouts' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold">Bespoke Residences</h3>
                  <button 
                    onClick={() => {
                      const newLayout = {
                        id: `l${Date.now()}`,
                        type: "New Layout",
                        size: "0 sq ft",
                        description: "Floorplan description coming soon.",
                        image: ""
                      };
                      updateField('layouts', [...editedContent.layouts, newLayout]);
                    }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-prestige-onyx hover:text-prestige-gold transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Layout
                  </button>
                </div>
                <div className="space-y-8">
                  {editedContent.layouts.map((layout) => (
                    <div key={layout.id} className="p-6 bg-prestige-cream/20 border border-prestige-gold/10 space-y-4 relative group">
                      <button 
                        onClick={() => {
                          const newList = editedContent.layouts.filter(l => l.id !== layout.id);
                          updateField('layouts', newList);
                        }}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex gap-8 justify-between text-left">
                        <div className="flex-1 space-y-3">
                           <input value={layout.type} onChange={(e) => updateItemInList('layouts', layout.id, 'type', e.target.value)} className="luxury-input font-serif text-xl p-0 h-auto bg-transparent border-none focus:ring-0" />
                           <input value={layout.size} onChange={(e) => updateItemInList('layouts', layout.id, 'size', e.target.value)} className="luxury-input text-[10px] font-bold text-prestige-gold p-0 h-auto bg-transparent border-none focus:ring-0" />
                        </div>
                      </div>
                      <textarea value={layout.description} onChange={(e) => updateItemInList('layouts', layout.id, 'description', e.target.value)} className="luxury-input text-xs italic min-h-[60px]" />
                      <ImageUploadControl url={layout.image} onChange={(url) => updateItemInList('layouts', layout.id, 'image', url)} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'gallery' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold">Visual Gallery</h3>
                  <button 
                    onClick={() => {
                      const newImg = {
                        id: `g${Date.now()}`,
                        url: "",
                        title: "New Gallery Asset"
                      };
                      updateField('gallery', [...editedContent.gallery, newImg]);
                    }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-prestige-onyx hover:text-prestige-gold transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Asset
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editedContent.gallery.map((img) => (
                    <div key={img.id} className="p-4 bg-gray-50 border border-gray-100 flex flex-col gap-3 relative group">
                      <button 
                        onClick={() => {
                          const newList = editedContent.gallery.filter(g => g.id !== img.id);
                          updateField('gallery', newList);
                        }}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <ImageUploadControl url={img.url} onChange={(url) => updateItemInList('gallery', img.id, 'url', url)} />
                      <input 
                        value={img.title}
                        onChange={(e) => updateItemInList('gallery', img.id, 'title', e.target.value)}
                        className="luxury-input text-[10px] font-bold"
                        placeholder="Image Title"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'location' && (
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold border-b pb-4">Connectivity Map</h3>
                <div className="space-y-4">
                  <textarea value={editedContent.location.description} onChange={(e) => updateField('location.description', e.target.value)} className="luxury-input min-h-[100px]" />
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Map Visual</label>
                    <ImageUploadControl url={editedContent.location.mapImage} onChange={(url) => updateField('location.mapImage', url)} />
                  </div>
                  <div className="space-y-3">
                    {editedContent.location.points.map((point) => (
                      <div key={point.id} className="flex gap-4">
                        <input value={point.title} onChange={(e) => {
                          const newPoints = editedContent.location.points.map(p => p.id === point.id ? { ...p, title: e.target.value } : p);
                          updateField('location.points', newPoints);
                        }} className="luxury-input flex-1" />
                        <input value={point.distance} onChange={(e) => {
                          const newPoints = editedContent.location.points.map(p => p.id === point.id ? { ...p, distance: e.target.value } : p);
                          updateField('location.points', newPoints);
                        }} className="luxury-input w-24 text-center" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'agent' && (
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-prestige-gold border-b pb-4">Concierge Services</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Concierge Name</label>
                    <input type="text" value={editedContent.agent.name} onChange={(e) => updateField('agent.name', e.target.value)} className="luxury-input" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">WhatsApp Number</label>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="text-[#25D366] w-5 h-5" />
                      <input type="text" value={editedContent.agent.whatsapp} onChange={(e) => updateField('agent.whatsapp', e.target.value)} className="luxury-input" placeholder="+60..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Default Inquiry Message</label>
                    <textarea value={editedContent.agent.message} onChange={(e) => updateField('agent.message', e.target.value)} className="luxury-input min-h-[80px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Registration No.</label>
                      <input type="text" value={editedContent.agent.ren} onChange={(e) => updateField('agent.ren', e.target.value)} className="luxury-input" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Agency Name</label>
                      <input type="text" value={editedContent.agent.agency} onChange={(e) => updateField('agent.agency', e.target.value)} className="luxury-input" />
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="p-8 border-t bg-white sticky bottom-0 z-20">
            <button 
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center justify-center gap-3 w-full py-5 bg-prestige-onyx text-white hover:bg-prestige-gold transition-all duration-500 disabled:opacity-50 text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl"
            >
              {isSaving ? 'Synchronizing Genesis...' : <><Save className="w-5 h-5" /> Commit All Changes</>}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[8px] text-gray-400 uppercase tracking-widest font-bold">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Connected to Firebase Cloud Firestore
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
