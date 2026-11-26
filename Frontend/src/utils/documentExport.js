/**
 * TrustVault Document Export Utility
 * Simulates verified document downloads with watermark metadata.
 */
export const generateVerifiedDocumentBlob = (document) => {
  const watermarkHeader = '--- TRUSTVAULT VERIFIED ENCRYPTED REPOSITORY ---\n';
  const metadata = `Document: ${document.name}\nCategory: ${document.category}\nID: ${document.id}\nStatus: ${document.status}\nVerified On: ${new Date().toISOString()}\n`;
  const watermarkFooter = '--- END OF VERIFIED CERTIFICATE ---';
  return new Blob([watermarkHeader + metadata + watermarkFooter], { type: 'text/plain' });
};
