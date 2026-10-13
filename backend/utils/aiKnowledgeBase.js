// MamaCare AI's knowledge base and response engine.
//
// This is a deliberately simple, fully offline, keyword-grounded
// educational assistant - it needs no external API key, so it works out
// of the box for every pilot clinic and user, with no "Coming Soon."
// It is NOT a general-purpose chatbot: it only ever answers from the
// fixed topic library below (mirroring the Health Education categories),
// and two safety checks run before anything else:
//
//   1. Danger-sign detection - if the message mentions a danger sign,
//      the reply is always the urgent-care message, never general info.
//   2. Diagnosis/prescription detection - if the message asks "do I
//      have X", "what should I take/stop taking", etc., the reply
//      always redirects to a professional rather than answering.
//
// Swapping this for a real LLM later (Claude or otherwise) means
// replacing `generateReply()`'s body with an API call - every caller
// (aiController.js) only depends on this function's return shape, so
// nothing else needs to change.

const DANGER_SIGN_KEYWORDS = {
  en: [
    "heavy bleeding", "severe bleeding", "bleeding a lot", "convulsion", "fit", "seizure",
    "can't breathe", "cannot breathe", "difficulty breathing", "struggling to breathe",
    "unconscious", "passed out", "not waking up", "fainted",
    "severe pain", "severe abdominal pain", "severe stomach pain",
    "severe headache", "blurred vision", "swelling of face", "swelling of hands",
    "very high fever", "high fever",
  ],
  ha: [
    "zubar jini mai yawa", "zubar jini mai tsanani", "farfadiya", "fadowa kasa",
    "wahalar numfashi", "ba ya numfashi", "rashin sani", "suma",
    "ciwon ciki mai tsanani", "ciwon kai mai tsanani", "hazo a gani",
    "kumburin fuska", "kumburin hannu", "zazzabi mai zafi",
  ],
};

const DIAGNOSIS_REQUEST_PATTERNS = {
  en: [
    "do i have", "am i having", "is this normal", "what disease", "diagnose",
    "what medicine should i take", "what drug should i take", "should i stop taking",
    "can i stop my medication", "what dose", "how much should i take", "prescribe",
  ],
  ha: [
    "ina da", "shin ina da", "wannan al'ada ne", "wace cuta", "ganewar asali",
    "wane magani zan sha", "ya kamata in daina sha", "wace kwaya zan sha",
  ],
};

