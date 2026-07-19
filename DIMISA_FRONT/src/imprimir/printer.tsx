export function PrintColSal(html: string): void {
  const ventana = window.open("", "_blank");
  if (!ventana) {
    alert("No se pudo abrir la ventana de impresión. Verifica que no esté bloqueada por el navegador.");
    return;
  }

  ventana.document.write(html);
  ventana.document.close();

  setTimeout(() => {
    ventana.focus();
    ventana.print();
  }, 1000);
}