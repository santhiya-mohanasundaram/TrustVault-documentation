/**
 * TrustVault Search Utilities
 * Implements debounced text matching for document title and metadata.
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const filterDocumentsByQuery = (docs, query) => {
  if (!query) return docs;
  const q = query.toLowerCase();
  return docs.filter(d => 
    d.name.toLowerCase().includes(q) || 
    (d.documentNumber && d.documentNumber.toLowerCase().includes(q)) ||
    (d.category && d.category.toLowerCase().includes(q))
  );
};
