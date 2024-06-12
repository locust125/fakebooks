import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

export async function exportDataToXlsx(DataToExport = null) {
  if (!DataToExport || DataToExport === null)
    throw new Error('Data to export is necesary');

  return await XlsxPopulate.fromBlankAsync().then(workbook => {
    workbook.sheet(0).cell('A1').value(DataToExport);
    return workbook.outputAsync();
  });
}
