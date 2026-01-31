
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft,
  Loader2,
  Award,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  UserCheck,
  GraduationCap,
  Instagram,
  Youtube,
  Facebook,
  Send,
  Check,
  Camera,
  Calendar,
  AlertCircle,
  Newspaper,
  Video,
  // Added missing Code2 icon
  Code2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { AdminSubSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment, NewsItem } from '../types';
import { PERFORMANCE_DATA } from '../constants';
import { generateCourseOutline } from '../services/geminiService';

interface AdminPanelProps {
  courses: Course[];
  achievements: Achievement[];
  news: NewsItem[];
  teacherImage: string;
  contactInfo: ContactInfo;
  messages: ContactMessage[];
  enrollments: CourseEnrollment[];
  onUpdateTeacherImage: (url: string) => void;
  onUpdateContactInfo: (info: ContactInfo) => void;
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

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  courses, 
  achievements,
  news,
  teacherImage,
  contactInfo,
  messages,
  enrollments,
  onUpdateTeacherImage,
  onUpdateContactInfo,
  onAddCourse, 
  onUpdateCourse,
  onDeleteCourse, 
  onAddAchievement,
  onUpdateAchievement,
  onDeleteAchievement,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  onDeleteMessage,
  onDeleteEnrollment,
  onExit 
}) => {
  const [activeTab, setActiveTab] = useState<AdminSubSection>(AdminSubSection.DASHBOARD);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  
  // Forms state
  const [courseFormData, setCourseFormData] = useState({
    title: '', category: '', description: '', duration: '3 oy', image: '', students: 0, content: ''
  });

  const [achievementFormData, setAchievementFormData] = useState({
    title: '', date: '', description: '', content: ''
  });

  const [newsFormData, setNewsFormData] = useState({
    title: '', date: new Date().toLocaleDateString('uz-UZ'), description: '', content: '', image: '', videoUrl: ''
  });

  const [contactData, setContactData] = useState<ContactInfo>(contactInfo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const newsFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContactData(contactInfo);
  }, [contactInfo]);

  const handleSaveContacts = () => {
    setSaveStatus('saving');
    onUpdateContactInfo(contactData);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'course' | 'profile' | 'news') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Rasm hajmi juda katta (maksimal 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'course') {
          setCourseFormData(prev => ({ ...prev, image: base64String }));
        } else if (target === 'profile') {
          onUpdateTeacherImage(base64String);
        } else if (target === 'news') {
          setNewsFormData(prev => ({ ...prev, image: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddNewsModal = () => {
    setEditingNews(null);
    setNewsFormData({ title: '', date: new Date().toLocaleDateString('uz-UZ'), description: '', content: '', image: '', videoUrl: '' });
    setShowNewsModal(true);
  };

  const openEditNewsModal = (item: NewsItem) => {
    setEditingNews(item);
    // Fix: Explicitly map properties to avoid type mismatch and provide fallback for videoUrl
    setNewsFormData({
      title: item.title,
      date: item.date,
      description: item.description,
      content: item.content,
      image: item.image,
      videoUrl: item.videoUrl || ''
    });
    setShowNewsModal(true);
  };

  const SidebarItem = ({ id, icon: Icon, label, count }: { id: AdminSubSection, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>{count}</span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 overflow-y-auto">
        <div className="p-6 flex items-center space-x-2 text-indigo-600">
          <Code2 className="w-8 h-8" />
          <span className="text-xl font-black tracking-tight uppercase">IT Yakkabog'</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Asosiy statistika" />
          <SidebarItem id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil rasmi" />
          <SidebarItem id={AdminSubSection.NEWS_MGMT} icon={Newspaper} label="Yangiliklar" />
          <SidebarItem id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslarni boshqarish" />
          <SidebarItem id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar" />
          <SidebarItem id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarItem id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={enrollments.length} />
          <SidebarItem id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={messages.length} />
          <SidebarItem id={AdminSubSection.AI_TOOLS} icon={Sparkles} label="AI Yordamchi" />
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={onExit} className="w-full flex items-center space-x-2 text-slate-500 hover:text-indigo-600 p-2 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Saytga qaytish</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {activeTab === AdminSubSection.DASHBOARD && (
            <div className="space-y-10 animate-fadeIn">
              <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Jami Kurslar', value: courses.length, bg: 'bg-blue-600' },
                  { label: 'Yangiliklar', value: news.length, bg: 'bg-indigo-600' },
                  { label: 'Arizalar', value: enrollments.length, bg: 'bg-emerald-600' },
                  { label: 'Xabarlar', value: messages.length, bg: 'bg-amber-600' }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-6 rounded-3xl text-white shadow-xl`}>
                    <p className="text-xs font-black opacity-80 uppercase mb-2">{stat.label}</p>
                    <p className="text-4xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.NEWS_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Yangiliklar</h2>
                <button onClick={openAddNewsModal} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  <Plus size={20}/> Yangilik qo'shish
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {news.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                        <p className="text-xs font-black text-indigo-600 uppercase">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditNewsModal(item)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"><Edit3 size={20}/></button>
                      <button onClick={() => onDeleteNews(item.id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* ... (Existing sections: Course, Profile, Achievement, Contact etc.) */}
        </div>
      </main>

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-slideUp">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">{editingNews ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}</h2>
              <button onClick={() => setShowNewsModal(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition"><X size={20}/></button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Rasm</label>
                <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                  <div className="w-32 h-20 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    {newsFormData.image ? <img src={newsFormData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={28}/></div>}
                  </div>
                  <div className="flex-1">
                    <button onClick={() => newsFileInputRef.current?.click()} className="px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-50 transition">
                      <Upload size={18}/> Tanlash
                    </button>
                  </div>
                  <input type="file" ref={newsFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'news')} />
                </div>
              </div>
              <input type="text" placeholder="Sarlavha" value={newsFormData.title} onChange={e => setNewsFormData({...newsFormData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input type="text" placeholder="Video havolasi (YouTube)" value={newsFormData.videoUrl} onChange={e => setNewsFormData({...newsFormData, videoUrl: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              <textarea placeholder="Qisqa tavsif" value={newsFormData.description} onChange={e => setNewsFormData({...newsFormData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-indigo-500" />
              <textarea placeholder="Batafsil ma'lumot" value={newsFormData.content} onChange={e => setNewsFormData({...newsFormData, content: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-48 outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => {
                 if (!newsFormData.title) return alert("Sarlavhani kiriting!");
                 if(editingNews) onUpdateNews({...editingNews, ...newsFormData});
                 else onAddNews({id: Math.random().toString(36).substr(2,9), ...newsFormData});
                 setShowNewsModal(false);
              }} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition">Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Course/Achievement modals go here (Keep from previous) */}
    </div>
  );
};

export default AdminPanel;
