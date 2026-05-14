import jsPDF from "jspdf";

export function downloadPrescriptionPdf({ pet, visit }) {
  const doc = new jsPDF();

  /** ---------------------------
   *  COLORS & LAYOUT
   *  --------------------------- */
  const primary = "#1d4ed8";
  const gray = "#374151";
  const lightGray = "#e5e7eb";

  let y = 20;

  /** ---------------------------
   *  LOGO + CLINIC HEADER
   *  --------------------------- */
  try {
    doc.addImage("/images/logo.png", "PNG", 14, y - 10, 30, 30);
  } catch {
    // logo optional – no crash
  }

//   doc.setFontSize(20);
//   doc.setTextColor(primary);
//   doc.text("PetClinic", 50, y);

//   doc.setFontSize(10);
//   doc.setTextColor(gray);
//   doc.text("www.petclinic.com", 50, y + 6);
//   doc.text("Care • Trust • Compassion", 50, y + 12);

  y += 22;

  doc.setDrawColor(lightGray);
  doc.line(14, y, 196, y);
  y += 10;

  /** ---------------------------
   *  PRESCRIPTION TITLE
   *  --------------------------- */
  doc.setFontSize(16);
  doc.setTextColor("#000");
  doc.text("Veterinary Prescription", 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(gray);
  doc.text(`Issued on: ${new Date().toLocaleString()}`, 14, y);
  y += 10;

  /** ---------------------------
   *  PET INFORMATION BOX
   *  --------------------------- */
  doc.setDrawColor(primary);
  doc.rect(14, y, 182, 28);

  doc.setFontSize(12);
  doc.setTextColor(primary);
  doc.text("Pet Details", 16, y + 7);

  doc.setFontSize(10);
  doc.setTextColor(gray);

  doc.text(`Name: ${pet?.name ?? "—"}`, 16, y + 14);
  doc.text(`Type: ${pet?.type ?? "—"}`, 90, y + 14);

  doc.text(`Breed: ${pet?.breed ?? "—"}`, 16, y + 21);
  doc.text(`Appointment ID: ${visit.appointmentId ?? visit.appointment_id}`, 90, y + 21);

  y += 36;

  /** ---------------------------
   *  PRESCRIPTION CONTENT BOX
   *  --------------------------- */
  doc.setDrawColor(primary);
  doc.rect(14, y, 182, 90);

  doc.setFontSize(12);
  doc.setTextColor(primary);
  doc.text("Clinical Notes", 16, y + 8);

  doc.setFontSize(10);
  doc.setTextColor("#000");

  y += 16;

  writeRow("Diagnosis", visit.diagnosis);
  writeRow("Treatment", visit.treatment);
  writeRow("Prescription", visit.prescription);
  writeRow("Additional Notes", visit.notes);

  function writeRow(label, value) {
    doc.setTextColor(gray);
    doc.text(`${label}:`, 16, y);

    doc.setTextColor("#000");
    doc.text(value || "—", 60, y, { maxWidth: 120 });

    y += 12;
  }

  y += 10;

  /** ---------------------------
   *  FOOTER DISCLAIMER
   *  --------------------------- */
  doc.setDrawColor(lightGray);
  doc.line(14, 270, 196, 270);

  doc.setFontSize(9);
  doc.setTextColor(gray);

  doc.text(
    "This document is a confidential veterinary prescription intended only for the pet owner.",
    14,
    277
  );
  doc.text(
    "Not valid without an authorized veterinary consultation.",
    14,
    282
  );

  /** ---------------------------
   *  SAVE FILE
   *  --------------------------- */
  const fileName = `Prescription_${pet?.name ?? "Pet"}_Appt_${
    visit.appointmentId ?? visit.appointment_id
  }.pdf`;

  doc.save(fileName);
}
