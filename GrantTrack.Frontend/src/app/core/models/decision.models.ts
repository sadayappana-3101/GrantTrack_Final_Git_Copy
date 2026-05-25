import { DecisionStatus } from './enums';

export interface DecisionRequest {
  applicationId: number;
  approverId: number;
  decisionValue: DecisionStatus;
  notes: string;
  date: string;         // ISO date string
}
