
export type Language = 'uz' | 'ru' | 'en';

export type LocalizedText = {
  uz: string;
  ru: string;
  en: string;
};

export interface Course {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  students: number;
  duration: LocalizedText;
  image: string;
  content?: LocalizedText;
}

export interface Achievement {
  id: string;
  title: LocalizedText;
  date: string;
  description: LocalizedText;
  content?: LocalizedText;
}

export interface GlobalStats {
  stat1Label: LocalizedText;
  stat1Value: string;
  stat2Label: LocalizedText;
  stat2Value: string;
  stat3Label: LocalizedText;
  stat3Value: string;
  stat4Label: LocalizedText;
  stat4Value: string;
}

export interface NewsItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  content: LocalizedText;
  date: string;
  image: string;
  videoUrl?: string;
}

export interface Stat {
  name: string;
  value: number;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentPhone: string;
  date: string;
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  instagram: string;
  telegram: string;
  youtube: string;
  facebook: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export enum AppSection {
  HOME = 'home',
  COURSES = 'courses',
  NEWS = 'news',
  ABOUT = 'about',
  CONTACT = 'contact',
  ADMIN = 'admin'
}

export enum AdminSubSection {
  DASHBOARD = 'dashboard',
  COURSE_MGMT = 'course_mgmt',
  ACHIEVEMENT_MGMT = 'achievement_mgmt',
  NEWS_MGMT = 'news_mgmt',
  PROFILE_MGMT = 'profile_mgmt',
  CONTACT_MGMT = 'contact_mgmt',
  MESSAGES = 'messages',
  ENROLLMENTS = 'enrollments',
  AI_TOOLS = 'ai_tools'
}
