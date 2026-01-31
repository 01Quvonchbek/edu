
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  students: number;
  duration: string;
  image: string;
  content?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  content?: string;
}

export interface GlobalStats {
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  stat4Label: string;
  stat4Value: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
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
