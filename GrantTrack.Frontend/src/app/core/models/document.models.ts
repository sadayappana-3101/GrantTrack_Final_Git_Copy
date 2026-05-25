export interface AppDocument {
  documentId: number;
  applicationId: number;
  docType: string;
  fileName: string;
  downloadUrl: string;
}
export const DOC_TYPES: ReadonlyArray<string> = [
  'Project Proposal',
  'Budget Plan',
  'ID Proof',
  'Address Proof',
  'Bank Statement',
  'Tax Document',
  'Other',
];
