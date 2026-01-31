
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, ArrowLeft, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Newspaper, Globe, Camera, BarChart
} from 'lucide-react';
import { AdminSubSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment, NewsItem, GlobalStats, LocalizedText } from '../types';

interface AdminPanelProps {
  courses: Course[];
  achievements: Achievement[];
  news: NewsItem[];
  globalStats: GlobalStats;
  teacherImage: string;
  contactInfo: ContactInfo;
  messages: ContactMessage[];
  enrollments: CourseEnrollment[];
  onUpdateTeacherImage: (url: string) => void;
  onUpdateContactInfo: (info: ContactInfo) => void;
  onUpdateGlobalStats: (stats: GlobalStats) => void;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onAddAchievement: (ach: Achievement) => void;
  onUpdateAchievement: (ach: Achievement) => void;
  onDeleteAchievement: (id: string) => void;
  onAddNews: (item: NewsItem) => void;
  onUpdateNews: (item: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onDeleteEnrollment: (id: string) => void;
  onExit: () => void;
}

const emptyLocalized = (): LocalizedText => ({ uz: '', ru: '', en: '' });

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminSubSection>(AdminSubSection.DASHBOARD);
  
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});

  const [contactForm, setContactForm] = useState<ContactInfo>(props.contactInfo);
  const [statsForm, setStatsForm] = useState<GlobalStats>(props.globalStats);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'course' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        if (target === 'course') setCourseForm(p => ({ ...p, image: url }));
        else if (target === 'profile') props.onUpdateTeacherImage(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const SidebarBtn = ({ id, icon: Icon, label, count }: any) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
      <div className="flex items-center gap-3"><Icon size={18}/><span className="text-sm font-bold">{label}</span></div>
      {count !== undefined && count > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === id ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>{count}</span>}
    </button>
  );

  const LocalizedInput = ({ label, value, onChange, isTextArea = false }: { label: string, value: LocalizedText, onChange: (val: LocalizedText) => void, isTextArea?: boolean }) => (
    <div className="space-y-4 p-6 bg-slate-50 rounded-[32px] border border-slate-200">
      <div className="flex items-center gap-2 mb-2"><Globe size={14} className="text-indigo-600" /><p className="text-[10px] font-black uppercase text-slate-400">{label}</p></div>
      <div className="space-y-3">
        {(['uz', 'ru', 'en'] as const).map((l) => (
          <div key={l} className="flex gap-3 items-center">
            <span className="w-8 shrink-0 font-black text-[10px] uppercase text-slate-400">{l}</span>
            {isTextArea ? (
              <textarea className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" rows={3} value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
            ) : (
              <input className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-72 bg-white border-r fixed inset-y-0 left-0 z-50 flex flex-col shadow-xl">
        <div className="p-8 flex items-center gap-3 text-indigo-600 font-black text-xl"><Code2 /><span>ADMIN</span></div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Boshqaruv" />
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar" />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil" />
        </nav>
        <div className="p-6 border-t"><button onClick={props.onExit} className="w-full flex items-center justify-center gap-2 bg-slate-100 p-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"><ArrowLeft size={16}/> Chiqish</button></div>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
          
          {activeTab === AdminSubSection.DASHBOARD && (
            <div className="animate-fadeIn space-y-12">
              <h1 className="text-4xl font-black mb-8">Markaz statistikasi</h1>
              <div className="grid grid-cols-4 gap-6">
                {[ 
                  { label: 'Kurslar', val: props.courses.length, icon: BookOpen }, 
                  { label: 'Arizalar', val: props.enrollments.length, icon: UserCheck }, 
                  { label: 'Xabarlar', val: props.messages.length, icon: MessageSquare }, 
                  { label: 'Yangiliklar', val: props.news.length, icon: Newspaper } 
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <s.icon className="text-indigo-600 mb-4" size={24}/>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className="text-3xl font-black mt-2">{s.val}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl space-y-8">
                <div className="flex items-center gap-3 mb-4"><BarChart className="text-indigo-600" /><h3 className="text-2xl font-black">Asosiy ko'rsatkichlar</h3></div>
                <div className="grid grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className="space-y-4">
                      <LocalizedInput label={`Statistika ${num} nomi`} value={(statsForm as any)[`stat${num}Label`]} onChange={v => setStatsForm({...statsForm, [`stat${num}Label`]: v})} />
                      <input value={(statsForm as any)[`stat${num}Value`]} onChange={e => setStatsForm({...statsForm, [`stat${num}Value`]: e.target.value})} placeholder="Qiymat (masalan: 98%)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                    </div>
                  ))}
                </div>
                <button onClick={() => props.onUpdateGlobalStats(statsForm)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">Statistikani yangilash</button>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="animate-fadeIn space-y-8">
              <div className="flex justify-between items-center"><h2 className="text-3xl font-black">Kurslarni tahrirlash</h2><button onClick={() => { setEditingCourse(null); setCourseForm({ title: emptyLocalized(), description: emptyLocalized(), category: emptyLocalized(), duration: emptyLocalized(), students: 0, content: emptyLocalized(), image: '' }); setShowCourseModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"><Plus size={18}/> Yangi Kurs</button></div>
              <div className="grid grid-cols-2 gap-6">
                {props.courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4"><img src={c.image || 'https://via.placeholder.com/64'} className="w-16 h-16 rounded-xl object-cover" /><h4 className="font-bold line-clamp-1">{c.title?.uz || 'Nomsiz kurs'}</h4></div>
                    <div className="flex gap-2"><button onClick={() => { setEditingCourse(c); setCourseForm(c); setShowCourseModal(true); }} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"><Edit3 size={16}/></button><button onClick={() => { if(confirm('Kurs o\'chirilsinmi?')) props.onDeleteCourse(c.id); }} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"><Trash2 size={16}/></button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.CONTACT_MGMT && (
            <div className="animate-fadeIn space-y-8">
              <h2 className="text-3xl font-black">Markaz kontaktlari</h2>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-8 max-w-3xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Aloqa ma'lumotlari</p>
                    <input value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} placeholder="Manzil" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    <input value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="Email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="Telefon" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Ijtimoiy tarmoqlar</p>
                    <input value={contactForm.instagram} onChange={e => setContactForm({...contactForm, instagram: e.target.value})} placeholder="Instagram link" className="w-full p-4 bg-pink-50 border border-pink-100 rounded-xl outline-none" />
                    <input value={contactForm.telegram} onChange={e => setContactForm({...contactForm, telegram: e.target.value})} placeholder="Telegram link" className="w-full p-4 bg-blue-50 border border-blue-100 rounded-xl outline-none" />
                    <input value={contactForm.youtube} onChange={e => setContactForm({...contactForm, youtube: e.target.value})} placeholder="Youtube link" className="w-full p-4 bg-red-50 border border-red-100 rounded-xl outline-none" />
                    <input value={contactForm.facebook} onChange={e => setContactForm({...contactForm, facebook: e.target.value})} placeholder="Facebook link" className="w-full p-4 bg-blue-50 border border-blue-100 rounded-xl outline-none" />
                  </div>
                </div>
                <button onClick={() => props.onUpdateContactInfo(contactForm)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-colors">Ma'lumotlarni saqlash</button>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="animate-fadeIn flex flex-col items-center gap-10">
              <h2 className="text-3xl font-black">Asosiy rasm (Mentor)</h2>
              <div className="relative group">
                <img src={props.teacherImage} className="w-72 h-96 rounded-[56px] object-cover shadow-2xl border-8 border-white group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[56px] transition-opacity"><Camera className="text-white" size={40} /></div>
              </div>
              <button onClick={() => profileFileInputRef.current?.click()} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all">Yangi rasm tanlash</button>
              <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'profile')} />
            </div>
          )}

          {(activeTab === AdminSubSection.MESSAGES || activeTab === AdminSubSection.ENROLLMENTS) && (
            <div className="animate-fadeIn space-y-8">
              <h2 className="text-3xl font-black">{activeTab === AdminSubSection.MESSAGES ? 'Xabarlar' : 'Arizalar'}</h2>
              <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                {(activeTab === AdminSubSection.MESSAGES ? props.messages : props.enrollments).map((m: any) => (
                  <div key={m.id} className="p-8 border-b border-slate-100 flex justify-between items-start hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="font-black text-lg text-slate-900">{m.name || m.studentName}</p>
                      <p className="text-sm text-slate-500 font-bold">{m.email || m.studentPhone} • {m.date}</p>
                      {m.message && <p className="mt-4 text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 italic">"{m.message}"</p>}
                    </div>
                    <button onClick={() => { if(confirm('O\'chirmoqchimisiz?')) activeTab === AdminSubSection.MESSAGES ? props.onDeleteMessage(m.id) : props.onDeleteEnrollment(m.id) }} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Course Editor Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[48px] p-12 w-full max-w-5xl max-h-[90vh] overflow-y-auto space-y-10 shadow-3xl">
            <div className="flex justify-between items-center border-b pb-6"><h2 className="text-3xl font-black">{editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs qo\'shish'}</h2><button onClick={() => setShowCourseModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button></div>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="p-8 bg-slate-50 rounded-[40px] flex flex-col items-center gap-4 border border-slate-100 shadow-inner">
                  {courseForm.image ? <img src={courseForm.image} className="w-full aspect-video rounded-3xl object-cover shadow-lg" /> : <div className="w-full aspect-video rounded-3xl bg-slate-200 flex items-center justify-center font-bold text-slate-400">Rasm tanlanmagan</div>}
                  <button onClick={() => fileInputRef.current?.click()} className="text-indigo-600 font-black hover:underline transition-all">Rasm yuklash</button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'course')} />
                </div>
                <LocalizedInput label="Kurs sarlavhasi" value={courseForm.title as LocalizedText} onChange={val => setCourseForm({...courseForm, title: val})} />
                <LocalizedInput label="Kategoriya" value={courseForm.category as LocalizedText} onChange={val => setCourseForm({...courseForm, category: val})} />
              </div>
              <div className="space-y-6">
                <LocalizedInput label="Davomiyligi" value={courseForm.duration as LocalizedText} onChange={val => setCourseForm({...courseForm, duration: val})} />
                <LocalizedInput label="Qisqa tavsif" value={courseForm.description as LocalizedText} onChange={val => setCourseForm({...courseForm, description: val})} isTextArea />
                <LocalizedInput label="Batafsil ma'lumot (Content)" value={courseForm.content as LocalizedText} onChange={val => setCourseForm({...courseForm, content: val})} isTextArea />
              </div>
            </div>
            <button onClick={() => { 
              if(editingCourse) props.onUpdateCourse({...editingCourse, ...courseForm} as Course); 
              else props.onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseForm} as Course); 
              setShowCourseModal(false); 
            }} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all">O'zgarishlarni saqlash</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
