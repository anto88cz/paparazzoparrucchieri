'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  content: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  timestamp: string;
  ipAddress?: string;
  analyses: Array<{
    id: string;
    timestamp: string;
    result: {
      season: string;
      confidence: number;
      undertone?: string;
      dominantColors?: string[];
      recommendations?: string;
      topColors?: Array<{
        name: string;
        code: string;
        difficulty: string;
        sessions: number;
        maintenance: string;
        price: { min: number; max: number };
        description: string;
        benefits: string[];
      }>;
    };
    imageInfo: {
      name: string;
      size: number;
    };
    imageData?: string;
  }>;
  consentGiven: boolean;
  source: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<{ slug: string; title: string }[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Nuovi stati per i Lead
  const [activeTab, setActiveTab] = useState<'blog' | 'leads'>('blog');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  
  // Stati per la modal di gestione lead
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [modalAction, setModalAction] = useState<'edit' | 'delete' | 'whatsapp' | 'details' | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [whatsappMessage, setWhatsappMessage] = useState('');
  
  // Stati per la generazione articoli
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftPost, setDraftPost] = useState<BlogPost | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Controlla se è già autenticato (localStorage)
  useEffect(() => {
    const authToken = localStorage.getItem('admin-auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Carica la lista dei post solo se autenticato
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/posts', {
        headers: {
          'Authorization': 'Bearer paparazzo2025!'
        }
      })
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch(console.error);
    }
  }, [isAuthenticated]);

  // Carica i lead quando si seleziona il tab
  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Errore caricamento leads:', error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'leads') {
      loadLeads();
    }
  }, [isAuthenticated, activeTab]);

  // Funzioni per gestire le azioni sui lead
  const openModal = (lead: Lead, action: 'edit' | 'delete' | 'whatsapp' | 'details') => {
    setSelectedLead(lead);
    setModalAction(action);
    setShowLeadModal(true);
    
    if (action === 'edit') {
      setEditForm({ name: lead.name, phone: lead.phone });
    } else if (action === 'whatsapp') {
      // Messaggio predefinito personalizzato
      const lastAnalysis = lead.analyses[lead.analyses.length - 1];
      const message = lastAnalysis 
        ? `Ciao ${lead.name}! 🎨 Ho visto che hai fatto l'analisi AI Color e il risultato è ${lastAnalysis.result.season}! Ti piacerebbe prenotare un appuntamento per realizzare il tuo colore perfetto? Chiamami al ${process.env.BUSINESS_PHONE} o scrivi qui! 💇‍♀️✨`
        : `Ciao ${lead.name}! 🎨 Ho visto che hai provato il nostro AI Color System. Ti piacerebbe prenotare un appuntamento per scoprire i tuoi colori perfetti? Chiamami al ${process.env.BUSINESS_PHONE} o scrivi qui! 💇‍♀️✨`;
      setWhatsappMessage(message);
    }
  };

  const closeModal = () => {
    setShowLeadModal(false);
    setSelectedLead(null);
    setModalAction(null);
    setEditForm({ name: '', phone: '' });
    setWhatsappMessage('');
  };

  const deleteLead = async () => {
    if (!selectedLead) return;
    
    try {
      const response = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== selectedLead.id));
        closeModal();
      } else {
        alert('Errore durante l\'eliminazione');
      }
    } catch (error) {
      console.error('Errore eliminazione lead:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  const updateLead = async () => {
    if (!selectedLead) return;
    
    try {
      const response = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone
        }),
      });
      
      if (response.ok) {
        const updatedLead = { ...selectedLead, name: editForm.name, phone: editForm.phone };
        setLeads(leads.map(lead => lead.id === selectedLead.id ? updatedLead : lead));
        closeModal();
      } else {
        alert('Errore durante l\'aggiornamento');
      }
    } catch (error) {
      console.error('Errore aggiornamento lead:', error);
      alert('Errore durante l\'aggiornamento');
    }
  };

  const sendWhatsApp = () => {
    if (!selectedLead) return;
    
    // Pulisci il numero di telefono per WhatsApp
    const cleanPhone = selectedLead.phone.replace(/[^0-9+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Apri WhatsApp in una nuova finestra
    window.open(whatsappUrl, '_blank');
    closeModal();
  };

  // Gestisce il login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Password semplice - in produzione usa qualcosa di più sicuro
    if (password === 'paparazzo2025!') {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'authenticated');
      setLoginError('');
    } else {
      setLoginError('Password non corretta');
      setPassword('');
    }
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-auth');
    setSelectedPost(null);
    setPosts([]);
  };

  // Carica un post specifico
  const loadPost = async (slug: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        headers: {
          'Authorization': 'Bearer paparazzo2025!'
        }
      });
      const post = await response.json();
      setSelectedPost(post);
    } catch (error) {
      console.error('Errore nel caricamento del post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salva le modifiche
  const savePost = async () => {
    if (!selectedPost) return;
    
    setSaveStatus('saving');
    try {
      const response = await fetch(`/api/admin/posts/${selectedPost.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer paparazzo2025!'
        },
        body: JSON.stringify(selectedPost),
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      setSaveStatus('error');
    }
  };

  // Aggiorna i campi del post
  const updateField = (field: keyof BlogPost, value: string) => {
    if (!selectedPost) return;
    setSelectedPost({ ...selectedPost, [field]: value });
  };
  
  // Funzioni per generazione articoli
  const generateArticle = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-draft', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer paparazzo2025!',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDraftPost(data.draft);
        setShowDraftModal(true);
      } else {
        const error = await response.json();
        alert('Errore nella generazione: ' + (error.details || error.error));
      }
    } catch (error) {
      console.error('Errore generazione:', error);
      alert('Errore nella generazione dell\'articolo');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const updateDraftField = (field: keyof BlogPost, value: string) => {
    if (!draftPost) return;
    setDraftPost({ ...draftPost, [field]: value });
  };
  
  const publishDraft = async () => {
    if (!draftPost) return;
    
    setIsPublishing(true);
    try {
      const response = await fetch('/api/admin/publish-draft', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer paparazzo2025!',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftPost),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('Articolo pubblicato con successo! Slug: ' + data.slug);
        setShowDraftModal(false);
        setDraftPost(null);
        
        // Ricarica la lista dei post
        fetch('/api/admin/posts', {
          headers: { 'Authorization': 'Bearer paparazzo2025!' }
        })
          .then(res => res.json())
          .then(data => setPosts(data))
          .catch(console.error);
      } else {
        const error = await response.json();
        alert('Errore nella pubblicazione: ' + (error.details || error.error));
      }
    } catch (error) {
      console.error('Errore pubblicazione:', error);
      alert('Errore nella pubblicazione dell\'articolo');
    } finally {
      setIsPublishing(false);
    }
  };
  
  const closeDraftModal = () => {
    if (confirm('Sei sicuro di voler chiudere? Le modifiche non salvate andranno perse.')) {
      setShowDraftModal(false);
      setDraftPost(null);
    }
  };
  
  const deletePost = async (slug: string, title: string) => {
    if (!confirm(`Sei sicuro di voler eliminare l'articolo "${title}"?\n\nQuesta azione è irreversibile!`)) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/posts/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer paparazzo2025!',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
      
      if (response.ok) {
        alert('Articolo eliminato con successo!');
        
        // Rimuovi dalla lista
        setPosts(posts.filter(p => p.slug !== slug));
        
        // Se era selezionato, deseleziona
        if (selectedPost?.slug === slug) {
          setSelectedPost(null);
        }
      } else {
        const error = await response.json();
        alert('Errore nell\'eliminazione: ' + (error.details || error.error));
      }
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('Errore nell\'eliminazione dell\'articolo');
    }
  };

  // Se non è autenticato, mostra il form di login
  if (!isAuthenticated) {
    return (
      <Section background="gray" padding="xl">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Amministrazione Blog</h1>
                <p className="text-gray-600">Inserisci la password per accedere</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="Inserisci la password"
                    required
                  />
                </div>
                
                {loginError && (
                  <div className="text-red-600 text-sm text-center">{loginError}</div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-gold-500 text-white py-2 px-4 rounded-lg hover:bg-gold-600 transition-colors font-medium"
                >
                  Accedi
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Area riservata agli amministratori
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="gray" padding="xl">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pannello Amministrazione</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'blog'
                      ? 'border-gold-500 text-gold-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📝 Gestione Blog
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'leads'
                      ? 'border-gold-500 text-gold-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  👥 Dati AI Color ({leads.length})
                </button>
              </nav>
            </div>
          </div>
          
          {/* Contenuto Blog */}
          {activeTab === 'blog' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Lista articoli */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Articoli</h2>
                  <button
                    onClick={() => {
                      const title = prompt('Titolo del nuovo articolo:');
                      if (title) {
                        const slug = title.toLowerCase()
                          .replace(/[^a-z0-9 -]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-')
                          .trim();
                        
                        const newPost = {
                          title,
                          slug,
                          excerpt: 'Nuovo articolo in fase di scrittura...',
                          date: new Date().toISOString(),
                          category: 'Blog',
                          metaTitle: title,
                          metaDescription: '',
                          keywords: '',
                          content: `# ${title}\n\nScrivi qui il contenuto del tuo articolo...`
                        };
                        setSelectedPost(newPost);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
                  >
                    + Nuovo
                  </button>
                </div>
                
                {/* Pulsante Genera Articolo Blog */}
                <button
                  onClick={generateArticle}
                  disabled={isGenerating}
                  className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generazione in corso...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      🤖 Genera Articolo Blog
                    </span>
                  )}
                </button>
                
                <div className="space-y-2">
                  {posts.map((post) => (
                    <div
                      key={post.slug}
                      className={`relative group rounded-lg transition-colors ${
                        selectedPost?.slug === post.slug
                          ? 'bg-gold-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <button
                        onClick={() => loadPost(post.slug)}
                        className={`w-full text-left p-3 pr-10 ${
                          selectedPost?.slug === post.slug
                            ? 'text-gold-800'
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{post.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{post.slug}</div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(post.slug, post.title);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded text-red-600 hover:text-red-700"
                        title="Elimina articolo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-gray-500">Caricamento...</div>
                </div>
              ) : selectedPost ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Modifica Articolo
                    </h2>
                    <button
                      onClick={savePost}
                      disabled={saveStatus === 'saving'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        saveStatus === 'saving'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : saveStatus === 'saved'
                          ? 'bg-green-500 text-white'
                          : saveStatus === 'error'
                          ? 'bg-red-500 text-white'
                          : 'bg-gold-500 text-white hover:bg-gold-600'
                      }`}
                    >
                      {saveStatus === 'saving'
                        ? 'Salvando...'
                        : saveStatus === 'saved'
                        ? 'Salvato!'
                        : saveStatus === 'error'
                        ? 'Errore'
                        : 'Salva'}
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Metadati */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titolo
                        </label>
                        <input
                          type="text"
                          value={selectedPost.title}
                          onChange={(e) => updateField('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoria
                        </label>
                        <input
                          type="text"
                          value={selectedPost.category}
                          onChange={(e) => updateField('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrizione breve
                      </label>
                      <textarea
                        value={selectedPost.excerpt}
                        onChange={(e) => updateField('excerpt', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description (SEO)
                      </label>
                      <textarea
                        value={selectedPost.metaDescription}
                        onChange={(e) => updateField('metaDescription', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords (separate da virgola)
                      </label>
                      <input
                        type="text"
                        value={selectedPost.keywords}
                        onChange={(e) => updateField('keywords', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                    </div>

                    {/* Contenuto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenuto (Markdown)
                      </label>
                      <textarea
                        value={selectedPost.content}
                        onChange={(e) => updateField('content', e.target.value)}
                        rows={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-mono text-sm"
                        placeholder="Scrivi il contenuto dell'articolo in Markdown..."
                      />
                    </div>

                    {/* Anteprima */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anteprima
                      </label>
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          {selectedPost.content.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.slice(3)}</h2>;
                            } else if (line.startsWith('### ')) {
                              return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>;
                            } else if (line.trim() === '') {
                              return <br key={index} />;
                            } else {
                              return <p key={index} className="mb-3">{line}</p>;
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-gray-500">Seleziona un articolo da modificare</div>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Contenuto Lead */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Dati AI Color</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={loadLeads}
                      disabled={isLoadingLeads}
                      className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isLoadingLeads ? 'Caricamento...' : '🔄 Aggiorna'}
                    </button>
                    <button
                      onClick={() => {
                        const csvContent = generateCSVExport();
                        downloadCSV(csvContent, `leads-${new Date().toISOString().split('T')[0]}.csv`);
                      }}
                      className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      📥 Esporta CSV
                    </button>
                  </div>
                </div>

                {isLoadingLeads ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Caricamento dati...</div>
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Nessun lead presente</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Telefono
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data Registrazione
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Analisi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ultima Attività
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Azioni
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => openModal(lead, 'details')}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left"
                              >
                                {lead.name}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{lead.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(lead.timestamp).toLocaleDateString('it-IT')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(lead.timestamp).toLocaleTimeString('it-IT')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {lead.analyses.length > 0 ? (
                                  <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {lead.analyses.length} analisi
                                    </span>
                                    <div className="mt-1 text-xs text-gray-500">
                                      Ultima: {lead.analyses[lead.analyses.length - 1]?.result.season}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Nessuna analisi
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {lead.analyses.length > 0
                                  ? new Date(lead.analyses[lead.analyses.length - 1].timestamp).toLocaleDateString('it-IT')
                                  : new Date(lead.timestamp).toLocaleDateString('it-IT')
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-xs text-gray-500">{lead.ipAddress}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openModal(lead, 'whatsapp')}
                                  className="group relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow-md transition-all duration-200"
                                  title="Invia WhatsApp"
                                >
                                  <span className="mr-1.5">💬</span>
                                  WhatsApp
                                </button>
                                <button
                                  onClick={() => openModal(lead, 'edit')}
                                  className="group relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                                  title="Modifica"
                                >
                                  <span className="mr-1.5">✏️</span>
                                  Modifica
                                </button>
                                <button
                                  onClick={() => openModal(lead, 'delete')}
                                  className="group relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md transition-all duration-200"
                                  title="Elimina"
                                >
                                  <span className="mr-1.5">🗑️</span>
                                  Elimina
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {leads.length > 0 && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Statistiche</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Totale Lead:</span>
                        <span className="ml-1 text-gray-600">{leads.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Con Analisi:</span>
                        <span className="ml-1 text-gray-600">
                          {leads.filter(lead => lead.analyses.length > 0).length}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Oggi:</span>
                        <span className="ml-1 text-gray-600">
                          {leads.filter(lead => 
                            new Date(lead.timestamp).toDateString() === new Date().toDateString()
                          ).length}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Ultima Settimana:</span>
                        <span className="ml-1 text-gray-600">
                          {leads.filter(lead => {
                            const leadDate = new Date(lead.timestamp);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return leadDate >= weekAgo;
                          }).length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal per gestione Lead */}
          {showLeadModal && selectedLead && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden transform transition-all">
                {/* Header con gradiente */}
                <div className={`px-6 py-4 ${
                  modalAction === 'details' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  modalAction === 'whatsapp' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  modalAction === 'edit' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  'bg-gradient-to-r from-red-500 to-red-600'
                }`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2 text-2xl">
                        {modalAction === 'details' && '👤'}
                        {modalAction === 'edit' && '✏️'}
                        {modalAction === 'delete' && '🗑️'}
                        {modalAction === 'whatsapp' && '💬'}
                      </span>
                      {modalAction === 'details' && 'Dettagli Lead & Analisi'}
                      {modalAction === 'edit' && 'Modifica Lead'}
                      {modalAction === 'delete' && 'Elimina Lead'}
                      {modalAction === 'whatsapp' && 'Invia WhatsApp'}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                  {/* Info Lead Card - solo per azioni non-details */}
                  {modalAction !== 'details' && (
                    <div className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">👤</span>
                        <div>
                          <div className="text-xs text-gray-500">Nome</div>
                          <div className="font-semibold text-gray-900">{selectedLead.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">📱</span>
                        <div>
                          <div className="text-xs text-gray-500">Telefono</div>
                          <div className="font-semibold text-gray-900">{selectedLead.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">📅</span>
                        <div>
                          <div className="text-xs text-gray-500">Registrato</div>
                          <div className="font-semibold text-gray-900">
                            {new Date(selectedLead.timestamp).toLocaleDateString('it-IT')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">🎨</span>
                        <div>
                          <div className="text-xs text-gray-500">Analisi</div>
                          <div className="font-semibold text-gray-900">{selectedLead.analyses.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Contenuto della modal basato sull'azione */}
                  {modalAction === 'details' && (
                    <div className="space-y-6">
                      {/* Info Lead */}
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                        <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">📋</span>
                          Informazioni Lead
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Nome Completo</p>
                            <p className="font-semibold text-gray-900">{selectedLead.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Telefono</p>
                            <p className="font-semibold text-gray-900">{selectedLead.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Data Registrazione</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(selectedLead.timestamp).toLocaleDateString('it-IT', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Numero Analisi</p>
                            <p className="font-semibold text-gray-900">{selectedLead.analyses.length}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500 mb-1">IP Address</p>
                            <p className="font-mono text-sm text-gray-700">{selectedLead.ipAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Analisi */}
                      {selectedLead.analyses.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <span className="text-4xl mb-2 block">📊</span>
                          <p className="text-gray-500">Nessuna analisi effettuata</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg text-gray-900 flex items-center">
                            <span className="mr-2">🎨</span>
                            Analisi Colore ({selectedLead.analyses.length})
                          </h4>
                          {selectedLead.analyses.map((analysis, index) => (
                            <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                              {/* Header analisi */}
                              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                                <div className="flex items-center justify-between text-white">
                                  <span className="font-semibold">Analisi #{selectedLead.analyses.length - index}</span>
                                  <span className="text-sm">
                                    {new Date(analysis.timestamp).toLocaleDateString('it-IT', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>

                              {/* Contenuto analisi */}
                              <div className="p-4">
                                {/* Foto caricata */}
                                {analysis.imageData && (
                                  <div className="mb-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">📸 Foto Analizzata</p>
                                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 w-full h-96">
                                      <Image 
                                        src={analysis.imageData} 
                                        alt="Foto analisi" 
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Risultati */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                                    <p className="text-xs text-amber-700 font-semibold mb-1">STAGIONE</p>
                                    <p className="text-lg font-bold text-amber-900">{analysis.result.season}</p>
                                  </div>
                                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <p className="text-xs text-blue-700 font-semibold mb-1">SOTTOTONO</p>
                                    <p className="text-lg font-bold text-blue-900">{analysis.result.undertone}</p>
                                  </div>
                                </div>

                                {/* Colori dominanti */}
                                {analysis.result.dominantColors && analysis.result.dominantColors.length > 0 && (
                                  <div className="mb-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">🎨 Colori Dominanti</p>
                                    <div className="flex flex-wrap gap-2">
                                      {analysis.result.dominantColors.map((color, idx) => (
                                        <div key={idx} className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                                          <div 
                                            className="w-6 h-6 rounded-full mr-2 border-2 border-white shadow-sm" 
                                            style={{ backgroundColor: color }}
                                          />
                                          <span className="text-xs font-mono text-gray-700">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Raccomandazioni */}
                                {analysis.result.recommendations && (
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">💡 Raccomandazioni Personalizzate</p>
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                      {analysis.result.recommendations.includes('•') ? (
                                        <ul className="space-y-2">
                                          {analysis.result.recommendations.split('•').map((tip, idx) => (
                                            tip.trim() && (
                                              <li key={idx} className="text-sm text-green-900 flex items-start">
                                                <span className="mr-2 mt-0.5">✓</span>
                                                <span className="leading-relaxed">{tip.trim()}</span>
                                              </li>
                                            )
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-sm text-green-900 leading-relaxed">{analysis.result.recommendations}</p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Colori Perfetti (Top 3) */}
                                {analysis.result.topColors && analysis.result.topColors.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                      <span className="mr-2">🎨</span>
                                      I Tuoi Colori Perfetti
                                    </p>
                                    <div className="space-y-3">
                                      {analysis.result.topColors.map((color, idx) => (
                                        <div 
                                          key={idx} 
                                          className={`rounded-xl border-2 overflow-hidden ${
                                            idx === 0 
                                              ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50' 
                                              : 'border-gray-200 bg-white'
                                          }`}
                                        >
                                          {/* Header colore */}
                                          <div className={`px-4 py-2.5 ${
                                            idx === 0 
                                              ? 'bg-gradient-to-r from-amber-400 to-yellow-400' 
                                              : 'bg-gradient-to-r from-gray-100 to-gray-200'
                                          }`}>
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-2">
                                                {idx === 0 && <span className="text-lg">🏆</span>}
                                                <span className={`font-bold ${idx === 0 ? 'text-amber-900' : 'text-gray-800'}`}>
                                                  {color.name}
                                                </span>
                                                <span className="text-xs bg-white/50 px-2 py-0.5 rounded font-mono">
                                                  {color.code}
                                                </span>
                                              </div>
                                              <span className={`text-sm font-bold ${idx === 0 ? 'text-amber-900' : 'text-gray-700'}`}>
                                                €{color.price.min}-{color.price.max}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Body colore */}
                                          <div className="p-4">
                                            <p className="text-sm text-gray-600 mb-3">{color.description}</p>
                                            
                                            <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                                              <div className="bg-blue-50 rounded px-2 py-1.5 border border-blue-200">
                                                <p className="text-blue-600 font-semibold">Sessioni</p>
                                                <p className="text-blue-900 font-bold">{color.sessions}</p>
                                              </div>
                                              <div className="bg-purple-50 rounded px-2 py-1.5 border border-purple-200">
                                                <p className="text-purple-600 font-semibold">Difficoltà</p>
                                                <p className="text-purple-900 font-bold">{color.difficulty}</p>
                                              </div>
                                              <div className="bg-green-50 rounded px-2 py-1.5 border border-green-200">
                                                <p className="text-green-600 font-semibold">Manutenzione</p>
                                                <p className="text-green-900 font-bold text-[10px] leading-tight">{color.maintenance}</p>
                                              </div>
                                            </div>

                                            {/* Benefici */}
                                            <div className="flex flex-wrap gap-1.5">
                                              {color.benefits.map((benefit, bidx) => (
                                                <span 
                                                  key={bidx} 
                                                  className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-200"
                                                >
                                                  ✓ {benefit}
                                                </span>
                                              ))}
                                            </div>

                                            {/* WhatsApp CTA per primo colore */}
                                            {idx === 0 && (
                                              <div className="mt-3 pt-3 border-t border-amber-200">
                                                <button
                                                  onClick={() => {
                                                    const message = `Ciao! Ho visto che ${selectedLead.name} ha fatto l'AI Color Analysis e il colore perfetto è: ${color.name}. Vorrei prenotare!`;
                                                    window.open(`https://wa.me/393392399044?text=${encodeURIComponent(message)}`, '_blank');
                                                  }}
                                                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                                                >
                                                  <span>💬</span>
                                                  <span>Prenota {color.name} su WhatsApp</span>
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {modalAction === 'edit' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome Completo
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-400">👤</span>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Mario Rossi"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Numero di Telefono
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-400">📱</span>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="+39 333 456 7890"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {modalAction === 'delete' && (
                    <div className="text-center py-4">
                      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                        <span className="text-3xl">⚠️</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Conferma Eliminazione
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Sei sicuro di voler eliminare <strong>{selectedLead.name}</strong>?
                        <br />
                        Questa azione non può essere annullata.
                      </p>
                      {selectedLead.analyses.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-orange-700 flex items-center justify-center">
                            <span className="mr-2">⚠️</span>
                            Questo lead ha <strong className="mx-1">{selectedLead.analyses.length}</strong> 
                            {selectedLead.analyses.length === 1 ? 'analisi' : 'analisi'} che {selectedLead.analyses.length === 1 ? 'verrà persa' : 'verranno perse'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {modalAction === 'whatsapp' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Messaggio WhatsApp
                        </label>
                        <div className="relative">
                          <textarea
                            value={whatsappMessage}
                            onChange={(e) => setWhatsappMessage(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                            placeholder="Scrivi il tuo messaggio personalizzato..."
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {whatsappMessage.length} caratteri
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700 flex items-center">
                          <span className="mr-2">📱</span>
                          Destinatario: <strong className="ml-1">{selectedLead.phone}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bottoni azioni */}
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={closeModal}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {modalAction === 'details' ? 'Chiudi' : 'Annulla'}
                    </button>
                    
                    {modalAction === 'edit' && (
                      <button
                        onClick={updateLead}
                        disabled={!editForm.name.trim() || !editForm.phone.trim()}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
                      >
                        💾 Salva Modifiche
                      </button>
                    )}
                    
                    {modalAction === 'delete' && (
                      <button
                        onClick={deleteLead}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md transition-all"
                      >
                        🗑️ Elimina Definitivamente
                      </button>
                    )}
                    
                    {modalAction === 'whatsapp' && (
                      <button
                        onClick={sendWhatsApp}
                        disabled={!whatsappMessage.trim()}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
                      >
                        📱 Apri WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal Preview Articolo Generato */}
          {showDraftModal && draftPost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                  <h2 className="text-2xl font-bold text-gray-900">🤖 Anteprima Articolo Generato</h2>
                  <button
                    onClick={closeDraftModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                {/* Body Modal - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-4">
                    {/* Metadata Editabili */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titolo
                        </label>
                        <input
                          type="text"
                          value={draftPost.title}
                          onChange={(e) => updateDraftField('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug URL
                        </label>
                        <input
                          type="text"
                          value={draftPost.slug}
                          onChange={(e) => updateDraftField('slug', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrizione Breve
                      </label>
                      <textarea
                        value={draftPost.excerpt}
                        onChange={(e) => updateDraftField('excerpt', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoria
                        </label>
                        <input
                          type="text"
                          value={draftPost.category}
                          onChange={(e) => updateDraftField('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data
                        </label>
                        <input
                          type="date"
                          value={draftPost.date}
                          onChange={(e) => updateDraftField('date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description (SEO)
                      </label>
                      <textarea
                        value={draftPost.metaDescription}
                        onChange={(e) => updateDraftField('metaDescription', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={draftPost.keywords}
                        onChange={(e) => updateDraftField('keywords', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Contenuto Markdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenuto (Markdown)
                      </label>
                      <textarea
                        value={draftPost.content}
                        onChange={(e) => updateDraftField('content', e.target.value)}
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                    
                    {/* Anteprima Rendering */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anteprima Rendering
                      </label>
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          {draftPost.content.split('\n').map((line, index) => {
                            // Salta il frontmatter
                            if (line.trim() === '---' || line.match(/^[a-z]+:/i)) {
                              return null;
                            }
                            
                            if (line.startsWith('# ')) {
                              return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.slice(3)}</h2>;
                            } else if (line.startsWith('### ')) {
                              return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>;
                            } else if (line.trim() === '') {
                              return <br key={index} />;
                            } else {
                              return <p key={index} className="mb-3">{line}</p>;
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer Modal - Azioni */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                  <button
                    onClick={generateArticle}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? 'Generazione...' : '🔄 Rigenera'}
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={closeDraftModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={publishDraft}
                      disabled={isPublishing}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPublishing ? 'Pubblicazione...' : '✅ Approva e Pubblica'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );

  // Funzioni di utilità per l'export CSV
  function generateCSVExport(): string {
    const headers = ['Nome', 'Telefono', 'Data Registrazione', 'Numero Analisi', 'Ultima Stagione', 'IP Address'];
    const rows = leads.map(lead => [
      lead.name,
      lead.phone,
      new Date(lead.timestamp).toLocaleDateString('it-IT'),
      lead.analyses.length.toString(),
      lead.analyses.length > 0 ? lead.analyses[lead.analyses.length - 1].result.season : 'Nessuna',
      lead.ipAddress || 'N/A'
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  }

  function downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}