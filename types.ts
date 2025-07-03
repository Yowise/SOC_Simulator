export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'New' | 'Investigating' | 'Resolved';

export interface Alert {
  id: string;
  timestamp: string;
  title: string;
  source_ip: string;
  dest_ip: string;
  severity: AlertSeverity;
  status: AlertStatus;
  details: string;
  raw_log: string;
}

export interface PlaybookStep {
  id: number;
  action: string;
  completed: boolean;
}

// Types for the submission analysis feature
export interface EmailAnalysis {
    isSpamOrPhishing: boolean;
    reason: string;
    sources?: Array<{ uri: string; title: string }>;
}

export interface NameAnalysis {
    isFake: boolean;
    reason: string;
}

export interface ProfanityAnalysis {
    containsProfanity: boolean;
    reason: string;
}

export interface SpamAnalysis {
    isSpam: boolean;
    reason: string;
}

export interface Analysis {
    emailAnalysis: EmailAnalysis;
    nameAnalysis: NameAnalysis;
    profanityAnalysis: ProfanityAnalysis;
    spamAnalysis: SpamAnalysis;
}

export interface Submission {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    timestamp: Date;
    analysis: Analysis;
}
