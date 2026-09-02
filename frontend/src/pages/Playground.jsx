import React, { useState } from 'react';
import useCircuitStore, { TEMPLATES } from '../stores/circuitStore';

const IconSearch = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconCircuit = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h10" /><path d="M6 12h12" /><path d="M8 18h10" /><path d="M3 12h3" /><path d="M18 12h3" /><rect x="6" y="4" width="4" height="4" rx="1" /><rect x="14" y="10" width="4" height="4" rx="1" /><rect x="6" y="16" width="4" height="4" rx="1" />
  </svg>
);

const IconClose = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Playground() {
  const { loadTemplate } = useCircuitStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Group templates
  const allTemplates = Object.entries(TEMPLATES).map(([key, data]) => ({ key, ...data }));
  
  // Grover is the featured algorithm
  const featured = allTemplates.find(t => t.key === 'grover2');
  const regularTemplates = allTemplates.filter(t => t.key !== 'grover2');

  const filteredTemplates = regularTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || t.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  const handleLoad = (e, templateKey, templateName) => {
    e.preventDefault();
    loadTemplate(templateKey);
    // Use history push to navigate to circuit builder
    window.history.pushState({}, '', '/circuit-builder');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. PAGE HEADER */}
      <div>
        <h1 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--color-text)] mb-3">
          Algorithm Playground
        </h1>
        <p className="text-[15px] md:text-[16px] text-[var(--color-text)]/70 max-w-2xl leading-relaxed">
          Load a known algorithm, then inspect and modify it in the Circuit Builder — the fastest way to learn by experiment.
        </p>
      </div>

      {/* 2. FILTER/SEARCH BAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-[var(--color-card)] p-2 rounded-full border border-[var(--color-border)]">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto px-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer border-none ${
                filter === f 
                  ? 'bg-[var(--color-text)] text-[var(--color-base)]' 
                  : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-[240px] shrink-0 px-2 sm:px-0 sm:pr-2 pb-2 sm:pb-0">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text)]/50 sm:left-2">
            <IconSearch />
          </span>
          <input 
            type="text" 
            placeholder="Search algorithms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[36px] bg-[var(--color-base)] border border-[var(--color-border)] rounded-full pl-9 pr-4 text-[13px] outline-none focus:border-[var(--color-accent-deep)] transition-colors text-[var(--color-text)] placeholder:text-[var(--color-text)]/40"
          />
        </div>
      </div>

      {/* 3. FEATURED ALGORITHM */}
      {(filter === 'All' || filter === featured?.difficulty) && (!searchQuery || featured?.name.toLowerCase().includes(searchQuery.toLowerCase())) && featured && (
        <div className="w-full bg-[var(--color-accent-deep)] rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-accent-light)]/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex-1 z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent-light)]/20 text-[var(--color-accent-light)] text-[11px] font-bold uppercase tracking-wider">
                Featured
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-bold uppercase tracking-wider">
                {featured.difficulty}
              </span>
              <span className="text-[13px] font-mono text-white/50">{featured.qubitCount} qubits</span>
            </div>
            
            <h2 className="font-display text-[28px] md:text-[32px] font-semibold mb-4">{featured.name}</h2>
            <p className="text-[15px] text-white/80 mb-8 max-w-lg leading-relaxed">
              {featured.description}
            </p>
            
            <button 
              onClick={(e) => handleLoad(e, featured.key, featured.name)}
              className="px-6 py-3 bg-white text-[var(--color-accent-deep)] rounded-full text-[14px] font-bold border-none cursor-pointer hover:bg-[var(--color-accent-light)] transition-colors shadow-sm"
            >
              Load into Circuit Builder
            </button>
          </div>

          <div className="w-full md:w-[320px] shrink-0 bg-black/20 border border-white/10 rounded-[12px] p-4 z-10">
            <div className="flex items-end gap-2 h-[120px] border-b border-white/20 pb-2">
              <div className="w-8 bg-white/10 h-[20%] rounded-t-sm"></div>
              <div className="w-8 bg-white/10 h-[20%] rounded-t-sm"></div>
              <div className="w-8 bg-white/10 h-[20%] rounded-t-sm"></div>
              <div className="w-8 bg-[var(--color-accent-light)] h-[90%] rounded-t-sm shadow-[0_0_15px_var(--color-accent-light)]"></div>
            </div>
            <div className="flex gap-2 pt-2 text-[10px] font-mono text-white/50 justify-between px-2">
              <span>|00⟩</span>
              <span>|01⟩</span>
              <span>|10⟩</span>
              <span className="text-[var(--color-accent-light)]">|11⟩</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ALGORITHM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map(template => (
          <div key={template.key} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 flex flex-col hover:border-[var(--color-text)]/20 hover:shadow-sm transition-all group">
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--color-base)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/70 group-hover:text-[var(--color-accent-deep)] transition-colors">
                <IconCircuit />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-[var(--color-base)] border border-[var(--color-border)] text-[var(--color-text)]/60 text-[11px] font-bold uppercase">
                  {template.difficulty}
                </span>
              </div>
            </div>
            
            <h3 className="font-display text-[18px] font-semibold text-[var(--color-text)] mb-2">{template.name}</h3>
            <p className="text-[13px] text-[var(--color-text)]/60 leading-relaxed mb-4 flex-1">
              {template.description}
            </p>
            
            <div className="flex items-center justify-between mb-5">
              <span className="text-[12px] font-mono text-[var(--color-text)]/50 bg-[var(--color-base)] px-2 py-1 rounded border border-[var(--color-border)]">
                {template.qubitCount} qubits
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-auto">
              <button 
                onClick={() => setSelectedTemplate(template)}
                className="flex-1 py-2 px-3 bg-transparent border border-[var(--color-border)] text-[var(--color-text)] rounded-full text-[13px] font-semibold cursor-pointer hover:bg-[var(--color-base)] transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={(e) => handleLoad(e, template.key, template.name)}
                className="flex-1 py-2 px-3 bg-[var(--color-text)] border border-[var(--color-text)] text-[var(--color-base)] rounded-full text-[13px] font-semibold cursor-pointer hover:bg-black transition-colors"
              >
                Load
              </button>
            </div>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-[var(--color-border)] rounded-[16px]">
            <p className="text-[15px] font-medium text-[var(--color-text)] mb-1">No algorithms found</p>
            <p className="text-[13px] text-[var(--color-text)]/50">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* 5. DETAILS MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedTemplate(null)}></div>
          <div className="relative w-full max-w-2xl bg-[var(--color-base)] rounded-[20px] shadow-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-card)]/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--color-accent-deep)]/10 text-[var(--color-accent-deep)] border border-[var(--color-accent-deep)]/20">
                    {selectedTemplate.difficulty}
                  </span>
                  <span className="text-[12px] font-mono text-[var(--color-text)]/50">
                    {selectedTemplate.qubitCount} qubits
                  </span>
                </div>
                <h2 className="font-display text-[24px] font-bold text-[var(--color-text)]">{selectedTemplate.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-base)] border border-[var(--color-border)] text-[var(--color-text)]/60 hover:text-[var(--color-text)] cursor-pointer"
              >
                <IconClose />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <p className="text-[15px] text-[var(--color-text)]/80 leading-relaxed mb-6">
                {selectedTemplate.description}
              </p>
              
              <div className="mb-6">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-text)]/50 mb-3">Key Equation</h4>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-4 rounded-xl font-mono text-[14px] overflow-x-auto text-center">
                  |ψ⟩ = (1/√N) ∑ (-1)^f(x) |x⟩
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-text)]/50 mb-3">Gate Sequence</h4>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-1">
                  {selectedTemplate.gates.reduce((acc, gate, i) => {
                    if (i === 0 || acc[acc.length - 1].col !== gate.col) acc.push({ col: gate.col, gates: [gate] });
                    else acc[acc.length - 1].gates.push(gate);
                    return acc;
                  }, []).map((step, idx) => (
                    <div key={idx} className="flex gap-4 p-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-base)] transition-colors rounded-lg">
                      <span className="text-[12px] font-mono text-[var(--color-text)]/40 shrink-0 w-12 pt-0.5">Step {idx + 1}</span>
                      <div className="flex flex-wrap gap-2">
                        {step.gates.map((g, gi) => (
                          <span key={gi} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-base)] border border-[var(--color-border)] text-[13px] font-medium">
                            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-deep)' }}></span>
                            {g.type} on q{g.qubit}{g.target !== undefined ? ` → q${g.target}` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-card)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <a href="/lesson/8" className="text-[14px] font-semibold text-[var(--color-accent-deep)] hover:underline no-underline flex items-center gap-1">
                Read the full lesson <IconChevronRight />
              </a>
              <button 
                onClick={(e) => handleLoad(e, selectedTemplate.key, selectedTemplate.name)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[var(--color-text)] text-[var(--color-base)] rounded-full text-[14px] font-bold border-none cursor-pointer hover:bg-black transition-colors"
              >
                Load into Circuit Builder
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
