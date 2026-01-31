
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, ArrowLeft, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Newspaper, BarChart3, Globe, 
  Camera, Sparkles, Wand2, Loader2, Copy, Check
} from 'lucide-react';
import { AdminSubSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment, NewsItem, GlobalStats, LocalizedText } from '../types';
import { generateCourseOutline } from '../services/geminiService';

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

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});

  const [showAchModal, setShowAchModal] = useState(false);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [achForm, setAchForm] = useState<Partial<Achievement>>({});

  const [contactForm, setContactForm] = useState<ContactInfo>(props.contactInfo);
  const [statsForm, setStatsForm] = useState<GlobalStats>(props.globalStats);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const newsFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'course' | 'news' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        if (target === 'course') setCourseForm(p => ({ ...p, image: url }));
        else if (target === 'news') setNewsForm(p => ({ ...p, image: url }));
        else if (target === 'profile') props.onUpdateTeacherImage(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const SidebarBtn = ({ id, icon: Icon, label, count }: any) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18}/>
        <span className="text-sm font-bold">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === id ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
          {count}
        </span>
      )}
    </button>
  );

  const LocalizedInput = ({ label, value, onChange, isTextArea = false }: { label: string, value: LocalizedText, onChange: (val: LocalizedText) => void, isTextArea?: boolean }) => (
    <div className="space-y-4 p-6 bg-slate-50 rounded-[32px] border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Globe size={14} className="text-indigo-600" />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
      </div>
      <div className="space-y-4">
        {(['uz', 'ru', 'en'] as const).map((l) => (
          <div key={l} className="flex gap-3">
            <span className="w-10 shrink-0 flex items-center justify-center font-black text-[10px] uppercase text-slate-400 bg-white border border-slate-200 rounded-xl">{l}</span>
            {isTextArea ? (
              <textarea 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                rows={3}
                value={value[l] || ''} 
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              />
            ) : (
              <input 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                value={value[l] || ''} 
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Section */}
      <aside className="w-72 bg-white border-r fixed inset-y-0 left-0 z-50 flex flex-col shadow-xl">
        <div className="p-8 flex items-center gap-3 text-indigo-600">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Code2 size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Admin <span className="text-slate-900">Portal</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-8">
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Boshqaruv paneli" />
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar & Stats" />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Kursga arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil rasmi" />
        </nav>
        <div className="p-6 border-t bg-slate-50">
          <button onClick={props.onExit} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={16}/> Saytga qaytish
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
          
          {/* 1. Dashboard Tab */}
          {activeTab === AdminSubSection.DASHBOARD && (
             <div className="space-y-10 animate-fadeIn">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Akademiya Holati</h1>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: 'Kurslar', val: props.courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Arizalar', val: props.enrollments.length, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Xabarlar', val: props.messages.length, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Yangiliklar', val: props.news.length, icon: Newspaper, color: 'text-amber-600', bg: 'bg-amber-50' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><s.icon size={24} /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                      <p className="text-4xl font-black text-slate-900 mt-2">{s.val}</p>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {/* 2. Course Management Tab */}
          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">O'quv Kurslari</h2>
                <button onClick={() => { 
                  setEditingCourse(null); 
                  setCourseForm({ title: emptyLocalized(), description: emptyLocalized(), category: emptyLocalized(), duration: emptyLocalized(), students: 0, content: emptyLocalized(), image: '' }); 
                  setShowCourseModal(true); 
                }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  <Plus size={20}/> Yangi Kurs
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {props.courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[40px] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-6">
                      <img src={c.image} className="w-20 h-20 rounded-3xl object-cover shadow-inner bg-slate-50 border" alt={c.title.uz} />
                      <div>
                        <h4 className="font-black text-lg text-slate-900 line-clamp-1">{c.title.uz}</h4>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{c.category.uz}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingCourse(c); setCourseForm(c); setShowCourseModal(true); }} className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Edit3 size={18}/></button>
                      <button onClick={() => { if(confirm('O\'chirmoqchimisiz?')) props.onDeleteCourse(c.id); }} className="p-4 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Enrollments (Arizalar) Tab */}
          {activeTab === AdminSubSection.ENROLLMENTS && (
            <div className="space-y-8 animate-fadeIn">
               <h2 className="text-3xl font-black text-slate-900">Kursga Kelib Tushgan Arizalar</h2>
               {props.enrollments.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100"><p className="text-slate-400 font-bold">Arizalar mavjud emas.</p></div>
               ) : (
                 <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">O'quvchi</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kurs</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Telefon</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {props.enrollments.map(e => (
                          <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 font-black text-slate-900">{e.studentName}</td>
                            <td className="px-8 py-6 font-bold text-indigo-600">{e.courseTitle}</td>
                            <td className="px-8 py-6 text-slate-500 font-medium">{e.studentPhone}</td>
                            <td className="px-8 py-6 text-right">
                              <button onClick={() => { if(confirm('Orizani o\'chirmoqchimisiz?')) props.onDeleteEnrollment(e.id); }} className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={18}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               )}
            </div>
          )}

          {/* 4. Messages (Xabarlar) Tab */}
          {activeTab === AdminSubSection.MESSAGES && (
            <div className="space-y-8 animate-fadeIn">
               <h2 className="text-3xl font-black text-slate-900">Xabarlar & Murojaatlar</h2>
               {props.messages.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100"><p className="text-slate-400 font-bold">Xabarlar mavjud emas.</p></div>
               ) : (
                 <div className="space-y-6">
                    {props.messages.map(m => (
                      <div key={m.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-start group">
                        <div className="space-y-4 max-w-3xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm">{m.name.charAt(0)}</div>
                            <div>
                              <p className="font-black text-slate-900 text-lg">{m.name}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{m.email} • {new Date(m.date).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-slate-700 font-medium leading-relaxed">
                            {m.message}
                          </div>
                        </div>
                        <button onClick={() => { if(confirm('Xabarni o\'chirmoqchimisiz?')) props.onDeleteMessage(m.id); }} className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={20}/></button>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {/* 5. Profile Picture (Profil Rasmi) Tab */}
          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900">Asosiy Profil Rasmi (Mentor)</h2>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl flex flex-col items-center gap-10 max-w-xl mx-auto">
                <div className="w-64 h-80 rounded-[48px] overflow-hidden border-8 border-slate-50 shadow-2xl relative group">
                  <img src={props.teacherImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Profile" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={48} />
                  </div>
                </div>
                <div className="w-full space-y-4 text-center">
                  <p className="text-slate-500 font-medium text-sm">Bu rasm asosiy sahifadagi "Hero Section"da aks etadi.</p>
                  <button onClick={() => profileFileInputRef.current?.click()} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    <Camera size={20}/> Rasmni Tanlash
                  </button>
                  <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'profile')} />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-5xl shadow-3xl overflow-y-auto max-h-[90vh] space-y-10 animate-slideUp">
            <div className="flex justify-between items-center border-b border-slate-100 pb-8">
              <h2 className="text-4xl font-black text-slate-900">{editingCourse ? 'Kurs Ma\'lumotlarini Yangilash' : 'Yangi Kurs Qo\'shish'}</h2>
              <button onClick={() => setShowCourseModal(false)} className="p-4 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 rounded-[48px] border border-slate-100 flex flex-col items-center gap-6">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                    {courseForm.image ? <img src={courseForm.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">Rasm yuklanmagan</div>}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-white border border-slate-200 text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Sarlavha Rasmini Yuklash</button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'course')}/>
                </div>
                <LocalizedInput label="Kurs Nomi" value={courseForm.title as LocalizedText} onChange={val => setCourseForm({...courseForm, title: val})} />
                <LocalizedInput label="Kategoriya (Yo'nalish)" value={courseForm.category as LocalizedText} onChange={val => setCourseForm({...courseForm, category: val})} />
              </div>

              <div className="space-y-8">
                <LocalizedInput label="Davomiyligi" value={courseForm.duration as LocalizedText} onChange={val => setCourseForm({...courseForm, duration: val})} />
                <div className="space-y-2 ml-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">O'quvchilar Soni (Taxminiy)</p>
                  <input type="number" value={courseForm.students || 0} onChange={e => setCourseForm({...courseForm, students: parseInt(e.target.value) || 0})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
                <LocalizedInput label="Qisqa Tavsif (Card uchun)" value={courseForm.description as LocalizedText} onChange={val => setCourseForm({...courseForm, description: val})} isTextArea />
                <LocalizedInput label="Batafsil Mazmuni (Modal uchun)" value={courseForm.content as LocalizedText} onChange={val => setCourseForm({...courseForm, content: val})} isTextArea />
              </div>
            </div>

            <button onClick={() => { 
              if(editingCourse) props.onUpdateCourse({...editingCourse, ...courseForm} as Course); 
              else props.onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseForm} as Course); 
              setShowCourseModal(false); 
            }} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-700 transition-all">Kursni Saqlash</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
