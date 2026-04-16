export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">science</span>
          </span>
          <span className="font-headline font-black text-xl text-slate-900">مختبر الفيزياء</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-slate-400 hover:text-primary transition-all font-black text-sm" href="#">
            الخصوصية
          </a>
          <a className="text-slate-400 hover:text-primary transition-all font-black text-sm" href="#">
            الشروط
          </a>
          <a className="text-slate-400 hover:text-primary transition-all font-black text-sm" href="#">
            الدعم
          </a>
        </div>
        <p className="text-slate-300 text-xs font-semibold">
          © {new Date().getFullYear()} مختبر الفيزياء. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}

