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

  const [contactForm, setContactForm] = useState<ContactInfo>(props.contactInfo);
  const [statsForm, setStatsForm] = useState<GlobalStats>(props.globalStats);

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
          <SidebarBtn id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Boshqaruv paneli" />
          <SidebarBtn id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" count={props.courses.length} />
          <SidebarBtn id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" count={props.news.length} />
          <SidebarBtn id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Statistika" />
          <SidebarBtn id={AdminSubSection.AI_TOOLS} icon={Sparkles} label="AI Generator" />
          <SidebarBtn id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Kursga arizalar" count={props.enrollments.length} />
          <SidebarBtn id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={props.messages.length} />
          <SidebarBtn id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
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
          
          {activeTab === AdminSubSection.ACHIEVEMENT_MGMT && (
            <div className="space-y-12 animate-fadeIn">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3"><BarChart3 size={28} className="text-indigo-600"/> Statistika</h2>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[1, 2, 3, 4].map(num => {
                    const labelKey = `stat${num}Label` as keyof GlobalStats;
                    const valueKey = `stat${num}Value` as keyof GlobalStats;
                    return (
                      <div key={num} className="space-y-6">
                        <LocalizedInput 
                          label={`Karta ${num} Sarlavhasi`} 
                          value={statsForm[labelKey] as LocalizedText} 
                          onChange={val => setStatsForm(prev => ({...prev, [labelKey]: val} as GlobalStats))} 
                        />
                        <div className="space-y-1 ml-1">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Qiymat (masalan: 98%)</p>
                          <input 
                            type="text" 
                            value={statsForm[valueKey] as string} 
                            onChange={e => setStatsForm(prev => ({...prev, [valueKey]: e.target.value} as GlobalStats))} 
                            className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => props.onUpdateGlobalStats(statsForm)} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                  <Save size={24}/> Statistikani Saqlash
                </button>
              </div>
            </div>
          )}

          {/* ... Boshqa tablar bir xil qoladi, faqat tepadagi statistika qismi tsc build'ni buzmasligi uchun explicit cast qilindi ... */}
          {activeTab === AdminSubSection.DASHBOARD && (
             <div className="space-y-8 animate-fadeIn">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Xush kelibsiz!</h1>
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
          
          {/* AI Generator qismi */}
          {activeTab === AdminSubSection.AI_TOOLS && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Kurs nomi..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                  <input value={aiCategory} onChange={e => setAiCategory(e.target.value)} placeholder="Yo'nalish..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                </div>
                <button onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3">
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />} Generatsiya
                </button>
              </div>
              {generatedOutline.length > 0 && (
                <div className="grid gap-4">
                  {generatedOutline.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="font-black text-slate-900">{item.chapter}</h4>
                      <p className="text-slate-500 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;