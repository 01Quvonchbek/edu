
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Mail, Code2, Newspaper, Calendar, Sparkles, Trophy, MapPin, Phone, Loader2, X,
  Globe, Instagram, Youtube, Facebook, Send, ChevronRight, Menu, Award, UserCheck
} from 'lucide-react';
import { AppSection, Course, Achievement, ContactInfo, ContactMessage, CourseEnrollment, NewsItem, GlobalStats, Language } from './types';
import { translations } from './translations';
import { INITIAL_COURSES, INITIAL_NEWS, ACHIEVEMENTS as INITIAL_ACHIEVEMENTS } from './constants';
import { supabase } from './services/supabaseClient';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('edu_lang') as Language) || 'uz');
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  // States for data
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    stat1Label: { uz: 'Ish bilan ta\'minlash', ru: 'Трудоустройство', en: 'Job Placement' },
    stat1Value: '98%',
    stat2Label: { uz: 'IT Yo\'nalishlar', ru: 'IT Направления', en: 'IT Directions' },
    stat2Value: '15+',
    stat3Label: { uz: 'Mentorlar', ru: 'Менторы', en: 'Mentors' },
    stat3Value: '50+',
    stat4Label: { uz: 'IELTS 7.0+', ru: 'IELTS 7.0+', en: 'IELTS 7.0+' },
    stat4Value: '200+'
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ 
    address: 'Yakkabog\' tumani, Markaziy IT bino', 
    email: 'it-yakkabog@edu.uz', 
    phone: '+998 90 123 45 67', 
    instagram: 'https://instagram.com', 
    telegram: 'https://t.me', 
    youtube: 'https://youtube.com', 
    facebook: 'https://facebook.com' 
  });
  const [teacherImage, setTeacherImage] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: string, data: any } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          { data: c }, { data: n }, { data: a }, { data: s }, 
          { data: ci }, { data: m }, { data: e }, { data: ti }
        ] = await Promise.all([
          supabase.from('courses').select('*').order('id', { ascending: false }),
          supabase.from('news').select('*').order('date', { ascending: false }),
          supabase.from('achievements').select('*'),
          supabase.from('global_stats').select('*').maybeSingle(),
          supabase.from('contact_info').select('*').maybeSingle(),
          supabase.from('messages').select('*').order('date', { ascending: false }),
          supabase.from('enrollments').select('*').order('date', { ascending: false }),
          supabase.from('teacher_profile').select('image_url').maybeSingle()
        ]);

        if (c && c.length > 0) setCourses(c as Course[]); else setCourses(INITIAL_COURSES);
        if (n && n.length > 0) setNews(n as NewsItem[]); else setNews(INITIAL_NEWS);
        if (a && a.length > 0) setAchievements(a as Achievement[]); else setAchievements(INITIAL_ACHIEVEMENTS);
        if (s) setGlobalStats(s as GlobalStats);
        if (ci) setContactInfo(ci as ContactInfo);
        if (m) setMessages(m as ContactMessage[]);
        if (e) setEnrollments(e as CourseEnrollment[]);
        if (ti?.image_url) setTeacherImage(ti.image_url);

      } catch (error) {
        console.error("Fetch Error:", error);
        setCourses(INITIAL_COURSES);
        setNews(INITIAL_NEWS);
        setAchievements(INITIAL_ACHIEVEMENTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    setActiveSection(id as AppSection);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const messageData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      date: new Date().toLocaleDateString('uz-UZ'),
    };

    try {
      const { data, error } = await supabase.from('messages').insert([messageData]).select();
      if (error) throw error;
      if (data && data[0]) {
        setMessages([data[0] as ContactMessage, ...messages]);
        alert(lang === 'uz' ? 'Xabaringiz yuborildi!' : lang === 'ru' ? 'Ваше сообщение отправлено!' : 'Your message has been sent!');
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleEnroll = async (course: Course) => {
    const name = prompt(t.contactFormName);
    const phone = prompt(t.contactFormPhone);
    if (!name || !phone) return;

    const enrollData = {
      courseId: course.id,
      courseTitle: course.title[lang],
      studentName: name,
      studentPhone: phone,
      date: new Date().toLocaleDateString('uz-UZ'),
    };

    try {
      const { data, error } = await supabase.from('enrollments').insert([enrollData]).select();
      if (error) throw error;
      if (data && data[0]) {
        setEnrollments([data[0] as CourseEnrollment, ...enrollments]);
        alert('Arizangiz qabul qilindi!');
      }
    } catch (err) {
      console.error('Enroll Error:', err);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={64} />
      <p className="font-black tracking-widest uppercase animate-pulse">IT Yakkabog' Academy</p>
    </div>
  );

  if (activeSection === AppSection.ADMIN) {
    if (!isLoggedIn) return <LoginForm onLogin={setIsLoggedIn} onCancel={() => setActiveSection(AppSection.HOME)} />;
    return (
      <AdminPanel 
        courses={courses} achievements={achievements} news={news} teacherImage={teacherImage} contactInfo={contactInfo} messages={messages} enrollments={enrollments} globalStats={globalStats}
        onUpdateTeacherImage={async url => { await supabase.from('teacher_profile').upsert({ id: 1, image_url: url }); setTeacherImage(url); }}
        onUpdateContactInfo={async info => { await supabase.from('contact_info').upsert({ id: 1, ...info }); setContactInfo(info); }}
        onUpdateGlobalStats={async stats => { await supabase.from('global_stats').upsert({ id: 1, ...stats }); setGlobalStats(stats); }}
        onAddCourse={async c => { const { data } = await supabase.from('courses').insert([c]).select(); if (data && data[0]) setCourses([data[0] as Course, ...courses]); }}
        onUpdateCourse={async u => { await supabase.from('courses').update(u).eq('id', u.id); setCourses(courses.map(c => c.id === u.id ? u : c)); }}
        onDeleteCourse={async id => { await supabase.from('courses').delete().eq('id', id); setCourses(courses.filter(c => c.id !== id)); }}
        onAddNews={async n => { const { data } = await supabase.from('news').insert([n]).select(); if (data && data[0]) setNews([data[0] as NewsItem, ...news]); }}
        onUpdateNews={async u => { await supabase.from('news').update(u).eq('id', u.id); setNews(news.map(n => n.id === u.id ? u : n)); }}
        onDeleteNews={async id => { await supabase.from('news').delete().eq('id', id); setNews(news.filter(n => n.id !== id)); }}
        onAddAchievement={async a => { const { data } = await supabase.from('achievements').insert([a]).select(); if (data && data[0]) setAchievements([data[0] as Achievement, ...achievements]); }}
        onUpdateAchievement={async u => { await supabase.from('achievements').update(u).eq('id', u.id); setAchievements(achievements.map(a => a.id === u.id ? u : a)); }}
        onDeleteAchievement={async id => { await supabase.from('achievements').delete().eq('id', id); setAchievements(achievements.filter(a => a.id !== id)); }}
        onDeleteMessage={async id => { await supabase.from('messages').delete().eq('id', id); setMessages(messages.filter(m => m.id !== id)); }}
        onDeleteEnrollment={async id => { await supabase.from('enrollments').delete().eq('id', id); setEnrollments(enrollments.filter(e => e.id !== id)); }}
        onExit={() => setActiveSection(AppSection.HOME)}
      />
    );
  }

  const socialLinks = [
    { Icon: Instagram, link: contactInfo.instagram, color: 'hover:bg-pink-600' },
    { Icon: Send, link: contactInfo.telegram, color: 'hover:bg-blue-500' },
    { Icon: Youtube, link: contactInfo.youtube, color: 'hover:bg-red-600' },
    { Icon: Facebook, link: contactInfo.facebook, color: 'hover:bg-blue-700' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-indigo-50 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setLogoClicks(p => p+1); if(logoClicks >= 4) {setActiveSection(AppSection.ADMIN); setLogoClicks(0);} }}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform"><Code2 size={28}/></div>
            <div>
              <span className="text-xl font-black text-slate-900 leading-none block">IT YAKKABOG'</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Innovation Academy</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 items-center font-bold text-sm text-slate-500">
            <button onClick={() => scrollTo('home')} className={`hover:text-indigo-600 transition ${activeSection === AppSection.HOME ? 'text-indigo-600' : ''}`}>{t.navHome}</button>
            <button onClick={() => scrollTo('courses')} className={`hover:text-indigo-600 transition ${activeSection === AppSection.COURSES ? 'text-indigo-600' : ''}`}>{t.navCourses}</button>
            <button onClick={() => scrollTo('news')} className={`hover:text-indigo-600 transition ${activeSection === AppSection.NEWS ? 'text-indigo-600' : ''}`}>{t.navNews}</button>
            <button onClick={() => scrollTo('achievements')} className={`hover:text-indigo-600 transition ${activeSection === AppSection.ABOUT ? 'text-indigo-600' : ''}`}>{t.navAchievements}</button>
            <button onClick={() => scrollTo('contact')} className={`hover:text-indigo-600 transition ${activeSection === AppSection.CONTACT ? 'text-indigo-600' : ''}`}>{t.navContact}</button>
            <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 gap-1 border border-slate-200 ml-4">
               {(['uz', 'ru', 'en'] as Language[]).map(l => (
                 <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{l}</button>
               ))}
            </div>
            <button onClick={() => scrollTo('contact')} className="bg-slate-900 text-white px-7 py-3 rounded-2xl font-black ml-4 hover:bg-indigo-600 transition-all">{t.navEnroll}</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
              <Sparkles size={18} className="text-indigo-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.heroBadge}</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              {t.heroTitle.split(' ')[0]} <br/> <span className="text-indigo-600">{t.heroTitle.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">{t.heroDesc}</p>
            <button onClick={() => scrollTo('courses')} className="bg-indigo-600 text-white px-10 py-5 rounded-[32px] font-black text-lg flex items-center gap-3 shadow-2xl hover:scale-105 transition-all">
              {t.heroCTA} <ArrowRight size={22}/>
            </button>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-[100px] overflow-hidden shadow-3xl aspect-[4/5] border-[20px] border-white">
               <img src={teacherImage} className="w-full h-full object-cover" alt="Mentor" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[1, 2, 3, 4].map((num) => {
              const label = (globalStats as any)[`stat${num}Label`][lang];
              const value = (globalStats as any)[`stat${num}Value`];
              return (
                <div key={num} className="space-y-2">
                  <p className="text-4xl md:text-5xl font-black text-indigo-600">{value}</p>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="text-indigo-600 font-black uppercase text-xs tracking-widest block">{t.coursesSub}</span>
            <h2 className="text-6xl font-black text-slate-900 tracking-tight">{t.coursesTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map(c => (
              <div key={c.id} className="group bg-slate-50 rounded-[60px] p-5 border border-slate-100 hover:shadow-3xl hover:bg-white transition-all duration-500">
                <div className="h-72 w-full rounded-[48px] overflow-hidden mb-8 relative shadow-inner">
                  <img src={c.image || 'https://via.placeholder.com/400x300'} className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" alt={c.title?.[lang]}/>
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-indigo-600 rounded-2xl text-[10px] font-black uppercase shadow-lg border border-white/50">{c.category?.[lang]}</span>
                  </div>
                </div>
                <div className="px-4 pb-6 space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{c.title?.[lang]}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm font-medium">{c.description?.[lang]}</p>
                  <button onClick={() => handleEnroll(c)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black group-hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                    {t.navEnroll} <ArrowRight size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="py-32 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <span className="text-indigo-600 font-black uppercase text-xs tracking-widest block">{t.achievementsSub}</span>
            <h2 className="text-6xl font-black text-slate-900 tracking-tight">{t.achievementsTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((ach) => (
              <div key={ach.id} className="bg-white p-10 rounded-[48px] border border-slate-100 space-y-6 hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Award size={32} /></div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{ach.date}</span>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{ach.title?.[lang]}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{ach.description?.[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <span className="text-indigo-600 font-black uppercase text-xs tracking-widest">{t.newsSub}</span>
            <h2 className="text-6xl font-black text-slate-900 tracking-tight">{t.newsTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {news.map(n => (
              <div key={n.id} onClick={() => setSelectedItem({type:'news', data:n})} className="bg-slate-50 rounded-[40px] p-5 group cursor-pointer border border-transparent hover:border-indigo-100 hover:shadow-2xl transition-all">
                <div className="h-64 rounded-[32px] overflow-hidden mb-6 relative">
                  <img src={n.image || 'https://via.placeholder.com/400x300'} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={n.title?.[lang]} />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 text-slate-900 text-[10px] font-black uppercase shadow-lg">
                      <Calendar size={14} className="text-indigo-600"/> {n.date}
                    </div>
                  </div>
                </div>
                <div className="px-2 pb-2 space-y-3">
                  <h4 className="font-black text-xl text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{n.title?.[lang]}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 font-medium">{n.description?.[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center relative z-10">
          <div className="text-white space-y-12">
            <h2 className="text-7xl font-black tracking-tighter leading-none">{t.contactTitle}</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-indigo-400"><MapPin size={32}/></div>
                <div><p className="text-white/40 text-[10px] font-black uppercase mb-1">{t.contactAddress}</p><p className="text-xl font-bold">{contactInfo.address}</p></div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-indigo-400"><Mail size={32}/></div>
                <div><p className="text-white/40 text-[10px] font-black uppercase mb-1">{t.contactEmail}</p><p className="text-xl font-bold">{contactInfo.email}</p></div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-indigo-400"><Phone size={32}/></div>
                <div><p className="text-white/40 text-[10px] font-black uppercase mb-1">{t.contactPhone}</p><p className="text-xl font-bold">{contactInfo.phone}</p></div>
              </div>
            </div>
            {/* Ijtimoiy tarmoqlar znachoklari qaytarildi */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map(({ Icon, link, color }, i) => (
                <a 
                  key={i} 
                  href={link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all text-white/60 hover:text-white ${color} hover:scale-110 hover:-translate-y-1`}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
          <div className="bg-white p-12 rounded-[64px] shadow-3xl">
            <h3 className="text-3xl font-black text-slate-900 mb-8">{t.contactFormTitle}</h3>
            <form onSubmit={handleSendMessage} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <input name="name" required placeholder={t.contactFormName} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none" />
                <input name="email" required placeholder={t.contactFormEmail} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none" />
              </div>
              <textarea name="message" required placeholder={t.contactFormMsg} rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none"></textarea>
              <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-lg shadow-2xl hover:bg-indigo-700 transition-all">{t.contactFormSubmit}</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><Code2 size={20}/></div>
             <span className="font-black text-slate-900 tracking-tight">IT YAKKABOG'</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{t.footerCopyright}</p>
          <div className="flex gap-4">
             {socialLinks.map(({ Icon, link }, i) => (
               <a key={i} href={link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors"><Icon size={20} /></a>
             ))}
          </div>
        </div>
      </footer>

      {/* News Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-[60px] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
              <img src={selectedItem.data.image || 'https://via.placeholder.com/800x600'} className="w-full h-full object-cover" alt={selectedItem.data.title?.[lang]}/>
            </div>
            <div className="flex-1 p-14 overflow-y-auto space-y-10">
              <div className="space-y-6">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase border border-indigo-100">
                  Yangilik
                </span>
                <h2 className="text-5xl font-black text-slate-900 leading-tight">{selectedItem.data.title?.[lang]}</h2>
              </div>
              <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-line">
                 {selectedItem.data.content?.[lang] || selectedItem.data.description?.[lang]}
              </div>
              <button onClick={() => setSelectedItem(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Yopish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
