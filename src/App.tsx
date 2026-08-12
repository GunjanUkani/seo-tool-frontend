import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuditForm } from './components/AuditForm';
import { AuditSummary } from './components/AuditSummary';
import { PageBreakdown } from './components/PageBreakdown';
import { AuditData } from './types/audit';
import { runAuditApi, getAuditApi, getRecentAuditsApi } from './api/client';

export const App: React.FC = () => {
  const [currentAudit, setCurrentAudit] = useState<AuditData | null>(null);
  const [recentAudits, setRecentAudits] = useState<AuditData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Load recent audits history on mount
  useEffect(() => {
    fetchRecentAudits();
  }, []);

  const fetchRecentAudits = async () => {
    try {
      const history = await getRecentAuditsApi();
      setRecentAudits(history);
    } catch {
      // Ignore initial load error if server is starting
    }
  };

  const handleStartAudit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedFilter(null);

    try {
      const result = await runAuditApi(url);
      setCurrentAudit(result);
      fetchRecentAudits();
    } catch (err: any) {
      console.error('Audit execution error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to complete SEO audit.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecentAudit = async (auditId: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedFilter(null);

    try {
      const audit = await getAuditApi(auditId);
      setCurrentAudit(audit);
    } catch (err: any) {
      setError('Failed to fetch audit report details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentAudit(null);
    setError(null);
    setSelectedFilter(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onReset={handleReset} activeUrl={currentAudit?.url} />

      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="app-container">
          {!currentAudit ? (
            <AuditForm
              onStartAudit={handleStartAudit}
              isLoading={isLoading}
              error={error}
              recentAudits={recentAudits}
              onSelectRecentAudit={handleSelectRecentAudit}
            />
          ) : (
            <div>
              {/* Screen 2: Audit Summary Cards */}
              <AuditSummary
                summary={currentAudit.summary}
                pages={currentAudit.pages}
                targetUrl={currentAudit.url}
                selectedFilter={selectedFilter}
                onSelectFilter={(filterCode) => setSelectedFilter(filterCode)}
              />

              {/* Screen 3: Page-Level Breakdown Table */}
              <PageBreakdown
                pages={currentAudit.pages}
                selectedFilter={selectedFilter}
                onClearFilter={() => setSelectedFilter(null)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 0',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
        textAlign: 'center',
        background: 'rgba(11, 15, 25, 0.9)'
      }}>
        <div className="app-container">
          <span>Zensor Solutions — Technical SEO Audit Interface • Built with React, Express, Node.js & Docker</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
