
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Sparkles, Plus, Trash2, Edit3, ArrowLeft, Loader2, Award, Save, X, 
  Upload, Image as ImageIcon, User as UserIcon, Phone, MessageSquare, UserCheck, Code2, 
  Check, Camera, Calendar, Newspaper, Video, Mail, MapPin, Send, Instagram, Youtube, Facebook, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
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
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  
  // Forms state
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
    if (!courseForm.title) return setAiError("Iltimos, avval kurs nomini kiriting.");
    setIsGenerating(true); setAiError(null);
    try {
      const res = await generateCourseOutline(courseForm.title, courseForm.category || 'Dasturlash');
      const text = res.outline.map((o: any) => `### ${o.chapter}\n${o.description}`).join('\n\n');
      setCourseForm(p => ({ ...p, content: text }));
    } catch (e) {
      setAiError("AI xizmatida xatolik yuz berdi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const statsData = [
    { name: 'Kurslar', value: props.courses.length },
    { name: 'Arizalar', value: props.enrollments.length },
    { name: 'Xabarlar', value: props.messages.length },
    { name: 'Yangiliklar', value: props.news.length }
  ];

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
          <Code2 size={32} /><span className="text-xl font-black uppercase">IT Yakkabog'</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Asosiy" />
          <SidebarBtn id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil rasmi" />
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar va Statistika" count={props.achievements.length} />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
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
            <div className="space-y-10 animate-fadeIn">
              <h1 className="text-3xl font-black">Dashboard</h1>
              <div className="grid grid-cols-4 gap-6">
                {statsData.map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.name}</p>
                    <p className="text-4xl font-black text-slate-900 mt-2">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.ACHIEVEMENT_MGMT && (
            <div className="space-y-12 animate-fadeIn">
              {/* Global Statistics Editing */}
              <div className="space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-2"><BarChart3 size={24} className="text-indigo-600"/> Asosiy Statistikalar</h2>
                <div className="bg-white p-8 rounded-[40px] border shadow-xl grid grid-cols-2 gap-x-8 gap-y-10">
                  {/* Stat 1 */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 1 Nomi</label>
                      <input type="text" value={statsForm.stat1Label} onChange={e => setStatsForm({...statsForm, stat1Label: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 1 Qiymati</label>
                      <input type="text" value={statsForm.stat1Value} onChange={e => setStatsForm({...statsForm, stat1Value: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  {/* Stat 2 */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 2 Nomi</label>
                      <input type="text" value={statsForm.stat2Label} onChange={e => setStatsForm({...statsForm, stat2Label: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 2 Qiymati</label>
                      <input type="text" value={statsForm.stat2Value} onChange={e => setStatsForm({...statsForm, stat2Value: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  {/* Stat 3 */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 3 Nomi</label>
                      <input type="text" value={statsForm.stat3Label} onChange={e => setStatsForm({...statsForm, stat3Label: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 3 Qiymati</label>
                      <input type="text" value={statsForm.stat3Value} onChange={e => setStatsForm({...statsForm, stat3Value: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  {/* Stat 4 */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 4 Nomi</label>
                      <input type="text" value={statsForm.stat4Label} onChange={e => setStatsForm({...statsForm, stat4Label: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Statistika 4 Qiymati</label>
                      <input type="text" value={statsForm.stat4Value} onChange={e => setStatsForm({...statsForm, stat4Value: e.target.value})} className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <button onClick={() => props.onUpdateGlobalStats(statsForm)} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all"><Save size={24}/> Statistikani saqlash</button>
                  </div>
                </div>
              </div>

              {/* Achievements list */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black">Yutuqlar</h2>
                  <button onClick={() => { setEditingAchievement(null); setAchForm({date: '2024'}); setShowAchievementModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={20}/> Qo'shish</button>
                </div>
                <div className="grid gap-4">
                  {props.achievements.map(a => (
                    <div key={a.id} className="bg-white p-4 rounded-3xl border flex items-center justify-between">
                      <div className="flex items-center gap-4"><div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Award/></div><h4 className="font-bold">{a.title} ({a.date})</h4></div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingAchievement(a); setAchForm(a); setShowAchievementModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={18}/></button>
                        <button onClick={() => props.onDeleteAchievement(a.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Kurslar</h2>
                <button onClick={() => { setEditingCourse(null); setCourseForm({category:'IT', duration:'3 oy', students: 0}); setShowCourseModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={20}/> Qo'shish</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {props.courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[32px] border flex items-center justify-between hover:border-indigo-600 transition">
                    <div className="flex items-center gap-4">
                      <img src={c.image} className="w-16 h-16 rounded-2xl object-cover" />
                      <div>
                        <h4 className="font-black">{c.title}</h4>
                        <p className="text-[10px] font-black text-indigo-600 uppercase">{c.category}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{c.students} o'quvchi</p>
                      </div>
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

          {activeTab === AdminSubSection.NEWS_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Yangiliklar</h2>
                <button onClick={() => { setEditingNews(null); setNewsForm({date: new Date().toLocaleDateString('uz-UZ')}); setShowNewsModal(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={20}/> Yangilik qo'shish</button>
              </div>
              <div className="grid gap-4">
                {props.news.map(n => (
                  <div key={n.id} className="bg-white p-4 rounded-3xl border flex items-center justify-between">
                    <div className="flex items-center gap-4"><img src={n.image} className="w-20 h-16 rounded-xl object-cover"/><h4 className="font-bold">{n.title}</h4></div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingNews(n); setNewsForm(n); setShowNewsModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={18}/></button>
                      <button onClick={() => props.onDeleteNews(n.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.MESSAGES && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black">Xabarlar</h2>
              <div className="bg-white rounded-[32px] border overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Ism</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Ma'lumot</th>
                      <th className="px-6 py-4 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.messages.map((item: any) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{item.message}</td>
                        <td className="px-6 py-4 text-right"><button onClick={() => props.onDeleteMessage(item.id)} className="text-rose-500 p-2"><Trash2 size={18}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.ENROLLMENTS && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black">Arizalar</h2>
              <div className="bg-white rounded-[32px] border overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">O'quvchi</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Kurs</th>
                      <th className="px-6 py-4 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.enrollments.map((item: any) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold">{item.studentName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{item.courseTitle}</td>
                        <td className="px-6 py-4 text-right"><button onClick={() => props.onDeleteEnrollment(item.id)} className="text-rose-500 p-2"><Trash2 size={18}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="max-w-xl animate-fadeIn space-y-8">
              <h2 className="text-2xl font-black">Profil rasmi</h2>
              <div className="bg-white p-12 rounded-[40px] border shadow-xl flex flex-col items-center">
                <div className="relative group">
                  <img src={props.teacherImage} className="w-64 h-64 rounded-full object-cover border-8 border-white shadow-2xl" />
                  <button onClick={() => profileFileInputRef.current?.click()} className="absolute bottom-4 right-4 p-5 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition"><Camera size={28}/></button>
                  <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'profile')} />
                </div>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.CONTACT_MGMT && (
            <div className="max-w-2xl animate-fadeIn space-y-6">
              <h2 className="text-2xl font-black">Kontaktlar</h2>
              <div className="bg-white p-8 rounded-[40px] border shadow-xl space-y-4">
                {Object.keys(contactForm).map((k: any) => (
                  <div key={k} className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{k}</label>
                    <input type="text" value={(contactForm as any)[k]} onChange={e => setContactForm({...contactForm, [k]: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                ))}
                <button onClick={() => props.onUpdateContactInfo(contactForm)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"><Save size={20}/> Saqlash</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black">{editingCourse ? 'Tahrirlash' : 'Yangi kurs'}</h2><button onClick={() => setShowCourseModal(false)}><X/></button></div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
                <img src={courseForm.image || 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-xl object-cover"/>
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white border rounded-xl text-sm font-bold">Rasm yuklash</button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={e => handleImageUpload(e, 'course')}/>
              </div>
              <input type="text" placeholder="Kurs Nomi" value={courseForm.title || ''} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Kategoriya</label>
                   <input type="text" placeholder="Kategoriya" value={courseForm.category || ''} onChange={e => setCourseForm({...courseForm, category: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">O'quvchilar soni</label>
                   <input type="number" placeholder="O'quvchilar soni" value={courseForm.students || 0} onChange={e => setCourseForm({...courseForm, students: parseInt(e.target.value) || 0})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
                </div>
              </div>
              <textarea placeholder="Tavsif" value={courseForm.description || ''} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl h-24 outline-none" />
              <textarea placeholder="Mundarija" value={courseForm.content || ''} onChange={e => setCourseForm({...courseForm, content: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl h-40 outline-none" />
              <button onClick={() => { if(editingCourse) props.onUpdateCourse({...editingCourse, ...courseForm} as Course); else props.onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseForm} as Course); setShowCourseModal(false); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-md shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black">Yutuqni saqlash</h2><button onClick={() => setShowAchievementModal(false)}><X/></button></div>
            <div className="space-y-4">
              <input type="text" placeholder="Sarlavha" value={achForm.title || ''} onChange={e => setAchForm({...achForm, title: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <input type="text" placeholder="Yil" value={achForm.date || ''} onChange={e => setAchForm({...achForm, date: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <textarea placeholder="Tavsif" value={achForm.description || ''} onChange={e => setAchForm({...achForm, description: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl h-24 outline-none" />
              <button onClick={() => { if(editingAchievement) props.onUpdateAchievement({...editingAchievement, ...achForm} as Achievement); else props.onAddAchievement({id: Math.random().toString(36).substr(2,9), ...achForm} as Achievement); setShowAchievementModal(false); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
