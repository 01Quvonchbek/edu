
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, ArrowLeft, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Newspaper, BarChart3, Globe, 
  Camera, Sparkles, Wand2, Loader2, Copy, Check
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
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
      <div className="flex items-center gap-3">
        <Icon size={18}/><span className="text-sm font-bold">{label}</span>
      </div>
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
              <textarea className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none" rows={3} value={value[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
            ) : (
              <input className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none" value={value[l] || ''} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
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
        <div className="p-8 flex items-center gap-3 text-indigo-600 font-black text-xl"><Code2 /><span>ADMIN</span></div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Boshqaruv" />
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar" />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil" />
        </nav>
        <div className="p-6 border-t"><button onClick={props.onExit} className="w-full flex items-center justify-center gap-2 bg-slate-100 p-4 rounded-xl font-bold"><ArrowLeft size={16}/> Chiqish</button></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
          
          {/* Dashboard */}
          {activeTab === AdminSubSection.DASHBOARD && <div className="animate-fadeIn"><h1 className="text-4xl font-black mb-8">Markaz Holati</h1><div className="grid grid-cols-4 gap-6">{[ { label: 'Kurslar', val: props.courses.length, icon: BookOpen }, { label: 'Arizalar', val: props.enrollments.length, icon: UserCheck }, { label: 'Xabarlar', val: props.messages.length, icon: MessageSquare }, { label: 'Yangiliklar', val: props.news.length, icon: Newspaper } ].map((s, i) => (<div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"><s.icon className="text-indigo-600 mb-4" size={24}/><p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p><p className="text-3xl font-black mt-2">{s.val}</p></div>))}</div></div>}

          {/* News Tiklandi */}
          {activeTab === AdminSubSection.NEWS_MGMT && (
            <div className="animate-fadeIn space-y-8">
              <div className="flex justify-between items-center"><h2 className="text-3xl font-black">Yangiliklar</h2><button onClick={() => { setEditingNews(null); setNewsForm({ title: emptyLocalized(), description: emptyLocalized(), content: emptyLocalized(), date: '2024', image: '' }); setShowNewsModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={18}/> Yangi Xabar</button></div>
              <div className="grid grid-cols-2 gap-6">{props.news.map(n => (<div key={n.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between"><div className="flex items-center gap-4"><img src={n.image} className="w-16 h-16 rounded-xl object-cover" /><div><h4 className="font-bold line-clamp-1">{n.title.uz}</h4><p className="text-[10px] text-indigo-600 font-black">{n.date}</p></div></div><div className="flex gap-2"><button onClick={() => { setEditingNews(n); setNewsForm(n); setShowNewsModal(true); }} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl"><Edit3 size={16}/></button><button onClick={() => props.onDeleteNews(n.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl"><Trash2 size={16}/></button></div></div>))}</div>
            </div>
          )}

          {/* Achievements Tiklandi */}
          {activeTab === AdminSubSection.ACHIEVEMENT_MGMT && (
            <div className="animate-fadeIn space-y-8">
              <div className="flex justify-between items-center"><h2 className="text-3xl font-black">Yutuqlar</h2><button onClick={() => { setEditingAch(null); setAchForm({ title: emptyLocalized(), description: emptyLocalized(), date: '2024' }); setShowAchModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={18}/> Yangi Yutuq</button></div>
              <div className="grid grid-cols-2 gap-6">{props.achievements.map(a => (<div key={a.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Award/></div><div><h4 className="font-bold">{a.title.uz}</h4><p className="text-[10px] text-indigo-600 font-black">{a.date}</p></div></div><div className="flex gap-2"><button onClick={() => { setEditingAch(a); setAchForm(a); setShowAchModal(true); }} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl"><Edit3 size={16}/></button><button onClick={() => props.onDeleteAchievement(a.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl"><Trash2 size={16}/></button></div></div>))}</div>
            </div>
          )}

          {/* Contact Tiklandi */}
          {activeTab === AdminSubSection.CONTACT_MGMT && (
            <div className="animate-fadeIn space-y-8">
              <h2 className="text-3xl font-black">Aloqa Ma'lumotlari</h2>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-8 max-w-3xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Asosiy</p>
                    <input value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} placeholder="Manzil" className="w-full p-4 bg-slate-50 rounded-xl outline-none" />
                    <input value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="Email" className="w-full p-4 bg-slate-50 rounded-xl outline-none" />
                    <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="Telefon" className="w-full p-4 bg-slate-50 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Ijtimoiy Tarmoq Linklari</p>
                    <input value={contactForm.instagram} onChange={e => setContactForm({...contactForm, instagram: e.target.value})} placeholder="Instagram URL" className="w-full p-4 bg-pink-50 rounded-xl outline-none" />
                    <input value={contactForm.telegram} onChange={e => setContactForm({...contactForm, telegram: e.target.value})} placeholder="Telegram URL" className="w-full p-4 bg-blue-50 rounded-xl outline-none" />
                    <input value={contactForm.youtube} onChange={e => setContactForm({...contactForm, youtube: e.target.value})} placeholder="Youtube URL" className="w-full p-4 bg-red-50 rounded-xl outline-none" />
                    <input value={contactForm.facebook} onChange={e => setContactForm({...contactForm, facebook: e.target.value})} placeholder="Facebook URL" className="w-full p-4 bg-blue-50 rounded-xl outline-none" />
                  </div>
                </div>
                <button onClick={() => props.onUpdateContactInfo(contactForm)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Saqlash</button>
              </div>
            </div>
          )}

          {/* Messages & Enrollments List */}
          {(activeTab === AdminSubSection.MESSAGES || activeTab === AdminSubSection.ENROLLMENTS) && (
            <div className="animate-fadeIn space-y-8">
              <h2 className="text-3xl font-black">{activeTab === AdminSubSection.MESSAGES ? 'Murojaatlar' : 'Kursga Arizalar'}</h2>
              <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
                {(activeTab === AdminSubSection.MESSAGES ? props.messages : props.enrollments).map((m: any) => (
                  <div key={m.id} className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{m.name || m.studentName}</p>
                      <p className="text-xs text-slate-400">{m.email || m.studentPhone} • {m.courseTitle || ''}</p>
                      {m.message && <p className="text-sm mt-2 text-slate-600 italic">"{m.message}"</p>}
                    </div>
                    <button onClick={() => activeTab === AdminSubSection.MESSAGES ? props.onDeleteMessage(m.id) : props.onDeleteEnrollment(m.id)} className="text-rose-400 p-2"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Picture */}
          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="animate-fadeIn flex flex-col items-center gap-8">
              <h2 className="text-3xl font-black">Profil Rasmi</h2>
              <img src={props.teacherImage} className="w-64 h-80 rounded-[48px] object-cover shadow-2xl border-8 border-white" />
              <button onClick={() => profileFileInputRef.current?.click()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black">Rasmni O'zgartirish</button>
              <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'profile')} />
            </div>
          )}

        </div>
      </main>

      {/* Shared Modals */}
      {showNewsModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white rounded-[48px] p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-8">
            <div className="flex justify-between items-center"><h2>Xabarni Tahrirlash</h2><button onClick={() => setShowNewsModal(false)}><X/></button></div>
            <div className="p-6 bg-slate-50 rounded-3xl flex flex-col items-center gap-4">
              <img src={newsForm.image} className="w-full max-w-sm aspect-video rounded-2xl object-cover" />
              <button onClick={() => newsFileInputRef.current?.click()} className="text-indigo-600 font-bold">Rasm Tanlash</button>
              <input type="file" ref={newsFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'news')} />
            </div>
            <LocalizedInput label="Sarlavha" value={newsForm.title as LocalizedText} onChange={val => setNewsForm({...newsForm, title: val})} />
            <LocalizedInput label="Tavsif" value={newsForm.description as LocalizedText} onChange={val => setNewsForm({...newsForm, description: val})} isTextArea />
            <button onClick={() => { editingNews ? props.onUpdateNews({...editingNews, ...newsForm} as NewsItem) : props.onAddNews({id: Math.random().toString(), ...newsForm} as NewsItem); setShowNewsModal(false); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black">Saqlash</button>
          </div>
        </div>
      )}

      {showAchModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white rounded-[48px] p-10 w-full max-w-2xl space-y-8">
            <div className="flex justify-between items-center"><h2>Yutuqni Tahrirlash</h2><button onClick={() => setShowAchModal(false)}><X/></button></div>
            <LocalizedInput label="Sarlavha" value={achForm.title as LocalizedText} onChange={val => setAchForm({...achForm, title: val})} />
            <input value={achForm.date || ''} onChange={e => setAchForm({...achForm, date: e.target.value})} placeholder="Sana (masalan: 2024)" className="w-full p-4 bg-slate-50 rounded-xl" />
            <LocalizedInput label="Tavsif" value={achForm.description as LocalizedText} onChange={val => setAchForm({...achForm, description: val})} isTextArea />
            <button onClick={() => { editingAch ? props.onUpdateAchievement({...editingAch, ...achForm} as Achievement) : props.onAddAchievement({id: Math.random().toString(), ...achForm} as Achievement); setShowAchModal(false); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black">Saqlash</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
