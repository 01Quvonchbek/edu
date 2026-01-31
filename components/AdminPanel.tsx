
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
  Calendar
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
import { AdminSubSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment } from '../types';
import { PERFORMANCE_DATA } from '../constants';
import { generateCourseOutline } from '../services/geminiService';

interface AdminPanelProps {
  courses: Course[];
  achievements: Achievement[];
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
  onDeleteMessage: (id: string) => void;
  onDeleteEnrollment: (id: string) => void;
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  courses, 
  achievements,
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
  onDeleteMessage,
  onDeleteEnrollment,
  onExit 
}) => {
  const [activeTab, setActiveTab] = useState<AdminSubSection>(AdminSubSection.DASHBOARD);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [aiResult, setAiResult] = useState<any>(null);
  
  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  
  // Forms state
  const [courseFormData, setCourseFormData] = useState({
    title: '', category: '', description: '', duration: '3 oy', image: '', students: 0, content: ''
  });

  const [achievementFormData, setAchievementFormData] = useState({
    title: '', date: '', description: '', content: ''
  });

  const [contactData, setContactData] = useState<ContactInfo>(contactInfo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'course' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Rasm hajmi juda katta (maksimal 3MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'course') {
          setCourseFormData(prev => ({ ...prev, image: base64String }));
        } else {
          onUpdateTeacherImage(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddCourseModal = () => {
    setEditingCourse(null);
    setCourseFormData({ title: '', category: '', description: '', duration: '3 oy', image: '', students: 0, content: '' });
    setShowCourseModal(true);
  };

  const openEditCourseModal = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({ ...course, content: course.content || '' });
    setShowCourseModal(true);
  };

  const openAddAchievementModal = () => {
    setEditingAchievement(null);
    setAchievementFormData({ title: '', date: new Date().getFullYear().toString(), description: '', content: '' });
    setShowAchievementModal(true);
  };

  const openEditAchievementModal = (ach: Achievement) => {
    setEditingAchievement(ach);
    setAchievementFormData({ ...ach, content: ach.content || '' });
    setShowAchievementModal(true);
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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 overflow-y-auto">
        <div className="p-6 flex items-center space-x-2 text-indigo-600">
          <GraduationCap className="w-8 h-8" />
          <span className="text-xl font-black tracking-tight">EduPanel</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Asosiy statistika" />
          <SidebarItem id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil rasmi" />
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
                  { label: 'Yangi Arizalar', value: enrollments.length, bg: 'bg-indigo-600' },
                  { label: 'Xabarlar', value: messages.length, bg: 'bg-amber-600' },
                  { label: 'Yutuqlar', value: achievements.length, bg: 'bg-emerald-600' }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-6 rounded-3xl text-white shadow-xl`}>
                    <p className="text-xs font-black opacity-80 uppercase mb-2">{stat.label}</p>
                    <p className="text-4xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm h-[400px]">
                 <h3 className="text-xl font-bold mb-6">Oylik faollik</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={PERFORMANCE_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                     <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                     <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="max-w-2xl animate-fadeIn space-y-8">
              <h2 className="text-2xl font-black">Profil rasmini yangilash</h2>
              <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className="w-56 h-56 rounded-full overflow-hidden border-8 border-slate-50 shadow-2xl">
                    <img src={teacherImage} className="w-full h-full object-cover" alt="Profile" />
                  </div>
                  <button 
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110"
                  >
                    <Camera size={24} />
                  </button>
                  <input 
                    type="file" 
                    ref={profileFileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'profile')} 
                  />
                </div>
                <div className="text-center max-w-sm">
                   <p className="text-slate-500 text-sm">Saytning asosiy qismida ko'rinadigan portret rasmingiz. Sifatli va professional rasm yuklash tavsiya etiladi.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.ACHIEVEMENT_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Yutuqlar ro'yxati</h2>
                <button onClick={openAddAchievementModal} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  <Plus size={20}/> Yangi qo'shish
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <Award size={28} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{ach.title}</h4>
                        <p className="text-xs font-black text-indigo-600 uppercase">{ach.date}-yil</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditAchievementModal(ach)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"><Edit3 size={20}/></button>
                      <button onClick={() => onDeleteAchievement(ach.id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="text-center p-16 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                    <Award size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">Hali hech qanday yutuq qo'shilmagan.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Kurslar</h2>
                <button onClick={openAddCourseModal} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  <Plus size={20}/> Kurs yaratish
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[32px] flex justify-between items-center shadow-sm border border-slate-200">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={c.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{c.title}</h4>
                        <p className="text-xs text-slate-400 font-bold">{c.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditCourseModal(c)} className="p-2 text-slate-400 hover:text-indigo-600 transition"><Edit3 size={18}/></button>
                      <button onClick={() => onDeleteCourse(c.id)} className="p-2 text-slate-400 hover:text-rose-500 transition"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact and other sections ... (qolgan qismlar mavjud) */}
          {activeTab === AdminSubSection.CONTACT_MGMT && (
            <div className="max-w-3xl space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-black">Bog'lanish ma'lumotlari</h2>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase ml-1">Email</label>
                      <input type="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase ml-1">Telefon</label>
                      <input type="text" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase ml-1">Telegram (Ssilka)</label>
                   <input type="text" value={contactData.telegram} onChange={e => setContactData({...contactData, telegram: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <button onClick={handleSaveContacts} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center space-x-2 transition hover:bg-indigo-700 shadow-lg">
                   {saveStatus === 'saving' ? <Loader2 className="animate-spin" /> : saveStatus === 'saved' ? <Check /> : <Save size={20}/>}
                   <span>{saveStatus === 'saved' ? 'Saqlandi' : 'Saqlash'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals for Courses and Achievements */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-slideUp">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">{editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs'}</h2>
              <button onClick={() => setShowCourseModal(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition"><X size={20}/></button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Kurs Muqovasi</label>
                <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                  <div className="w-32 h-20 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    {courseFormData.image ? <img src={courseFormData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={28}/></div>}
                  </div>
                  <div className="flex-1">
                    <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-50 transition">
                      <Upload size={18}/> Tanlash
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2">Maksimal hajmi: 3MB. Format: JPG, PNG</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'course')} />
                </div>
              </div>
              <input type="text" placeholder="Sarlavha" value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              <textarea placeholder="Qisqa tavsif" value={courseFormData.description} onChange={e => setCourseFormData({...courseFormData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-indigo-500" />
              <textarea placeholder="Kursning to'liq tarkibi va dasturi" value={courseFormData.content} onChange={e => setCourseFormData({...courseFormData, content: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-48 outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => {
                 if (!courseFormData.title) return alert("Kurs nomini kiriting!");
                 if(editingCourse) onUpdateCourse({...editingCourse, ...courseFormData});
                 else onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseFormData, students: 0, image: courseFormData.image || 'https://picsum.photos/seed/edu/800/600'});
                 setShowCourseModal(false);
              }} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition">Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {showAchievementModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-slideUp">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">{editingAchievement ? 'Yutuqni tahrirlash' : 'Yangi yutuq'}</h2>
              <button onClick={() => setShowAchievementModal(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition"><X size={20}/></button>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Sarlavha</label>
                  <input type="text" placeholder="Yutuq nomi" value={achievementFormData.title} onChange={e => setAchievementFormData({...achievementFormData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Yil</label>
                  <input type="text" placeholder="2024" value={achievementFormData.date} onChange={e => setAchievementFormData({...achievementFormData, date: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <textarea placeholder="Qisqa tavsif" value={achievementFormData.description} onChange={e => setAchievementFormData({...achievementFormData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-indigo-500" />
              <textarea placeholder="Batafsil ma'lumot (Marosim, natijalar va h.k.)" value={achievementFormData.content} onChange={e => setAchievementFormData({...achievementFormData, content: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-40 outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => {
                 if (!achievementFormData.title || !achievementFormData.date) return alert("Sarlavha va yilni to'ldiring!");
                 if(editingAchievement) onUpdateAchievement({...editingAchievement, ...achievementFormData});
                 else onAddAchievement({id: Math.random().toString(36).substr(2,9), ...achievementFormData});
                 setShowAchievementModal(false);
              }} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition">Yutuqni saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
