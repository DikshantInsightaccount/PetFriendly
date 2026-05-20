import jsPDF from "jspdf";

export function downloadPrescriptionPdf({ pet, visit }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;

  // Colors for text contrast
  const dark = "#1f2937";
  const gray = "#374151";

  /** ===========================
   *  BACKGROUND IMAGE (FULL PAGE)
   *  =========================== */
  try {
    doc.addImage(
      "/images/prescription-bg.png",
      "PNG",
      0,
      0,
      PAGE_WIDTH,
      PAGE_HEIGHT
    );
  } catch (e) {
    console.warn("Prescription background not found", e);
  }

  /** ===========================
   *  CONTENT START POSITION
   *  =========================== */
  let y = 55; // start lower to avoid logo/title already in image
  const left = 25;
  const right = PAGE_WIDTH - 25;

  /** ===========================
   *  TITLE
   *  =========================== */
  doc.setFontSize(16);
  doc.setTextColor(dark);
  doc.text("Veterinary Prescription", PAGE_WIDTH / 2, y, {
    align: "center",
  });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(gray);
  doc.text(`Issued on: ${new Date().toLocaleString()}`, PAGE_WIDTH / 2, y, {
    align: "center",
  });
  y += 14;

  /** ===========================
   *  PET DETAILS
   *  =========================== */
  doc.setFontSize(12);
  doc.setTextColor(dark);
  doc.text("Pet Details", left, y);
  y += 8;

  doc.setFontSize(10);
  doc.text(`Name: ${pet?.name ?? "—"}`, left, y);
  doc.text(`Type: ${pet?.type ?? "—"}`, right - 60, y);
  y += 6;

  doc.text(`Breed: ${pet?.breed ?? "—"}`, left, y);
  doc.text(
    `Appointment ID: ${visit.appointmentId ?? visit.appointment_id}`,
    right - 60,
    y
  );
  y += 14;

  /** ===========================
   *  CLINICAL NOTES
   *  =========================== */
  doc.setFontSize(12);
  doc.text("Clinical Notes", left, y);
  y += 10;

  writeRow("Diagnosis", visit.diagnosis);
  writeRow("Treatment", visit.treatment);
  writeRow("Prescription", visit.prescription);
  writeRow("Additional Notes", visit.notes);

  function writeRow(label, value) {
    doc.setFontSize(10);
    doc.setTextColor(gray);
    doc.text(`${label}:`, left, y);

    doc.setTextColor(dark);
    doc.text(value || "—", left + 40, y, {
      maxWidth: right - left - 40,
    });

    y += 10;
  }

  /** ===========================
   *  SIGNATURE AREA (BOTTOM)
   *  =========================== */
  y = 245;

  doc.setFontSize(10);
  doc.setTextColor(gray);
  doc.text("Authorized Veterinary Doctor", left, y);
  y += 8;

  doc.setTextColor(dark);
  doc.text("Signature: ____________________________", left, y);

  /** ===========================
   *  FILE SAVE
   *  =========================== */
  const fileName = `Prescription_${pet?.name ?? "Pet"}_Appt_${
    visit.appointmentId ?? visit.appointment_id
  }.pdf`;

  doc.save(fileName);
}