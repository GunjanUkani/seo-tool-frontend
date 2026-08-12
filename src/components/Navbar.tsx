import React from 'react';
import { Search, ShieldCheck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onReset?: () => void;
  activeUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, activeUrl }) => {
  return (
    <header className="navbar">
      <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          className="header-brand" 
          onClick={onReset}
          style={{ cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--accent-gradient)',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Search size={22} color="#ffffff" />
          </div>
          <div>
            <span>ZENSOR</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '8px', display: 'inline-block' }}>
              SEO Diagnostic Engine
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {activeUrl && (
            <button className="btn-secondary" onClick={onReset}>
              <RefreshCw size={14} />
              New Audit
            </button>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--severity-success)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            <ShieldCheck size={14} />
            <span>v1.0 Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
