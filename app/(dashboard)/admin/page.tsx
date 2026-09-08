export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#08080e] p-6 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-[#e2e8f0]">لوحة الإدارة العامة</h1>
        <span className="text-xs text-[#64748b] bg-[#12121c] px-3 py-1.5 rounded-xl border border-white/10">⚙️ إعدادات</span>
      </div>

      {/* إحصائيات المنصة */}
      <div className="bg-[#12121c] border border-white/10 p-4 rounded-2xl space-y-2">
        <p className="text-xs text-[#64748b]">إجمالي مستخدمي المنصة</p>
        <h3 className="text-2xl font-bold text-[#e2e8f0]">5,420 مستخدم</h3>
        <p className="text-[10px] text-purple-400">↑ نمو بنسبة 14% هذا الشهر</p>
      </div>

      {/* إدارة المستخدمين سريعة */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#e2e8f0]">مراجعة المحتوى الجديد</h3>
        <div className="bg-[#12121c] border border-white/10 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-[#e2e8f0]">كورس الرياضيات المتقدمة</p>
              <p className="text-[10px] text-[#64748b]">بواسطة د. سامي</p>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <button className="px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] rounded-lg">رفض</button>
              <button className="px-2.5 py-1 bg-[#7c3aed] text-white text-[10px] rounded-lg">اعتماد</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}