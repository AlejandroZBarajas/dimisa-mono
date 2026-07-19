import { useState } from "react";

import logo_header from '../../assets/logo_header.png'
import type SalidaDTO from "../../../entities/salida_DTO";

interface Props {
  salida: SalidaDTO;
}

export default function SalidaParaImprimir({ salida }: Props) {
  const [open, setOpen] = useState(false);

function handleImprimir() {
  const ventana = window.open("", "_blank");
  if (!ventana) return;
  ventana.document.write(`
    <html>
      <head>
        <style>
          @page {
            margin: 8mm;
            size: auto;
          }
          @media print {
            body {
              margin: 0;
            }
            header, footer {
              display: none;
            }
          }
          body { 
            font-family: Arial, sans-serif; 
            padding: 8px;
            font-size: 10px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table { 
            border: 1px solid #000; 
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
            border: 1px solid #000;
          }
          tr{
            border: 1px solid #000;
          }
          h2 { 
            margin-bottom: 5px; 
            font-size: 14px;
          }
          p { 
            margin: 2px 0; 
            font-size: 10px;
          }
          .firmas-container{
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            page-break-inside: avoid;
          }
          .headers-container {
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .firma-box, .header-box {
            width: 45%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .cantidades{
            text-align: center;
            width:50px;
          }
          .headers-container{
            width: 100%;
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
          header{
          display:flex;
          flex-direction: row;
          }
          img{
          width:200px;
          }
        </style>
      </head>
      
      <body>
      <header>
        <div class="headers-container">
          <div class="header-box">
            <img src=${logo_header}>
          </div>
          <div class="header-box">
            <p class="firma-texto"><strong>IMSS BIENESTAR</strong></p>
            <p class="firma-texto">HOSPITAL CHIAPAS NOS UNE</p>
            <p class="firma-texto">DR JESÚS GILBERTO GÓMEZ MAZA</p>
            <p class="firma-texto">COORDINACIÓN DE UNIDOSIS</p>
            <p class="firma-texto">INSTITUTO DE SALUD</p>
          </div>
          <div class="header-box">
            <h2>Colectivo: ${salida.folio}</h2>
            <p><strong>Fecha de captura:</strong> ${salida.fecha}</p>
            <p><strong>Cendis que solicita:</strong></p>
            <p><strong></strong> ${salida.area}</p>
            
          </div>
        </div>
      </header>
        <table>
          <thead>
            <tr>
              <th>Clave</th>
              <th>Descripción</th>
              /* <th class="cantidades" >Cantidad solicitada</th> */
              <th class="cantidades" >Cantidad surtida</th>
            </tr>
          </thead>
          <tbody>
          ${salida.claves.map(d => `
                        <tr>
                          <td>${d.clave}</td>
                          <td>${d.descripcion}</td>
                          <td class="cantidades" >${d.cantidad}</td>
                        </tr>
                      `).join("")}
          </tbody>
        </table>
        
        <div class="firmas-container">
          <div class="firma-box">
            <div class="firma-linea"></div>
            <p class="firma-texto"><strong>Generado por:</strong> ${salida.usuario}</p>
          </div>
          <div class="firma-box">
            <div class="firma-linea"></div>
            <p class="firma-texto">Nombre completo y firma de quien recibe en almacén</p>
          </div>
        </div>
      </body>
    </html>
  `);
  ventana.document.close();
  ventana.print();
}

  return (
    <div className="border rounded-lg shadow p-4 mb-4 w-1/2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h3 className="font-bold text-lg">Folio: {salida.folio}</h3>
          <p>Fecha: {salida.fecha}</p>
          <p>Generado por: {salida.usuario}</p>
        </div>
        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
          {open ? "Cerrar" : "Abrir"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Clave</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Cantidad solicitada</th>
              </tr>
            </thead>
            <tbody>
              {salida.claves.map((d) => (
                <tr key={d.id_salida_detalle}>
                  <td className="border p-2">{d.clave}</td>
                  <td className="border p-2">{d.descripcion}</td>
                  <td className="border p-2 text-center">{d.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleImprimir}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
