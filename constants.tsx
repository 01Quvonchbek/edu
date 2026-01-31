
import React from 'react';
import { Course, Achievement, Stat } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Matematika: Algoritmlar va Mantiq',
    description: 'Boshlang\'ich va o\'rta darajadagi talabalar uchun chuqurlashtirilgan matematika kursi.',
    category: 'Aniq fanlar',
    students: 120,
    duration: '3 oy',
    image: 'https://picsum.photos/seed/math/800/600',
    content: "Ushbu kursda biz matematikaning eng qiziqarli va muhim jabhalarini o'rganamiz. \n\nKurs tarkibi:\n1. Mantiqiy mulohazalar va to'plamlar nazariyasi.\n2. Algoritmlar tuzish va ularning murakkabligini hisoblash.\n3. Graf nazariyasi va amaliy tatbiqlar.\n\nHar bir darsda nafaqat nazariya, balki haqiqiy hayotiy misollar ustida ishlaymiz. Kurs so'ngida talabalar murakkab muammolarni tizimli tahlil qilishni o'rganadilar."
  },
  {
    id: '2',
    title: 'Ingliz tili: IELTS Masterclass',
    description: 'IELTS imtihonidan 7.5+ ball olishni maqsad qilganlar uchun intensiv trening.',
    category: 'Tillar',
    students: 85,
    duration: '4 oy',
    image: 'https://picsum.photos/seed/english/800/600',
    content: "IELTS Masterclass - bu sizning xalqaro ta'limga bo'lgan yo'lingiz. \n\nNimalarni o'rganasiz:\n- Academic Writing Task 1 & 2: Eng yuqori ball keltiradigan strukturalar.\n- Reading: Vaqtni tejash va to'g'ri javoblarni tez topish strategiyalari.\n- Listening: Turli urg'ularni tushunish va diqqatni jamlash.\n- Speaking: Ravonlik va so'z boyligini oshirish mashqlari.\n\nKurs davomida har haftada Mock Exam (sinov imtihonlari) o'tkaziladi va xatolar ustida individual ishlanadi."
  },
  {
    id: '3',
    title: 'Dasturlash asoslari (Python)',
    description: 'Sun\'iy intellekt va ma\'lumotlar tahlili uchun eng mashhur tilni o\'rganing.',
    category: 'IT',
    students: 250,
    duration: '6 oy',
    image: 'https://picsum.photos/seed/code/800/600',
    content: "Python - zamonaviy texnologiyalar asosi. \n\nKurs dasturi:\n1. Python sintaksisi va ma'lumot turlari.\n2. Funktsional va Obyektga Yo'naltirilgan Dasturlash (OOP).\n3. Ma'lumotlar ombori (SQL) bilan ishlash.\n4. Web-development (Django/Flask asoslari).\n\nKurs yakunida har bir talaba o'zining shaxsiy portfoliosi uchun to'liq ishlaydigan loyihasini (Telegram-bot yoki veb-sayt) tayyorlaydi."
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'Yilning eng yaxshi o\'qituvchisi',
    date: '2023',
    description: 'Xalq ta\'limi vazirligi tomonidan taqdirlandim.',
    content: "Ushbu mukofot 2023-yil yakunlariga ko'ra, ta'lim tizimida innovatsiyalarni joriy etish va yoshlarning IT sohasiga bo'lgan qiziqishini oshirishdagi mehnatlarim uchun topshirildi. \n\nMarosim Toshkent shahridagi Simpoziumlar saroyida bo'lib o'tdi va soha mutaxassislari tomonidan yuqori baholandi."
  },
  {
    id: 'a2',
    title: 'Google Certified Educator',
    date: '2022',
    description: 'Xalqaro sertifikat sohibi.',
    content: "Google Workspace for Education vositalaridan foydalanish bo'yicha Level 2 darajasidagi xalqaro sertifikat. Bu sertifikat darslarni raqamli texnologiyalar orqali samaraliroq tashkil etish imkoniyatini tasdiqlaydi."
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
