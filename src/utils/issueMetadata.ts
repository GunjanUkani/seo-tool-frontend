import { IssueDefinition, IssueSeverity } from '../types/audit';

export const ISSUE_DEFINITIONS: Record<string, IssueDefinition> = {
  TITLE_MISSING: {
    code: 'TITLE_MISSING',
    label: 'Missing Title Tag',
    description: 'The page lacks a <title> element. Title tags are critical for search ranking and click-through rates.',
    severity: 'critical'
  },
  TITLE_TOO_SHORT: {
    code: 'TITLE_TOO_SHORT',
    label: 'Title Tag Too Short',
    description: 'Title length is under 30 characters. Expand title to include relevant keywords and brand context.',
    severity: 'warning'
  },
  TITLE_TOO_LONG: {
    code: 'TITLE_TOO_LONG',
    label: 'Title Tag Too Long',
    description: 'Title length exceeds 65 characters and may be truncated in Search Engine Results Pages (SERPs).',
    severity: 'warning'
  },
  META_DESCRIPTION_MISSING: {
    code: 'META_DESCRIPTION_MISSING',
    label: 'Missing Meta Description',
    description: 'The page is missing a meta description tag. Search engines may auto-generate snippets.',
    severity: 'warning'
  },
  META_DESCRIPTION_TOO_SHORT: {
    code: 'META_DESCRIPTION_TOO_SHORT',
    label: 'Meta Description Too Short',
    description: 'Meta description is under 70 characters. Provide a compelling call-to-action summary.',
    severity: 'info'
  },
  META_DESCRIPTION_TOO_LONG: {
    code: 'META_DESCRIPTION_TOO_LONG',
    label: 'Meta Description Too Long',
    description: 'Meta description exceeds 160 characters and will likely be cut off on desktop/mobile SERPs.',
    severity: 'info'
  },
  H1_MISSING: {
    code: 'H1_MISSING',
    label: 'Missing H1 Heading',
    description: 'No <h1> tag was found. Every page should have exactly one main heading defining page topic.',
    severity: 'critical'
  },
  MULTIPLE_H1: {
    code: 'MULTIPLE_H1',
    label: 'Multiple H1 Headings',
    description: 'More than one <h1> tag found. Use a single main <h1> and structure subheadings with <h2>-<h6>.',
    severity: 'warning'
  },
  CANONICAL_MISSING: {
    code: 'CANONICAL_MISSING',
    label: 'Missing Canonical Tag',
    description: 'No <link rel="canonical"> tag detected. Canonical tags prevent duplicate content issues.',
    severity: 'warning'
  },
  NOINDEX_DETECTED: {
    code: 'NOINDEX_DETECTED',
    label: 'Noindex Directives Present',
    description: 'Page contains a noindex instruction (<meta name="robots"> or X-Robots-Tag), blocking search indexing.',
    severity: 'critical'
  },
  NON_200_STATUS: {
    code: 'NON_200_STATUS',
    label: 'Non-200 HTTP Response',
    description: 'The page returned an HTTP error or redirect status code instead of a 200 OK.',
    severity: 'critical'
  },
  PAGE_SIZE_TOO_LARGE: {
    code: 'PAGE_SIZE_TOO_LARGE',
    label: 'Page Size Exceeds 2 MB',
    description: 'Total HTML page size exceeds 2MB, impacting page load performance and crawl efficiency.',
    severity: 'warning'
  }
};

export function getIssueSeverity(issueCode: string): IssueSeverity {
  return ISSUE_DEFINITIONS[issueCode]?.severity || 'warning';
}

export function getIssueLabel(issueCode: string): string {
  return ISSUE_DEFINITIONS[issueCode]?.label || issueCode.replace(/_/g, ' ');
}
