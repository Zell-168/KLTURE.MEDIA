
import { TranslationData, Trainer, Course, FAQItem } from './types';

export const TRANSLATIONS: Record<'en' | 'kh', TranslationData> = {
  en: {
    nav: {
      home: "Home",
      mini: "Mini Program",
      other: "Other Programs", 
      online: "Online Courses",
      free: "Free Courses",
      community: "Community",
      ai: "AI Tools",
      clients: "Our Clients",
      about: "About",
      faq: "FAQ & Policy",
      contact: "Contact",
      register: "Work With Us",
      signIn: "Sign In",
      signOut: "Sign Out",
      profile: "My Profile"
    },
    home: {
      heroTitle: "KLTURE.MEDIA – Cambodia’s Leading TikTok Personal Branding Agency",
      heroSubtitle: "We build influential personal brands for business owners and creators through strategic TikTok content.",
      ctaPrimary: "Explore Free Courses",
      ctaSecondary: "Talk to Our Team",
      introTitle: "Building Influence in the Digital Age",
      introText: "We don't just teach marketing; we execute strategies that build real influence and drive business results.",
      focusTitle: "Main Focus 2025 – Agency",
      focusPrice: "Custom Pricing",
      focusSeats: "Limited Clients Only",
      reasonsTitle: "Why Clients Choose Us",
      reasons: [
        "Expert Personal Branding Strategy",
        "High-Quality Content Production",
        "Data-Driven Growth",
        "Proven Track Record",
        "Full Management Service",
        "Industry Connection",
        "Access to Exclusive Network",
        "Results-Oriented Approach"
      ],
      seeMore: "See more reasons"
    },
    mini: {
      pageTitle: "KLTURE.ACADEMY MINI – Main Program (2025)",
      intro: "Our strongest and most in-demand program. Designed for real-world results in just one day or two nights.",
      weekendTitle: "MINI — Weekend Full-Day Class",
      weekendSub: "Main Product #1",
      nightTitle: "MINI — Night Class",
      nightSub: "Main Product #2",
      learnTitle: "What You Will Learn",
      learnList: [
        "TikTok content creation",
        "How to go viral on Cambodian TikTok",
        "Social media marketing fundamentals",
        "Creative and trend-based content strategy",
        "Sales and closing techniques for business",
        "Marketing psychology",
        "Step-by-step templates and systems"
      ],
      receiveTitle: "What Every Student Receives",
      receiveList: [
        "Official Certificate",
        "Worksheets & templates",
        "Practical exercises",
        "Access to private Telegram support group"
      ],
      btnRegisterWeekend: "Register for Weekend MINI",
      btnRegisterNight: "Register for Night MINI",
      trainerSectionTitle: "Meet The Team",
      zellNote: "Note: Zell acts as lead strategist and creative director."
    },
    other: {
      title: "Other Programs (Not Main Focus)",
      sTitle: "KLTURE.ACADEMY S",
      sDesc: "4 trainers (including Zell). 1 Full Day. $150 per student. Advanced strategies & deeper content.",
      vipTitle: "KLTURE.ACADEMY VIP",
      vipDesc: "7 Premium Trainers. 8 Half-day sessions (4 weekends). Designed for serious marketers and business owners.",
      note: "Note: Our main focus for 2025 is the MINI program, but S and VIP are still available upon request.",
      interest: "Inquire Interest"
    },
    online: {
      title: "Online Self-Paced Courses",
      bundleTitle: "Bundle Offer",
      bundleDesc: "Get all 3 courses for only $35",
      note: "Online courses are self-paced and designed for business owners, online sellers, marketers, and aspiring influencers.",
      btnEnroll: "Buy The Course"
    },
    free: {
      title: "Free Courses",
      subtitle: "Start learning today with our collection of free, high-value training videos.",
      enrollBtn: "Enroll for Free",
      watchBtn: "Watch Now",
      loginToEnroll: "Log in to enroll"
    },
    community: {
      title: "Our Community",
      subtitle: "Connect with other marketers, business owners, and creators in the KLTURE network.",
      follow: "Follow",
      unfollow: "Unfollow",
      members: "Member Since"
    },
    trainers: {
      title: "Our Team",
      subtitle: "Meet the experts building the future of personal branding in Cambodia.",
      addBtn: "Add Member",
      formName: "Name",
      formRole: "Role / Specialty",
      formImage: "Image URL",
      formDesc: "Detailed Description",
      delete: "Delete",
      managementTitle: "Team Management"
    },
    about: {
      title: "About KLTURE.MEDIA",
      content: [
        "Founded by Zell (Samnang Yim), KLTURE.MEDIA is Cambodia’s leading TikTok Personal Branding Agency.",
        "We exist to empower business owners and creators to build authentic, high-impact personal brands that drive real business results.",
        "We move beyond traditional advertising to create genuine connection and influence through short-form video content."
      ],
      mission: "Mission: To define the culture of modern influence in Cambodia.",
      visionTitle: "Future Vision (2026)",
      visionList: [
        "Manage top 50 personal brands in Cambodia",
        "Expand media network across SE Asia",
        "Launch KLTURE Creator Hub",
        "Partner with major global brands",
        "Revolutionize digital storytelling"
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      refundTitle: "Service Policy",
      refundPolicy: [
        "We prioritize long-term partnerships.",
        "Commitment to quality and consistency is key.",
        "Consultation required before engagement."
      ],
      refundNote: "We strongly recommend booking a discovery call.",
      refundContact: "Contact Zell directly"
    },
    contact: {
      title: "Register & Contact",
      priceLabel: "Price (MINI)",
      formName: "Full Name",
      formPhone: "Phone Number",
      formTelegram: "Telegram Username (Optional)",
      formEmail: "Email",
      formPassword: "Password",
      formProgram: "Service Interest",
      formDate: "Preferred Schedule",
      formMsg: "Questions / Message",
      btnSubmit: "Submit Inquiry",
      success: "Thank you! Our team will contact you via Telegram or phone shortly."
    },
    footer: {
      summary: "Cambodia’s leading TikTok Personal Branding Agency.",
      foundedBy: "Founded by Zell (Samnang Yim)."
    }
  },
  kh: {
    nav: {
      home: "ទំព័រដើម",
      mini: "កម្មវិធី MINI",
      other: "កម្មវិធីផ្សេងៗ",
      online: "វគ្គសិក្សាតាមអនឡាញ",
      free: "វគ្គសិក្សាហ្វ្រី",
      community: "សហគមន៍",
      ai: "AI Tools",
      clients: "អតិថិជន",
      about: "អំពីយើង",
      faq: "សំណួរ & គោលការណ៍",
      contact: "ទំនាក់ទំនង",
      register: "ធ្វើការជាមួយយើង",
      signIn: "ចូលប្រើប្រាស់",
      signOut: "ចាកចេញ",
      profile: "គណនីរបស់ខ្ញុំ"
    },
    home: {
      heroTitle: "KLTURE.MEDIA – ទីភ្នាក់ងារ Personal Branding លើ TikTok ឈានមុខគេនៅកម្ពុជា",
      heroSubtitle: "យើងកសាងម៉ាកយីហោផ្ទាល់ខ្លួនដែលមានឥទ្ធិពលសម្រាប់ម្ចាស់អាជីវកម្ម និងអ្នកបង្កើតមាតិកា តាមរយៈយុទ្ធសាស្ត្រមាតិកា TikTok ។",
      ctaPrimary: "មើលវគ្គសិក្សាហ្វ្រី",
      ctaSecondary: "ជជែកជាមួយក្រុមការងារ",
      introTitle: "កសាងឥទ្ធិពលក្នុងសម័យឌីជីថល",
      introText: "យើងមិនត្រឹមតែបង្រៀនទីផ្សារទេ យើងអនុវត្តយុទ្ធសាស្ត្រដែលបង្កើតឥទ្ធិពលពិតប្រាកដ និងជំរុញលទ្ធផលអាជីវកម្ម។",
      focusTitle: "ការផ្តោតសំខាន់ឆ្នាំ ២០២៥ – Agency",
      focusPrice: "តម្លៃតាមតម្រូវការ",
      focusSeats: "ទទួលអតិថិជនមានកំណត់",
      reasonsTitle: "ហេតុអ្វីអតិថិជនជ្រើសរើសយើង",
      reasons: [
        "យុទ្ធសាស្ត្រ Personal Branding ជំនាញ",
        "ការផលិតមាតិកាគុណភាពខ្ពស់",
        "កំណើនផ្អែកលើទិន្នន័យ",
        "មានកំណត់ត្រាជោគជ័យ",
        "សេវាកម្មគ្រប់គ្រងពេញលេញ",
        "ទំនាក់ទំនងក្នុងវិស័យ",
        "ការចូលទៅកាន់បណ្តាញផ្តាច់មុខ",
        "វិធីសាស្ត្រតម្រង់ទិសលទ្ធផល"
      ],
      seeMore: "មើលហេតុផលបន្ថែម"
    },
    mini: {
      pageTitle: "KLTURE.ACADEMY MINI – កម្មវិធីចម្បង (២០២៥)",
      intro: "កម្មវិធីដែលពេញនិយមបំផុតរបស់យើង។ រចនាឡើងដើម្បីទទួលបានលទ្ធផលជាក់ស្តែងក្នុងរយៈពេលមួយថ្ងៃ ឬពីរយប់។",
      weekendTitle: "MINI — ថ្នាក់ពេញមួយថ្ងៃ (ចុងសប្តាហ៍)",
      weekendSub: "ផលិតផលចម្បងទី ១",
      nightTitle: "MINI — ថ្នាក់ពេលយប់",
      nightSub: "ផលិតផលចម្បងទី ២",
      learnTitle: "អ្វីដែលអ្នកនឹងរៀន",
      learnList: [
        "ការបង្កើតមាតិកា TikTok",
        "របៀបធ្វើឱ្យវីដេអូផ្ទុះ (Viral) នៅកម្ពុជា",
        "មូលដ្ឋានគ្រឹះទីផ្សារបណ្តាញសង្គម",
        "យុទ្ធសាស្ត្រមាតិកាច្នៃប្រឌិត និងតាមនិន្នាការ",
        "បច្ចេកទេសលក់ និងបិទការលក់សម្រាប់អាជីវកម្ម",
        "ចិត្តវិទ្យាទីផ្សារ",
        "គំរូ និងប្រព័ន្ធដែលអ្នកអាចប្រើភ្លាមៗ"
      ],
      receiveTitle: "អ្វីដែលសិស្សនឹងទទួលបាន",
      receiveList: [
        "វិញ្ញាបនបត្រផ្លូវការ",
        "ឯកសារសិក្សា & គំរូការងារ",
        "លំហាត់អនុវត្តជាក់ស្តែង",
        "ការចូលក្នុងក្រុម Telegram សម្រាប់ជំនួយ"
      ],
      btnRegisterWeekend: "ចុះឈ្មោះសម្រាប់ថ្នាក់ចុងសប្តាហ៍",
      btnRegisterNight: "ចុះឈ្មោះសម្រាប់ថ្នាក់ពេលយប់",
      trainerSectionTitle: "ជួបជាមួយក្រុមការងារ",
      zellNote: "សម្គាល់៖ Zell ដើរតួជាអ្នកយុទ្ធសាស្ត្រ និងនាយកច្នៃប្រឌិត។"
    },
    other: {
      title: "កម្មវិធីផ្សេងៗទៀត",
      sTitle: "KLTURE.ACADEMY S",
      sDesc: "គ្រូបង្វឹក ៤ នាក់ (រួមទាំង Zell)។ ១ ថ្ងៃពេញ។ $១៥០។ យុទ្ធសាស្ត្រកម្រិតខ្ពស់ & មាតិកាស៊ីជម្រៅ។",
      vipTitle: "KLTURE.ACADEMY VIP",
      vipDesc: "គ្រូបង្វឹកពិសេស ៧ នាក់។ ៨ វគ្គពាក់កណ្តាលថ្ងៃ (៤ ចុងសប្តាហ៍)។ សម្រាប់អ្នកទីផ្សារ និងម្ចាស់អាជីវកម្ម។",
      note: "សម្គាល់៖ ការផ្តោតសំខាន់របស់យើងសម្រាប់ឆ្នាំ ២០២៥ គឺកម្មវិធី MINI ប៉ុន្តែ S និង VIP នៅតែមានតាមការស្នើសុំ។",
      interest: "សាកសួរចំណាប់អារម្មណ៍"
    },
    online: {
      title: "វគ្គសិក្សាតាមអនឡាញ",
      bundleTitle: "ការផ្តល់ជូនពិសេស (Bundle)",
      bundleDesc: "ទទួលបានទាំង ៣ វគ្គក្នុងតម្លៃត្រឹមតែ $៣៥",
      note: "វគ្គសិក្សាអនឡាញគឺរៀនដោយខ្លួនឯង រចនាឡើងសម្រាប់ម្ចាស់អាជីវកម្ម អ្នកលក់អនឡាញ និងអ្នកទីផ្សារ។",
      btnEnroll: "ទិញវគ្គសិក្សា"
    },
    free: {
      title: "វគ្គសិក្សាហ្វ្រី",
      subtitle: "ចាប់ផ្តើមរៀនថ្ងៃនេះជាមួយវីដេអូហ្វឹកហ្វឺនដែលមានតម្លៃខ្ពស់របស់យើងដោយឥតគិតថ្លៃ។",
      enrollBtn: "ចុះឈ្មោះចូលរៀនហ្វ្រី",
      watchBtn: "មើលវីដេអូ",
      loginToEnroll: "ចូលប្រើប្រាស់ដើម្បីរៀន"
    },
    community: {
      title: "សហគមន៍របស់យើង",
      subtitle: "ភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកទីផ្សារ ម្ចាស់អាជីវកម្ម និងអ្នកបង្កើតមាតិកាផ្សេងទៀតនៅក្នុងបណ្តាញ KLTURE ។",
      follow: "តាមដាន",
      unfollow: "ឈប់តាមដាន",
      members: "សមាជិកតាំងពី"
    },
    trainers: {
      title: "ក្រុមការងាររបស់យើង",
      subtitle: "ជួបជាមួយអ្នកជំនាញដែលកំពុងកសាងអនាគតនៃ Personal Branding នៅកម្ពុជា។",
      addBtn: "បន្ថែមសមាជិក",
      formName: "ឈ្មោះ",
      formRole: "តួនាទី / ជំនាញ",
      formImage: "តំណភ្ជាប់រូបភាព",
      formDesc: "ការពិពណ៌នាលម្អិត",
      delete: "លុប",
      managementTitle: "ការគ្រប់គ្រងក្រុម"
    },
    about: {
      title: "អំពី KLTURE.MEDIA",
      content: [
        "បង្កើតឡើងដោយ Zell (សំ ណាង), KLTURE.MEDIA គឺជាទីភ្នាក់ងារ Personal Branding លើ TikTok ឈានមុខគេនៅកម្ពុជា។",
        "យើងបង្កើតឡើងដើម្បីផ្តល់អំណាចដល់ម្ចាស់អាជីវកម្ម និងអ្នកបង្កើតមាតិកាក្នុងការកសាងម៉ាកយីហោផ្ទាល់ខ្លួនដែលពិតប្រាកដ និងមានឥទ្ធិពល។",
        "យើងឈានទៅមុខលើសពីការផ្សាយពាណិជ្ជកម្មបែបប្រពៃណី ដើម្បីបង្កើតទំនាក់ទំនងពិតប្រាកដតាមរយៈវីដេអូខ្លី។"
      ],
      mission: "បេសកកម្ម៖ កំណត់វប្បធម៌នៃឥទ្ធិពលទំនើបនៅកម្ពុជា។",
      visionTitle: "ចក្ខុវិស័យអនាគត (២០២៦)",
      visionList: [
        "គ្រប់គ្រង Personal Brands កំពូលទាំង ៥០ នៅកម្ពុជា",
        "ពង្រីកបណ្តាញផ្សព្វផ្សាយទូទាំងអាស៊ីអាគ្នេយ៍",
        "ដាក់ឱ្យដំណើរការ KLTURE Creator Hub",
        "សហការជាមួយម៉ាកយីហោសកលធំៗ",
        "បដិវត្តការនិទានរឿងឌីជីថល"
      ]
    },
    faq: {
      title: "សំណួរដែលសួរញឹកញាប់",
      refundTitle: "គោលការណ៍សេវាកម្ម",
      refundPolicy: [
        "យើងផ្តល់អាទិភាពដល់ភាពជាដៃគូរយៈពេលវែង។",
        "ការប្តេជ្ញាចិត្តចំពោះគុណភាព និងភាពជាប់លាប់គឺជាគន្លឹះ។",
        "តម្រូវឱ្យមានការពិគ្រោះយោបល់មុនពេលចូលរួម។"
      ],
      refundNote: "យើងសូមណែនាំឱ្យកក់ការហៅពិគ្រោះយោបល់។",
      refundContact: "ទាក់ទង Zell ផ្ទាល់"
    },
    contact: {
      title: "ចុះឈ្មោះ & ទំនាក់ទំនង",
      priceLabel: "តម្លៃ (MINI)",
      formName: "ឈ្មោះពេញ",
      formPhone: "លេខទូរស័ព្ទ",
      formTelegram: "ឈ្មោះ Telegram (មិនចាំបាច់)",
      formEmail: "អ៊ីមែល",
      formPassword: "ពាក្យសម្ងាត់",
      formProgram: "ចំណាប់អារម្មណ៍សេវាកម្ម",
      formDate: "កាលវិភាគ",
      formMsg: "សំណួរ / សារ",
      btnSubmit: "ដាក់ពាក្យ",
      success: "អរគុណ! ក្រុមការងាររបស់យើងនឹងទាក់ទងអ្នកតាមរយៈ Telegram ឬទូរស័ព្ទក្នុងពេលឆាប់ៗនេះ។"
    },
    footer: {
      summary: "ទីភ្នាក់ងារ Personal Branding លើ TikTok ឈានមុខគេនៅកម្ពុជា។",
      foundedBy: "បង្កើតឡើងដោយ Zell (សំ ណាង)។"
    }
  }
};

export const COURSES: Course[] = [
  { id: 'TCM01', title: 'TikTok Content Marketing', price: '$25', description: 'Self-paced TikTok content marketing fundamentals.' },
  { id: 'TAC01', title: 'TikTok Ads Course', price: '$25', description: 'How to run effective TikTok ads.' },
  { id: 'CAP01', title: 'CapCut: Zero to Pro', price: '$15', description: 'Full guide to editing with CapCut.' },
];

export const TRAINERS: Trainer[] = [
  { name: 'Sopheng', role: 'TikTok Marketing & Content', image: 'https://picsum.photos/seed/sopheng/200/200' },
  { name: 'Kimly', role: 'TikTok Marketing & Content', image: 'https://picsum.photos/seed/kimly/200/200' },
  { name: 'Visal', role: 'Creative Content & Trend Strategy', image: 'https://picsum.photos/seed/visal/200/200' },
  { name: 'Siengmeng', role: 'Sales, Closing & Business', image: 'https://picsum.photos/seed/siengmeng/200/200' },
];

export const FAQS: FAQItem[] = [
  { question: "Who is this for?", answer: "Business owners, marketers, freelancers, and students wanting real skills." },
  { question: "Do I need marketing experience?", answer: "No. We teach from fundamentals to advanced strategies." },
  { question: "What do I get after training?", answer: "A certificate, access to the community, and templates." }
];
