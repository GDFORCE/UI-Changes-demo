"use client"

import { createContext, useContext, useState, useCallback } from "react"

export type LangCode = "en" | "hi" | "ta" | "te" | "kn" | "mr" | "ml" | "bn"

// Map the human-readable language names used in the dropdowns/pickers to codes.
export function langCodeFromName(name: string): LangCode {
  const key = name.split(/[\s—-]/)[0].trim().toLowerCase()
  switch (key) {
    case "hindi": return "hi"
    case "tamil": return "ta"
    case "telugu": return "te"
    case "kannada": return "kn"
    case "marathi": return "mr"
    case "malayalam": return "ml"
    case "bengali": return "bn"
    default: return "en"
  }
}

type Dict = Record<string, string>

// Only patient-facing strings are translated. Anything missing falls back to English,
// then to the key itself.
const translations: Partial<Record<LangCode, Dict>> = {
  en: {
    // App bar / dashboard
    "myTrialJourney": "My Trial Journey",
    "hello": "Hello,",
    "welcomeBack": "Welcome back",
    "yourProgress": "Your Progress",
    "visitOfCompleted": "Visit {a} of {b} completed",
    "nextVisit": "Next Visit",
    "upcoming": "Upcoming",
    "followUpVisit": "Follow-Up Visit",
    "calendar": "Calendar",
    "openCalendar": "Open Calendar",
    "notifications": "Notifications",
    "seeAll": "See All",
    "completed": "Completed",
    "scheduled": "Scheduled",
    "protocolId": "Protocol ID",
    "phase": "Phase",
    "indication": "Indication",
    "visitType": "Visit Type",
    "window": "Window:",
    "viewDetails": "View Details",
    "medication": "Medication",
    "taken": "taken",
    "allDone": "All done",
    "allDoneToday": "All done for today!",
    "noMoreMeds": "No more medications required",
    "greatJob": "Great job keeping up with your schedule",
    "noMedsToday": "No medications today",
    "medFreeDay": "Enjoy your medication-free day!",
    "confirmTaken": "Confirm taken",
    "loggedAt": "Logged at",
    "undo": "Undo",
    "recentActivity": "Recent Activity",
    "done": "Done",
    // Bottom nav
    "nav.home": "Home",
    "nav.myTrial": "My Trial",
    "nav.myVisits": "My Visits",
    "nav.calendar": "Calendar",
    "nav.notifs": "Notifs",
    "nav.me": "Me",
    "nav.messages": "Messages",
    // Profile & Settings
    "profileSettings": "Profile & Settings",
    "editProfile": "Edit Profile",
    "changePassword": "Change Password",
    "preferredLanguage": "Preferred Language",
    "notificationPreferences": "Notification Preferences",
    "termsConditions": "Terms & Conditions",
    "privacyPolicy": "Privacy Policy",
    "helpSupport": "Help & Support",
    "reportIssue": "Report an Issue",
    "logout": "Logout",
    "apply": "Apply",
  },
  hi: {
    "myTrialJourney": "मेरी ट्रायल यात्रा",
    "hello": "नमस्ते,",
    "welcomeBack": "वापसी पर स्वागत है",
    "yourProgress": "आपकी प्रगति",
    "visitOfCompleted": "{b} में से {a} विज़िट पूरी",
    "nextVisit": "अगली विज़िट",
    "upcoming": "आगामी",
    "followUpVisit": "फॉलो-अप विज़िट",
    "window": "अवधि:",
    "viewDetails": "विवरण देखें",
    "medication": "दवा",
    "taken": "ली गई",
    "allDone": "सब हो गया",
    "allDoneToday": "आज के लिए सब हो गया!",
    "noMoreMeds": "अब और दवा की ज़रूरत नहीं",
    "greatJob": "अपने शेड्यूल का पालन करने के लिए बढ़िया काम",
    "noMedsToday": "आज कोई दवा नहीं",
    "medFreeDay": "अपने दवा-मुक्त दिन का आनंद लें!",
    "confirmTaken": "पुष्टि करें",
    "loggedAt": "दर्ज किया गया",
    "undo": "पूर्ववत करें",
    "recentActivity": "हाल की गतिविधि",
    "done": "पूर्ण",
    "nav.home": "होम",
    "nav.myTrial": "मेरा ट्रायल",
    "nav.myVisits": "मेरी विज़िट",
    "nav.calendar": "कैलेंडर",
    "nav.notifs": "सूचनाएं",
    "nav.me": "मैं",
    "nav.messages": "संदेश",
    "profileSettings": "प्रोफ़ाइल और सेटिंग्स",
    "editProfile": "प्रोफ़ाइल संपादित करें",
    "changePassword": "पासवर्ड बदलें",
    "preferredLanguage": "पसंदीदा भाषा",
    "notificationPreferences": "सूचना प्राथमिकताएं",
    "termsConditions": "नियम और शर्तें",
    "privacyPolicy": "गोपनीयता नीति",
    "helpSupport": "सहायता और समर्थन",
    "reportIssue": "समस्या की रिपोर्ट करें",
    "logout": "लॉग आउट",
    "apply": "लागू करें",
  },
  ta: {
    "myTrialJourney": "எனது சோதனை பயணம்",
    "hello": "வணக்கம்,",
    "welcomeBack": "மீண்டும் வரவேற்கிறோம்",
    "yourProgress": "உங்கள் முன்னேற்றம்",
    "visitOfCompleted": "{b} இல் {a} வருகை முடிந்தது",
    "nextVisit": "அடுத்த வருகை",
    "upcoming": "வரவிருக்கிறது",
    "followUpVisit": "பின்தொடர் வருகை",
    "window": "கால இடைவெளி:",
    "viewDetails": "விவரங்களைக் காண்க",
    "medication": "மருந்து",
    "taken": "எடுக்கப்பட்டது",
    "allDone": "அனைத்தும் முடிந்தது",
    "allDoneToday": "இன்றைக்கு அனைத்தும் முடிந்தது!",
    "noMoreMeds": "மேலும் மருந்து தேவையில்லை",
    "greatJob": "உங்கள் அட்டவணையைப் பின்பற்றியதற்கு சிறந்த பணி",
    "noMedsToday": "இன்று மருந்து இல்லை",
    "medFreeDay": "உங்கள் மருந்து இல்லாத நாளை அனுபவியுங்கள்!",
    "confirmTaken": "உறுதிப்படுத்து",
    "loggedAt": "பதிவு செய்யப்பட்டது",
    "undo": "செயல்தவிர்",
    "recentActivity": "சமீபத்திய செயல்பாடு",
    "done": "முடிந்தது",
    "nav.home": "முகப்பு",
    "nav.myTrial": "எனது சோதனை",
    "nav.myVisits": "எனது வருகைகள்",
    "nav.calendar": "நாட்காட்டி",
    "nav.notifs": "அறிவிப்புகள்",
    "nav.me": "நான்",
    "nav.messages": "செய்திகள்",
    "profileSettings": "சுயவிவரம் & அமைப்புகள்",
    "editProfile": "சுயவிவரத்தைத் திருத்து",
    "changePassword": "கடவுச்சொல்லை மாற்று",
    "preferredLanguage": "விருப்ப மொழி",
    "notificationPreferences": "அறிவிப்பு விருப்பங்கள்",
    "termsConditions": "விதிமுறைகள் & நிபந்தனைகள்",
    "privacyPolicy": "தனியுரிமைக் கொள்கை",
    "helpSupport": "உதவி & ஆதரவு",
    "reportIssue": "சிக்கலைப் புகாரளி",
    "logout": "வெளியேறு",
    "apply": "பயன்படுத்து",
  },
  te: {
    "myTrialJourney": "నా ట్రయల్ ప్రయాణం",
    "hello": "నమస్కారం,",
    "welcomeBack": "తిరిగి స్వాగతం",
    "yourProgress": "మీ పురోగతి",
    "visitOfCompleted": "{b} లో {a} సందర్శన పూర్తయింది",
    "nextVisit": "తదుపరి సందర్శన",
    "upcoming": "రాబోయే",
    "followUpVisit": "ఫాలో-అప్ సందర్శన",
    "window": "విండో:",
    "viewDetails": "వివరాలు చూడండి",
    "medication": "మందు",
    "taken": "తీసుకున్నారు",
    "allDone": "అన్నీ పూర్తయ్యాయి",
    "allDoneToday": "ఈ రోజుకు అన్నీ పూర్తయ్యాయి!",
    "noMoreMeds": "ఇక మందులు అవసరం లేదు",
    "greatJob": "మీ షెడ్యూల్‌ను కొనసాగించినందుకు అభినందనలు",
    "noMedsToday": "ఈ రోజు మందులు లేవు",
    "medFreeDay": "మీ మందులు లేని రోజును ఆస్వాదించండి!",
    "confirmTaken": "నిర్ధారించండి",
    "loggedAt": "నమోదు చేయబడింది",
    "undo": "రద్దు చేయండి",
    "recentActivity": "ఇటీవలి కార్యకలాపం",
    "done": "పూర్తయింది",
    "nav.home": "హోమ్",
    "nav.myTrial": "నా ట్రయల్",
    "nav.myVisits": "నా సందర్శనలు",
    "nav.calendar": "క్యాలెండర్",
    "nav.notifs": "నోటిఫికేషన్లు",
    "nav.me": "నేను",
    "nav.messages": "సందేశాలు",
    "profileSettings": "ప్రొఫైల్ & సెట్టింగ్‌లు",
    "editProfile": "ప్రొఫైల్ సవరించండి",
    "changePassword": "పాస్‌వర్డ్ మార్చండి",
    "preferredLanguage": "ప్రాధాన్య భాష",
    "notificationPreferences": "నోటిఫికేషన్ ప్రాధాన్యతలు",
    "termsConditions": "నిబంధనలు & షరతులు",
    "privacyPolicy": "గోప్యతా విధానం",
    "helpSupport": "సహాయం & మద్దతు",
    "reportIssue": "సమస్యను నివేదించండి",
    "logout": "లాగ్ అవుట్",
    "apply": "వర్తింపజేయి",
  },
  kn: {
    "myTrialJourney": "ನನ್ನ ಪ್ರಯೋಗ ಪ್ರಯಾಣ",
    "hello": "ನಮಸ್ಕಾರ,",
    "welcomeBack": "ಮರಳಿ ಸ್ವಾಗತ",
    "yourProgress": "ನಿಮ್ಮ ಪ್ರಗತಿ",
    "visitOfCompleted": "{b} ರಲ್ಲಿ {a} ಭೇಟಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
    "nextVisit": "ಮುಂದಿನ ಭೇಟಿ",
    "upcoming": "ಮುಂಬರುವ",
    "followUpVisit": "ಅನುಸರಣಾ ಭೇಟಿ",
    "window": "ಅವಧಿ:",
    "viewDetails": "ವಿವರಗಳನ್ನು ನೋಡಿ",
    "medication": "ಔಷಧಿ",
    "taken": "ತೆಗೆದುಕೊಂಡಿದೆ",
    "allDone": "ಎಲ್ಲಾ ಮುಗಿದಿದೆ",
    "allDoneToday": "ಇಂದಿಗೆ ಎಲ್ಲಾ ಮುಗಿದಿದೆ!",
    "noMoreMeds": "ಇನ್ನು ಔಷಧಿ ಅಗತ್ಯವಿಲ್ಲ",
    "greatJob": "ನಿಮ್ಮ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಪಾಲಿಸಿದ್ದಕ್ಕೆ ಅಭಿನಂದನೆಗಳು",
    "noMedsToday": "ಇಂದು ಔಷಧಿ ಇಲ್ಲ",
    "medFreeDay": "ನಿಮ್ಮ ಔಷಧಿ-ಮುಕ್ತ ದಿನವನ್ನು ಆನಂದಿಸಿ!",
    "confirmTaken": "ದೃಢೀಕರಿಸಿ",
    "loggedAt": "ದಾಖಲಿಸಲಾಗಿದೆ",
    "undo": "ರದ್ದುಗೊಳಿಸಿ",
    "recentActivity": "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    "done": "ಮುಗಿದಿದೆ",
    "nav.home": "ಮುಖಪುಟ",
    "nav.myTrial": "ನನ್ನ ಪ್ರಯೋಗ",
    "nav.myVisits": "ನನ್ನ ಭೇಟಿಗಳು",
    "nav.calendar": "ಕ್ಯಾಲೆಂಡರ್",
    "nav.notifs": "ಅಧಿಸೂಚನೆಗಳು",
    "nav.me": "ನಾನು",
    "nav.messages": "ಸಂದೇಶಗಳು",
    "profileSettings": "ಪ್ರೊಫೈಲ್ & ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "editProfile": "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    "changePassword": "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
    "preferredLanguage": "ಆದ್ಯತೆಯ ಭಾಷೆ",
    "notificationPreferences": "ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳು",
    "termsConditions": "ನಿಯಮಗಳು & ಷರತ್ತುಗಳು",
    "privacyPolicy": "ಗೌಪ್ಯತಾ ನೀತಿ",
    "helpSupport": "ಸಹಾಯ & ಬೆಂಬಲ",
    "reportIssue": "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    "logout": "ಲಾಗ್ ಔಟ್",
    "apply": "ಅನ್ವಯಿಸಿ",
  },
  mr: {
    "myTrialJourney": "माझा चाचणी प्रवास",
    "hello": "नमस्कार,",
    "welcomeBack": "पुन्हा स्वागत आहे",
    "yourProgress": "तुमची प्रगती",
    "visitOfCompleted": "{b} पैकी {a} भेट पूर्ण",
    "nextVisit": "पुढील भेट",
    "upcoming": "आगामी",
    "followUpVisit": "फॉलो-अप भेट",
    "window": "कालावधी:",
    "viewDetails": "तपशील पहा",
    "medication": "औषध",
    "taken": "घेतली",
    "allDone": "सर्व झाले",
    "allDoneToday": "आजसाठी सर्व झाले!",
    "noMoreMeds": "आणखी औषधाची गरज नाही",
    "greatJob": "तुमचे वेळापत्रक पाळल्याबद्दल छान काम",
    "noMedsToday": "आज औषध नाही",
    "medFreeDay": "तुमचा औषधमुक्त दिवस एन्जॉय करा!",
    "confirmTaken": "पुष्टी करा",
    "loggedAt": "नोंदवले",
    "undo": "पूर्ववत करा",
    "recentActivity": "अलीकडील क्रियाकलाप",
    "done": "पूर्ण",
    "nav.home": "होम",
    "nav.myTrial": "माझी चाचणी",
    "nav.myVisits": "माझ्या भेटी",
    "nav.calendar": "दिनदर्शिका",
    "nav.notifs": "सूचना",
    "nav.me": "मी",
    "nav.messages": "संदेश",
    "profileSettings": "प्रोफाइल आणि सेटिंग्ज",
    "editProfile": "प्रोफाइल संपादित करा",
    "changePassword": "पासवर्ड बदला",
    "preferredLanguage": "पसंतीची भाषा",
    "notificationPreferences": "सूचना प्राधान्ये",
    "termsConditions": "अटी व शर्ती",
    "privacyPolicy": "गोपनीयता धोरण",
    "helpSupport": "मदत व समर्थन",
    "reportIssue": "समस्या नोंदवा",
    "logout": "लॉग आउट",
    "apply": "लागू करा",
  },
}

type TFunc = (key: string, params?: Record<string, string | number>) => string

interface LanguageContextValue {
  lang: LangCode
  setLang: (lang: LangCode | string) => void
  t: TFunc
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en")

  const setLang = useCallback((next: LangCode | string) => {
    const code = (next in translations || next === "en"
      ? (next as LangCode)
      : langCodeFromName(next))
    setLangState(code)
  }, [])

  const t = useCallback<TFunc>((key, params) => {
    const dict = translations[lang] ?? translations.en!
    let str = dict[key] ?? translations.en![key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v))
      }
    }
    return str
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Safe fallback so components used outside the provider still render in English.
    const t: TFunc = (key, params) => {
      let str = translations.en![key] ?? key
      if (params) for (const [k, v] of Object.entries(params)) str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v))
      return str
    }
    return { lang: "en", setLang: () => {}, t }
  }
  return ctx
}
