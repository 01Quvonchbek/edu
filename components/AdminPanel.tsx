
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
  FileText,
  UserCheck,
  GraduationCap,
  Instagram,
  Youtube,
  Facebook,
  Github,
  Send,
  Check,
  RefreshCw,
  Globe,
  Camera
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
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [courseFormData, setCourseFormData] = useState({
    title: '', category: '', description: '', duration: '3 oy', image: '', students: 0, content: ''
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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'course') {
          setCourseFormData({ ...courseFormData, image: base64String });
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
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl lg:shadow-none overflow-y-auto">
        <div className="p-6 flex items-center space-x-2 text-indigo-600">
          <GraduationCap className="w-8 h-8" />
          <span className="text-xl font-black tracking-tight">AdminPanel</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem id={AdminSubSection.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id={AdminSubSection.PROFILE_MGMT} icon={UserIcon} label="Profil Rasm" />
          <SidebarItem id={AdminSubSection.COURSE_MGMT} icon={BookOpen} label="Kurslar" />
          <SidebarItem id={AdminSubSection.ACHIEVEMENT_MGMT} icon={Award} label="Yutuqlar" />
          <SidebarItem id={AdminSubSection.CONTACT_MGMT} icon={Phone} label="Kontaktlar" />
          <SidebarItem id={AdminSubSection.ENROLLMENTS} icon={UserCheck} label="Arizalar" count={enrollments.length} />
          <SidebarItem id={AdminSubSection.MESSAGES} icon={MessageSquare} label="Xabarlar" count={messages.length} />
          <SidebarItem id={AdminSubSection.AI_TOOLS} icon={Sparkles} label="AI Yordamchi" />
        </nav>
        <div className="p-4 border-t border-slate-100 mt-auto">
          <button onClick={onExit} className="w-full flex items-center space-x-2 text-slate-500 hover:text-indigo-600 p-2 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Chiqish</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {activeTab === AdminSubSection.DASHBOARD && (
            <div className="space-y-10 animate-fadeIn">
              <h1 className="text-3xl font-black text-slate-900">Xush kelibsiz!</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Kurslar', value: courses.length, bg: 'bg-blue-500' },
                  { label: 'Arizalar', value: enrollments.length, bg: 'bg-indigo-500' },
                  { label: 'Xabarlar', value: messages.length, bg: 'bg-amber-500' },
                  { label: 'Yutuqlar', value: achievements.length, bg: 'bg-emerald-500' }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-6 rounded-3xl text-white shadow-lg`}>
                    <p className="text-sm font-bold opacity-80 uppercase mb-2">{stat.label}</p>
                    <p className="text-4xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm h-[400px]">
                 <h3 className="text-xl font-bold mb-6">O'quvchilar statistikasi</h3>
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={PERFORMANCE_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.PROFILE_MGMT && (
            <div className="max-w-2xl animate-fadeIn space-y-8">
              <h2 className="text-2xl font-black">Profil ma'lumotlari</h2>
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center space-y-8">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-100 shadow-xl">
                    <img src={teacherImage} className="w-full h-full object-cover" alt="Profile" />
                  </div>
                  <button 
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
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
                <div className="text-center space-y-2">
                   <p className="text-lg font-bold text-slate-900">Asosiy portret rasmi</p>
                   <p className="text-sm text-slate-500">Ushbu rasm asosiy sahifada ko'rinadi. Professional ko'rinish uchun sifatli rasm yuklang.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.CONTACT_MGMT && (
            <div className="max-w-3xl space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-black flex items-center gap-2"><Phone className="text-indigo-600" /> Aloqa Ma'lumotlari</h2>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center space-x-2 text-slate-700"><Mail size={16}/> <span>Email</span></label>
                    <input type="email" value={contactData.email} onChange={(e) => setContactData({...contactData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center space-x-2 text-slate-700"><Phone size={16}/> <span>Telefon</span></label>
                    <input type="text" value={contactData.phone} onChange={(e) => setContactData({...contactData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center space-x-2 text-slate-700"><Instagram size={16} className="text-pink-600" /> <span>Instagram URL</span></label>
                    <input type="text" value={contactData.instagram} onChange={(e) => setContactData({...contactData, instagram: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center space-x-2 text-slate-700"><Send size={16} className="text-sky-500" /> <span>Telegram URL</span></label>
                    <input type="text" value={contactData.telegram} onChange={(e) => setContactData({...contactData, telegram: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center space-x-2 text-slate-700"><Facebook size={16} className="text-blue-600" /> <span>Facebook URL</span></label>
                    <input type="text" value={contactData.facebook} onChange={(e) => setContactData({...contactData, facebook: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center space-x-2 text-slate-700"><Youtube size={16} className="text-red-600" /> <span>YouTube URL</span></label>
                    <input type="text" value={contactData.youtube} onChange={(e) => setContactData({...contactData, youtube: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold flex items-center space-x-2 text-slate-700"><MapPin size={16}/> <span>Manzil</span></label>
                   <input type="text" value={contactData.address} onChange={(e) => setContactData({...contactData, address: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <button 
                  onClick={handleSaveContacts} 
                  disabled={saveStatus !== 'idle'}
                  className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 transition shadow-lg ${
                    saveStatus === 'saved' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {saveStatus === 'saving' ? <Loader2 className="animate-spin" /> : saveStatus === 'saved' ? <Check /> : <Save size={20}/>} 
                  <span>{saveStatus === 'saved' ? 'Saqlandi!' : 'Ma\'lumotlarni saqlash'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.ENROLLMENTS && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black">Kurs arizalari</h2>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-5 font-bold text-sm uppercase">F.I.O</th>
                      <th className="p-5 font-bold text-sm uppercase">Telefon</th>
                      <th className="p-5 font-bold text-sm uppercase">Kurs</th>
                      <th className="p-5 text-right uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrollments.length === 0 ? (
                      <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">Arizalar mavjud emas.</td></tr>
                    ) : (
                      enrollments.map(e => (
                        <tr key={e.id} className="hover:bg-slate-50">
                          <td className="p-5 font-bold">{e.studentName}</td>
                          <td className="p-5 text-indigo-600 font-medium">{e.studentPhone}</td>
                          <td className="p-5">{e.courseTitle}</td>
                          <td className="p-5 text-right"><button onClick={() => onDeleteEnrollment(e.id)} className="text-slate-300 hover:text-rose-500 transition"><Trash2 size={18}/></button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === AdminSubSection.COURSE_MGMT && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Kurslar ro'yxati</h2>
                <button onClick={openAddCourseModal} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition"><Plus size={20}/> Qo'shish</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm border border-slate-200">
                    <div className="flex gap-4 items-center">
                      <img src={c.image} className="w-16 h-12 rounded-lg object-cover bg-slate-100" />
                      <h4 className="font-bold">{c.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditCourseModal(c)} className="p-2 text-slate-400 hover:text-indigo-600 transition"><Edit3 size={18}/></button>
                      <button onClick={() => onDeleteCourse(c.id)} className="p-2 text-slate-400 hover:text-rose-500 transition"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === AdminSubSection.AI_TOOLS && (
            <div className="max-w-3xl space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black flex items-center gap-2 text-amber-500"><Sparkles/> AI Yordamchi</h2>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                <input type="text" placeholder="Kurs nomi..." value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <button 
                   onClick={async () => {
                     if (!courseFormData.title) return alert("Iltimos, avval kurs nomini kiriting!");
                     setIsGenerating(true);
                     try {
                        const res = await generateCourseOutline(courseFormData.title, 'Ta\'lim');
                        setAiResult(res.outline);
                     } catch(e) {
                       alert("AI bilan bog'lanishda xatolik!");
                     } finally { setIsGenerating(false); }
                   }}
                   className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex justify-center gap-2 hover:bg-indigo-700 transition"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20}/>} Reja tuzish
                </button>
              </div>
              {aiResult && (
                <div className="space-y-4 animate-slideUp">
                  {aiResult.map((r: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-indigo-100"><p className="font-bold text-slate-900">{r.chapter}</p><p className="text-slate-600 text-sm mt-1">{r.description}</p></div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showCourseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black">Kurs ma'lumotlari</h2><button onClick={() => setShowCourseModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X/></button></div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Kurs rasm (JPG/PNG)</label>
                <div className="flex gap-4 items-center">
                  <div className="w-32 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    {courseFormData.image ? <img src={courseFormData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={24}/></div>}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition">
                    <Upload size={16}/> Tanlash
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'course')} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Kurs nomi</label>
                <input type="text" placeholder="Matematika asoslari" value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Qisqa tavsif</label>
                <textarea placeholder="Kurs haqida qisqacha..." value={courseFormData.description} onChange={e => setCourseFormData({...courseFormData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">To'liq ma'lumot</label>
                <textarea placeholder="Kurs dasturi va batafsil ma'lumotlar..." value={courseFormData.content} onChange={e => setCourseFormData({...courseFormData, content: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-48 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button onClick={() => {
                 if(editingCourse) onUpdateCourse({...editingCourse, ...courseFormData});
                 else onAddCourse({id: Math.random().toString(36).substr(2,9), ...courseFormData, students: 0, image: courseFormData.image || 'https://picsum.photos/seed/edu/800/600', category: 'General'});
                 setShowCourseModal(false);
              }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
