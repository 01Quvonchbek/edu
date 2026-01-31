
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Sparkles, Plus, Trash2, Edit3, ArrowLeft, Loader2, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Camera, Newspaper, BarChart3
} from 'lucide-react';
import { AdminSubSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment, NewsItem, GlobalStats } from '../types';
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

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminSubSection>(AdminSubSection.DASHBOARD);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});
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

  const handleAiGeneration = async () => {
    if (!courseForm.title) return;
    setIsGenerating(true);
    try {
      const res = await generateCourseOutline(courseForm.title, courseForm.category || 'IT');
      const text = res.outline.map((o: any) => `### ${o.chapter}\n${o.description}`).join('\n\n');
      setCourseForm(p => ({ ...p, content: text }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const SidebarBtn = ({ id, icon: Icon, label, count }: any) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
      <div className="flex items-center gap-3"><Icon size={18}/><span className="text-sm font-semibold">{label}</span></div>
      {count > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === id ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>{count}</span>}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r fixed inset-y-0 left-0 z-50 flex flex-col">
        <div className="p-8 flex items-center gap-2 text-indigo-600">
          <Code2 size={32} /><span className="text-xl font-black uppercase">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Asosiy (Dashboard)" />
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Statistika & Yutuqlar" />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil rasmi" />
          <SidebarBtn id={AdminSubSection.AI_TOOLS} icon={Sparkles} label="AI Yordamchi" />
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
                <h2 className="text-2xl font-black flex items-center gap-2"><BarChart3 size={24} className="text-indigo-600"/> Statistikani tahrirlash</h2>
                <div className="bg-white p-8 rounded-[40px] border shadow-xl grid grid-cols-2 gap-8">
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <input type="text" placeholder="Nom (uz/ru/en)" value={statsForm.stat1Label} onChange={e => setStatsForm({...statsForm, stat1Label: e.target.value})} className="w-full p-3 border rounded-xl" />
                    <input type="text" placeholder="Qiymat" value={statsForm.stat1Value} onChange={e => setStatsForm({...statsForm, stat1Value: e.target.value})} className="w-full p-3 border rounded-xl" />
                  </div>
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <input type="text" placeholder="Nom (uz/ru/en)" value={statsForm.stat2Label} onChange={e => setStatsForm({...statsForm, stat2Label: e.target.value})} className="w-full p-3 border rounded-xl" />
                    <input type="text" placeholder="Qiymat" value={statsForm.stat2Value} onChange={e => setStatsForm({...statsForm, stat2Value: e.target.value})} className="w-full p-3 border rounded-xl" />
                  </div>
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <input type="text" placeholder="Nom (uz/ru/en)" value={statsForm.stat3Label} onChange={e => setStatsForm({...statsForm, stat3Label: e.target.value})} className="w-full p-3 border rounded-xl" />
                    <input type="text" placeholder="Qiymat" value={statsForm.stat3Value} onChange={e => setStatsForm({...statsForm, stat3Value: e.target.value})} className="w-full p-3 border rounded-xl" />
                  </div>
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <input type="text" placeholder="Nom (uz/ru/en)" value={statsForm.stat4Label} onChange={e => setStatsForm({...statsForm, stat4Label: e.target.value})} className="w-full p-3 border rounded-xl" />
                    <input type="text" placeholder="Qiymat" value={statsForm.stat4Value} onChange={e => setStatsForm({...statsForm, stat4Value: e.target.value})} className="w-full p-3 border rounded-xl" />
                  </div>
                  <button onClick={() => props.onUpdateGlobalStats(statsForm)} className="col-span-2 bg-slate-900 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-2"><Save size={24}/> Saqlash</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Barcha kurslar</h2>
                <button onClick={() => { setEditingCourse(null); setCourseForm({students: 0}); setShowCourseModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={20}/> Qo'shish</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {props.courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[32px] border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={c.image} className="w-16 h-16 rounded-2xl object-cover" />
                      <div><h4 className="font-black">{c.title}</h4><p className="text-[10px] font-bold text-indigo-600">{c.students} o'quvchi</p></div>
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

      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black">Kursni saqlash</h2><button onClick={() => setShowCourseModal(false)}><X/></button></div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
                <img src={courseForm.image || 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-xl object-cover"/>
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white border rounded-xl text-sm font-bold">Rasm</button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={e => handleImageUpload(e, 'course')}/>
              </div>
              <input type="text" placeholder="Nomi" value={courseForm.title || ''} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Kategoriya" value={courseForm.category || ''} onChange={e => setCourseForm({...courseForm, category: e.target.value})} className="p-4 border rounded-2xl" />
                <input type="number" placeholder="O'quvchilar" value={courseForm.students || 0} onChange={e => setCourseForm({...courseForm, students: parseInt(e.target.value) || 0})} className="p-4 border rounded-2xl" />
              </div>
              <textarea placeholder="Tavsif" value={courseForm.description || ''} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full p-4 border rounded-2xl h-24" />
              <textarea placeholder="Mundarija" value={courseForm.content || ''} onChange={e => setCourseForm({...courseForm, content: e.target.value})} className="w-full p-4 border rounded-2xl h-40" />
              <button onClick={() => { if(editingCourse) props.onUpdateCourse({...editingCourse, ...courseForm} as Course); else props.onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseForm} as Course); setShowCourseModal(false); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