// One entry per Health Education category the AI is allowed to speak to.
// Keep this in sync in spirit with backend/utils/seedHealthEducation.js,
// though the AI's phrasing is conversational rather than article prose.
const TOPICS = [
  {
    key: "pregnancy",
    keywords: {
      en: ["pregnant", "pregnancy", "trimester", "week of pregnancy", "due date", "edd"],
      ha: ["ciki", "mace mai ciki", "kashi na ciki", "ranar haihuwa"],
    },
    reply: {
      en: "Pregnancy is usually tracked in three trimesters (roughly weeks 1–12, 13–27, and 28–40). You can see your own week, trimester and estimated due date in the Pregnancy Tracker on your dashboard, based on your last menstrual period. Every pregnancy is different, so always bring any specific concerns to your antenatal provider.",
      ha: "Ana bin diddigin ciki yawanci cikin kashi uku (kusan mako 1–12, 13–27, da 28–40). Za ki iya ganin makonki, kashinki, da ranar da ake tsammanin haihuwa a sashen Bin Diddigin Ciki a dashboard ɗinki, bisa ranar al'adarki ta ƙarshe. Kowane ciki daban ne, don haka ko da yaushe ka kawo wata damuwa ta musamman ga mai kula da cikinki.",
    },
  },
  {
    key: "antenatal",
    keywords: {
      en: ["antenatal", "anc visit", "antenatal care", "antenatal visit", "booking visit"],
      ha: ["kula da ciki", "ziyarar kula da ciki"],
    },
    reply: {
      en: "Antenatal care checks your blood pressure, weight and baby's growth, and screens for problems like anaemia or high blood pressure early. Nigeria recommends at least 8 antenatal contacts across a pregnancy. Bring your antenatal card to every visit.",
      ha: "Kula da ciki na duba hawan jini, nauyi, da ci gaban jariri, kuma na gano matsaloli kamar karancin jini ko hawan jini da wuri. Najeriya na ba da shawarar akalla ziyara 8 na kula da ciki a tsawon ciki. Ka kawo katin kula da cikinki a kowace ziyara.",
    },
  },
  {
    key: "maternal-health",
    keywords: {
      en: ["maternal health", "nutrition in pregnancy", "eating during pregnancy", "iron and folic"],
      ha: ["lafiyar uwa", "abinci yayin ciki", "karfe da folic"],
    },
    reply: {
      en: "Good maternal nutrition means a variety of foods - proteins, iron-rich foods like leafy greens, and fruits - plus iron and folic acid supplements as your health worker prescribes. Rest when you can, avoid alcohol and unprescribed medication, and drink clean water through the day.",
      ha: "Ingantacciyar abincin uwa na nufin iri-iri na abinci - furotin, abincin da ke da karfe kamar ganyayen kore, da 'ya'yan itace - tare da kwayoyin karfe da folic acid kamar yadda ma'aikacin lafiya ya rubuta. Ka huta lokacin da za ki iya, ki guji giya da magungunan da ba a rubuta ba, kuma ki sha ruwa mai tsafta a duk rana.",
    },
  },
  {
    key: "newborn",
    keywords: {
      en: ["newborn", "new baby", "umbilical cord", "cord stump", "first days of baby"],
      ha: ["jariri", "sabon jariri", "tsintsiyar cibiya"],
    },
    reply: {
      en: "Keep a newborn warm and dry, start breastfeeding within the first hour, and keep the umbilical cord stump clean and dry until it falls off naturally. Watch for fever, difficulty breastfeeding, yellowing skin or unusual sleepiness, and seek care immediately if you see these.",
      ha: "Ka tabbatar jariri yana da dumi kuma bushe, ka fara shayarwa cikin sa'a ta farko, kuma ka kula da tsintsiyar cibiya ta kasance mai tsafta har sai ta fadi da kanta. Ka kula da zazzabi, wahalar shayarwa, rawaya a fata, ko yawan barci, ka nemi kulawa nan take idan ka gan su.",
    },
  },
  {
    key: "child-health",
    keywords: {
      en: ["sick child", "child is sick", "my child has fever", "child not eating", "child health"],
      ha: ["yaro mara lafiya", "yarona yana da zazzabi", "lafiyar yara"],
    },
    reply: {
      en: "Seek care immediately if a child has difficulty breathing, can't drink or breastfeed, has convulsions, is unusually drowsy, or has a fever with other worrying symptoms. Routine check-ups and growth monitoring help catch problems early.",
      ha: "Nemi kulawa nan take idan yaro yana da wahalar numfashi, ba zai iya sha ko shayarwa ba, yana da farfadiya, yana da yawan gyangyadi, ko yana da zazzabi tare da wasu alamun damuwa. Bincike na yau da kullum na taimakawa gano matsala da wuri.",
    },
  },
  {
    key: "immunization",
    keywords: {
      en: ["vaccine", "vaccination", "immunization", "immunisation", "bcg", "penta", "measles vaccine"],
      ha: ["allura", "allurar rigakafi", "bcg"],
    },
    reply: {
      en: "Vaccines protect your child from diseases like measles, polio and whooping cough. You can see your child's full schedule and status (Upcoming, Due Today, Completed, Overdue) in the Children section. Missing a dose doesn't mean starting over - take your child as soon as possible.",
      ha: "Alluran rigakafi na kare yaronki daga cututtuka kamar kyanda, shan inna, da tari mai zafi. Za ki iya ganin cikakken jadawalin yaronki da matsayinsa a sashen Yara. Rashin allura daya ba yana nufin sake farawa ba - ka kai yaronki da wuri-wuri.",
    },
  },
  {
    key: "child-nutrition",
    keywords: {
      en: ["complementary feeding", "baby food", "pap", "weaning", "child nutrition", "what to feed baby"],
      ha: ["abincin yara", "kunu", "cire shayarwa", "abin da za a ciyar da jariri"],
    },
    reply: {
      en: "From about 6 months, start adding soft, mashed foods alongside continued breastfeeding - 2–3 small meals a day at first, increasing in frequency and thickness as your baby grows. See the Child Nutrition section for pap recipes and fruit guides, including safety notes like no honey before 12 months.",
      ha: "Daga kimanin wata 6, fara kara taushin abinci tare da ci gaba da shayarwa - abinci karami 2–3 a rana da farko, sannan a kara yawa da kauri yayin da jaririnki ke girma. Duba sashen Abincin Yara don girke-girke na kunu da jagororin 'ya'yan itace, da kuma lura kamar babu zuma kafin wata 12.",
    },
  },
  {
    key: "breastfeeding",
    keywords: {
      en: ["breastfeeding", "breastfeed", "breast milk", "nursing baby"],
      ha: ["shayarwa", "nonon uwa"],
    },
    reply: {
      en: "Breast milk alone is recommended for the first 6 months - no water, other liquids or foods needed. Feed on demand, day and night. Continued breastfeeding alongside complementary foods is recommended up to 2 years or beyond.",
      ha: "Nonon uwa kawai ana ba da shawara a watanni 6 na farko - babu bukatar ruwa, wani ruwa ko abinci. Ki shayar duk lokacin da yaro yake so, dare da rana. Ana ba da shawarar ci gaba da shayarwa tare da abincin kari har zuwa shekaru 2 ko fiye.",
    },
  },
  {
    key: "postpartum",
    keywords: {
      en: ["postpartum", "after delivery", "after birth", "recovering from birth", "post delivery"],
      ha: ["bayan haihuwa", "farfadowa bayan haihuwa"],
    },
    reply: {
      en: "The weeks after delivery are for rest and healing. Watch for danger signs - heavy bleeding, fever, severe pain, foul-smelling discharge - and seek care immediately if they occur. Attend your postpartum check-ups and accept help so you can rest.",
      ha: "Makonnin bayan haihuwa lokaci ne na huta da warkarwa. Ka kula da alamun hadari - zubar jini mai yawa, zazzabi, ciwo mai tsanani, fitarwar da ke da wari - ka nemi kulawa nan take idan sun faru. Ka je bincike bayan haihuwa kuma ka karbi taimako domin ka huta.",
    },
  },
  {
    key: "reproductive-health",
    keywords: {
      en: ["menstrual cycle", "period", "fertility", "ovulation", "reproductive health"],
      ha: ["al'ada", "haihuwa", "fitowar kwai"],
    },
    reply: {
      en: "Understanding your menstrual cycle and fertility signs helps you make informed decisions about pregnancy and family planning. Regular check-ups can catch concerns early - speak openly with a healthcare provider about anything on your mind.",
      ha: "Fahimtar al'adarki da alamun haihuwa na taimaka maki yanke shawara mai kyau game da ciki da tsare-tsaren iyali. Bincike akai-akai na iya gano damuwa da wuri - ki yi magana a fili da ma'aikacin lafiya.",
    },
  },
  {
    key: "family-planning",
    keywords: {
      en: ["family planning", "contraception", "birth control", "condom", "iud", "implant", "injectable", "the pill"],
      ha: ["tsare-tsaren iyali", "hana ciki", "kwaroron roba", "allurar hana ciki"],
    },
    reply: {
      en: "Family planning gives you and your partner information to choose when and how many children to have. The Family Planning section explains each method's duration, how it works, effectiveness, advantages and side effects, with a tool to compare methods side by side. MamaCare does not tell you which method to choose - that's a decision for you and your healthcare provider.",
      ha: "Tsare-tsaren iyali na ba ki da abokin zamanki bayani don zabar lokacin da yawan yaran da za a haifa. Sashen Tsare-tsaren Iyali na bayyana tsawon lokaci, yadda take aiki, tasiri, fa'idoji da illolin kowace hanya, tare da kayan aikin kwatanta hanyoyi. MamaCare ba ya gaya maki wace hanya za ki zaba - wannan shawarar ki ne da mai kula da lafiyarki.",
    },
  },
  {
    key: "danger-signs",
    keywords: {
      en: ["warning signs", "danger signs", "emergency signs"],
      ha: ["alamun hadari", "alamun gaggawa"],
    },
    reply: {
      en: "Seek urgent professional care immediately for: severe bleeding, convulsions, severe breathing difficulty, unconsciousness, severe abdominal pain, severe headache with blurred vision or swelling, or high fever. These can appear during pregnancy, delivery or after birth - when in doubt, go to a health facility right away.",
      ha: "Nemi kulawar kwararre nan take don: zubar jini mai tsanani, farfadiya, wahalar numfashi mai tsanani, rashin sani, ciwon ciki mai tsanani, ciwon kai mai tsanani tare da hazo a gani ko kumburi, ko zazzabi mai zafi. Wadannan na iya bayyana yayin ciki, haihuwa, ko bayan haihuwa - idan kina shakka, je asibiti nan take.",
    },
  },
];

