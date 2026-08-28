import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  MessageSquare, Heart, Plus, Search, Filter, 
  Send, User, Hash, School, X, Sparkles, AlertCircle 
} from 'lucide-react';
import { INITIAL_STORIES, CATEGORIES } from '../data/mockStories';

export default function GrievanceWall({ onStorySubmitted }) {
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem('pnd_wbjee_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out any legacy dummy mock stories
        const realOnly = parsed.filter(s => !s.id.startsWith('story-1') && !s.id.startsWith('story-2') && !s.id.startsWith('story-3') && !s.id.startsWith('story-4'));
        return realOnly;
      }
      return INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  });

  const [upvotedIds, setUpvotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pnd_wbjee_upvoted');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Story Form State
  const [newStory, setNewStory] = useState({
    name: '',
    gmr: '',
    category: 'Upgradation Blocked',
    allottedCollege: '',
    story: ''
  });

  // Save stories to localStorage
  useEffect(() => {
    localStorage.setItem('pnd_wbjee_stories', JSON.stringify(stories));
  }, [stories]);

  // Save upvoted ids to localStorage
  useEffect(() => {
    localStorage.setItem('pnd_wbjee_upvoted', JSON.stringify(upvotedIds));
  }, [upvotedIds]);

  // Handle Upvote
  const handleToggleUpvote = (storyId) => {
    if (upvotedIds.includes(storyId)) {
      setUpvotedIds(prev => prev.filter(id => id !== storyId));
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, upvotes: Math.max(0, s.upvotes - 1) } : s));
    } else {
      setUpvotedIds(prev => [...prev, storyId]);
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, upvotes: (s.upvotes || 0) + 1 } : s));
    }
  };

  // Handle New Story Submission
  const handleSubmitStory = (e) => {
    e.preventDefault();
    if (!newStory.story.trim()) return;

    const entry = {
      id: `incident-${Date.now()}`,
      name: newStory.name.trim() || 'Anonymous Ranker',
      gmr: newStory.gmr.trim() || 'Undisclosed',
      category: newStory.category,
      allottedCollege: newStory.allottedCollege.trim() || 'Not Specified',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      story: newStory.story.trim(),
      upvotes: 1
    };

    setStories(prev => [entry, ...prev]);
    setIsModalOpen(false);
    setNewStory({
      name: '',
      gmr: '',
      category: 'Upgradation Blocked',
      allottedCollege: '',
      story: ''
    });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#10b981']
    });

    if (onStorySubmitted) {
      onStorySubmitted();
    }
  };

  // Filter stories
  const filteredStories = stories.filter(story => {
    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory;
    const matchesSearch = 
      story.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.gmr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.allottedCollege.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="grievance-wall" className="py-16 bg-slate-950 border-t border-slate-800/80 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Action 3: Incident Wall</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Student Grievances & Incidents
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Documented personal accounts of counseling irregularities, seat-blocking, and fee traps.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Log Your Incident Anonymously</span>
          </button>
        </div>

        {/* Filters & Search Toolbar (Only if stories exist) */}
        {stories.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Stories Grid */}
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStories.map((story) => {
              const isUpvoted = upvotedIds.includes(story.id);

              return (
                <div
                  key={story.id}
                  className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>{story.name}</span>
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                            GMR: {story.gmr}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {story.allottedCollege}
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                        {story.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap mb-4">
                      "{story.story}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                    <span>{story.date}</span>

                    <button
                      onClick={() => handleToggleUpvote(story.id)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isUpvoted 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{story.upvotes || 1}</span>
                      <span>{isUpvoted ? 'Supported' : 'Stand With This'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Clean Empty State (No Dummy Data) */
          <div className="text-center py-12 px-6 bg-slate-900/40 rounded-2xl border border-slate-800 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Incidents Logged Yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-5">
              Be the first to document your counseling grievance, seat blockage, or private college fee trap to build collective evidence for the press.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Share Your Story Anonymously</span>
            </button>
          </div>
        )}

      </div>

      {/* Submit Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Log Incident</span>
            </div>
            <h3 className="text-lg font-black text-white mb-4">Document Your Grievance</h3>

            <form onSubmit={handleSubmitStory} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name / Alias
                  </label>
                  <input
                    type="text"
                    value={newStory.name}
                    onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
                    placeholder="e.g. Rahul K. / Anon"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">
                    WBJEE GMR Rank *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStory.gmr}
                    onChange={(e) => setNewStory({ ...newStory, gmr: e.target.value })}
                    placeholder="e.g. 2150"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Category
                </label>
                <select
                  value={newStory.category}
                  onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Upgradation Blocked">Upgradation Blocked</option>
                  <option value="Seat Blocking">Seat Blocking / Seat Hoarding</option>
                  <option value="Financial Burden">Financial Burden / Private College Fee Trap</option>
                  <option value="Counseling Confusion">Counseling Confusion / Arbitrary Dates</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Status / College Held (if any)
                </label>
                <input
                  type="text"
                  value={newStory.allottedCollege}
                  onChange={(e) => setNewStory({ ...newStory, allottedCollege: e.target.value })}
                  placeholder="e.g. Heritage CSE / None"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Detailed Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newStory.story}
                  onChange={(e) => setNewStory({ ...newStory, story: e.target.value })}
                  placeholder="Explain how the current counseling system or seat blocking affected you..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
