import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Summary = {
  users: number;
  groups: number;
  studies: number;
  visits: number;
};

type Group = { name: string };
type Study = { lesson: string; date: string; group?: { name: string } };
type Visit = { firstName: string; lastName: string; date: string };

export function generateSummaryPdf(
  summary: Summary,
  groups: Group[],
  studies: Study[],
  visits: Visit[],
) {
  const doc = new jsPDF();
  const now = new Date();

  doc.setFontSize(16);
  doc.text('Reporte Iglesia Adventista', 14, 18);
  doc.setFontSize(10);
  doc.text(`Generado: ${now.toLocaleString()}`, 14, 24);

  doc.setFontSize(12);
  doc.text(`Grupos: ${summary.groups}`, 14, 36);
  doc.text(`Estudios: ${summary.studies}`, 14, 42);
  doc.text(`Visitas: ${summary.visits}`, 14, 48);
  doc.text(`Usuarios: ${summary.users}`, 14, 54);

  autoTable(doc, {
    head: [['Grupos (nombre)']],
    body: groups.map((group) => [group.name]),
    startY: 62,
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [['Lección', 'Fecha', 'Grupo']],
    body: studies.map((study) => [
      study.lesson,
      new Date(study.date).toLocaleDateString(),
      study.group?.name ?? 'Sin grupo',
    ]),
    startY: (doc as any).lastAutoTable.finalY + 6,
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [['Nombre', 'Fecha']],
    body: visits.map((visit) => [
      `${visit.firstName} ${visit.lastName}`,
      new Date(visit.date).toLocaleDateString(),
    ]),
    startY: (doc as any).lastAutoTable.finalY + 6,
    styles: { fontSize: 9 },
  });

  doc.save(`reporte-iglesia-${now.toISOString().slice(0, 10)}.pdf`);
}