const DISCLAIMER = {
  en: "MamaCare AI provides educational support and does not replace professional healthcare advice.",
  ha: "MamaCare AI na bayar da taimakon ilimi kawai kuma ba ya maye gurbin shawarar likitan kwararre.",
};

const URGENT_CARE_REPLY = {
  en: "What you're describing could be a danger sign. Please seek urgent professional medical care right away - go to the nearest health facility or call your clinic now. This is not something to wait on or manage at home.",
  ha: "Abin da kika kwatanta na iya zama alamar hadari. Da fatan za ki nemi kulawar likitan kwararre nan take - je asibiti mafi kusa ko ki kira asibitin ki yanzu. Wannan ba abin jira ba ne ko a kula da shi a gida.",
};

const DIAGNOSIS_REFUSAL_REPLY = {
  en: "I can't diagnose conditions, prescribe medication, or tell you to start or stop any treatment - that needs a qualified healthcare provider who can examine you. I can explain general health information on pregnancy, child health, nutrition, immunization, family planning and more. Would you like me to explain one of those topics?",
  ha: "Ba zan iya gano cuta, bayar da magani, ko gaya maki ki fara ko ki daina wani magani ba - wannan yana bukatar kwararren likita wanda zai iya duba ki. Zan iya bayyana bayanin lafiya na gaba daya kan ciki, lafiyar yara, abinci, allurar rigakafi, tsare-tsaren iyali da sauransu. Kina so in bayyana daya daga cikin wadannan batutuwa?",
};

