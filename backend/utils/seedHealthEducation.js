// Run once with: node utils/seedHealthEducation.js
// Seeds the 11 fixed categories plus one starter article each, in
// English and Hausa. Admin can publish more articles later from the
// Admin Dashboard (Phase 7) - these are meant as a real, usable starting
// library, not filler. NOTE: Hausa text is AI-drafted; have a native
// speaker review it before real users see it (see README).
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const HealthCategory = require("../models/HealthCategory");
const HealthArticle = require("../models/HealthArticle");

const categories = [
  { slug: "pregnancy", name: { en: "Pregnancy", ha: "Ciki" }, order: 1 },
  { slug: "antenatal", name: { en: "Antenatal Care", ha: "Kula da Ciki" }, order: 2 },
  { slug: "maternal-health", name: { en: "Maternal Health", ha: "Lafiyar Uwa" }, order: 3 },
  { slug: "newborn", name: { en: "Newborn Care", ha: "Kula da Jariri" }, order: 4 },
  { slug: "child-health", name: { en: "Child Health", ha: "Lafiyar Yara" }, order: 5 },
  { slug: "immunization", name: { en: "Immunization", ha: "Allurar Rigakafi" }, order: 6 },
  { slug: "child-nutrition", name: { en: "Child Nutrition", ha: "Abincin Yara" }, order: 7 },
  { slug: "breastfeeding", name: { en: "Breastfeeding", ha: "Shayarwa" }, order: 8 },
  { slug: "postpartum", name: { en: "Postpartum Care", ha: "Kula Bayan Haihuwa" }, order: 9 },
  { slug: "reproductive-health", name: { en: "Reproductive Health", ha: "Lafiyar Haihuwa" }, order: 10 },
  { slug: "family-planning", name: { en: "Family Planning", ha: "Tsare-tsaren Iyali" }, order: 11 },
  { slug: "danger-signs", name: { en: "Danger Signs", ha: "Alamun Haɗari" }, order: 12 },
];

