export interface PageMetrics {
  title?: string;
  title_length: number;
  meta_description?: string;
  meta_description_length: number;
  h1_count: number;
  h1_texts?: string[];
  page_size_kb: number;
  canonical_url: string | null;
  has_canonical: boolean;
  is_noindex: boolean;
  internal_link_count: number;
}

export interface PageAudit {
  url: string;
  status_code: number;
  issues: string[];
  metrics: PageMetrics;
}

export interface AuditSummary {
  missing_titles: number;
  multiple_h1: number;
  noindex_pages: number;
  non_200_pages: number;
  total_pages?: number;
  total_issues?: number;
  health_score?: number;
}

export interface AuditData {
  audit_id: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  summary: AuditSummary;
  pages: PageAudit[];
  created_at?: string;
}

export type IssueSeverity = 'critical' | 'warning' | 'info';

export interface IssueDefinition {
  code: string;
  label: string;
  description: string;
  severity: IssueSeverity;
}
