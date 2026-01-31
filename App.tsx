import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Mail, Code2, Newspaper, Calendar, Sparkles, Trophy, MapPin, Phone, Loader2, X
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
    instagram: '#', telegram: '#', youtube: '#', facebook: '#' 
  });
  const [teacherImage, setTeacherImage] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: string, data: any } | null>(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: c } = await supabase.from('courses').select('*').order('id', { ascending: false });
        if (c && c.length > 0) setCourses(c as Course[]); else setCourses(INITIAL_COURSES);

        const { data: n } = await supabase.from('news').select('*').order('date', { ascending: false });
        if (n && n.length > 0) setNews(n as NewsItem[]); else setNews(INITIAL_NEWS);

        const { data: a } = await supabase.from('achievements').select('*');
        if (a && a.length > 0) setAchievements(a as Achievement[]); else setAchievements(INITIAL_ACHIEVEMENTS);

        const { data: s } = await supabase.from('global_stats').select('*').single();
        if (s) setGlobalStats(s as GlobalStats);

        const { data: ci } = await supabase.from('contact_info').select('*').single();
        if (ci) setContactInfo(ci as ContactInfo);

        const { data: m } = await supabase.from('messages').select('*').order('date', { ascending: false });
        if (m) setMessages(m as ContactMessage[]);

        const { data: e } = await supabase.from('enrollments').select('*').order('date', { ascending: false });
        if (e) setEnrollments(e as CourseEnrollment[]);

        const { data: ti } = await supabase.from('teacher_profile').select('image_url').single();
        if (ti?.image_url) setTeacherImage(ti.image_url);

      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMessage = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      date: new Date().toISOString()
    };
    const { data, error } = await supabase.from('messages').insert([newMessage]).select();
    if (!error && data && data[0]) {
      setMessages([data[0] as ContactMessage, ...messages]);
      alert("Yuborildi!");
      e.currentTarget.reset();
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><Loader2 className="animate-spin" size={48} /></div>;

  if (activeSection === AppSection.ADMIN) {
    if (!isLoggedIn) return <LoginForm onLogin={setIsLoggedIn} onCancel={() => setActiveSection(AppSection.HOME)} />;
    return (
      <AdminPanel 
        courses={courses} achievements={achievements} news={news} teacherImage={teacherImage} contactInfo={contactInfo} messages={messages} enrollments={enrollments} globalStats={globalStats}
        onUpdateTeacherImage={async url => { await supabase.from('teacher_profile').update({ image_url: url }).eq('id', 1); setTeacherImage(url); }}
        onUpdateContactInfo={async info => { await supabase.from('contact_info').update(info).eq('id', 1); setContactInfo(info); }}
        onUpdateGlobalStats={async stats => { await supabase.from('global_stats').update(stats).eq('id', 1); setGlobalStats(stats); }}
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

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setLogoClicks(p => p+1); if(logoClicks >= 4) {setActiveSection(AppSection.ADMIN); setLogoClicks(0);} }}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Code2 /></div>
            <span className="text-xl font-black text-slate-900">IT YAKKABOG'</span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-bold text-sm text-slate-500">
            <button onClick={() => scrollTo('home')}>{t.navHome}</button>
            <button onClick={() => scrollTo('courses')}>{t.navCourses}</button>
            <button onClick={() => scrollTo('news')}>{t.navNews}</button>
            <button onClick={() => scrollTo('contact')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl">{t.navEnroll}</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-slideUp">
          <h1 className="text-7xl font-black text-slate-900 leading-none">{t.heroTitle}</h1>
          <p className="text-xl text-slate-500 max-w-lg">{t.heroDesc}</p>
          <button onClick={() => scrollTo('courses')} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black flex items-center gap-3 shadow-xl shadow-indigo-200">
            {t.heroCTA} <ArrowRight />
          </button>
        </div>
        <div className="rounded-[80px] overflow-hidden shadow-3xl aspect-[4/5] border-[16px] border-white">
          <img src={teacherImage} className="w-full h-full object-cover" alt="Mentor" />
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16">{t.coursesTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map(c => (
              <div key={c.id} onClick={() => setSelectedItem({type:'course', data:c})} className="bg-slate-50 p-4 rounded-[48px] border border-slate-100 cursor-pointer hover:shadow-2xl transition-all">
                <div className="h-64 rounded-[36px] overflow-hidden mb-6"><img src={c.image} className="w-full h-full object-cover" alt={c.title[lang]}/></div>
                <div className="p-4"><h3 className="text-2xl font-black mb-2">{c.title[lang]}</h3><p className="text-slate-500 text-sm line-clamp-2">{c.description[lang]}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16">{t.newsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {news.map(n => (
              <div key={n.id} onClick={() => setSelectedItem({type:'news', data:n})} className="bg-white p-4 rounded-[40px] cursor-pointer hover:shadow-xl transition-all">
                <div className="h-60 rounded-[30px] overflow-hidden mb-4"><img src={n.image} className="w-full h-full object-cover" /></div>
                <div className="p-4"><h4 className="font-black text-xl mb-2">{n.title[lang]}</h4><p className="text-slate-400 text-xs flex items-center gap-2"><Calendar size={14}/> {n.date}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements & Stats */}
      <section id="achievements" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl font-black">{t.achievementsTitle}</h2>
            <div className="space-y-6">
              {achievements.map(a => (
                <div key={a.id} className="flex gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-all">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0"><Trophy size={32}/></div>
                  <div><h4 className="text-xl font-black">{a.title[lang]}</h4><p className="text-slate-500 text-sm">{a.description[lang]}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white space-y-2">
              <span className="text-4xl font-black">{globalStats.stat1Value}</span>
              <p className="text-xs uppercase font-bold opacity-70">{globalStats.stat1Label[lang]}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-2">
              <span className="text-4xl font-black">{globalStats.stat2Value}</span>
              <p className="text-xs uppercase font-bold opacity-70">{globalStats.stat2Label[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div className="space-y-12">
            <h2 className="text-6xl font-black">{t.contactTitle}</h2>
            <div className="space-y-8">
              <div className="flex gap-6"><MapPin className="text-indigo-400"/><p>{contactInfo.address}</p></div>
              <div className="flex gap-6"><Mail className="text-indigo-400"/><p>{contactInfo.email}</p></div>
              <div className="flex gap-6"><Phone className="text-indigo-400"/><p>{contactInfo.phone}</p></div>
            </div>
          </div>
          <form onSubmit={handleSendMessage} className="bg-white p-12 rounded-[50px] space-y-4">
            <h3 className="text-slate-900 text-3xl font-black mb-4">{t.contactFormTitle}</h3>
            <input name="name" required placeholder={t.contactFormName} className="w-full p-4 bg-slate-50 border rounded-2xl text-slate-900 outline-none" />
            <input name="email" required placeholder={t.contactFormEmail} className="w-full p-4 bg-slate-50 border rounded-2xl text-slate-900 outline-none" />
            <textarea name="message" required rows={4} placeholder={t.contactFormMsg} className="w-full p-4 bg-slate-50 border rounded-2xl text-slate-900 outline-none" />
            <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100">Yuborish</button>
          </form>
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-[60px] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-2/5 h-64 md:h-auto"><img src={selectedItem.data.image} className="w-full h-full object-cover" /></div>
            <div className="flex-1 p-12 overflow-y-auto space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-4xl font-black">{selectedItem.data.title[lang]}</h2>
                <button onClick={() => setSelectedItem(null)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">{(selectedItem.data.content?.[lang]) || (selectedItem.data.description?.[lang])}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;