
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, ArrowLeft, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Newspaper, BarChart3, Mail, Globe, ExternalLink,
  Camera
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

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});

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
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}
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
    <div className="space-y-4 p-5 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2">
        <Globe size={14} className="text-indigo-600" />
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</p>
      </div>
      <div className="space-y-3">
        {['uz', 'ru', 'en'].map((l) => (
          <div key={l} className="flex gap-2">
            <span className="w-10 shrink-0 flex items-center justify-center font-black text-[10px] uppercase text-slate-400 bg-white border border-slate-200 rounded-xl">{l}</span>
            {isTextArea ? (
              <textarea 
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                rows={3}
                value={(value as any)?.[l] || ''} 
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              />
            ) : (
              <input 
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                value={(value as any)?.[l] || ''} 
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
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r fixed inset-y-0 left-0 z-50 flex flex-col shadow-xl">
        <div className="p-8 flex items-center gap-3 text-indigo-600">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Code2 size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Admin <span className="text-slate-900">Edu</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-8">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Asosiy</div>
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Boshqaruv paneli" />
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-2">Kontent</div>
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Statistika & Yutuqlar" />
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-2">Aloqa</div>
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Kursga arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-2">Sozlamalar</div>
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil rasmi" />
        </nav>
        
        <div className="p-6 border-t bg-slate-50">
          <button onClick={props.onExit} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 p-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={16}/> Saytga qaytish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Dashboard */}
          {activeTab === AdminSubSection.DASHBOARD && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Xush kelibsiz!</h1>
                  <p className="text-slate-500 font-medium">Platformangizdagi so'nggi holat haqida ma'lumot.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Barcha kurslar', val: props.courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Yangi arizalar', val: props.enrollments.length, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Kelgan xabarlar', val: props.messages.length, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Yangiliklar', val: props.news.length, icon: Newspaper, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <s.icon size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className="text-4xl font-black text-slate-900 mt-2">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Management */}
          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Kurslarni boshqarish</h2>
                <button onClick={() => { 
                  setEditingCourse(null); 
                  setCourseForm({ title: emptyLocalized(), description: emptyLocalized(), category: emptyLocalized(), duration: emptyLocalized(), students: 0, content: emptyLocalized(), image: '' }); 
                  setShowCourseModal(true); 
                }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  <Plus size={20}/> Yangi kurs
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {props.courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[40px] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-inner bg-slate-50 border">
                        <img src={c.image} className="w-full h-full object-cover" alt={c.title.uz} />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-slate-900">{c.title.uz}</h4>
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

          {/* News Management */}
          {activeTab === AdminSubSection.NEWS_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Yangiliklar</h2>
                <button onClick={() => { 
                  setEditingNews(null); 
                  setNewsForm({ title: emptyLocalized(), description: emptyLocalized(), content: emptyLocalized(), image: '', date: new Date().toLocaleDateString() }); 
                  setShowNewsModal(true); 
                }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  <Plus size={20}/> Yangi xabar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {props.news.map(n => (
                  <div key={n.id} className="bg-white p-6 rounded-[40px] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-inner bg-slate-50 border">
                        <img src={n.image} className="w-full h-full object-cover" alt={n.title.uz} />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-slate-900 line-clamp-1">{n.title.uz}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingNews(n); setNewsForm(n); setShowNewsModal(true); }} className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Edit3 size={18}/></button>
                      <button onClick={() => { if(confirm('O\'chirmoqchimisiz?')) props.onDeleteNews(n.id); }} className="p-4 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeTab === AdminSubSection.MESSAGES && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900">Foydalanuvchi xabarlari</h2>
              <div className="space-y-4">
                {props.messages.map(m => (
                  <div key={m.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-start">
                    <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black">{m.name.charAt(0)}</div>
                        <div>
                          <p className="font-black text-slate-900">{m.name}</p>
                          <p className="text-xs text-slate-400 font-bold">{m.email} • {new Date(m.date).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">{m.message}</p>
                    </div>
                    <button onClick={() => props.onDeleteMessage(m.id)} className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enrollments */}
          {activeTab === AdminSubSection.ENROLLMENTS && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900">Kursga arizalar</h2>
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">O'quvchi</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kurs</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Telefon</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Sana</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {props.enrollments.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 font-black text-slate-900">{e.studentName}</td>
                        <td className="px-8 py-6 font-bold text-indigo-600">{e.courseTitle}</td>
                        <td className="px-8 py-6 text-slate-500">{e.studentPhone}</td>
                        <td className="px-8 py-6 text-slate-400 text-xs">{new Date(e.date).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <button onClick={() => props.onDeleteEnrollment(e.id)} className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Achievements & Global Stats */}
          {activeTab === AdminSubSection.ACHIEVEMENT_MGMT && (
            <div className="space-y-12 animate-fadeIn">
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3"><BarChart3 size={28} className="text-indigo-600"/> Global Statistika</h2>
                <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[1, 2, 3, 4].map(num => (
                      <div key={num} className="space-y-6">
                        <LocalizedInput label={`Statistika ${num} Nomi`} value={(statsForm as any)[`stat${num}Label`]} onChange={val => setStatsForm({...statsForm, [`stat${num}Label`]: val})} />
                        <div className="space-y-1 ml-1">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Qiymat</p>
                          <input type="text" placeholder="Qiymat (masalan: 98% yoki 50+)" value={(statsForm as any)[`stat${num}Value`]} onChange={e => setStatsForm({...statsForm, [`stat${num}Value`]: e.target.value})} className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => props.onUpdateGlobalStats(statsForm)} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                    <Save size={24}/> Statistikani Saqlash
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info Management */}
          {activeTab === AdminSubSection.CONTACT_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900">Aloqa ma'lumotlari</h2>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-8 max-w-3xl">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Manzil</p>
                    <input value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</p>
                    <input value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Telefon</p>
                    <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Instagram URL</p>
                      <input value={contactForm.instagram} onChange={e => setContactForm({...contactForm, instagram: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Telegram URL</p>
                      <input value={contactForm.telegram} onChange={e => setContactForm({...contactForm, telegram: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" />
                    </div>
                  </div>
                </div>
                <button onClick={() => props.onUpdateContactInfo(contactForm)} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black shadow-2xl hover:bg-slate-800 transition-all">Saqlash</button>
              </div>
            </div>
          )}

          {/* Profile Image Management */}
          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900">Profil rasmi</h2>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl flex flex-col items-center gap-10 max-w-xl">
                <div className="w-64 h-80 rounded-[48px] overflow-hidden border-8 border-slate-50 shadow-2xl">
                  <img src={props.teacherImage} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <div className="w-full space-y-4 text-center">
                  <p className="text-slate-500 font-medium px-8 text-sm">Ushbu rasm saytning asosiy sahifasida (Hero section) ko'rinadi.</p>
                  <button onClick={() => profileFileInputRef.current?.click()} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    <Camera size={20}/> Rasmni yangilash
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
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-slate-900">{editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs qo\'shish'}</h2>
              <button onClick={() => setShowCourseModal(false)} className="p-4 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 rounded-[48px] border border-slate-100 flex flex-col items-center gap-6">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                    {courseForm.image ? <img src={courseForm.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">Rasm tanlanmagan</div>}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-white border border-slate-200 text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Rasm yuklash</button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'course')}/>
                </div>
                
                <LocalizedInput label="Kurs Nomi" value={courseForm.title as LocalizedText} onChange={val => setCourseForm({...courseForm, title: val})} />
                <LocalizedInput label="Kategoriya" value={courseForm.category as LocalizedText} onChange={val => setCourseForm({...courseForm, category: val})} />
              </div>

              <div className="space-y-8">
                <LocalizedInput label="Davomiyligi" value={courseForm.duration as LocalizedText} onChange={val => setCourseForm({...courseForm, duration: val})} />
                <div className="space-y-1 ml-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">O'quvchilar soni</p>
                  <input type="number" value={courseForm.students || 0} onChange={e => setCourseForm({...courseForm, students: parseInt(e.target.value) || 0})} className="w-full p-4 border border-slate-200 rounded-2xl outline-none" />
                </div>
                <LocalizedInput label="Qisqa Tavsif" value={courseForm.description as LocalizedText} onChange={val => setCourseForm({...courseForm, description: val})} isTextArea />
                <LocalizedInput label="To'liq Mazmuni" value={courseForm.content as LocalizedText} onChange={val => setCourseForm({...courseForm, content: val})} isTextArea />
              </div>
            </div>

            <button onClick={() => { 
              if(editingCourse) props.onUpdateCourse({...editingCourse, ...courseForm} as Course); 
              else props.onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseForm} as Course); 
              setShowCourseModal(false); 
            }} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-700 transition-all">Saqlash</button>
          </div>
        </div>
      )}

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-5xl shadow-3xl overflow-y-auto max-h-[90vh] space-y-10 animate-slideUp">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-slate-900">{editingNews ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}</h2>
              <button onClick={() => setShowNewsModal(false)} className="p-4 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 rounded-[48px] border border-slate-100 flex flex-col items-center gap-6">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                    {newsForm.image ? <img src={newsForm.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">Rasm tanlanmagan</div>}
                  </div>
                  <button onClick={() => newsFileInputRef.current?.click()} className="px-8 py-4 bg-white border border-slate-200 text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Rasm yuklash</button>
                  <input type="file" ref={newsFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'news')}/>
                </div>
                
                <LocalizedInput label="Sarlavha" value={newsForm.title as LocalizedText} onChange={val => setNewsForm({...newsForm, title: val})} />
                <div className="space-y-1 ml-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sana</p>
                  <input type="text" value={newsForm.date || ''} onChange={e => setNewsForm({...newsForm, date: e.target.value})} className="w-full p-4 border border-slate-200 rounded-2xl outline-none" placeholder="25.05.2024" />
                </div>
              </div>

              <div className="space-y-8">
                <LocalizedInput label="Qisqa Tavsif" value={newsForm.description as LocalizedText} onChange={val => setNewsForm({...newsForm, description: val})} isTextArea />
                <LocalizedInput label="To'liq Mazmuni" value={newsForm.content as LocalizedText} onChange={val => setNewsForm({...newsForm, content: val})} isTextArea />
                <div className="space-y-1 ml-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Video URL (ixtiyoriy)</p>
                  <input type="text" value={newsForm.videoUrl || ''} onChange={e => setNewsForm({...newsForm, videoUrl: e.target.value})} className="w-full p-4 border border-slate-200 rounded-2xl outline-none" placeholder="YouTube link" />
                </div>
              </div>
            </div>

            <button onClick={() => { 
              if(editingNews) props.onUpdateNews({...editingNews, ...newsForm} as NewsItem); 
              else props.onAddNews({id: Math.random().toString(36).substr(2,9), ...newsForm} as NewsItem); 
              setShowNewsModal(false); 
            }} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-700 transition-all">Saqlash</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
