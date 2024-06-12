export function applyPagination(documents, page, rowsPerPage) {
  if (documents && documents.length) {
    return documents.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  } else {
    return [];
  }
}
