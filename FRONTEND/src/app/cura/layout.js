import CuraNavbar from "@/components/CuraNavbar";
import CuraSidebar from "@/components/CuraSidebar";

export default function CuraLayout({ children }) {
  return (
    <>
      <CuraNavbar />
      <CuraSidebar />
      <div className="pt-20 lg:pl-[72px] min-h-screen">
        {children}
      </div>
    </>
  );
}
