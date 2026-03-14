import MedIntelNavbar from "@/components/MedIntelNavbar";

export default function PatientLayout({ children }) {
  return (
    <>
      <MedIntelNavbar />
      {children}
    </>
  );
}
