
export type Language = 'en' | 'kh';

export interface Trainer {
  name: string;
  role: string;
  image: string;
}

export interface Course {
  id: string;
  title: string;
  price: string;
  description: string;
}

// Supabase Table Types
export interface DbTrainer {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface DbOnlineCourse {
  id: number;
  title: string;
  price: string;
  description: string;
  video_url?: string;
  image_url?: string;
  // Joined Data
  online_course_trainers?: {
    trainers: DbTrainer;
  }[];
}

export interface DbFreeCourse {
  id: number;
  title: string;
  description: string;
  trainer_name: string;
  video_url: string;
  image_url?: string;
  created_at?: string;
}

export interface DbOtherProgram {
  id: number;
  title: string;
  price: string;
  description: string;
  video_url?: string;
  image_url?: string;
  trainers_count?: string;
  available_dates?: string[];
  // Joined Data
  other_program_trainers?: {
    trainers: DbTrainer;
  }[];
}

export interface DbMiniProgram {
  id: number;
  title: string;
  subtitle?: string;
  price: string;
  description?: string;
  video_url?: string;
  image_url?: string;
  learn_list?: string[];
  receive_list?: string[];
  available_dates?: string[];
  // Joined Data
  mini_program_trainers?: {
    trainers: DbTrainer;
  }[];
}

export interface DbKmSlider {
  id: number;
  image_url: string;
  title?: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DbClientFeedback {
  id: number;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SalesRecord {
  id: number;
  created_at: string;
  user_email: string;
  program_title: string;
  category: 'MINI' | 'OTHER' | 'ONLINE' | 'BUNDLE';
  amount: number;
  note?: string;
}

export interface DbAiHistory {
  id: number;
  user_email: string;
  tool_name: 'MARKETING' | 'BOOSTING' | 'SPY';
  input_data: any;
  result_data: any;
  created_at: string;
}

export interface DbClient {
  id: number;
  client_name: string;
  tiktok_url: string;
  tiktok_embed_html?: string;
  image_url?: string;
  category: string;
  project_manager_id?: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  // Joined Data
  project_manager?: DbTrainer; 
}

export interface ProgramDetails {
  title: string;
  subtitle: string;
  price: string;
  format: string;
  description: string[];
  trainers: Trainer[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface User {
  id: number;
  full_name: string;
  username?: string;
  email: string;
  phone_number: string;
  telegram_username?: string;
  program: string;
  preferred_date?: string;
}

export interface CreditTransaction {
  id: string;
  created_at: string;
  user_email: string;
  type: 'topup' | 'spend' | 'adjustment';
  amount: number;
  note?: string;
  created_by?: string;
}

export interface Follow {
  id: number;
  follower_email: string;
  following_email: string;
}

export interface TranslationData {
  nav: {
    home: string;
    mini: string;
    other: string;
    online: string;
    free: string;
    community: string;
    ai: string;
    clients: string;
    about: string;
    faq: string;
    contact: string;
    register: string;
    signIn: string;
    signOut: string;
    profile: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    introTitle: string;
    introText: string;
    focusTitle: string;
    focusPrice: string;
    focusSeats: string;
    reasonsTitle: string;
    reasons: string[];
    seeMore: string;
  };
  mini: {
    pageTitle: string;
    intro: string;
    weekendTitle: string;
    weekendSub: string;
    nightTitle: string;
    nightSub: string;
    learnTitle: string;
    learnList: string[];
    receiveTitle: string;
    receiveList: string[];
    btnRegisterWeekend: string;
    btnRegisterNight: string;
    trainerSectionTitle: string;
    zellNote: string;
  };
  other: {
    title: string;
    sTitle: string;
    sDesc: string;
    vipTitle: string;
    vipDesc: string;
    note: string;
    interest: string;
  };
  online: {
    title: string;
    bundleTitle: string;
    bundleDesc: string;
    note: string;
    btnEnroll: string;
  };
  free: {
    title: string;
    subtitle: string;
    enrollBtn: string;
    watchBtn: string;
    loginToEnroll: string;
  };
  community: {
    title: string;
    subtitle: string;
    follow: string;
    unfollow: string;
    members: string;
  };
  trainers: {
    title: string;
    subtitle: string;
    addBtn: string;
    formName: string;
    formRole: string;
    formImage: string;
    formDesc: string;
    delete: string;
    managementTitle: string;
  };
  about: {
    title: string;
    content: string[];
    mission: string;
    visionTitle: string;
    visionList: string[];
  };
  faq: {
    title: string;
    refundTitle: string;
    refundPolicy: string[];
    refundNote: string;
    refundContact: string;
  };
  contact: {
    title: string;
    priceLabel: string;
    formName: string;
    formPhone: string;
    formTelegram: string;
    formEmail: string;
    formPassword: string;
    formProgram: string;
    formDate: string;
    formMsg: string;
    btnSubmit: string;
    success: string;
  };
  footer: {
    summary: string;
    foundedBy: string;
  };
}
