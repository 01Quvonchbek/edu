
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Mail, Award, Users, Phone, MapPin, Send, Instagram, Youtube, Facebook, 
  Code2, Newspaper, Play, Calendar, Sparkles, Trophy, ChevronRight, Languages
} from 'lucide-react';
import { AppSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment, NewsItem, GlobalStats, Language } from './types';
import { translations } from './translations';
import { INITIAL_COURSES, INITIAL_NEWS, ACHIEVEMENTS as INITIAL_ACHIEVEMENTS } from './constants';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('edu_lang') as Language) || 'uz');
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = translations[lang];

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
  const [globalStats, setGlobalStats] = useState<GlobalStats>(() => {
    const s = localStorage.getItem('edu_global_stats');
    return s ? JSON.parse(s) : {
      stat1Label: 'Ish bilan ta\'minlash',
      stat1Value: '98%',
      stat2Label: 'IT Yo\'nalishlar',
      stat2Value: '15+',
      stat3Label: 'Mentorlar',
      stat3Value: '50+',
      stat4Label: 'IELTS 7.0+',
      stat4Value: '200+'
    };
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const s = localStorage.getItem('edu_contact');
    return s ? JSON.parse(s) : { 
      address: 'Yakkabog\' tumani, Markaziy IT bino', 
      email: 'it-yakkabog@edu.uz', 
      phone: '+998 90 123 45 67', 
      instagram: '#', telegram: '#', youtube: '#', facebook: '#' 
    };
  });
  const [teacherImage, setTeacherImage] = useState(() => 
    localStorage.getItem('edu_teacher_image') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800'
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
    localStorage.setItem('edu_lang', lang);
    localStorage.setItem('edu_courses', JSON.stringify(courses));
    localStorage.setItem('edu_news', JSON.stringify(news));
    localStorage.setItem('edu_achievements', JSON.stringify(achievements));
    localStorage.setItem('edu_global_stats', JSON.stringify(globalStats));
    localStorage.setItem('edu_contact', JSON.stringify(contactInfo));
    localStorage.setItem('edu_teacher_image', teacherImage);
    localStorage.setItem('edu_messages', JSON.stringify(messages));
    localStorage.setItem('edu_enrollments', JSON.stringify(enrollments));
  }, [lang, courses, news, achievements, globalStats, contactInfo, teacherImage, messages, enrollments]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
    alert(lang === 'uz' ? "Muvaffaqiyatli yuborildi!" : lang === 'ru' ? "Успешно отправлено!" : "Successfully sent!");
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
    alert(lang === 'uz' ? "Muvaffaqiyatli qabul qilindi!" : lang === 'ru' ? "Заявка успешно принята!" : "Application successfully received!");
    setShowEnrollForm(false);
    setSelectedItem(null);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  if (activeSection === AppSection.ADMIN) {
    if (!isLoggedIn) return <LoginForm onLogin={setIsLoggedIn} onCancel={() => setActiveSection(AppSection.HOME)} />;
    return (
      <AdminPanel 
        courses={courses} achievements={achievements} news={news} teacherImage={teacherImage} contactInfo={contactInfo} messages={messages} enrollments={enrollments} globalStats={globalStats}
        onUpdateTeacherImage={setTeacherImage} onUpdateContactInfo={setContactInfo} onUpdateGlobalStats={setGlobalStats}
        onAddCourse={c => setCourses([c, ...courses])} onUpdateCourse={u => setCourses(courses.map(c => c.id === u.id ? u : c))} onDeleteCourse={id => setCourses(courses.filter(c => c.id !== id))}
        onAddNews={n => setNews([n, ...news])} onUpdateNews={u => setNews(news.map(n => n.id === u.id ? u : n))} onDeleteNews={id => setNews(news.filter(n => n.id !== id))}
        onAddAchievement={a => setAchievements([a, ...achievements])} onUpdateAchievement={u => setAchievements(achievements.map(a => a.id === u.id ? u : a))} onDeleteAchievement={id => setAchievements(achievements.filter(a => a.id !== id))}
        onDeleteMessage={id => setMessages(messages.filter(m => m.id !== id))} onDeleteEnrollment={id => setEnrollments(enrollments.filter(e => e.id !== id))}
        onExit={() => setActiveSection(AppSection.HOME)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-indigo-100 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setLogoClicks(p => p+1); if(logoClicks >= 4) {setActiveSection(AppSection.ADMIN); setLogoClicks(0);} }}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
              <Code2 size={28}/>
            </div>
            <div>
              <span className="text-xl font-black uppercase tracking-tighter text-slate-900 block leading-none">IT Yakkabog'</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Innovation Academy</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            {[
              { id: 'home', label: t.navHome },
              { id: 'courses', label: t.navCourses },
              { id: 'news', label: t.navNews },
              { id: 'achievements', label: t.navAchievements },
              { id: 'contact', label: t.navContact }
            ].map(s => (
              <button 
                key={s.id} 
                onClick={() => { scrollTo(s.id); setActiveSection(s.id as any); }} 
                className={`font-bold text-sm transition-all relative py-2 ${activeSection === s.id ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
              >
                {s.label}
                {activeSection === s.id && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full animate-fadeIn"></span>}
              </button>
            ))}

            <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 border border-slate-200 shadow-inner">
               {(['uz', 'ru', 'en'] as Language[]).map(l => (
                 <button 
                  key={l} 
                  onClick={() => setLang(l)} 
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {l}
                 </button>
               ))}
            </div>

            <button 
              onClick={() => scrollTo('contact')}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all"
            >
              {t.navEnroll}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-20 right-0 w-1/2 h-full bg-indigo-600/5 rounded-l-[200px] -z-10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-8 animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
              <Sparkles size={18} className="animate-pulse"/>
              <span className="text-xs font-black uppercase tracking-widest">{t.heroBadge}</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter">
              {t.heroTitle.split(' ')[0]} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{t.heroTitle.split(' ')[1]}</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
              {t.heroDesc}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={() => scrollTo('courses')} className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black flex items-center gap-3 shadow-2xl shadow-indigo-200 hover:scale-105 transition-all">
                {t.heroCTA} <ArrowRight size={20}/>
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} /></div>)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">+2000 {t.courseStudents}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.heroTrust}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fadeIn">
            <div className="relative z-10 border-[20px] border-white rounded-[100px] shadow-3xl overflow-hidden aspect-[4/5]">
               <img src={teacherImage} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Mentor" />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-indigo-600 font-black uppercase text-xs tracking-[0.2em] block">{t.coursesSub}</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">{t.coursesTitle}</h2>
            </div>
            <div className="flex gap-3">
               <button className="px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all">{t.all}</button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedItem({type:'course', data:c})} 
                className="group bg-slate-50 rounded-[56px] overflow-hidden border border-slate-100 p-4 cursor-pointer hover:shadow-3xl hover:bg-white hover:-translate-y-3 transition-all duration-500"
              >
                <div className="h-64 w-full rounded-[44px] overflow-hidden relative shadow-inner">
                  <img src={c.image} className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" alt={c.title}/>
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-indigo-600 rounded-2xl text-[10px] font-black uppercase shadow-lg border border-white/50">{c.category}</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold"><Users size={14}/> {c.students}+ {t.courseStudents}</span>
                    <span className="text-indigo-600 font-bold text-xs">{c.duration}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm font-medium leading-relaxed">{c.description}</p>
                  <div className="pt-4 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.courseMore} <ChevronRight size={16}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-32 bg-slate-50 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <span className="px-5 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">{t.newsSub}</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">{t.newsTitle}</h2>
            <p className="text-slate-500 max-w-2xl font-medium">{t.newsDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map(n => (
              <div 
                key={n.id} 
                onClick={() => setSelectedItem({type:'news', data:n})} 
                className="bg-white rounded-[40px] p-4 group cursor-pointer border border-transparent hover:border-indigo-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="h-64 rounded-[32px] overflow-hidden relative shadow-lg">
                  <img src={n.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={n.title}/>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 text-[10px] font-black uppercase shadow-lg border border-white/50">
                      <Calendar size={14} className="text-indigo-600"/> {n.date}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">{n.title}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2">{n.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-indigo-600 font-black uppercase text-xs tracking-widest block">{t.achievementsSub}</span>
                <h2 className="text-6xl font-black text-slate-900 tracking-tight leading-none">{t.achievementsTitle}</h2>
              </div>
              
              <div className="space-y-6">
                {achievements.map((a) => (
                  <div key={a.id} className="flex gap-6 group p-6 rounded-3xl hover:bg-slate-50 transition-colors">
                    <div className="shrink-0 w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Trophy size={28}/>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{a.date}</span>
                        <h4 className="text-xl font-black text-slate-900">{a.title}</h4>
                      </div>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="bg-indigo-600 p-8 rounded-[48px] text-white shadow-2xl">
                    <h5 className="text-4xl font-black mb-1">{globalStats.stat1Value}</h5>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{globalStats.stat1Label}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl">
                    <h5 className="text-4xl font-black text-slate-900 mb-1">{globalStats.stat2Value}</h5>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{globalStats.stat2Label}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-900 p-8 rounded-[48px] text-white shadow-2xl">
                    <h5 className="text-4xl font-black mb-1">{globalStats.stat3Value}</h5>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{globalStats.stat3Label}</p>
                  </div>
                  <div className="bg-indigo-50 p-8 rounded-[48px] border border-indigo-100">
                    <h5 className="text-4xl font-black text-indigo-600 mb-1">{globalStats.stat4Value}</h5>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{globalStats.stat4Label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          <div className="text-white space-y-12">
            <div className="space-y-4">
              <span className="text-indigo-400 font-black uppercase text-xs tracking-[0.3em] block">{t.contactSub}</span>
              <h2 className="text-6xl font-black tracking-tighter leading-none">{t.contactTitle}</h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-xl"><MapPin size={28}/></div>
                <div><p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{t.contactAddress}</p><p className="text-xl font-bold">{contactInfo.address}</p></div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-xl"><Mail size={28}/></div>
                <div><p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{t.contactEmail}</p><p className="text-xl font-bold">{contactInfo.email}</p></div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-xl"><Phone size={28}/></div>
                <div><p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{t.contactPhone}</p><p className="text-xl font-bold">{contactInfo.phone}</p></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-12 rounded-[64px] shadow-3xl space-y-8">
            <h3 className="text-3xl font-black text-slate-900">{t.contactFormTitle}</h3>
            <form onSubmit={handleSendMessage} className="space-y-5">
              <input name="name" required placeholder={t.contactFormName} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-medium" />
              <input name="phone" required placeholder={t.contactFormPhone} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-medium" />
              <textarea name="message" required placeholder={t.contactFormMsg} rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none font-medium"></textarea>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all">{t.contactFormSubmit}</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Code2 size={24}/></div><span className="font-black text-lg text-slate-900">IT YAKKABOG'</span></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.footerCopyright}</p>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">{t.footerUp}</button>
        </div>
      </footer>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[60px] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-slideUp">
            <div className="w-full md:w-2/5 h-64 md:h-auto relative">
              <img src={selectedItem.data.image} className="w-full h-full object-cover" alt={selectedItem.data.title}/>
              <button onClick={() => { setSelectedItem(null); setShowEnrollForm(false); }} className="absolute top-6 left-6 p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 border border-white/30"><X size={24}/></button>
            </div>
            <div className="flex-1 p-12 overflow-y-auto">
              <div className="mb-8 space-y-4">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase shadow-sm">{selectedItem.data.category}</span>
                <h2 className="text-5xl font-black text-slate-900 leading-tight">{selectedItem.data.title}</h2>
              </div>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg font-medium bg-slate-50 p-8 rounded-[40px] border border-slate-100">{selectedItem.data.content || selectedItem.data.description}</div>
              {selectedItem.type === 'course' && !showEnrollForm && (
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <button onClick={() => setShowEnrollForm(true)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:scale-[1.02] transition-all">{t.navEnroll}</button>
                </div>
              )}
              {showEnrollForm && (
                <div className="mt-12 p-10 bg-indigo-600 rounded-[48px] shadow-2xl text-white">
                  <h4 className="text-2xl font-black mb-6">{t.enrollTitle}</h4>
                  <form onSubmit={handleEnrollSubmit} className="space-y-4">
                    <input name="name" required placeholder={t.contactFormName} className="w-full p-5 bg-white/10 border border-white/20 rounded-2xl outline-none text-white placeholder:text-white/40" />
                    <input name="phone" required placeholder={t.contactFormPhone} className="w-full p-5 bg-white/10 border border-white/20 rounded-2xl outline-none text-white placeholder:text-white/40" />
                    <button type="submit" className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black text-lg mt-4">{t.enrollSubmit}</button>
                    <button type="button" onClick={() => setShowEnrollForm(false)} className="w-full text-white/60 font-bold py-2">{t.enrollCancel}</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
