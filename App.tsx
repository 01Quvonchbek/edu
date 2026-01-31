
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  Award,
  Users,
  Clock,
  Phone,
  MapPin,
  Send,
  Loader2,
  Instagram,
  Youtube,
  Facebook,
  Github,
  Star,
  ExternalLink,
  Code2,
  AlertCircle
} from 'lucide-react';
import { AppSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment } from './types';
import { INITIAL_COURSES, ACHIEVEMENTS as INITIAL_ACHIEVEMENTS } from './constants';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edu_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('edu_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('edu_contact');
    return saved ? JSON.parse(saved) : {
      address: 'Toshkent sh., Chilonzor tumani, 5-mavze',
      email: 'info@eduport.uz',
      phone: '+998 90 123 45 67',
      instagram: 'https://instagram.com/eduport',
      telegram: 'https://t.me/eduport_admin',
      youtube: 'https://youtube.com/@eduport',
      facebook: 'https://facebook.com/eduport'
    };
  });

  const [teacherImage, setTeacherImage] = useState(() => {
    return localStorage.getItem('edu_teacher_image') || 'https://images.unsplash.com/photo-1544717297-fa15739a5447?auto=format&fit=crop&q=80&w=800';
  });

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [selectedItem, setSelectedItem] = useState<{ type: 'course' | 'achievement', data: any } | null>(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useEffect(() => {
    localStorage.setItem('edu_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edu_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('edu_contact', JSON.stringify(contactInfo));
  }, [contactInfo]);

  useEffect(() => {
    localStorage.setItem('edu_teacher_image', teacherImage);
  }, [teacherImage]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    const formData = new FormData(e.currentTarget);
    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      date: new Date().toLocaleString()
    };
    
    setTimeout(() => {
      setMessages([newMessage, ...messages]);
      setFormStatus('success');
      e.currentTarget.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1000);
  };

  const handleEnrollSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem || selectedItem.type !== 'course') return;
    
    setEnrollStatus('sending');
    const formData = new FormData(e.currentTarget);
    const newEnrollment: CourseEnrollment = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: selectedItem.data.id,
      courseTitle: selectedItem.data.title,
      studentName: formData.get('name') as string,
      studentPhone: formData.get('phone') as string,
      date: new Date().toLocaleString()
    };

    setTimeout(() => {
      setEnrollments([newEnrollment, ...enrollments]);
      setEnrollStatus('success');
      setTimeout(() => {
        setEnrollStatus('idle');
        setShowEnrollForm(false);
        setSelectedItem(null);
      }, 2000);
    }, 1200);
  };

  const NavLink = ({ id, label }: { id: AppSection, label: string }) => (
    <button
      onClick={() => {
        setActiveSection(id);
        setIsMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }}
      className={`px-4 py-2 rounded-full transition-all ${
        activeSection === id ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-indigo-600'
      }`}
    >
      {label}
    </button>
  );

  if (activeSection === AppSection.ADMIN) {
    if (!isLoggedIn) {
      return (
        <LoginForm 
          onLogin={(status) => setIsLoggedIn(status)} 
          onCancel={() => setActiveSection(AppSection.HOME)} 
        />
      );
    }
    return (
      <AdminPanel 
        courses={courses} 
        achievements={achievements}
        teacherImage={teacherImage}
        contactInfo={contactInfo}
        messages={messages}
        enrollments={enrollments}
        onUpdateTeacherImage={setTeacherImage}
        onUpdateContactInfo={setContactInfo}
        onAddCourse={(c) => setCourses([...courses, c])}
        onUpdateCourse={(updated) => setCourses(courses.map(c => c.id === updated.id ? updated : c))}
        onDeleteCourse={(id) => setCourses(courses.filter(c => c.id !== id))}
        onAddAchievement={(a) => setAchievements([...achievements, a])}
        onUpdateAchievement={(updated) => setAchievements(achievements.map(a => a.id === updated.id ? updated : a))}
        onDeleteAchievement={(id) => setAchievements(achievements.filter(a => a.id !== id))}
        onDeleteMessage={(id) => setMessages(messages.filter(m => m.id !== id))}
        onDeleteEnrollment={(id) => setEnrollments(enrollments.filter(e => e.id !== id))}
        onExit={() => setActiveSection(AppSection.HOME)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-indigo-600 cursor-pointer select-none" onClick={() => {
            setLogoClicks(p => p + 1);
            if (logoClicks >= 4) { setActiveSection(AppSection.ADMIN); setLogoClicks(0); }
          }}>
            <GraduationCap className="w-10 h-10" />
            <span className="text-2xl font-black tracking-tighter">EduPort</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <NavLink id={AppSection.HOME} label="Asosiy" />
            <NavLink id={AppSection.COURSES} label="Kurslar" />
            <NavLink id={AppSection.ABOUT} label="Yutuqlar" />
            <NavLink id={AppSection.CONTACT} label="Aloqa" />
          </div>
          <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-fadeIn">
          <div className="flex flex-col space-y-4">
             <NavLink id={AppSection.HOME} label="Asosiy" />
             <NavLink id={AppSection.COURSES} label="Kurslar" />
             <NavLink id={AppSection.ABOUT} label="Yutuqlar" />
             <NavLink id={AppSection.CONTACT} label="Aloqa" />
          </div>
        </div>
      )}

      <section id="home" className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-indigo-50 rounded-bl-[100px] hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slideUp">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold tracking-wide uppercase">Ta'lim Mutaxassisi</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">Bilimga asoslangan <span className="text-indigo-600">kelajak</span></h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">Metodika, texnologiya va AI integratsiyasi orqali ta'lim sifatini oshirish.</p>
            <button onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-200">
              <span>Kurslarni ko'rish</span>
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="relative animate-fadeIn hidden md:block">
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl bg-slate-200 aspect-[4/5]">
              <img src={teacherImage} alt="Teacher" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-black text-slate-900">Mualliflik kurslari</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} onClick={() => setSelectedItem({ type: 'course', data: course })} className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-indigo-600 transition-all hover:shadow-xl">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">{course.title}</h3>
                  <p className="text-slate-600 line-clamp-2">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-12">Yutuqlar</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((ach) => (
              <div key={ach.id} onClick={() => setSelectedItem({ type: 'achievement', data: ach })} className="group cursor-pointer flex space-x-4 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-sm"><Award size={28} /></div>
                <div>
                  <span className="text-indigo-600 text-xs font-black uppercase">{ach.date}</span>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{ach.title}</h3>
                  <p className="text-slate-600 line-clamp-2">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900">Aloqa</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600"><MapPin size={24} /></div>
                  <p className="text-slate-900 font-medium">{contactInfo.address}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600"><Mail size={24} /></div>
                  <p className="text-slate-900 font-medium">{contactInfo.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600"><Phone size={24} /></div>
                  <p className="text-slate-900 font-medium">{contactInfo.phone}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-slate-100">
              <form onSubmit={handleSendMessage} className="space-y-6">
                <input name="name" type="text" required placeholder="Ismingiz" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500" />
                <input name="email" type="email" required placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500" />
                <textarea name="message" required placeholder="Xabaringiz" rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg">{formStatus === 'sending' ? 'Yuborilmoqda...' : 'Xabar yuborish'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white pt-24 pb-12 text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 flex flex-col items-center">
          <div className="flex items-center space-x-2 text-indigo-400">
            <GraduationCap className="w-10 h-10" />
            <span className="text-2xl font-black tracking-tighter text-white">EduPort</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
             <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300 shadow-lg" title="Instagram">
                <Instagram size={28} />
             </a>
             <a href={contactInfo.telegram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-sky-500 hover:-translate-y-1 transition-all duration-300 shadow-lg" title="Telegram">
                <Send size={28} />
             </a>
             <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 shadow-lg" title="YouTube">
                <Youtube size={28} />
             </a>
             <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-lg" title="Facebook">
                <Facebook size={28} />
             </a>
             <a href={`mailto:${contactInfo.email}`} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 shadow-lg" title="Email">
                <Mail size={28} />
             </a>
          </div>
          <p className="text-slate-500 text-sm mt-8">&copy; 2024 EduPortfolio. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4 md:p-8 animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-slideUp max-h-[90vh] relative">
            {selectedItem.type === 'course' && (
              <div className="w-full md:w-2/5 bg-slate-100 relative h-64 md:h-auto">
                <img src={selectedItem.data.image} alt={selectedItem.data.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`w-full flex-1 p-8 md:p-12 overflow-y-auto ${selectedItem.type === 'achievement' ? 'md:w-full' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{selectedItem.data.title}</h2>
                </div>
                <button onClick={() => { setSelectedItem(null); setShowEnrollForm(false); }} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition text-slate-600"><X size={24} /></button>
              </div>
              <p className="text-xl text-slate-600 mb-8 italic border-l-4 border-indigo-200 pl-6">{selectedItem.data.description}</p>
              <div className="text-slate-800 leading-relaxed space-y-4 whitespace-pre-wrap mb-10">{selectedItem.data.content || "Ma'lumot mavjud emas."}</div>
              {selectedItem.type === 'course' && !showEnrollForm && (
                <button onClick={() => setShowEnrollForm(true)} className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg"><span>Kursga yozilish</span><ArrowRight size={20} /></button>
              )}
              {selectedItem.type === 'course' && showEnrollForm && (
                <form onSubmit={handleEnrollSubmit} className="mt-8 p-8 bg-white border-2 border-indigo-100 rounded-[32px] space-y-4 animate-fadeIn">
                  <input name="name" required type="text" placeholder="Ismingiz" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 outline-none" />
                  <input name="phone" required type="text" placeholder="Telefon" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 outline-none" />
                  <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">{enrollStatus === 'sending' ? <Loader2 className="animate-spin" /> : enrollStatus === 'success' ? <CheckCircle /> : <span>Yuborish</span>}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
