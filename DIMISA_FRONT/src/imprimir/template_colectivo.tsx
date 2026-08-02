import logo_header from "./../assets/logo_header.png"

interface TemplateData {
  encabezado: string | ""
  tipo_nombre: string | "";
  folio?: string;
  fecha: string;
  usuario_nombre: string;
  cendis_nombre: string;
  lista: {
    clave: string | "";
    descripcion: string | "";
    cantidad: number | 0;
    piezas_esperadas: number |  null;
    piezas_recibidas: number | null;
  }[];
}
export function TemplateColectivo(data: TemplateData): string {

  const mostrarPiezas = data.lista.some(
  item =>
    item.piezas_esperadas != null ||
    item.piezas_recibidas != null
);
  return `
    <html>
      <head>
        <style>
          @page {
            margin: 8mm;
            size: auto;
          }
          @media print {
            body { margin: 0; }
            header, footer { display: none; }
          }
          body { 
            font-family: Arial, sans-serif; 
            padding: 8px;
            font-size: 10px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
          }
          th, td { 
            border: 1px solid #000;
            padding: 4px; 
            text-align: left; 
            font-size: 9px;
          }
          th { 
            background-color: #f0f0f0; 
          }
          h2 { 
            margin-bottom: 5px; 
            font-size: 14px;
          }
          p { 
            margin: 2px 0; 
            font-size: 10px;
          }
          .header-cell {
            padding: 0 0 6px 0;
            border: none !important;
          }
          .header-row-inner {
            display: flex;
            flex-direction: row;
            width: 100%;
          }
          .header-box {
            width: 33%; 
            padding: 8px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center; 
            align-items: center;     
          }
          .firmas-container {
            display: flex;
            justify-content: space-between;
            padding-top: 55px;
          }
          .firma-box {
            width: 45%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .firma-linea {
            width: 80%;
            border-top: 1px solid #000;
            margin-bottom: 5px;
          }
          .firma-texto {
            text-align: center;
            font-size: 9px;
          }
          .cantidades {
            text-align: center;
            width: 50px;
          }
          .no-border {
            border: none !important;
            padding: 0 !important;
          }
          tbody tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          img {
            width: 200px;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <td colspan="4" class="header-cell">
                <div class="header-row-inner">
                  <div class="header-box">
                    <img src="${logo_header}">
                  </div>
                  <div class="header-box">
                    <p class="firma-texto"><strong>IMSS BIENESTAR</strong></p>
                    <p class="firma-texto">HOSPITAL CHIAPAS NOS UNE</p>
                    <p class="firma-texto">DR JESÚS GILBERTO GÓMEZ MAZA</p>
                    <p class="firma-texto">COORDINACIÓN DE UNIDOSIS</p>
                    <p class="firma-texto">INSTITUTO DE SALUD</p>
                  </div>
                  <div class="header-box">
                    <h2>${data.folio}</h2>
                    <p><strong>Fecha:</strong> ${data.fecha}</p>
                    <p><strong>${data.encabezado} de: ${data.tipo_nombre}</strong></p>
                    <h2><strong>Cendis:</strong> ${data.cendis_nombre}</h2>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
            
            ${
              mostrarPiezas
              ? `
                    <th>Clave</th>
                    <th>Descripción</th>
                    <th class="cantidades">Cantidad solicitada</th>
                    <th class="cantidades">Piezas esperadas</th>
                    <th class="cantidades">Piezas recibidas</th>
                  `
                  : `
                    <th>Clave</th>
                    <th>Descripción</th>
                    <th class="cantidades">Cantidad solicitada</th>
                    <th class="cantidades">Cantidad surtida</th>
                  `
              }
            </tr>
          </thead>

          <!-- tfoot ANTES de tbody: Chromium lo renderiza abajo pero lo procesa primero -->
          <tfoot>
            <tr>
              <td colspan="4" class="no-border">
                <div class="firmas-container">
                  <div class="firma-box">
                    <div class="firma-linea"></div>
                    <p class="firma-texto"><strong>Generado por:</strong> ${data.usuario_nombre}</p>
                  </div>
                  <div class="firma-box">
                    <div class="firma-linea"></div>
                    <p class="firma-texto">Nombre completo y firma de quien recibe en almacén</p>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>

          <tbody>
            <tr>


              ${data.lista
                .map(
                  item => `
                    <tr>
                      <td>${item.clave}</td>
                      <td>${item.descripcion}</td>
                      <td class="cantidades">${item.cantidad}</td>

                      ${
                        mostrarPiezas
                          ? `
                            <td class="cantidades">${item.piezas_esperadas ?? ""}</td>
                            <td class="cantidades">${item.piezas_recibidas ?? ""}</td>
                          `
                          : `
                            <td class="cantidades"></td>
                          `
                      }
                    </tr>
                  `,
                )
                .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
}