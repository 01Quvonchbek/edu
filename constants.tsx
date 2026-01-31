
import { Course, Achievement, Stat, NewsItem } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: {
      uz: 'Matematika: Algoritmlar va Mantiq',
      ru: 'Математика: Алгоритмы и Логика',
      en: 'Mathematics: Algorithms and Logic'
    },
    description: {
      uz: 'Boshlang\'ich va o\'rta darajadagi talabalar uchun chuqurlashtirilgan matematika kursi.',
      ru: 'Углубленный курс математики для начинающих и продолжающих студентов.',
      en: 'Advanced mathematics course for beginner and intermediate students.'
    },
    category: {
      uz: 'Aniq fanlar',
      ru: 'Точные науки',
      en: 'Exact Sciences'
    },
    students: 120,
    duration: {
      uz: '3 oy',
      ru: '3 месяца',
      en: '3 months'
    },
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    content: {
      uz: "Ushbu kursda biz matematikaning eng qiziqarli va muhim jabhalarini o'rganamiz.",
      ru: "В этом курсе мы изучим самые интересные и важные аспекты математики.",
      en: "In this course, we will explore the most interesting and important aspects of mathematics."
    }
  },
  {
    id: '2',
    title: {
      uz: 'Ingliz tili: IELTS Masterclass',
      ru: 'Английский язык: IELTS Masterclass',
      en: 'English: IELTS Masterclass'
    },
    description: {
      uz: 'IELTS imtihonidan 7.5+ ball olishni maqsad qilganlar uchun intensiv trening.',
      ru: 'Интенсивный тренинг для тех, кто хочет набрать 7.5+ баллов на экзамене IELTS.',
      en: 'Intensive training for those aiming to score 7.5+ on the IELTS exam.'
    },
    category: {
      uz: 'Tillar',
      ru: 'Языки',
      en: 'Languages'
    },
    students: 85,
    duration: {
      uz: '4 oy',
      ru: '4 месяца',
      en: '4 months'
    },
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    content: {
      uz: "IELTS Masterclass - bu sizning xalqaro ta'limga bo'lgan yo'lingiz.",
      ru: "IELTS Masterclass - это ваш путь к международному образованию.",
      en: "IELTS Masterclass is your gateway to international education."
    }
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: {
      uz: 'IT Yakkabog\' markazining yangi binosi ochildi',
      ru: 'Открыто новое здание центра IT Yakkabog\'',
      en: 'New building of IT Yakkabog\' center opened'
    },
    description: {
      uz: 'Zamonaviy sharoitlar va eng so\'nggi texnologiyalar bilan jihozlangan o\'quv markazimiz ish boshladi.',
      ru: 'Начал работу наш учебный центр, оснащенный современными условиями и новейшими технологиями.',
      en: 'Our learning center, equipped with modern conditions and the latest technologies, has started operations.'
    },
    content: {
      uz: 'Bizning yangi markazimizda endi 500 dan ortiq o\'quvchi bir vaqtning o\'zida ta\'lim olishi mumkin.',
      ru: 'В нашем новом центре теперь могут одновременно обучаться более 500 студентов.',
      en: 'In our new center, more than 500 students can now study at the same time.'
    },
    date: '20.05.2024',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: {
      uz: 'Yilning eng yaxshi o\'qituvchisi',
      ru: 'Лучший учитель года',
      en: 'Teacher of the year'
    },
    date: '2023',
    description: {
      uz: 'Xalq ta\'limi vazirligi tomonidan taqdirlandim.',
      ru: 'Награжден Министерством народного образования.',
      en: 'Awarded by the Ministry of Public Education.'
    }
  }
];

export const PERFORMANCE_DATA: Stat[] = [
  { name: 'Yanvar', value: 40 },
  { name: 'Fevral', value: 55 },
  { name: 'Mart', value: 75 },
  { name: 'Aprel', value: 90 },
  { name: 'May', value: 120 },
  { name: 'Iyun', value: 150 }
];
