import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (title, fileName, columns, rows, columnStyles = {}) => {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Estilos del título
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");

  // Centrar el título
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 20);

  // Configuración de la tabla
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 30,
    margin: { horizontal: 10 },
    styles: {
      cellPadding: 2,
      fontSize: 10,
      valign: 'middle',
      overflow: 'linebreak',
      halign: 'center',
    },
    headStyles: {
      fillColor: [33, 150, 243], // Azul MUI
      textColor: 255,
      fontSize: 11,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles,
    didDrawPage: (data) => {
      // Footer con paginación
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const pageCount = doc.internal.getNumberOfPages();
      doc.text(
        `Página ${data.pageNumber} de ${pageCount}`,
        pageWidth - 50,
        pageHeight - 10
      );
    }
  });

  // Guardar el PDF con el nombre correspondiente
  doc.save(`${fileName}.pdf`);
};

export const generateEmployeePDF = (columns, rows) => {
  generatePDF("Listado Completo de Empleados", "listado-empleados", columns, rows, {
    0: { halign: 'center' }, // ID
    3: { halign: 'right' },  // Salario
    4: { halign: 'center' }, // Fecha
  });
};

export const generateDepartmentPDF = (columns, rows) => {
  generatePDF("Listado de Departamentos", "listado-departamentos", columns, rows, {
    0: { halign: 'center' }, // ID
    2: { halign: 'center' }, // Ubicación
    3: { halign: 'right' },  // Presupuesto
    4: { halign: 'center' }, // Fecha de Creación
  });
};
