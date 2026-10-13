// Run once with: node utils/seedFamilyPlanning.js
// Effectiveness figures are widely published typical-use ranges (WHO/CDC
// contraceptive effectiveness tables), presented neutrally for
// comparison — this is educational information, not a recommendation of
// which method to use. NOTE: Hausa text is AI-drafted and should be
// reviewed by a native speaker, and by a health professional for
// terminology accuracy given the sensitivity of this content.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const FamilyPlanningMethod = require("../models/FamilyPlanningMethod");

const methods = [
  {
    name: { en: "Lactational Amenorrhea Method (LAM)", ha: "Hanyar Rashin Al'ada ta Shayarwa (LAM)" },
    category: "natural",
    description: { en: "Uses exclusive breastfeeding as temporary, natural contraception in the first months after birth.", ha: "Ana amfani da shayarwa kawai a matsayin hanyar hana daukar ciki ta wucin gadi da dabi'a a watanni na farko bayan haihuwa." },
    duration: { en: "Effective for up to 6 months after birth, only while criteria below are met.", ha: "Yana aiki har zuwa wata 6 bayan haihuwa, kawai idan sharuɗɗan ƙasa sun cika." },
    mechanism: { en: "Frequent, exclusive breastfeeding (day and night, no other food/liquids) suppresses ovulation, provided the baby is under 6 months and menstruation has not returned.", ha: "Shayarwa akai-akai kuma kawai (dare da rana, babu wani abinci/ruwa) na hana fitowar kwai, muddin jariri bai wuce wata 6 ba kuma al'ada bata dawo ba." },
    effectiveness: { en: "About 98% effective when all three criteria are strictly met; effectiveness drops quickly if any criterion is not met.", ha: "Kimanin kashi 98% na aiki idan an bi dukkan sharuɗɗa uku sosai; yana raguwa da sauri idan ba a bi ɗaya daga cikinsu ba." },
    advantages: { en: ["No cost, no supplies needed", "Supports exclusive breastfeeding, which also benefits the baby", "No hormones"], ha: ["Babu kudi, babu bukatar kayan aiki", "Yana tallafawa shayarwa kawai, wanda kuma yana amfanar jariri", "Babu hormones"] },
    sideEffects: { en: ["None directly, but only works under strict conditions"], ha: ["Babu kai tsaye, amma yana aiki ne kawai a karkashin sharudda masu tsauri"] },
    considerations: { en: "Only reliable if breastfeeding is truly exclusive and frequent, baby is under 6 months, and periods have not returned. Switch to another method once any condition changes.", ha: "Abin dogaro ne kawai idan shayarwa ta kasance ta gaskiya kuma akai-akai, jariri bai wuce wata 6 ba, kuma al'ada bata dawo ba. A koma zuwa wata hanyar da zarar wani sharadi ya canza." },
    order: 1,
  },
  {
    name: { en: "Fertility Awareness Methods", ha: "Hanyoyin Sanin Lokacin Haihuwa" },
    category: "natural",
    description: { en: "Tracking the menstrual cycle, body temperature, or cervical mucus to identify and avoid unprotected sex on fertile days.", ha: "Bin diddigin al'ada, zafin jiki, ko ruwan mahaifa don gane kuma guje wa jima'i mara kariya a kwanakin haihuwa." },
    duration: { en: "Used continuously, cycle by cycle.", ha: "Ana amfani da su akai-akai, kowane wata." },
    mechanism: { en: "Identifies the fertile window in each cycle so the couple can avoid intercourse or use a barrier method during that time.", ha: "Yana gane kwanakin haihuwa a kowane wata don ma'aurata su guji jima'i ko amfani da hanyar shamaki a wannan lokaci." },
    effectiveness: { en: "Roughly 76–88% effective with typical use; effectiveness depends heavily on consistent, correct tracking.", ha: "Kimanin kashi 76–88% na aiki da amfani na yau da kullum; yana dogara sosai kan daidaiton bin diddigi." },
    advantages: { en: ["No hormones or devices", "No cost", "Increases awareness of one's own cycle"], ha: ["Babu hormones ko na'urori", "Babu kudi", "Yana ƙara sanin al'adar jiki"] },
    sideEffects: { en: ["None directly"], ha: ["Babu kai tsaye"] },
    considerations: { en: "Requires a regular cycle and consistent daily tracking; less reliable with irregular cycles or inconsistent use.", ha: "Yana bukatar al'ada mai tsari da bin diddigi na yau da kullum; ba shi da tabbaci sosai idan al'ada ba ta da tsari ko amfani bai tsayu ba." },
    order: 2,
  },
  {
    name: { en: "Male Condoms", ha: "Kwaroron Roba na Namiji" },
    category: "barrier",
    description: { en: "A barrier worn on the penis during sex to prevent sperm from reaching the egg, and reduce STI transmission.", ha: "Wani shamaki da ake sanyawa a azzakari yayin jima'i don hana maniyi kaiwa ga kwai, kuma yana rage yaduwar cututtukan jima'i." },
    duration: { en: "Used once per act of intercourse.", ha: "Ana amfani da shi sau daya a kowane jima'i." },
    mechanism: { en: "Physically blocks sperm from entering the vagina.", ha: "Yana toshe maniyi kai tsaye daga shiga farji." },
    effectiveness: { en: "About 87% effective with typical use, up to 98% with perfect use every time.", ha: "Kimanin kashi 87% na aiki da amfani na yau da kullum, har zuwa kashi 98% idan an yi amfani daidai kowane lokaci." },
    advantages: { en: ["Also reduces risk of sexually transmitted infections", "No prescription needed", "No hormones"], ha: ["Har ila yau yana rage haɗarin cututtukan jima'i", "Ba a bukatar takardar likita", "Babu hormones"] },
    sideEffects: { en: ["Rare latex allergy"], ha: ["Wani lokaci rashin lafiyar jiki ga roba (latex)"] },
    considerations: { en: "Must be used correctly and consistently every time to be effective.", ha: "Dole a yi amfani daidai kuma akai-akai kowane lokaci don ya yi aiki." },
    order: 3,
  },
  {
    name: { en: "Female Condoms", ha: "Kwaroron Roba na Mace" },
    category: "barrier",
    description: { en: "A barrier inserted into the vagina before sex to prevent sperm from reaching the egg.", ha: "Wani shamaki da ake sanyawa a farji kafin jima'i don hana maniyi kaiwa ga kwai." },
    duration: { en: "Used once per act of intercourse.", ha: "Ana amfani da shi sau daya a kowane jima'i." },
    mechanism: { en: "Lines the vaginal wall to physically block sperm.", ha: "Yana rufe bangon farji don toshe maniyi kai tsaye." },
    effectiveness: { en: "About 79% effective with typical use.", ha: "Kimanin kashi 79% na aiki da amfani na yau da kullum." },
    advantages: { en: ["Also reduces risk of sexually transmitted infections", "Controlled by the woman", "No hormones"], ha: ["Har ila yau yana rage haɗarin cututtukan jima'i", "Mace ce ke sarrafa shi", "Babu hormones"] },
    sideEffects: { en: ["Rare irritation"], ha: ["Wani lokaci fushi a fata"] },
    considerations: { en: "Needs practice for correct insertion; must be used every time.", ha: "Yana bukatar horo don sanya shi daidai; dole a yi amfani da shi kowane lokaci." },
    order: 4,
  },
  {
    name: { en: "Combined & Progestin-Only Pills", ha: "Kwayoyin Hana Ciki (Cakuda da Kadai)" },
    category: "hormonal-short-acting",
    description: { en: "Daily pills containing hormones that prevent pregnancy.", ha: "Kwayoyin hormones da ake sha kowace rana don hana daukar ciki." },
    duration: { en: "Taken daily; effective only while taken consistently.", ha: "Ana sha kowace rana; yana aiki ne kawai idan ana sha akai-akai." },
    mechanism: { en: "Hormones prevent ovulation and thicken cervical mucus to block sperm.", ha: "Hormones na hana fitowar kwai kuma su kaurara ruwan mahaifa don toshe maniyi." },
    effectiveness: { en: "About 91% effective with typical use, over 99% with perfect daily use.", ha: "Kimanin kashi 91% na aiki da amfani na yau da kullum, sama da kashi 99% idan ana sha daidai kowace rana." },
    advantages: { en: ["Can make periods more regular and lighter", "Reversible immediately on stopping", "Some formulations safe while breastfeeding"], ha: ["Na iya sanya al'ada ta zama mai tsari kuma sauki", "Ana iya dawowa nan take idan an daina", "Wasu nau'ukan suna da aminci yayin shayarwa"] },
    sideEffects: { en: ["Nausea", "Headaches", "Spotting between periods", "Mood changes"], ha: ["Tashin zuciya", "Ciwon kai", "Zubar jini kadan tsakanin al'ada", "Canjin yanayi"] },
    considerations: { en: "Must be taken at the same time each day; a healthcare provider can advise which type suits your health history.", ha: "Dole a sha a lokaci guda kowace rana; ma'aikacin lafiya na iya ba da shawara kan wanne nau'i ya dace da tarihin lafiyarki." },
    order: 5,
  },
  {
    name: { en: "Injectables (e.g. DMPA)", ha: "Allurar Hana Ciki (misali DMPA)" },
    category: "hormonal-short-acting",
    description: { en: "A hormone injection given by a health worker every 1–3 months depending on the type.", ha: "Allurar hormone da ma'aikacin lafiya ke bayarwa kowane wata 1–3 dangane da nau'in." },
    duration: { en: "Lasts 1–3 months per injection depending on the type used.", ha: "Yana daukar wata 1–3 a kowace allura dangane da nau'in da ake amfani da shi." },
    mechanism: { en: "Hormones prevent ovulation.", ha: "Hormones na hana fitowar kwai." },
    effectiveness: { en: "About 94% effective with typical use, over 99% with on-time injections.", ha: "Kimanin kashi 94% na aiki da amfani na yau da kullum, sama da kashi 99% idan ana yin allura a kan lokaci." },
    advantages: { en: ["Only needs a clinic visit every few months", "Private — not visible to a partner", "Safe while breastfeeding"], ha: ["Kawai yana bukatar ziyarar asibiti a kowane 'yan watanni", "Sirri ne — ba a iya gani ga abokin zama", "Yana da aminci yayin shayarwa"] },
    sideEffects: { en: ["Irregular bleeding or spotting", "Delayed return to fertility after stopping", "Possible weight change"], ha: ["Zubar jini mara tsari", "Jinkirin dawowar haihuwa bayan dainawa", "Yiwuwar canjin nauyi"] },
    considerations: { en: "Requires returning to a clinic on schedule for the next dose.", ha: "Yana bukatar dawowa asibiti a kan lokaci don allura ta gaba." },
    order: 6,
  },
  {
    name: { en: "Implants", ha: "Dashen Roba (Implant)" },
    category: "long-acting",
    description: { en: "A small, flexible rod placed under the skin of the upper arm by a trained provider.", ha: "Karamin sandar roba mai laushi da ma'aikacin lafiya da aka horar ke sanyawa karkashin fatar hannun sama." },
    duration: { en: "Lasts 3–5 years depending on the type, and can be removed earlier if desired.", ha: "Yana daukar shekaru 3–5 dangane da nau'in, kuma ana iya cirewa da wuri idan an so." },
    mechanism: { en: "Slowly releases hormone to prevent ovulation.", ha: "Yana fitar da hormone a hankali don hana fitowar kwai." },
    effectiveness: { en: "Over 99% effective — one of the most effective reversible methods.", ha: "Sama da kashi 99% na aiki — daya daga cikin hanyoyin da za a iya dawowa da suka fi tasiri." },
    advantages: { en: ["Long-lasting with no daily action needed", "Fertility returns quickly after removal", "Safe while breastfeeding"], ha: ["Na dogon lokaci ba tare da bukatar wani aiki na yau da kullum ba", "Haihuwa na dawowa da sauri bayan an cire", "Yana da aminci yayin shayarwa"] },
    sideEffects: { en: ["Irregular bleeding, especially in the first months", "Headaches", "Minor discomfort at insertion site"], ha: ["Zubar jini mara tsari, musamman a watanni na farko", "Ciwon kai", "Ɗan rashin jin daɗi a wurin da aka sanya"] },
    considerations: { en: "Must be inserted and removed by a trained provider.", ha: "Dole ma'aikacin lafiya da aka horar ne ke sanyawa da cirewa." },
    order: 7,
  },
  {
    name: { en: "Intrauterine Device (IUD)", ha: "Na'urar Cikin Mahaifa (IUD)" },
    category: "long-acting",
    description: { en: "A small device placed inside the womb by a trained provider; available in copper (non-hormonal) or hormonal versions.", ha: "Karamar na'ura da ake sanyawa cikin mahaifa da ma'aikacin lafiya da aka horar; akwai nau'in tagulla (ba hormone ba) ko mai hormone." },
    duration: { en: "Copper IUDs last up to 10 years; hormonal IUDs last 3–8 years depending on the type.", ha: "IUD na tagulla na daukar har zuwa shekaru 10; mai hormone na daukar shekaru 3–8 dangane da nau'in." },
    mechanism: { en: "Copper IUDs prevent sperm from reaching the egg; hormonal IUDs also thicken cervical mucus and may prevent ovulation.", ha: "IUD na tagulla na hana maniyi kaiwa ga kwai; mai hormone kuma na kaurara ruwan mahaifa kuma na iya hana fitowar kwai." },
    effectiveness: { en: "Over 99% effective — among the most effective reversible methods.", ha: "Sama da kashi 99% na aiki — daya daga cikin hanyoyin da za a iya dawowa da suka fi tasiri." },
    advantages: { en: ["Very long-lasting", "Copper version has no hormones", "Fertility returns quickly after removal"], ha: ["Na dogon lokaci sosai", "Nau'in tagulla ba shi da hormones", "Haihuwa na dawowa da sauri bayan an cire"] },
    sideEffects: { en: ["Heavier periods and cramping (copper IUD)", "Irregular bleeding initially (hormonal IUD)", "Rare risk of expulsion or perforation"], ha: ["Al'ada mai yawa da ciwon ciki (IUD na tagulla)", "Zubar jini mara tsari a farko (mai hormone)", "Wani lokaci ta iya fitowa ko huda mahaifa"] },
    considerations: { en: "Must be inserted and removed by a trained provider.", ha: "Dole ma'aikacin lafiya da aka horar ne ke sanyawa da cirewa." },
    order: 8,
  },
  {
    name: { en: "Emergency Contraception", ha: "Kwayar Gaggawa ta Hana Ciki" },
    category: "emergency",
    description: { en: "A pill taken after unprotected sex to reduce the chance of pregnancy — for occasional emergency use, not regular contraception.", ha: "Kwaya da ake sha bayan jima'i mara kariya don rage yiwuwar daukar ciki — don gaggawa kawai, ba don hana ciki na yau da kullum ba." },
    duration: { en: "Most effective within 72 hours of unprotected sex; some types work up to 5 days.", ha: "Ta fi tasiri cikin sa'o'i 72 na jima'i mara kariya; wasu nau'uka na aiki har zuwa kwana 5." },
    mechanism: { en: "Mainly delays or prevents ovulation.", ha: "Galibi tana jinkirtawa ko hana fitowar kwai." },
    effectiveness: { en: "Significantly reduces pregnancy risk but is less effective than regular methods and effectiveness drops the longer you wait to take it.", ha: "Tana rage haɗarin daukar ciki sosai amma ba ta da tasiri kamar hanyoyin yau da kullum kuma tasirinta na raguwa yayin da lokaci ke wucewa kafin a sha." },
    advantages: { en: ["Available without advance planning", "Can be used after a condom failure or missed pills"], ha: ["Ana samun ta ba tare da shirin gaba ba", "Ana amfani da ita bayan gazawar kwaroron roba ko rasa kwayoyi"] },
    sideEffects: { en: ["Nausea", "Irregular bleeding", "Fatigue"], ha: ["Tashin zuciya", "Zubar jini mara tsari", "Gajiya"] },
    considerations: { en: "Not intended for regular use — talk to a provider about an ongoing method if used more than occasionally.", ha: "Ba a nufe don amfani na yau da kullum ba — ka tattauna da ma'aikacin lafiya game da hanyar dindindin idan ana amfani da ita fiye da lokaci-lokaci." },
    order: 9,
  },
  {
    name: { en: "Permanent Methods (Tubal Ligation / Vasectomy)", ha: "Hanyoyin Dindindin (Daure Bututun Uwa / Yankan Bututun Miji)" },
    category: "permanent",
    description: { en: "A minor surgical procedure — tubal ligation for women or vasectomy for men — intended to permanently prevent pregnancy.", ha: "Ƙaramin tiyata — daure bututun uwa ga mata ko yankan bututun miji ga maza — da nufin dindindin hana daukar ciki." },
    duration: { en: "Permanent; not usually reversible.", ha: "Dindindin ne; ba ya yiwuwa a mayar da shi galibi." },
    mechanism: { en: "Blocks or seals the tubes that carry eggs or sperm.", ha: "Yana toshewa ko rufe bututun da ke ɗauke da kwai ko maniyi." },
    effectiveness: { en: "Over 99% effective. Vasectomy takes about 3 months to become fully effective, so use another method until confirmed.", ha: "Sama da kashi 99% na aiki. Yankan bututun miji na daukar kimanin wata 3 kafin ya yi cikakken tasiri, don haka a yi amfani da wata hanyar har sai an tabbatar." },
    advantages: { en: ["One-time procedure, no ongoing action needed", "Highly effective"], ha: ["Aiki daya kawai, babu bukatar ci gaba da wani aiki", "Yana da tasiri sosai"] },
    sideEffects: { en: ["Standard minor surgery risks (infection, bleeding)", "Regret is possible, especially if circumstances change"], ha: ["Hadarin tiyata na yau da kullum (kamuwa da cuta, zubar jini)", "Nadama na iya faruwa, musamman idan yanayi ya canza"] },
    considerations: { en: "Considered permanent — recommended only for those certain they do not want more children. Counseling before the procedure is important.", ha: "Ana ɗaukarsa dindindin — ana ba da shawara kawai ga wanda ya tabbata ba ya son ƙarin yara. Shawarwari kafin tiyata na da muhimmanci." },
    order: 10,
  },
];

async function run() {
  await connectDB();
  await FamilyPlanningMethod.deleteMany({});
  await FamilyPlanningMethod.insertMany(methods);
  console.log(`Seeded ${methods.length} family planning methods.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
