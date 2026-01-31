
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, ArrowLeft, Award, Save, X, 
  User as UserIcon, Phone, MessageSquare, UserCheck, Code2, Newspaper, BarChart3, Mail, Globe, 
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

  const [contactForm, setContactForm] = useState<ContactInfo>(props.contactInfo);
  const [statsForm, setStatsForm] = useState<GlobalStats>(props.globalStats);

  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState(false);

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

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const result = await generateCourseOutline(aiPrompt, aiCategory || 'Umumiy');
      setGeneratedOutline(result.outline);
    } catch (error) {
      alert("AI generatsiyada xatolik yuz berdi.");
    } finally {
      setIsGenerating(false);
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
        {(['uz', 'ru', 'en'] as const).map((l) => (
          <div key={l} className="flex gap-2">
            <span className="w-10 shrink-0 flex items-center justify-center font-black text-[10px] uppercase text-slate-400 bg-white border border-slate-200 rounded-xl">{l}</span>
            {isTextArea ? (
              <textarea 
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                rows={3}
                value={value[l] || ''} 
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              />
            ) : (
              <input 
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
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
      <aside className="w-72 bg-white border-r fixed inset-y-0 left-0 z-50 flex flex-col shadow-xl">
        <div className="p-8 flex items-center gap-3 text-indigo-600">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Code2 size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Admin <span className="text-slate-900">Edu</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Asosiy</div>
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Boshqaruv paneli" />
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-2">Kontent</div>
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Statistika" />
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-2">AI Kuchaytirgich</div>
          <SidebarBtn id={AdminSubSection.AI_TOOLS} icon={Sparkles} label="AI Generator" />

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

      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
          
          {activeTab === AdminSubSection.DASHBOARD && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Xush kelibsiz!</h1>
                <p className="text-slate-500 font-medium">Barcha ko'rsatkichlar joyida.</p>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Kurslar', val: props.courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Arizalar', val: props.enrollments.length, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Xabarlar', val: props.messages.length, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

          {activeTab === AdminSubSection.AI_TOOLS && (
            <div className="space-y-8 animate-fadeIn">
              <div className="max-w-3xl space-y-4">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <Sparkles className="text-indigo-600" /> Kurs Rejasini AI bilan yarating
                </h2>
                <p className="text-slate-500">Gemini 3.0 Flash yordamida har qanday kurs uchun professional syllabus va o'quv rejasini bir necha soniyada yarating.</p>
              </div>

              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Kurs nomi</label>
                    <input 
                      value={aiPrompt} 
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Masalan: Full-Stack Web Dasturlash" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Yo'nalish</label>
                    <input 
                      value={aiCategory} 
                      onChange={(e) => setAiCategory(e.target.value)}
                      placeholder="Masalan: IT / Dizayn" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !aiPrompt}
                  className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                  {isGenerating ? "Generatsiya qilinmoqda..." : "Kurs rejasini yaratish"}
                </button>
              </div>

              {generatedOutline.length > 0 && (
                <div className="space-y-6 animate-slideUp">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900">AI tomonidan yaratilgan reja:</h3>
                    <button 
                      onClick={() => {
                        const text = generatedOutline.map(o => `• ${o.chapter}: ${o.description}`).join('\n');
                        navigator.clipboard.writeText(text);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-xl"
                    >
                      {isCopied ? <Check size={16}/> : <Copy size={16}/>}
                      {isCopied ? "Nusxalandi" : "Nusxa olish"}
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {generatedOutline.map((item, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-6 items-start">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black shrink-0">{idx + 1}</div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg mb-1">{item.chapter}</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Kurslar</h2>
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
                        <img src={c.image} className="w-full h-full object-cover" />
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
                        <img src={n.image} className="w-full h-full object-cover" />
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

          {activeTab === AdminSubSection.MESSAGES && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900">Xabarlar</h2>
              {props.messages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
                  <p className="text-slate-400 font-bold">Hozircha xabarlar yo'q.</p>
                </div>
              ) : (
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
              )}
            </div>
          )}

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
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {props.enrollments.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 font-black text-slate-900">{e.studentName}</td>
                        <td className="px-8 py-6 font-bold text-indigo-600">{e.courseTitle}</td>
                        <td className="px-8 py-6 text-slate-500">{e.studentPhone}</td>
                        <td className="px-8 py-6 text-slate-400 text-xs">{new Date(e.date).toLocaleDateString()}</td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => props.onDeleteEnrollment(e.id)} className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.ACHIEVEMENT_MGMT && (
            <div className="space-y-12 animate-fadeIn">
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3"><BarChart3 size={28} className="text-indigo-600"/> Statistika</h2>
                <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[1, 2, 3, 4].map(num => (
                      <div key={num} className="space-y-6">
                        <LocalizedInput 
                          label={`Karta ${num} Sarlavhasi`} 
                          value={statsForm[`stat${num as 1|2|3|4}Label` as keyof GlobalStats] as LocalizedText} 
                          onChange={val => setStatsForm({...statsForm, [`stat${num as 1|2|3|4}Label`]: val})} 
                        />
                        <div className="space-y-1 ml-1">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Qiymat (masalan: 98%)</p>
                          <input 
                            type="text" 
                            value={statsForm[`stat${num as 1|2|3|4}Value` as keyof GlobalStats] as string} 
                            onChange={e => setStatsForm({...statsForm, [`stat${num as 1|2|3|4}Value`]: e.target.value})} 
                            className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                          />
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
                </div>
                <button onClick={() => props.onUpdateContactInfo(contactForm)} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black shadow-2xl hover:bg-slate-800 transition-all">Saqlash</button>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900">Profil rasmi</h2>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl flex flex-col items-center gap-10 max-w-xl">
                <div className="w-64 h-80 rounded-[48px] overflow-hidden border-8 border-slate-50 shadow-2xl">
                  <img src={props.teacherImage} className="w-full h-full object-cover" />
                </div>
                <div className="w-full space-y-4 text-center">
                  <button onClick={() => profileFileInputRef.current?.click()} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    <Camera size={20}/> Rasmni o'zgartirish
                  </button>
                  <input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'profile')} />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-5xl shadow-3xl overflow-y-auto max-h-[90vh] space-y-10 animate-slideUp">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-slate-900">{editingCourse ? 'Tahrirlash' : 'Yangi kurs'}</h2>
              <button onClick={() => setShowCourseModal(false)} className="p-4 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 rounded-[48px] border border-slate-100 flex flex-col items-center gap-6">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                    {courseForm.image ? <img src={courseForm.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">Rasm tanlang</div>}
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

      {showNewsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-5xl shadow-3xl overflow-y-auto max-h-[90vh] space-y-10 animate-slideUp">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-slate-900">{editingNews ? 'Tahrirlash' : 'Yangi yangilik'}</h2>
              <button onClick={() => setShowNewsModal(false)} className="p-4 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 rounded-[48px] border border-slate-100 flex flex-col items-center gap-6">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                    {newsForm.image ? <img src={newsForm.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">Rasm tanlang</div>}
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
