import Link from "next/link";
import Image from "next/image";

export default function Footer({ brand = "CURA", showSidePadding = false }) {
  if (brand === "MedIntel") {
    return (
      <footer className="bg-surface-container-low py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Image src="/logo.jpg" alt="Cura Logo" width={32} height={32} className="rounded-lg" />
              <span className="font-[Manrope] text-2xl font-bold text-primary">Cura</span>
            </div>
            <p className="text-on-surface-variant text-sm max-w-xs">
              Empowering patients through algorithmic precision and clinical clarity.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Healthcare Provider Portal</Link>
            <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/20 text-center">
          <p className="text-xs text-on-surface-variant opacity-60">© 2024 Medical Intelligence Systems. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`w-full bg-surface-container-low pt-20 pb-12 px-8 ${showSidePadding ? "lg:pl-32" : ""} border-t border-outline-variant/10`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.jpg" alt="Cura Logo" width={36} height={36} className="rounded-lg" />
            <span className="font-[Manrope] font-extrabold text-2xl tracking-tighter text-primary">Cura</span>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The next generation of clinical intelligence. Empowering clinicians and patients with data-driven clarity.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
          <div>
            <h5 className="font-[Manrope] font-bold text-on-surface mb-6">Product</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="#" className="hover:text-primary transition-colors">Trace Engine</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Vault Access</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-[Manrope] font-bold text-on-surface mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Clinical Ethics</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-[Manrope] font-bold text-on-surface mb-6">Legal</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-outline">
        <span>© 2024 Cura Intelligence Systems. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-on-surface">Twitter</Link>
          <Link href="#" className="hover:text-on-surface">LinkedIn</Link>
          <Link href="#" className="hover:text-on-surface">Substack</Link>
        </div>
      </div>
    </footer>
  );
}