const FALLBACK_REPLY = {
  en: "I'm not able to answer that specifically yet - I can currently help explain pregnancy, antenatal care, newborn and child health, immunization, child nutrition, breastfeeding, postpartum care, reproductive health, family planning, and danger signs. Try asking about one of those, or browse the Learn section for more detail.",
  ha: "Ban iya amsa wannan takamaimai tukuna ba - a yanzu zan iya taimakawa wajen bayyana ciki, kula da ciki, lafiyar jariri da yara, allurar rigakafi, abincin yara, shayarwa, kula bayan haihuwa, lafiyar haihuwa, tsare-tsaren iyali, da alamun hadari. Ka gwada tambaya kan daya daga cikinsu, ko ka bincika sashen Koyo don karin bayani.",
};

function containsAny(text, phrases) {
  const lower = text.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}

// Returns { reply, matchedTopic, safetyFlag, disclaimer }. Always call
// this rather than hand-rolling a reply, so every caller gets the same
// safety checks in the same order.
function generateReply(message, language = "en") {
  const lang = language === "ha" ? "ha" : "en";

  if (containsAny(message, DANGER_SIGN_KEYWORDS[lang]) || containsAny(message, DANGER_SIGN_KEYWORDS.en)) {
    return {
      reply: URGENT_CARE_REPLY[lang],
      matchedTopic: "danger-signs",
      safetyFlag: "danger_sign",
      disclaimer: DISCLAIMER[lang],
    };
  }

  if (
    containsAny(message, DIAGNOSIS_REQUEST_PATTERNS[lang]) ||
    containsAny(message, DIAGNOSIS_REQUEST_PATTERNS.en)
  ) {
    return {
      reply: DIAGNOSIS_REFUSAL_REPLY[lang],
      matchedTopic: null,
      safetyFlag: "diagnosis_request",
      disclaimer: DISCLAIMER[lang],
    };
  }

  for (const topic of TOPICS) {
    if (containsAny(message, topic.keywords[lang]) || containsAny(message, topic.keywords.en)) {
      return {
        reply: topic.reply[lang],
        matchedTopic: topic.key,
        safetyFlag: null,
        disclaimer: DISCLAIMER[lang],
      };
    }
  }

  return {
    reply: FALLBACK_REPLY[lang],
    matchedTopic: null,
    safetyFlag: null,
    disclaimer: DISCLAIMER[lang],
  };
}

module.exports = { generateReply, DISCLAIMER, TOPICS };
