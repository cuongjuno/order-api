export interface SendEmailData {
  subject: string;
  content: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
}
