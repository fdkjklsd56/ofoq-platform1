export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-[#08080e] p-6 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-[#e2e8f0]">لوحة المعلم</h1>
        <button className="bg-[#7c3aed] text-white px-3 py-1.5 rounded-xl text-xs font-medium">+ إضافة كورس</button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#12121c] border border-white/10 p-4 rounded-xl text-center">
          <p className="text-xs text-[#64748b] mb-1">الطلاب النشطون</p>
          <h3 className="text-lg font-bold text-[#e2e8f0]">120 طالب</h3>
        </div>
        <div className="bg-[#12121c] border border-white/10 p-4 rounded-xl text-center">
          <p className="text-xs text-[#64748b] mb-1">الكورسات المنشورة</p>
          <h3 className="text-lg font-bold text-[#e2e8f0]">4 كورسات</h3>
        </div>
      </div>

      {/* الشروحات النشطة */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#e2e8f0]">الكورسات والشروحات الحالية</h3>
        <div className="bg-[#12121c] border border-white/10 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#e2e8f0]">أساسيات الفيزياء الحديثة</span>
            <span className="text-[10px] text-green-400 bg-green-950/30 px-2 py-0.5 rounded">نشط</span>
          </div>
          <p className="text-[10px] text-[#64748b]">45 طالب مسجل في هذا الكورس</p>
        </div>
      </div>
    </div>
  );
}