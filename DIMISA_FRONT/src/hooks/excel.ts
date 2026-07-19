import * as XLSX from "xlsx"

export const useExcelExport = () => {
  const exportar = (datos: object[], nombreArchivo: string, nombreHoja: string) => {
    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, nombreHoja)
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`)
  }

  return { exportar }
}