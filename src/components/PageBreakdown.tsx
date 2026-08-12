import React, { useState } from 'react';
import { PageAudit } from '../types/audit';
import { getIssueLabel, getIssueSeverity } from '../utils/issueMetadata';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Heading, 
  Link2, 
  HardDrive, 
  ShieldAlert 
} from 'lucide-react';

interface PageBreakdownProps {
  pages: PageAudit[];
  selectedFilter: string | null;
  onClearFilter: () => void;
}

export const PageBreakdown: React.FC<PageBreakdownProps> = ({
  pages,
  selectedFilter,
  onClearFilter
}) => {
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [issueCategoryFilter, setIssueCategoryFilter] = useState<'all' | 'issues_only' | 'critical'>('all');

  const toggleExpand = (url: string) => {
    setExpandedUrl(expandedUrl === url ? null : url);
  };

  // Filtering Logic
  const filteredPages = pages.filter((page) => {
    // 1. Search Query Filter
    if (searchQuery.trim() && !page.url.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Metric Pill Filter from Summary Screen
    if (selectedFilter && !page.issues.includes(selectedFilter)) {
      return false;
    }

    // 3. Category Filter
    if (issueCategoryFilter === 'issues_only' && page.issues.length === 0) {
      return false;
    }

    if (issueCategoryFilter === 'critical') {
      const hasCritical = page.issues.some((issue) =>
        ['TITLE_MISSING', 'H1_MISSING', 'NOINDEX_DETECTED', 'NON_200_STATUS'].includes(issue)
      );
      if (!hasCritical) return false;
    }

    return true;
  });

  return (
    <div className="glass-card" style={{ padding: '1.75rem 2rem' }}>
      {/* Section Header & Search Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Page-Level Diagnostic Breakdown</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Showing {filteredPages.length} of {pages.length} crawled pages. Click any row to expand metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Active Metric Filter Tag */}
          {selectedFilter && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-light)',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              <span>Filter: {getIssueLabel(selectedFilter)}</span>
              <button
                onClick={onClearFilter}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Filter Buttons */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setIssueCategoryFilter('all')}
              style={{
                background: issueCategoryFilter === 'all' ? 'var(--accent-primary)' : 'transparent',
                color: issueCategoryFilter === 'all' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Pages ({pages.length})
            </button>
            <button
              onClick={() => setIssueCategoryFilter('issues_only')}
              style={{
                background: issueCategoryFilter === 'issues_only' ? 'var(--accent-primary)' : 'transparent',
                color: issueCategoryFilter === 'issues_only' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Has Issues ({pages.filter(p => p.issues.length > 0).length})
            </button>
            <button
              onClick={() => setIssueCategoryFilter('critical')}
              style={{
                background: issueCategoryFilter === 'critical' ? 'var(--severity-critical)' : 'transparent',
                color: issueCategoryFilter === 'critical' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Critical
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Page URL</th>
              <th style={{ width: '100px' }}>Status</th>
              <th>Detected SEO Issues</th>
              <th style={{ width: '120px' }}>Internal Links</th>
              <th style={{ width: '100px' }}>Page Size</th>
            </tr>
          </thead>
          <tbody>
            {filteredPages.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <div>No pages match your selected filter criteria.</div>
                </td>
              </tr>
            ) : (
              filteredPages.map((page) => {
                const isExpanded = expandedUrl === page.url;
                const hasIssues = page.issues.length > 0;

                return (
                  <React.Fragment key={page.url}>
                    <tr
                      className="table-row-hover"
                      onClick={() => toggleExpand(page.url)}
                      style={{ background: isExpanded ? 'rgba(30, 41, 59, 0.5)' : undefined }}
                    >
                      <td style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="url-code">{page.url}</span>
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: 'var(--text-dim)' }}
                            title="Open URL in new tab"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: page.status_code === 200 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: page.status_code === 200 ? 'var(--severity-success)' : 'var(--severity-critical)'
                        }}>
                          {page.status_code}
                        </span>
                      </td>
                      <td>
                        {hasIssues ? (
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {page.issues.map((issueCode) => {
                              const severity = getIssueSeverity(issueCode);
                              const label = getIssueLabel(issueCode);
                              const badgeClass = `badge badge-${severity}`;

                              return (
                                <span key={issueCode} className={badgeClass}>
                                  <span className={`status-dot ${severity}`} />
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="badge badge-success">
                            <CheckCircle2 size={12} />
                            Healthy (0 issues)
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{page.metrics.internal_link_count} links</td>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{page.metrics.page_size_kb} KB</td>
                    </tr>

                    {/* Expandable Row Details */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} style={{ background: 'rgba(15, 23, 42, 0.95)', padding: '1.5rem', borderBottom: '2px solid var(--border-glow)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                            {/* Card 1: Title & Meta Description */}
                            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                                <FileText size={16} /> Title & Meta Tags
                              </div>

                              <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>TITLE TAG</div>
                                <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 500 }}>
                                  {page.metrics.title || <em style={{ color: 'var(--severity-critical)' }}>Missing &lt;title&gt; tag</em>}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                  Length: {page.metrics.title_length} chars (Target: 30-65 chars)
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>META DESCRIPTION</div>
                                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                                  {page.metrics.meta_description || <em style={{ color: 'var(--severity-warning)' }}>Missing meta description</em>}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                  Length: {page.metrics.meta_description_length} chars (Target: 70-160 chars)
                                </div>
                              </div>
                            </div>

                            {/* Card 2: Headings & Indexability */}
                            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                                <Heading size={16} /> Headings & Indexability
                              </div>

                              <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>H1 HEADINGS COUNT</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: page.metrics.h1_count === 1 ? 'var(--severity-success)' : 'var(--severity-warning)' }}>
                                  {page.metrics.h1_count} H1 Tag(s) Found
                                </div>
                                {page.metrics.h1_texts && page.metrics.h1_texts.length > 0 && (
                                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {page.metrics.h1_texts.map((txt, idx) => (
                                      <li key={idx}>"{txt}"</li>
                                    ))}
                                  </ul>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>ROBOTS INDEXABILITY</div>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: page.metrics.is_noindex ? 'var(--severity-critical)' : 'var(--severity-success)' }}>
                                    {page.metrics.is_noindex ? '🚫 NOINDEX SET' : '✅ INDEXABLE'}
                                  </div>
                                </div>

                                <div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>CANONICAL TAG</div>
                                  <div className="url-code" style={{ fontSize: '0.8rem' }}>
                                    {page.metrics.canonical_url || <span style={{ color: 'var(--severity-warning)' }}>Not Specified</span>}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card 3: Detailed Issues Explanation */}
                            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                                <ShieldAlert size={16} /> Recommended Fixes
                              </div>

                              {hasIssues ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {page.issues.map((issueCode) => {
                                    const severity = getIssueSeverity(issueCode);
                                    const label = getIssueLabel(issueCode);
                                    return (
                                      <div key={issueCode} style={{ fontSize: '0.8rem', borderLeft: `3px solid var(--severity-${severity})`, paddingLeft: '0.5rem' }}>
                                        <strong style={{ color: `var(--severity-${severity})` }}>{label}:</strong>{' '}
                                        <span style={{ color: 'var(--text-muted)' }}>
                                          Check title tag length, ensure single H1, and canonical tags are present.
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div style={{ color: 'var(--severity-success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <CheckCircle2 size={16} />
                                  This page adheres to all technical SEO requirements!
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
