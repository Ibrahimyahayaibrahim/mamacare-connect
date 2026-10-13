// Run once with: node utils/seedFruitGuides.js
// NOTE: Hausa text is AI-drafted and should be reviewed by a native speaker.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const FruitGuide = require("../models/FruitGuide");

const fruits = [
  {
    name: { en: "Banana", ha: "Ayaba" },
    benefits: { en: "A good source of energy and potassium, and gentle on a young baby's digestion.", ha: "Tushen kuzari da potassium mai kyau, kuma mai laushi ga narkewar jaririn da yake karami." },
    preparation: { en: "6–8 months: mash well with a fork until smooth. From about 9 months: cut into small, soft pieces or thin strips for self-feeding.", ha: "Wata 6–8: a daka da cokali sosai har ya laushe. Daga kimanin wata 9: a yanka guntu-guntu masu laushi ko dogayen sirara don yaro ya ci da kansa." },
    chokingSafety: { en: "Never give large chunks or whole rounds to a young baby — always mash or cut into small, manageable pieces.", ha: "Kada a bai wa jariri babban guntu ko dukan zagaye — koyaushe a daka ko a yanka guntu-guntu kanana masu sauƙin cinyewa." },
    order: 1,
  },
  {
    name: { en: "Pawpaw (Papaya)", ha: "Gwanda" },
    benefits: { en: "Rich in vitamin A and vitamin C, and generally easy to digest.", ha: "Tana da yawan bitamin A da bitamin C, kuma gabaɗaya sauƙi ake narkewa." },
    preparation: { en: "Remove all seeds and skin. 6–8 months: mash ripe pawpaw until smooth. From about 9 months: cut into small soft cubes.", ha: "A cire dukkan iri da fata. Wata 6–8: a daka gwanda mai nunannen sosai har ta laushe. Daga kimanin wata 9: a yanka gunduwa-gunduwa kanana masu laushi." },
    chokingSafety: { en: "Always remove seeds completely before serving; ensure the fruit is ripe and soft.", ha: "Koyaushe a cire iri gaba ɗaya kafin bayarwa; a tabbata 'ya'yan itacen ya nuna sosai kuma yana da laushi." },
    order: 2,
  },
  {
    name: { en: "Avocado", ha: "Avokado" },
    benefits: { en: "A great source of healthy fats, which support brain development and add energy in a small volume of food.", ha: "Babban tushen mai mai kyau, wanda ke tallafawa ci gaban kwakwalwa kuma yana ƙara kuzari daga ɗan ƙaramin abinci." },
    preparation: { en: "6–8 months: mash ripe avocado flesh until smooth. From about 9 months: cut into small soft slices or cubes.", ha: "Wata 6–8: a daka naman avokado mai nunannen sosai har ya laushe. Daga kimanin wata 9: a yanka gunduwa-gunduwa ko sirara masu laushi." },
    chokingSafety: { en: "Remove the seed and skin completely; use only ripe, soft avocado.", ha: "A cire kwaya da fata gaba ɗaya; a yi amfani da avokado mai nunannen kuma mai laushi kawai." },
    order: 3,
  },
  {
    name: { en: "Orange", ha: "Lemun Zaki" },
    benefits: { en: "A good source of vitamin C, which helps the body absorb iron from other foods eaten at the same meal.", ha: "Tushen bitamin C mai kyau, wanda ke taimaka wa jiki sha karfe daga sauran abincin da aka ci a lokaci guda." },
    preparation: { en: "Remove all seeds and pith. Offer as soft segments with membrane removed, or well-strained juice diluted with water, in small amounts.", ha: "A cire dukkan iri da fatar ciki. A bayar da gunduwoyi masu laushi bayan an cire fim, ko ruwan lemu da aka tace sosai aka narka da ruwa, kadan-kadan." },
    chokingSafety: { en: "Remove seeds and tough membrane completely; citrus can be acidic, so watch for any reaction and introduce in small amounts.", ha: "A cire iri da fim mai wuya gaba ɗaya; 'ya'yan lemu na iya zama mai tsami, don haka a lura da duk wata illa kuma a fara da kadan." },
    order: 4,
  },
  {
    name: { en: "Mango", ha: "Mangwaro" },
    benefits: { en: "Rich in vitamin A and vitamin C, and naturally sweet, so no added sugar is needed.", ha: "Tana da yawan bitamin A da bitamin C, kuma tana da zaki na dabi'a, don haka babu bukatar ƙarin sukari." },
    preparation: { en: "Remove skin and seed completely. 6–8 months: mash ripe mango until smooth. From about 9 months: cut into small soft pieces.", ha: "A cire fata da kwaya gaba ɗaya. Wata 6–8: a daka mangwaro mai nunannen sosai har ya laushe. Daga kimanin wata 9: a yanka guntu-guntu kanana masu laushi." },
    chokingSafety: { en: "Ensure the seed and any tough, fibrous parts near it are fully removed before serving.", ha: "A tabbata an cire kwaya da duk wani sashi mai wuya ko zaren kusa da ita gaba ɗaya kafin bayarwa." },
    order: 5,
  },
  {
    name: { en: "Watermelon", ha: "Kankana" },
    benefits: { en: "Mostly water, so it helps with hydration, along with some vitamin A and C.", ha: "Galibi ruwa ne, don haka yana taimakawa da ruwan jiki, tare da ɗan bitamin A da C." },
    preparation: { en: "Remove all seeds and rind. 6–8 months: mash or offer as strained pulp. From about 9 months: cut into small soft pieces, not large wedges or round chunks.", ha: "A cire dukkan iri da baraga. Wata 6–8: a daka ko a bayar da naman da aka tace. Daga kimanin wata 9: a yanka guntu-guntu kanana masu laushi, ba manyan yanka ko zagaye ba." },
    chokingSafety: { en: "Remove all seeds; never give round or large wedge-shaped pieces, which can block a young child's airway.", ha: "A cire dukkan iri; kada a taɓa bayarwa da guntu zagaye ko manyan yanka, wanda zai iya toshe numfashin karamin yaro." },
    order: 6,
  },
];

async function run() {
  await connectDB();
  await FruitGuide.deleteMany({});
  await FruitGuide.insertMany(fruits);
  console.log(`Seeded ${fruits.length} fruit guides.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
