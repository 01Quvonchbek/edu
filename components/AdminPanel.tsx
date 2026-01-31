
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Sparkles, Plus, Trash2, Edit3, ArrowLeft, Loader2, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Camera, Newspaper, BarChart3
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

  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [achForm, setAchForm] = useState<Partial<Achievement>>({});

  const [contactForm, setContactForm] = useState<ContactInfo>(props.contactInfo);
  const [statsForm, setStatsForm] = useState<GlobalStats>(props.globalStats);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const newsFileInputRef = useRef<HTMLInputElement>(null);

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
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
      <div className="flex items-center gap-3"><Icon size={18}/><span className="text-sm font-semibold">{label}</span></div>
      {count > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === id ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>{count}</span>}
    </button>
  );

  const LocalizedInput = ({ label, value, onChange, isTextArea = false }: { label: string, value: LocalizedText, onChange: (val: LocalizedText) => void, isTextArea?: boolean }) => (
    <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{label}</p>
      <div className="space-y-3">
        {['uz', 'ru', 'en'].map((l) => (
          <div key={l} className="flex gap-2">
            <span className="w-8 shrink-0 flex items-center justify-center font-black text-[10px] uppercase text-slate-400 border border-slate-200 rounded-lg">{l}</span>
            {isTextArea ? (
              <textarea 
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-500" 
                rows={3}
                value={(value as any)[l]} 
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              />
            ) : (
              <input 
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-500" 
                value={(value as any)[l]} 
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
      <aside className="w-64 bg-white border-r fixed inset-y-0 left-0 z-50 flex flex-col">
        <div className="p-8 flex items-center gap-2 text-indigo-600">
          <Code2 size={32} /><span className="text-xl font-black uppercase tracking-tighter">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8">
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar & Statistika" />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil rasmi" />
        </nav>
        <div className="p-4 border-t">
          <button onClick={props.onExit} className="w-full flex items-center gap-2 text-slate-500 hover:text-indigo-600 p-2 font-bold text-sm">
            <ArrowLeft size={16}/> Saytga qaytish
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === AdminSubSection.DASHBOARD && (
            <div className="grid grid-cols-4 gap-6 animate-fadeIn">
               {[
                 { label: 'Kurslar', val: props.courses.length },
                 { label: 'Arizalar', val: props.enrollments.length },
                 { label: 'Xabarlar', val: props.messages.length },
                 { label: 'Yangiliklar', val: props.news.length }
               ].map((s, i) => (
                 <div key={i} className="bg-white p-8 rounded-[32px] border shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                   <p className="text-4xl font-black text-slate-900 mt-2">{s.val}</p>
                 </div>
               ))}
            </div>
          )}

          {activeTab === AdminSubSection.ACHIEVEMENT_MGMT && (
            <div className="space-y-12 animate-fadeIn">
              <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-2"><BarChart3 size={24} className="text-indigo-600"/> Statistikani tahrirlash (3 tilda)</h2>
                <div className="bg-white p-8 rounded-[40px] border shadow-xl space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <LocalizedInput label="Statistika 1 Nomi" value={statsForm.stat1Label} onChange={val => setStatsForm({...statsForm, stat1Label: val})} />
                      <input type="text" placeholder="Qiymat (masalan: 98%)" value={statsForm.stat1Value} onChange={e => setStatsForm({...statsForm, stat1Value: e.target.value})} className="w-full p-4 border rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                      <LocalizedInput label="Statistika 2 Nomi" value={statsForm.stat2Label} onChange={val => setStatsForm({...statsForm, stat2Label: val})} />
                      <input type="text" placeholder="Qiymat" value={statsForm.stat2Value} onChange={e => setStatsForm({...statsForm, stat2Value: e.target.value})} className="w-full p-4 border rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                      <LocalizedInput label="Statistika 3 Nomi" value={statsForm.stat3Label} onChange={val => setStatsForm({...statsForm, stat3Label: val})} />
                      <input type="text" placeholder="Qiymat" value={statsForm.stat3Value} onChange={e => setStatsForm({...statsForm, stat3Value: e.target.value})} className="w-full p-4 border rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                      <LocalizedInput label="Statistika 4 Nomi" value={statsForm.stat4Label} onChange={val => setStatsForm({...statsForm, stat4Label: val})} />
                      <input type="text" placeholder="Qiymat" value={statsForm.stat4Value} onChange={e => setStatsForm({...statsForm, stat4Value: e.target.value})} className="w-full p-4 border rounded-2xl" />
                    </div>
                  </div>
                  <button onClick={() => props.onUpdateGlobalStats(statsForm)} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-2"><Save size={24}/> Statistikani saqlash</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Kurslar boshqaruvi</h2>
                <button onClick={() => { 
                  setEditingCourse(null); 
                  setCourseForm({
                    title: emptyLocalized(), 
                    description: emptyLocalized(), 
                    category: emptyLocalized(), 
                    duration: emptyLocalized(), 
                    students: 0, 
                    content: emptyLocalized() 
                  }); 
                  setShowCourseModal(true); 
                }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"><Plus size={20}/> Yangi kurs qo'shish</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {props.courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[32px] border flex items-center justify-between shadow-sm hover:border-indigo-600 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={c.image} className="w-16 h-16 rounded-2xl object-cover" />
                      <div><h4 className="font-black text-slate-900">{c.title.uz}</h4><p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{c.category.uz}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingCourse(c); setCourseForm(c); setShowCourseModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={18}/></button>
                      <button onClick={() => props.onDeleteCourse(c.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] space-y-8">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-black text-slate-900">{editingCourse ? 'Tahrirlash' : 'Yangi kurs'}</h2><button onClick={() => setShowCourseModal(false)}><X/></button></div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
                  <img src={courseForm.image || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-xl object-cover border"/>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">Rasm yuklash</button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={e => handleImageUpload(e, 'course')}/>
                </div>
                
                <LocalizedInput label="Kurs Nomi" value={courseForm.title as LocalizedText} onChange={val => setCourseForm({...courseForm, title: val})} />
                <LocalizedInput label="Kategoriya" value={courseForm.category as LocalizedText} onChange={val => setCourseForm({...courseForm, category: val})} />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-600 ml-1">O'quvchilar soni</p>
                  <input type="number" placeholder="Soni" value={courseForm.students || 0} onChange={e => setCourseForm({...courseForm, students: parseInt(e.target.value) || 0})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
                </div>
              </div>

              <div className="space-y-6">
                <LocalizedInput label="Kurs Davomiyligi" value={courseForm.duration as LocalizedText} onChange={val => setCourseForm({...courseForm, duration: val})} />
                <LocalizedInput label="Qisqa Tavsif" value={courseForm.description as LocalizedText} onChange={val => setCourseForm({...courseForm, description: val})} isTextArea />
                <LocalizedInput label="To'liq Mazmuni" value={courseForm.content as LocalizedText} onChange={val => setCourseForm({...courseForm, content: val})} isTextArea />
              </div>
            </div>

            <button onClick={() => { 
              if(editingCourse) props.onUpdateCourse({...editingCourse, ...courseForm} as Course); 
              else props.onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseForm} as Course); 
              setShowCourseModal(false); 
            }} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-700 transition-all">Saqlash</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
