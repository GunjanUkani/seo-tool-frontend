import React from 'react';
import { AuditSummary as AuditSummaryType, PageAudit } from '../types/audit';
import { 
  FileText, 
  Heading1, 
  EyeOff, 
  AlertTriangle, 
  Layers, 
  Activity, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';

interface AuditSummaryProps {
  summary: AuditSummaryType;
  pages: PageAudit[];
  targetUrl: string;
  selectedFilter: string | null;
  onSelectFilter: (filterCode: string | null) => void;
}

export const AuditSummary: React.FC<AuditSummaryProps> = ({
  summary,
  pages,
  targetUrl,
  selectedFilter,
  onSelectFilter
}) => {
  const totalPages = summary.total_pages || pages.length;
  const healthScore = summary.health_score ?? 100;

  // Calculate severity counts
  let criticalCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  pages.forEach((page) => {
    page.issues.forEach((issue) => {
      if (['TITLE_MISSING', 'H1_MISSING', 'NOINDEX_DETECTED', 'NON_200_STATUS'].includes(issue)) {
        criticalCount++;
      } else if (['TITLE_TOO_SHORT', 'TITLE_TOO_LONG', 'META_DESCRIPTION_MISSING', 'MULTIPLE_H1', 'CANONICAL_MISSING', 'PAGE_SIZE_TOO_LARGE'].includes(issue)) {
        warningCount++;
      } else {
        infoCount++;
      }
    });
  });

  const issueCards = [
    {
      code: 'TITLE_MISSING',
      title: 'Missing Titles',
      count: summary.missing_titles,
      icon: FileText,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)'
    },
    {
      code: 'MULTIPLE_H1',
      title: 'Multiple H1 Headings',
      count: summary.multiple_h1,
      icon: Heading1,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)'
    },
    {
      code: 'NOINDEX_DETECTED',
      title: 'Noindex Pages',
      count: summary.noindex_pages,
      icon: EyeOff,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)'
    },
    {
      code: 'NON_200_STATUS',
      title: 'Non-200 HTTP Pages',
      count: summary.non_200_pages,
      icon: AlertTriangle,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Top Banner URL & Health Score */}
      <div className="glass-card" style={{ padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Website
            </div>
            <div className="url-code" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
              {targetUrl}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Health Score Gauge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                position: 'relative',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `conic-gradient(${healthScore > 80 ? '#10b981' : healthScore > 50 ? '#f59e0b' : '#ef4444'} ${healthScore}%, rgba(255,255,255,0.08) 0%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--bg-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: healthScore > 80 ? '#10b981' : healthScore > 50 ? '#f59e0b' : '#ef4444'
                }}>
                  {healthScore}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Site Health Score</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {healthScore > 80 ? 'Good condition' : healthScore > 50 ? 'Needs attention' : 'Critical issues found'}
                </div>
              </div>
            </div>

            {/* Total Pages Crawled Badge */}
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Layers size={16} color="var(--accent-primary)" />
                Total Pages Crawled
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                {totalPages}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Summary Check Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {issueCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedFilter === card.code;

          return (
            <div
              key={card.code}
              className="glass-card"
              onClick={() => onSelectFilter(isSelected ? null : card.code)}
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                borderColor: isSelected ? card.color : undefined,
                boxShadow: isSelected ? `0 0 15px ${card.color}33` : undefined,
                background: isSelected ? 'rgba(30, 41, 59, 0.9)' : undefined
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {card.title}
                </span>
                <div style={{
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  background: card.bg
                }}>
                  <Icon size={18} color={card.color} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.count > 0 ? card.color : 'var(--severity-success)' }}>
                  {card.count}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {card.count === 0 ? 'All pages passed' : `${card.count} pages affected`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Severity Breakdown Bar */}
      <div className="glass-card" style={{ padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <Activity size={16} color="var(--accent-primary)" />
            Issues Severity Overview
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="status-dot critical" /> Critical: <strong>{criticalCount}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="status-dot warning" /> Warning: <strong>{warningCount}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="status-dot info" /> Info: <strong>{infoCount}</strong>
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{
          height: '8px',
          width: '100%',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex'
        }}>
          {criticalCount + warningCount + infoCount > 0 ? (
            <>
              <div style={{ width: `${(criticalCount / (criticalCount + warningCount + infoCount)) * 100}%`, background: 'var(--severity-critical)' }} />
              <div style={{ width: `${(warningCount / (criticalCount + warningCount + infoCount)) * 100}%`, background: 'var(--severity-warning)' }} />
              <div style={{ width: `${(infoCount / (criticalCount + warningCount + infoCount)) * 100}%`, background: 'var(--severity-info)' }} />
            </>
          ) : (
            <div style={{ width: '100%', background: 'var(--severity-success)' }} />
          )}
        </div>
      </div>
    </div>
  );
};
