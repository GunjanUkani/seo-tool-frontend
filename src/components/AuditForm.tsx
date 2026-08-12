import React, { useState } from 'react';
import { Search, Globe, ArrowRight, Loader2, Zap, AlertCircle, History } from 'lucide-react';
import { AuditData } from '../types/audit';

interface AuditFormProps {
  onStartAudit: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  recentAudits: AuditData[];
  onSelectRecentAudit: (auditId: string) => void;
}

const SAMPLE_URLS = [
  'https://example.com',
  'https://news.ycombinator.com',
  'https://wikipedia.org'
];

export const AuditForm: React.FC<AuditFormProps> = ({
  onStartAudit,
  isLoading,
  error,
  recentAudits,
  onSelectRecentAudit
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    let trimmed = urlInput.trim();
    if (!trimmed) {
      setValidationError('Please enter a target website URL.');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = 'https://' + trimmed;
    }

    try {
      new URL(trimmed);
    } catch {
      setValidationError('Invalid URL format. Please include a valid domain (e.g. example.com).');
      return;
    }

    onStartAudit(trimmed);
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    setValidationError(null);
    onStartAudit(sampleUrl);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '3rem auto', padding: '0 1rem' }}>
      {/* Hero Title Section */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          background: 'rgba(2, 132, 199, 0.12)',
          border: '1px solid var(--border-glow)',
          color: 'var(--accent-light)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          <Zap size={14} color="var(--accent-light)" />
          <span>Navigation-Based Technical SEO Crawler</span>
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: '0.75rem',
          lineHeight: 1.2
        }}>
          Automated Website SEO Audits & Insights
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Enter a URL to analyze primary navigation links, evaluate critical SEO tags, detect broken status codes, and get decision-ready diagnostic reports.
        </p>
      </div>

      {/* URL Input Form Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} /> Target Website Homepage URL
            </label>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="https://example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ minWidth: '160px' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>Crawling...</span>
                  </>
                ) : (
                  <>
                    <span>Run Audit</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {(validationError || error) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.9rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{validationError || error}</span>
              </div>
            )}
          </div>
        </form>

        {/* Quick Sample Links */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.6rem', fontWeight: 600 }}>
            QUICK TEST URLS:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {SAMPLE_URLS.map((sample) => (
              <button
                key={sample}
                type="button"
                className="btn-secondary"
                onClick={() => handleSampleClick(sample)}
                disabled={isLoading}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                <Search size={12} />
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Progress Card */}
      {isLoading && (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', animation: 'pulse-glow 2s infinite' }}>
          <Loader2 size={36} className="spin" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Auditing Navigation & Crawling Pages
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Detecting primary navigation links, evaluating meta descriptions, titles, canonical tags, and HTTP status codes...
          </p>
        </div>
      )}

      {/* Recent Audits History */}
      {recentAudits.length > 0 && !isLoading && (
        <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <History size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Audits</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentAudits.map((item) => (
              <div
                key={item.audit_id}
                onClick={() => onSelectRecentAudit(item.audit_id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="table-row-hover"
              >
                <div>
                  <div className="url-code" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {item.url}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    ID: {item.audit_id} • {item.summary?.total_pages || item.pages?.length || 0} pages crawled
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.summary?.health_score !== undefined && (
                    <div style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: item.summary.health_score > 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: item.summary.health_score > 80 ? 'var(--severity-success)' : 'var(--severity-warning)',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      Score: {item.summary.health_score}%
                    </div>
                  )}
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
