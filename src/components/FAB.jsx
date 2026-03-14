export default function FAB({ label = "View All Sources" }) {
  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button className="h-[56px] px-8 bg-primary text-on-primary rounded-full shadow-[0_8px_24px_rgba(0,96,103,0.3)] flex items-center gap-3 font-bold hover:scale-105 transition-transform active:scale-95">
        <span className="material-symbols-outlined">list</span>
        {label}
      </button>
    </div>
  );
}
