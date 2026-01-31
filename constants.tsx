
import React from 'react';
import { Course, Achievement, Stat, NewsItem } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Matematika: Algoritmlar va Mantiq',
    description: 'Boshlang\'ich va o\'rta darajadagi talabalar uchun chuqurlashtirilgan matematika kursi.',
    category: 'Aniq fanlar',
    students: 120,
    duration: '3 oy',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    content: "Ushbu kursda biz matematikaning eng qiziqarli va muhim jabhalarini o'rganamiz. \n\nKurs tarkibi:\n1. Mantiqiy mulohazalar va to'plamlar nazariyasi.\n2. Algoritmlar tuzish va ularning murakkabligini hisoblash.\n3. Graf nazariyasi va amaliy tatbiqlar."
  },
  {
    id: '2',
    title: 'Ingliz tili: IELTS Masterclass',
    description: 'IELTS imtihonidan 7.5+ ball olishni maqsad qilganlar uchun intensiv trening.',
    category: 'Tillar',
    students: 85,
    duration: '4 oy',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    content: "IELTS Masterclass - bu sizning xalqaro ta'limga bo'lgan yo'lingiz."
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'IT Yakkabog\' markazining yangi binosi ochildi',
    description: 'Zamonaviy sharoitlar va eng so\'nggi texnologiyalar bilan jihozlangan o\'quv markazimiz ish boshladi.',
    content: 'Bizning yangi markazimizda endi 500 dan ortiq o\'quvchi bir vaqtning o\'zida ta\'lim olishi mumkin. Barcha xonalar yuqori tezlikdagi internet va zamonaviy kompyuterlar bilan ta\'minlangan.',
    date: '20.05.2024',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'Yilning eng yaxshi o\'qituvchisi',
    date: '2023',
    description: 'Xalq ta\'limi vazirligi tomonidan taqdirlandim.',
    content: "Ushbu mukofot 2023-yil yakunlariga ko'ra topshirildi."
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
