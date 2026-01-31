
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Mail, Award, Users, Phone, MapPin, Send, Instagram, Youtube, Facebook, 
  Code2, Newspaper, Play, Calendar, Sparkles
} from 'lucide-react';
import { AppSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment, NewsItem } from './types';
import { INITIAL_COURSES, INITIAL_NEWS, ACHIEVEMENTS as INITIAL_ACHIEVEMENTS } from './constants';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [courses, setCourses] = useState<Course[]>(() => {
    const s = localStorage.getItem('edu_courses');
    return s ? JSON.parse(s) : INITIAL_COURSES;
  });
  const [news, setNews] = useState<NewsItem[]>(() => {
    const s = localStorage.getItem('edu_news');
    return s ? JSON.parse(s) : INITIAL_NEWS;
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const s = localStorage.getItem('edu_achievements');
    return s ? JSON.parse(s) : INITIAL_ACHIEVEMENTS;
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const s = localStorage.getItem('edu_contact');
    return s ? JSON.parse(s) : { 
      address: 'Yakkabog\' tumani, Markaziy ko\'cha', 
      email: 'it-yakkabog@mail.uz', 
      phone: '+998 90 123 45 67', 
      instagram: '#', telegram: '#', youtube: '#', facebook: '#' 
    };
  });
  const [teacherImage, setTeacherImage] = useState(() => 
    localStorage.getItem('edu_teacher_image') || 'https://images.unsplash.com/photo-1544717297-fa15739a5447?w=800'
  );
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const s = localStorage.getItem('edu_messages');
    return s ? JSON.parse(s) : [];
  });
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>(() => {
    const s = localStorage.getItem('edu_enrollments');
    return s ? JSON.parse(s) : [];
  });

  const [selectedItem, setSelectedItem] = useState<{ type: string, data: any } | null>(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('edu_courses', JSON.stringify(courses));
    localStorage.setItem('edu_news', JSON.stringify(news));
    localStorage.setItem('edu_achievements', JSON.stringify(achievements));
    localStorage.setItem('edu_contact', JSON.stringify(contactInfo));
    localStorage.setItem('edu_teacher_image', teacherImage);
    localStorage.setItem('edu_messages', JSON.stringify(messages));
    localStorage.setItem('edu_enrollments', JSON.stringify(enrollments));
  }, [courses, news, achievements, contactInfo, teacherImage, messages, enrollments]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      date: new Date().toLocaleString()
    };
    setMessages([newMessage, ...messages]);
    alert("Xabaringiz yuborildi!");
    e.currentTarget.reset();
  };

  const handleEnrollSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem || selectedItem.type !== 'course') return;
    const formData = new FormData(e.currentTarget);
    const newEnroll: CourseEnrollment = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: selectedItem.data.id,
      courseTitle: selectedItem.data.title,
      studentName: formData.get('name') as string,
      studentPhone: formData.get('phone') as string,
      date: new Date().toLocaleString()
    };
    setEnrollments([newEnroll, ...enrollments]);
    alert("Arizangiz qabul qilindi!");
    setShowEnrollForm(false);
    setSelectedItem(null);
  };

  if (activeSection === AppSection.ADMIN) {
    if (!isLoggedIn) return <LoginForm onLogin={setIsLoggedIn} onCancel={() => setActiveSection(AppSection.HOME)} />;
    return (
      <AdminPanel 
        courses={courses} achievements={achievements} news={news} teacherImage={teacherImage} contactInfo={contactInfo} messages={messages} enrollments={enrollments}
        onUpdateTeacherImage={setTeacherImage} onUpdateContactInfo={setContactInfo}
        onAddCourse={c => setCourses([c, ...courses])} onUpdateCourse={u => setCourses(courses.map(c => c.id === u.id ? u : c))} onDeleteCourse={id => setCourses(courses.filter(c => c.id !== id))}
        onAddNews={n => setNews([n, ...news])} onUpdateNews={u => setNews(news.map(n => n.id === u.id ? u : n))} onDeleteNews={id => setNews(news.filter(n => n.id !== id))}
        onAddAchievement={a => setAchievements([a, ...achievements])} onUpdateAchievement={u => setAchievements(achievements.map(a => a.id === u.id ? u : a))} onDeleteAchievement={id => setAchievements(achievements.filter(a => a.id !== id))}
        onDeleteMessage={id => setMessages(messages.filter(m => m.id !== id))} onDeleteEnrollment={id => setEnrollments(enrollments.filter(e => e.id !== id))}
        onExit={() => setActiveSection(AppSection.HOME)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 cursor-pointer select-none" onClick={() => { setLogoClicks(p => p+1); if(logoClicks >= 4) {setActiveSection(AppSection.ADMIN); setLogoClicks(0);} }}>
            <Code2 size={40}/><span className="text-2xl font-black uppercase tracking-tighter">IT Yakkabog'</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {['home', 'news', 'courses', 'about', 'contact'].map(s => (
              <button key={s} onClick={() => { document.getElementById(s)?.scrollIntoView({behavior:'smooth'}); setActiveSection(s as any); }} className={`font-bold capitalize text-sm ${activeSection === s ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-400'}`}>
                {s === 'about' ? 'Yutuqlar' : s === 'home' ? 'Asosiy' : s === 'news' ? 'Yangiliklar' : s === 'courses' ? 'Kurslar' : 'Aloqa'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section id="home" className="pt-40 pb-20 px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center min-h-screen">
        <div className="space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest"><Sparkles size={16}/> Professional Ta'lim</div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-slate-900">Kelajakni <span className="text-indigo-600">bugun</span> o'rganing</h1>
          <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">IT Yakkabog' - zamonaviy texnologiyalar olamiga sizning eshigingiz.</p>
          <button onClick={() => document.getElementById('courses')?.scrollIntoView({behavior:'smooth'})} className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black flex items-center gap-3 shadow-2xl hover:scale-105 transition">Kurslar <ArrowRight size={20}/></button>
        </div>
        <div className="relative"><img src={teacherImage} className="rounded-[80px] shadow-2xl w-full aspect-[4/5] object-cover border-[16px] border-white" /></div>
      </section>

      <section id="courses" className="py-32 bg-slate-50 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16">Mashhur kurslar</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {courses.map(c => (
              <div key={c.id} onClick={() => setSelectedItem({type:'course', data:c})} className="bg-white rounded-[48px] overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-3xl transition duration-500 hover:-translate-y-2">
                <div className="h-72 w-full overflow-hidden"><img src={c.image} className="h-full w-full object-cover group-hover:scale-110 transition duration-700"/></div>
                <div className="p-10 space-y-4">
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">{c.category}</span>
                  <h3 className="text-2xl font-black leading-tight">{c.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm font-medium">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-8 bg-indigo-600">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div className="text-white space-y-10">
            <h2 className="text-6xl font-black tracking-tighter">Savollaringiz bormi?</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-6"><MapPin/><p className="text-lg font-bold">{contactInfo.address}</p></div>
              <div className="flex items-center gap-6"><Mail/><p className="text-lg font-bold">{contactInfo.email}</p></div>
              <div className="flex items-center gap-6"><Phone/><p className="text-lg font-bold">{contactInfo.phone}</p></div>
            </div>
            <div className="flex gap-4">
              <a href={contactInfo.telegram} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition"><Send/></a>
              <a href={contactInfo.instagram} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition"><Instagram/></a>
            </div>
          </div>
          <div className="bg-white p-12 rounded-[60px] shadow-2xl space-y-6">
            <h3 className="text-2xl font-black">Xabar qoldiring</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <input name="name" required placeholder="Ismingiz" className="w-full bg-slate-50 border rounded-2xl p-4 outline-none" />
              <input name="email" required placeholder="Telefon" className="w-full bg-slate-50 border rounded-2xl p-4 outline-none" />
              <textarea name="message" required placeholder="Xabar" rows={4} className="w-full bg-slate-50 border rounded-2xl p-4 outline-none"></textarea>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl">Yuborish</button>
            </form>
          </div>
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[60px] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="w-full md:w-2/5 h-64 md:h-auto relative">
              <img src={selectedItem.data.image} className="w-full h-full object-cover" />
              <button onClick={() => { setSelectedItem(null); setShowEnrollForm(false); }} className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white"><X/></button>
            </div>
            <div className="flex-1 p-12 overflow-y-auto">
              <h2 className="text-4xl font-black mb-6">{selectedItem.data.title}</h2>
              <div className="whitespace-pre-wrap text-slate-800 leading-relaxed text-lg mb-8">{selectedItem.data.content || selectedItem.data.description}</div>
              {selectedItem.type === 'course' && !showEnrollForm && (
                <button onClick={() => setShowEnrollForm(true)} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-2xl">Ro'yxatdan o'tish</button>
              )}
              {showEnrollForm && (
                <form onSubmit={handleEnrollSubmit} className="space-y-4 p-8 bg-slate-50 rounded-[40px] border">
                  <h4 className="text-xl font-black mb-6">Ariza berish</h4>
                  <input name="name" required placeholder="F.I.SH" className="w-full p-4 border rounded-2xl" />
                  <input name="phone" required placeholder="Telefon" className="w-full p-4 border rounded-2xl" />
                  <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black">Yuborish</button>
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
