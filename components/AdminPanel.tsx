
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, ArrowLeft, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Newspaper, Globe, Camera, BarChart, Calendar, Mail,
  ExternalLink, Hash, Image as ImageIcon
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
  
  // Forms
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'course' | 'profile' | 'news') => {
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
              <textarea className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none" rows={3} value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
            ) : (
              <input className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none" value={value?.[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
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
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar" count={props.achievements.length} />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil" />
        </nav>
        <div className="p-6 border-t"><button onClick={props.onExit} className="w-full flex items-center justify-center gap-2 bg-slate-100 p-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"><ArrowLeft size={16}/> Chiqish</button></div>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
          
          {/* DASHBOARD */}
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

              {/* Stats Update */}
              <div className="bg-white p-10 rounded-[48px] border border-slate-100 space-y-8">
                <h3 className="text-2xl font-black flex items-center gap-3"><BarChart size={24} className="text-indigo-600"/> Global Statistikalar</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <LocalizedInput label={`Statistika ${num} nomi`} value={(statsForm as any)[`stat${num}Label`]} onChange={v => setStatsForm({...statsForm, [`stat${num}Label`]: v})} />
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold" value={(statsForm as any)[`stat${num}Value`]} onChange={e => setStatsForm({...statsForm, [`stat${num}Value`]: e.target.value})} placeholder="Qiymat (masalan: 98%)" />
                    </div>
                  ))}
                </div>
                <button onClick={() => props.onUpdateGlobalStats(statsForm)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2"><Save size={18}/> Saqlash</button>
              </div>
            </div>
          )}

          {/* COURSE MANAGEMENT */}
          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black">Kurslar</h2>
                <button onClick={() => { setEditingCourse(null); setCourseForm({ id: Date.now().toString(), title: emptyLocalized(), description: emptyLocalized(), category: emptyLocalized(), duration: emptyLocalized(), students: 0 }); setShowCourseModal(true); }} className="bg-indigo-600 text-white p-4 rounded-2xl font-black flex items-center gap-2"><Plus size={18}/> Yangi kurs</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {props.courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex gap-4">
                    <img src={c.image} className="w-24 h-24 rounded-2xl object-cover" />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-black text-lg line-clamp-1">{c.title.uz}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingCourse(c); setCourseForm(c); setShowCourseModal(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 size={18}/></button>
                        <button onClick={() => props.onDeleteCourse(c.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEWS MANAGEMENT */}
          {activeTab === AdminSubSection.NEWS_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black">Yangiliklar</h2>
                <button onClick={() => { setEditingNews(null); setNewsForm({ id: Date.now().toString(), title: emptyLocalized(), description: emptyLocalized(), content: emptyLocalized(), date: new Date().toLocaleDateString('uz-UZ') }); setShowNewsModal(true); }} className="bg-indigo-600 text-white p-4 rounded-2xl font-black flex items-center gap-2"><Plus size={18}/> Yangi yangilik</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {props.news.map(n => (
                  <div key={n.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex gap-4">
                    <img src={n.image} className="w-24 h-24 rounded-2xl object-cover" />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-black text-lg line-clamp-1">{n.title.uz}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingNews(n); setNewsForm(n); setShowNewsModal(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 size={18}/></button>
                        <button onClick={() => props.onDeleteNews(n.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT MANAGEMENT */}
          {activeTab === AdminSubSection.CONTACT_MGMT && (
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black">Kontakt ma'lumotlari</h2>
              <div className="grid grid-cols-2 gap-6">
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl" value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} placeholder="Manzil" />
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="Telefon" />
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="Email" />
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl" value={contactForm.telegram} onChange={e => setContactForm({...contactForm, telegram: e.target.value})} placeholder="Telegram" />
              </div>
              <button onClick={() => props.onUpdateContactInfo(contactForm)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black"><Save size={18} className="inline mr-2"/> Saqlash</button>
            </div>
          )}

          {/* MESSAGES & ENROLLMENTS */}
          {(activeTab === AdminSubSection.MESSAGES || activeTab === AdminSubSection.ENROLLMENTS) && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-3xl font-black">{activeTab === AdminSubSection.MESSAGES ? 'Xabarlar' : 'Arizalar'}</h2>
              {(activeTab === AdminSubSection.MESSAGES ? props.messages : props.enrollments).map((item: any) => (
                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-black text-xl">{activeTab === AdminSubSection.MESSAGES ? item.name : item.student_name}</p>
                    <p className="text-slate-500 font-bold">{activeTab === AdminSubSection.MESSAGES ? item.message : item.course_title}</p>
                    <p className="text-xs text-indigo-600 font-black uppercase mt-1">{item.date}</p>
                  </div>
                  <button onClick={() => activeTab === AdminSubSection.MESSAGES ? props.onDeleteMessage(item.id) : props.onDeleteEnrollment(item.id)} className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE MANAGEMENT */}
          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black">O'qituvchi profili</h2>
              <div className="flex items-center gap-10">
                <div className="relative group">
                  <img src={props.teacherImage} className="w-48 h-64 object-cover rounded-[32px] border-4 border-slate-100" />
                  <label className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-[32px] flex items-center justify-center cursor-pointer transition-all">
                    <Camera size={32}/>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'profile')} />
                  </label>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-500 font-medium">Asosiy portret rasmini bu erdan o'zgartirishingiz mumkin.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modals for Course/News/Achievements */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[48px] p-10 max-h-[90vh] overflow-y-auto space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black">{editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs'}</h3>
              <button onClick={() => setShowCourseModal(false)}><X/></button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <LocalizedInput label="Kurs nomi" value={courseForm.title as LocalizedText} onChange={v => setCourseForm({...courseForm, title: v})} />
                <LocalizedInput label="Kategoriya" value={courseForm.category as LocalizedText} onChange={v => setCourseForm({...courseForm, category: v})} />
              </div>
              <div className="space-y-6">
                 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-200">
                    <div className="w-full h-40 bg-white border border-dashed border-slate-300 rounded-2xl flex items-center justify-center relative overflow-hidden">
                       {courseForm.image ? <img src={courseForm.image} className="w-full h-full object-cover"/> : <ImageIcon className="text-slate-300" size={40}/>}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'course')}/>
                    </div>
                    <p className="text-center text-[10px] font-black uppercase text-slate-400 mt-2">Rasm yuklash</p>
                 </div>
                 <LocalizedInput label="Davomiyligi" value={courseForm.duration as LocalizedText} onChange={v => setCourseForm({...courseForm, duration: v})} />
              </div>
            </div>
            <LocalizedInput label="Tavsif" value={courseForm.description as LocalizedText} onChange={v => setCourseForm({...courseForm, description: v})} isTextArea />
            <button onClick={() => { editingCourse ? props.onUpdateCourse(courseForm as Course) : props.onAddCourse(courseForm as Course); setShowCourseModal(false); }} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black">Saqlash</button>
          </div>
        </div>
      )}

      {/* NEWS MODAL */}
      {showNewsModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[48px] p-10 max-h-[90vh] overflow-y-auto space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black">{editingNews ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}</h3>
              <button onClick={() => setShowNewsModal(false)}><X/></button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <LocalizedInput label="Sarlavha" value={newsForm.title as LocalizedText} onChange={v => setNewsForm({...newsForm, title: v})} />
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-200">
                <div className="w-full h-40 bg-white border border-dashed border-slate-300 rounded-2xl flex items-center justify-center relative overflow-hidden">
                   {newsForm.image ? <img src={newsForm.image} className="w-full h-full object-cover"/> : <ImageIcon className="text-slate-300" size={40}/>}
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'news')}/>
                </div>
              </div>
            </div>
            <LocalizedInput label="Qisqa tavsif" value={newsForm.description as LocalizedText} onChange={v => setNewsForm({...newsForm, description: v})} isTextArea />
            <LocalizedInput label="To'liq maqola" value={newsForm.content as LocalizedText} onChange={v => setNewsForm({...newsForm, content: v})} isTextArea />
            <button onClick={() => { editingNews ? props.onUpdateNews(newsForm as NewsItem) : props.onAddNews(newsForm as NewsItem); setShowNewsModal(false); }} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black">Saqlash</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
