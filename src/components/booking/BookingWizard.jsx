import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import GlassCard from "../common/GlassCard";
import Button from "../common/Button";
import "../../styles/bookingWizard.css";

export default function BookingWizard({
  kind = "APPOINTMENT",
  title = "Booking",
  loadData,
  loadSlots,
  onConfirm,
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [form, setForm] = useState({
    appointmentTypeId: "",
    vetId: "",
    petId: "",
    slotDate: "",
    slotId: "",
    appointmentMode: "ONLINE",
    fullName: "",
    phone: "",
    email: "",
    notes: "",
    paymentMethod: "UPI",

    // ✅ added for Other options
    requestTypeName: "",
    otherPetName: "",
  });

  const steps = useMemo(
    () => [
      { key: "service", label: "1. Service" },
      { key: "time", label: "2. Time" },
      { key: "details", label: "3. Details" },
      { key: "payment", label: "4. Payment" },
      { key: "done", label: "5. Done" },
    ],
    []
  );

  // ✅ fallback appointment type suggestions (UI only)
  const fallbackTypeSuggestions = useMemo(
    () => [
      "General Consultation",
      "Vaccination",
      "Grooming",
      "Follow-up",
      "Emergency",
    ],
    []
  );
  // ✅ ADD THIS BLOCK (do not remove anything above)
const fallbackPetSuggestions = useMemo(
  () => [
    { name: "Dog", type: "Dog" },
    { name: "Cat", type: "Cat" },
    { name: "Bird", type: "Bird" },
  ],
  []
);


  useEffect(() => {
    if (!loadData) return;

    let mounted = true;
    (async () => {
      try {
        setBusy(true);
        const data = await loadData();
        if (!mounted) return;

        const types = Array.isArray(data.appointmentTypes) ? data.appointmentTypes : [];
        const vetsData = Array.isArray(data.vets) ? data.vets : [];
        const petsData = Array.isArray(data.pets) ? data.pets : [];

        setAppointmentTypes(types);
        setVets(vetsData);
        setPets(petsData);

        setForm((p) => ({
          ...p,
          appointmentTypeId:
            types?.[0]?.appointment_type_id?.toString?.() ??
            types?.[0]?.appointmentTypeId?.toString?.() ??
            "",
          vetId:
            vetsData?.[0]?.vet_id?.toString?.() ??
            vetsData?.[0]?.vetId?.toString?.() ??
            "",
          petId:
            petsData?.[0]?.pet_id?.toString?.() ??
            petsData?.[0]?.petId?.toString?.() ??
            "",
        }));
      } finally {
        setBusy(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loadData]);

  useEffect(() => {
    if (!loadSlots) return;
    if (!form.vetId || !form.slotDate) return;

    let mounted = true;
    (async () => {
      try {
        setSlotsLoading(true);
        const s = await loadSlots(form.vetId, form.slotDate);
        if (!mounted) return;

        setSlots(s || []);

        const firstAvailable = (s || []).find(
          (x) => x.is_available ?? x.isAvailable ?? true
        );

        setForm((p) => ({
          ...p,
          slotId:
            firstAvailable?.slot_id?.toString?.() ??
            firstAvailable?.slotId?.toString?.() ??
            "",
        }));
      } finally {
        setSlotsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [form.vetId, form.slotDate, loadSlots]);

  const selectedType = appointmentTypes.find(
    (t) =>
      (t.appointment_type_id?.toString?.() ??
        t.appointmentTypeId?.toString?.()) === form.appointmentTypeId
  );

  const selectedVet = vets.find(
    (v) => (v.vet_id?.toString?.() ?? v.vetId?.toString?.()) === form.vetId
  );

  const selectedPet = pets.find(
    (p) => (p.pet_id?.toString?.() ?? p.petId?.toString?.()) === form.petId
  );

  const selectedSlot = slots.find(
    (s) => (s.slot_id?.toString?.() ?? s.slotId?.toString?.()) === form.slotId
  );

  const canNext = useMemo(() => {
    if (step === 0) {
      const typeOk =
        (!!form.appointmentTypeId && form.appointmentTypeId !== "__OTHER_TYPE__") ||
        (form.appointmentTypeId === "__OTHER_TYPE__" && form.requestTypeName.trim().length >= 2);

      const petOk =
        (!!form.petId && form.petId !== "__OTHER__") ||
        (form.petId === "__OTHER__" && form.otherPetName.trim().length >= 2);

      return typeOk && petOk;
    }
    if (step === 1) return !!form.vetId && !!form.slotDate && !!form.slotId;
    if (step === 2) return !!form.fullName && !!form.phone && !!form.email;
    if (step === 3) return !!form.appointmentMode;
    return true;
  }, [step, form]);

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(steps.length - 1, s + 1));

  const [confirmResult, setConfirmResult] = useState({});

  const handleConfirm = async () => {
    if (!onConfirm) return;

    // ✅ If user used "Other Pet", let them add pet manually
    if (form.petId === "__OTHER__") {
      // Save draft so they remember
      sessionStorage.setItem("draft_pet_name", form.otherPetName.trim());
      alert("Please add this pet in Pets section first. We saved the pet name for you.");
      navigate("/app/pets");
      return;
    }

    // ✅ If type is Other, backend needs real appointment_type_id
    if (form.appointmentTypeId === "__OTHER_TYPE__") {
      alert("Please select a valid Appointment Type (Admin can add your requested type later).");
      return;
    }

    try {
      setBusy(true);

      const extraNotes = [];
      if (form.requestTypeName.trim()) extraNotes.push(`Requested type: ${form.requestTypeName.trim()}`);
      const mergedNotes = [form.notes, ...extraNotes].filter(Boolean).join("\n");

      const appointmentPayload = {
        petId: Number(form.petId),
        vetId: Number(form.vetId),
        appointmentTypeId: Number(form.appointmentTypeId),
        slotId: Number(form.slotId),
        appointmentMode: form.appointmentMode,
      };

      const result = await onConfirm({
        kind,
        appointmentPayload,
        notes: mergedNotes,
      });

      setConfirmResult(result || {});
      setStep(4);
    } catch (e) {
      console.error(e);
      alert("Something went wrong while booking. Please check API and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bw-page">
      {/* ✅ Home-like background layers */}
      <div className="bw-bgImage" />
      <div className="bw-overlay" />
      <div className="bw-pattern" />
      <div className="bw-blob1" />
      <div className="bw-blob2" />

      <div className="bw-topbar">
        <button className="bw-homeBtn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <button
          className="bw-homeBtn"
          style={{ marginLeft: "auto" }}
          onClick={() =>
            navigate(kind === "VISIT" ? "/app/visits" : "/app/appointments")
          }
        >
          ← Back to {kind === "VISIT" ? "Visits" : "Appointments"}
        </button>
      </div>

      <div className="bw-container">
        <GlassCard hover={false}>
          <div className="bw-header">
            <div>
              <div className="bw-kicker">
                {kind === "VISIT" ? "Visit Booking" : "Appointment Booking"}
              </div>
              <h2 className="bw-title">{title}</h2>
            </div>

            <div className="bw-pricePill">
              <div className="bw-priceLabel">Duration</div>
              <div className="bw-priceValue">
                {(selectedType?.expected_duration ??
                  selectedType?.expectedDuration ??
                  "--")}{" "}
                min
              </div>
            </div>
          </div>

          <div className="bw-stepper">
            {steps.map((s, idx) => {
              const state = idx < step ? "done" : idx === step ? "active" : "idle";
              return (
                <div key={s.key} className={`bw-step bw-${state}`}>
                  <div className="bw-stepLabel">{s.label}</div>
                  <div className="bw-bar" />
                </div>
              );
            })}
          </div>

          <div className="bw-summary">
            You selected <b>{selectedType?.name ?? (form.appointmentTypeId === "__OTHER_TYPE__" ? (form.requestTypeName || "Other") : "—")}</b>{" "}
            {selectedVet ? (
              <>
                with <b>{selectedVet.name ?? selectedVet.userName ?? "Vet"}</b>
              </>
            ) : null}
            {selectedSlot ? (
              <>
                {" "}
                at <b>{selectedSlot.start_time ?? selectedSlot.startTime}</b> on{" "}
                <b>{form.slotDate}</b>.
              </>
            ) : (
              <>. Choose a time slot to proceed.</>
            )}
          </div>

          <div className="bw-body">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <ServiceStep
                    appointmentTypes={appointmentTypes}
                    fallbackTypeSuggestions={fallbackTypeSuggestions}
                    
  fallbackPetSuggestions={fallbackPetSuggestions}  // ✅ ADD THIS LINE

                    pets={pets}
                    form={form}
                    setForm={setForm}
                    busy={busy}
                    onAddPet={() => {
                      sessionStorage.setItem("draft_pet_name", form.otherPetName.trim());
                     // navigate("/app/pets");
                    }}
                  />
                )}

                {step === 1 && (
                  <TimeStep
                    vets={vets}
                    slots={slots}
                    slotsLoading={slotsLoading}
                    form={form}
                    setForm={setForm}
                    busy={busy}
                  />
                )}

                {step === 2 && <DetailsStep form={form} setForm={setForm} />}

                {step === 3 && (
                  <PaymentStep form={form} setForm={setForm} kind={kind} />
                )}

                {step === 4 && (
                  <DoneStep
                    kind={kind}
                    form={form}
                    selectedType={selectedType}
                    selectedVet={selectedVet}
                    selectedPet={selectedPet}
                    selectedSlot={selectedSlot}
                    confirmResult={confirmResult}
                    onGoList={() =>
                      navigate(kind === "VISIT" ? "/app/visits" : "/app/appointments")
                    }
                    onBookAnother={() =>
                      navigate(kind === "VISIT" ? "/app/visits/book" : "/app/appointments/book")
                    }
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bw-footer">
            <button
              className="bw-back"
              onClick={goBack}
              disabled={step === 0 || step === 4 || busy}
            >
              BACK
            </button>

            {step < 3 && (
              <button className="bw-next" onClick={goNext} disabled={!canNext || busy}>
                NEXT
              </button>
            )}

            {step === 3 && (
              <Button
                variant="paw"
                className="bw-confirm"
                onClick={handleConfirm}
                disabled={!canNext || busy}
              >
                Confirm &amp; Finish
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

function ServiceStep({
  appointmentTypes,
  fallbackTypeSuggestions,
   fallbackPetSuggestions, // ✅ ADD THIS
  pets,
  form,
  setForm,
  busy,
  onAddPet,
}) {
  const hasBackendTypes = Array.isArray(appointmentTypes) && appointmentTypes.length > 0;
  const hasPets = Array.isArray(pets) && pets.length > 0;

  return (
    <div className="bw-grid">
      <div className="bw-row">
        {/* Appointment type */}
        <div className="bw-field">
          <label className="bw-label">Appointment Type</label>

          <select
            className="bw-input"
            value={form.appointmentTypeId}
            disabled={busy}
            onChange={(e) => {
              const val = e.target.value;

              // preset suggestions are encoded like OTHER::Vaccination
              if (val.startsWith("OTHER::")) {
                const name = val.replace("OTHER::", "");
                setForm((p) => ({
                  ...p,
                  appointmentTypeId: "__OTHER_TYPE__",
                  requestTypeName: name,
                }));
                return;
              }

              setForm((p) => ({
                ...p,
                appointmentTypeId: val,
                requestTypeName: val === "__OTHER_TYPE__" ? p.requestTypeName : "",
              }));
            }}
          >
            {hasBackendTypes ? (
              appointmentTypes.map((t) => {
                const id = t.appointment_type_id ?? t.appointmentTypeId;
                return (
                  <option key={id} value={String(id)}>
                    {t.name} ({t.expected_duration ?? t.expectedDuration} min)
                  </option>
                );
              })
            ) : (
              <>
                {/* show helpful defaults even if backend empty */}
                {fallbackTypeSuggestions.map((name) => (
                  <option key={name} value={`OTHER::${name}`}>
                    {name}
                  </option>
                ))}
              </>
            )}

            <option value="__OTHER_TYPE__">Other / Not listed</option>
          </select>

          {form.appointmentTypeId === "__OTHER_TYPE__" && (
            <>
              <div className="bw-helper">
                Type what you need (Admin can add this into appointment types later).
              </div>
              <input
                className="bw-input"
                value={form.requestTypeName}
                disabled={busy}
                onChange={(e) =>
                  setForm((p) => ({ ...p, requestTypeName: e.target.value }))
                }
                placeholder="e.g., Nail trimming / Skin allergy consult"
              />
            </>
          )}

          {!hasBackendTypes && (
            <div className="bw-helper">
              Note: These are suggestions. Actual booking needs appointment types seeded in backend.
            </div>
          )}
        </div>

        {/* Pets */}
        <div className="bw-field">
          <label className="bw-label">Select Pet</label>

          <select
            className="bw-input"
            value={form.petId}
            disabled={busy}
          onChange={(e) => {
  const val = e.target.value;

  // ✅ HANDLE DEFAULT PETS
  if (val.startsWith("OTHER::")) {
    const name = val.replace("OTHER::", "");
    setForm((p) => ({
      ...p,
      petId: "__OTHER__",
      otherPetName: name,
    }));
    return;
  }

  setForm((p) => ({
    ...p,
    petId: val,
    otherPetName: val === "__OTHER__" ? p.otherPetName : "",
  }));
}}
          >
           {hasPets ? (
  pets.map((p) => {
    const id = p.pet_id ?? p.petId;
    return (
      <option key={id} value={String(id)}>
        {p.name} ({p.type ?? "Pet"})
      </option>
    );
  })
) : (
  <>
    {/* ✅ DEFAULT PET OPTIONS */}
    {fallbackPetSuggestions.map((p) => (
      <option key={p.name} value={`OTHER::${p.name}`}>
        {p.name} (General)
      </option>
    ))}
  </>
)}


            <option value="__OTHER__">Other / New Pet</option>
          </select>

          {form.petId === "__OTHER__" && (
            <>
              <div className="bw-helper">
                Enter pet name and add it properly in Pets section.
              </div>
              <input
                className="bw-input"
                value={form.otherPetName}
                disabled={busy}
                ange={(e) =>
                  setForm((p) => ({ ...p, otherPetName: e.target.value }))
                }onCh
                placeholder="Pet name (e.g., Bruno)"
              />

              <button
                type="button"
                className="bw-miniBtn"
                disabled={busy || form.otherPetName.trim().length < 2}
                onClick={onAddPet}
              >
                + Add this pet in Pets page
              </button>
            </>
          )}
        </div>

        {/* Mode */}
        <div className="bw-field">
          <label className="bw-label">Mode</label>
          <select
            className="bw-input"
            value={form.appointmentMode}
            disabled={busy}
            onChange={(e) =>
              setForm((p) => ({ ...p, appointmentMode: e.target.value }))
            }
          >
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>

          <div className="bw-helper">
            ONLINE = tele-consult, OFFLINE = clinic visit.
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeStep({ vets, slots, slotsLoading, form, setForm, busy }) {
  return (
    <div className="bw-grid">
      <div className="bw-row">
        <div className="bw-field">
          <label className="bw-label">Select Vet</label>
          <select
            className="bw-input"
            value={form.vetId}
            disabled={busy}
            onChange={(e) =>
              setForm((p) => ({ ...p, vetId: e.target.value, slotId: "" }))
            }
          >
            {vets.map((v) => {
              const id = v.vet_id ?? v.vetId;
              return (
                <option key={id} value={String(id)}>
                  {v.name ?? v.userName ?? `Vet #${id}`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="bw-field">
          <label className="bw-label">Date</label>
          <input
            className="bw-input"
            type="date"
            value={form.slotDate}
            disabled={busy}
            onChange={(e) =>
              setForm((p) => ({ ...p, slotDate: e.target.value, slotId: "" }))
            }
          />
        </div>

        <div className="bw-field">
          <label className="bw-label">Slot</label>
          <select
            className="bw-input"
            value={form.slotId}
            disabled={busy || slotsLoading}
            onChange={(e) => setForm((p) => ({ ...p, slotId: e.target.value }))}
          >
            <option value="">
              {slotsLoading ? "Loading slots..." : "Select slot"}
            </option>
            {slots.map((s) => {
              const id = s.slot_id ?? s.slotId;
              const available = s.is_available ?? s.isAvailable ?? true;
              const start = s.start_time ?? s.startTime;
              const end = s.end_time ?? s.endTime;

              return (
                <option key={id} value={String(id)} disabled={!available}>
                  {start} - {end} {available ? "" : "(Booked)"}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="bw-slotGrid">
        {(slots || []).map((s) => {
          const id = s.slot_id ?? s.slotId;
          const available = s.is_available ?? s.isAvailable ?? true;
          const start = s.start_time ?? s.startTime;

          return (
            <button
              key={id}
              type="button"
              className={`bw-slot ${String(id) === form.slotId ? "active" : ""}`}
              disabled={!available || busy}
              onClick={() => setForm((p) => ({ ...p, slotId: String(id) }))}
            >
              {start}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailsStep({ form, setForm }) {
  return (
    <div className="bw-grid">
      <div className="bw-row">
        <div className="bw-field">
          <label className="bw-label">Full name</label>
          <input
            className="bw-input"
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Your full name"
          />
        </div>

        <div className="bw-field">
          <label className="bw-label">Phone</label>
          <input
            className="bw-input"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder="98xxxxxxxx"
          />
        </div>

        <div className="bw-field">
          <label className="bw-label">Email</label>
          <input
            className="bw-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="bw-field">
        <label className="bw-label">Notes</label>
        <textarea
          className="bw-textarea"
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          placeholder="Symptoms / requirements / special instructions..."
          rows={5}
        />
      </div>
    </div>
  );
}

function PaymentStep({ form, setForm, kind }) {
  return (
    <div className="bw-grid">
      <div className="bw-payBox">
        <div className="bw-payTitle">Payment</div>
        <div className="bw-payMeta">
          (Demo) Choose a payment method — real integration can be added later.
        </div>

        <div className="bw-payMethods">
          {[
            { id: "UPI", label: "UPI" },
            { id: "CARD", label: "Card" },
            { id: "CASH", label: "Cash at Clinic" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              className={`bw-payMethod ${form.paymentMethod === m.id ? "active" : ""}`}
              onClick={() => setForm((p) => ({ ...p, paymentMethod: m.id }))}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="bw-payHint">
          {kind === "VISIT"
            ? "A visit record will be created after appointment booking (schema-required)."
            : "Appointment will be booked and slot will be reserved."}
        </div>
      </div>
    </div>
  );
}

function DoneStep({
  kind,
  form,
  selectedType,
  selectedVet,
  selectedPet,
  selectedSlot,
  confirmResult,
  onGoList,
  onBookAnother,
}) {
  return (
    <div className="bw-done">
      <div className="bw-doneBadge">Done</div>

      <h3 className="bw-doneTitle">
        {kind === "VISIT" ? "Visit booked successfully" : "Appointment booked successfully"}
      </h3>

      <div className="bw-doneCard">
        <div><b>Appointment ID:</b> {confirmResult.appointmentId ?? "—"}</div>
        {kind === "VISIT" && <div><b>Visit ID:</b> {confirmResult.visitId ?? "—"}</div>}
        <div><b>Type:</b> {selectedType?.name ?? "—"}</div>
        <div><b>Pet:</b> {selectedPet?.name ?? "—"}</div>
        <div><b>Vet:</b> {selectedVet?.name ?? selectedVet?.userName ?? "—"}</div>
        <div><b>Date:</b> {form.slotDate || "—"}</div>
        <div><b>Time:</b> {selectedSlot?.start_time ?? selectedSlot?.startTime ?? "—"}</div>
        <div><b>Mode:</b> {form.appointmentMode}</div>
      </div>

      <div className="bw-doneActions">
        <button className="bw-next" onClick={onGoList}>Go to List</button>
        <button className="bw-back" onClick={onBookAnother}>Book Another</button>
      </div>
    </div>
  );
}