const articles = [
  {
    slug: "pregnancy",
    title: { en: "What to Expect Each Trimester", ha: "Abin da Za a Jira a Kowane Kashi na Ciki" },
    content: {
      en: "Pregnancy is usually divided into three trimesters. In the first trimester (weeks 1–12), your body adjusts to new hormones — tiredness and nausea are common. The second trimester (weeks 13–27) is often the most comfortable, with steady growth and your first movements felt. The third trimester (weeks 28–40) brings rapid growth and preparation for birth. Attend every antenatal appointment so a health worker can track your progress and catch problems early.",
      ha: "Ana kasa ciki zuwa kashi uku yawanci. A kashi na farko (mako 1–12), jikinki na daidaitawa da sabbin hormones — gajiya da tashin zuciya abu ne na yau da kullum. Kashi na biyu (mako 13–27) galibi shi ne mafi sauƙi, tare da ci gaba na yau da kullum da fara jin motsin ɗan tayi. Kashi na uku (mako 28–40) na kawo ci gaba mai sauri da shirye-shirye don haihuwa. Ka je kowane alƙawarin kula da ciki don ma'aikacin lafiya ya bi diddigin ci gabanki kuma ya gano matsala da wuri.",
    },
  },
  {
    slug: "antenatal",
    title: { en: "Why Antenatal Visits Matter", ha: "Me Ya Sa Ziyarar Kula da Ciki Ke da Muhimmanci" },
    content: {
      en: "Antenatal care checks your blood pressure, weight, and your baby's growth, and screens for conditions like anaemia, malaria, and high blood pressure before they become dangerous. Nigeria recommends at least 8 antenatal contacts. Bring your antenatal card to every visit and to the health facility when you deliver.",
      ha: "Kula da ciki na duba hawan jini, nauyi, da ci gaban jaririnki, kuma na duba matsaloli kamar karancin jini, zazzabin cizon sauro, da hawan jini kafin su zama haɗari. Najeriya na ba da shawarar ziyara akalla 8 na kula da ciki. Ka kawo katin kula da cikinki a kowace ziyara da kuma zuwa asibiti lokacin haihuwa.",
    },
  },
  {
    slug: "maternal-health",
    title: { en: "Nutrition During Pregnancy", ha: "Abinci Yayin Ciki" },
    content: {
      en: "Eat a variety of foods including proteins (beans, fish, eggs), iron-rich foods (leafy greens, liver), and fruits. Take iron and folic acid supplements as prescribed by your health worker. Avoid alcohol and unprescribed medication. Rest when you can and drink clean water throughout the day.",
      ha: "Ci iri-iri na abinci hada da furotin (wake, kifi, kwai), abincin da ke da karfe (ganyayen kore, hanta), da 'ya'yan itace. Sha kwayoyin karfe da folic acid kamar yadda ma'aikacin lafiya ya rubuta. Ka guji giya da magungunan da ba a rubuta maka ba. Ka huta lokacin da za ka iya kuma ka sha ruwa mai tsafta a duk tsawon rana.",
    },
  },
  {
    slug: "newborn",
    title: { en: "Caring for Your Newborn's First Days", ha: "Kula da Jaririnki a Kwanakin Farko" },
    content: {
      en: "Keep your newborn warm and dry, start breastfeeding within the first hour, and keep the umbilical cord stump clean and dry until it falls off naturally. Watch for danger signs: fever, difficulty breastfeeding, yellowing skin, or unusual sleepiness — seek care immediately if these occur.",
      ha: "Ka tabbatar jaririnki yana da dumi kuma bushe, ka fara shayarwa cikin sa'a ta farko, kuma ka kula da tsintsiyar cibiya ta kasance mai tsafta da bushewa har sai ta fadi da kanta. Ka kula da alamun haɗari: zazzabi, wahalar shayarwa, rawaya a fata, ko yawan barci fiye da kima — nemi kulawa nan take idan hakan ya faru.",
    },
  },
  {
    slug: "child-health",
    title: { en: "Recognizing When a Sick Child Needs Care", ha: "Gane Lokacin Da Yaro Mai Rashin Lafiya Ke Bukatar Kulawa" },
    content: {
      en: "Seek care immediately if a child has difficulty breathing, cannot drink or breastfeed, has convulsions, is unusually drowsy or unresponsive, or has a fever alongside other worrying symptoms. Routine check-ups and growth monitoring help catch problems before they become emergencies.",
      ha: "Nemi kulawa nan take idan yaro yana da wahalar numfashi, ba zai iya sha ko shayarwa ba, yana da farfaɗiya, yana da yawan gyangyaɗi ko rashin amsawa, ko yana da zazzabi tare da wasu alamun damuwa. Bincike na yau da kullum da bin diddigin girma na taimakawa gano matsala kafin ta zama gaggawa.",
    },
  },
  {
    slug: "immunization",
    title: { en: "Why Every Vaccine Dose Matters", ha: "Me Ya Sa Kowace Allurar Rigakafi Ke da Muhimmanci" },
    content: {
      en: "Vaccines protect your child from serious diseases like measles, polio, and whooping cough. Missing a dose doesn't mean starting over — take your child as soon as possible and the schedule will continue from where it left off. Keep your child's immunization card safe and bring it to every visit.",
      ha: "Alluran rigakafi na kare yaronki daga cututtuka masu tsanani kamar kyanda, shan inna, da tari mai zafi. Rashin allura daya ba yana nufin sake farawa ba — ka kai yaronki da wuri-wuri kuma jadawalin zai ci gaba daga inda ya tsaya. Ka ajiye katin allurar rigakafin yaronki lafiya kuma ka kawo shi a kowace ziyara.",
    },
  },
  {
    slug: "child-nutrition",
    title: { en: "Starting Complementary Feeding at 6 Months", ha: "Fara Ciyar da Abinci na Ƙari a Wata 6" },
    content: {
      en: "From about 6 months, begin adding soft, mashed foods alongside continued breastfeeding. Start with 2–3 small meals a day and increase frequency and thickness as your baby grows. Include energy-rich foods, iron-rich foods, and a variety of food groups. See the Child Nutrition section for pap recipes and fruit guides.",
      ha: "Daga kimanin wata 6, fara ƙara taushin abinci mai laushi tare da ci gaba da shayarwa. Fara da abinci karami 2–3 a rana kuma ka ƙara yawa da kaurin abincin yayin da jaririnki ke girma. Ka hada da abinci mai karfin kuzari, abinci mai karfe, da iri-iri na kungiyoyin abinci. Duba sashen Abincin Yara don girke-girke na kunu da jagororin 'ya'yan itace.",
    },
  },
  {
    slug: "breastfeeding",
    title: { en: "Exclusive Breastfeeding for the First 6 Months", ha: "Shayarwa Kawai a Watanni 6 na Farko" },
    content: {
      en: "Breast milk alone — no water, no other liquids or foods — is recommended for the first 6 months. It provides complete nutrition and protects against infections. Feed on demand, both day and night. Continued breastfeeding alongside complementary foods is recommended up to 2 years or beyond.",
      ha: "Nonon uwa kawai — babu ruwa, babu wani ruwa ko abinci — ana ba da shawara a watanni 6 na farko. Yana bayar da cikakken abinci mai gina jiki kuma yana kare daga cututtuka. Ka shayar duk lokacin da yaro yake so, dare da rana. Ana ba da shawarar ci gaba da shayarwa tare da abincin ƙari har zuwa shekaru 2 ko fiye.",
    },
  },
  {
    slug: "postpartum",
    title: { en: "Recovering After Delivery", ha: "Farfadowa Bayan Haihuwa" },
    content: {
      en: "The weeks after delivery are a time for rest and healing. Watch for danger signs: heavy bleeding, fever, severe pain, or foul-smelling discharge — seek care immediately. Attend postpartum check-ups, eat well, and accept help from family so you can rest and bond with your baby.",
      ha: "Makonnin bayan haihuwa lokaci ne na huta da warkarwa. Ka kula da alamun haɗari: zubar jini mai yawa, zazzabi, ciwo mai tsanani, ko fitarwar da ke da wari mara kyau — nemi kulawa nan take. Ka je bincike bayan haihuwa, ka ci abinci mai kyau, kuma ka karɓi taimako daga iyali domin ka huta kuma ka kulla alaƙa da jaririnki.",
    },
  },
  {
    slug: "reproductive-health",
    title: { en: "Understanding Your Reproductive Health", ha: "Fahimtar Lafiyar Haihuwarki" },
    content: {
      en: "Understanding your menstrual cycle, fertility signs, and reproductive health helps you make informed decisions about pregnancy and family planning. Regular check-ups can catch reproductive health concerns early. Speak openly with a healthcare provider about any concerns without embarrassment.",
      ha: "Fahimtar al'adarki, alamun haihuwa, da lafiyar haihuwa na taimaka maka yanke shawara mai kyau game da ciki da tsare-tsaren iyali. Bincike akai-akai na iya gano matsalolin lafiyar haihuwa da wuri. Ka yi magana a fili da ma'aikacin lafiya game da duk wata damuwa ba tare da kunya ba.",
    },
  },
  {
    slug: "family-planning",
    title: { en: "Healthy Birth Spacing", ha: "Tsara Tazarar Haihuwa Cikin Koshin Lafiya" },
    content: {
      en: "Spacing pregnancies at least 2 years apart lowers health risks for both mother and child. Family planning gives you and your partner the information to choose when and how many children to have. See the Family Planning section to compare methods — the right choice depends on your health and preferences, so discuss with a healthcare provider.",
      ha: "Barin akalla shekaru 2 tsakanin haihuwa na rage haɗarin lafiya ga uwa da yaro. Tsare-tsaren iyali na ba ki da abokin zamanki bayanin da za a zaɓi lokacin da yawan yaran da za a haifa. Duba sashen Tsare-tsaren Iyali don kwatanta hanyoyi — zaɓin da ya dace ya dogara da lafiyarki da abin da kika fi so, don haka ka tattauna da ma'aikacin lafiya.",
    },
  },
  {
    slug: "danger-signs",
    title: { en: "Danger Signs You Should Never Ignore", ha: "Alamun Haɗari da Bai Kamata Ki Yi Watsi da Su Ba" },
    content: {
      en: "Seek urgent professional care immediately for: severe bleeding, convulsions, severe breathing difficulty, unconsciousness, severe abdominal pain, severe headache with blurred vision or swelling, or high fever. These signs can appear during pregnancy, delivery, or after birth. MamaCare Connect does not diagnose — when in doubt, go to a health facility right away.",
      ha: "Nemi kulawar kwararre nan take don: zubar jini mai tsanani, farfaɗiya, wahalar numfashi mai tsanani, rashin sani, ciwon ciki mai tsanani, ciwon kai mai tsanani tare da hazo a gani ko kumburi, ko zazzabi mai zafi. Wadannan alamu na iya bayyana yayin ciki, haihuwa, ko bayan haihuwa. MamaCare Connect ba ya gano cuta — idan kina shakka, je asibiti nan take.",
    },
  },
];

async function run() {
  await connectDB();

  await HealthCategory.deleteMany({});
  const createdCategories = await HealthCategory.insertMany(categories);
  const categoryBySlug = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

  await HealthArticle.deleteMany({});
  const articleDocs = articles.map((a) => ({
    title: a.title,
    content: a.content,
    category: categoryBySlug[a.slug],
    source: "MamaCare Connect editorial team, aligned with WHO/UNICEF and Nigeria FMOH guidance",
    status: "published",
  }));
  await HealthArticle.insertMany(articleDocs);

  console.log(`Seeded ${createdCategories.length} categories and ${articleDocs.length} articles.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
