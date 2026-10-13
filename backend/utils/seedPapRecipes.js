// Run once with: node utils/seedPapRecipes.js
// Recipes reflect common, real Nigerian complementary-feeding practice —
// a maize/millet/guinea corn pap base enriched with soybean, groundnut,
// or crayfish/fish, per published Nigerian nutrition research and public
// health guidance (see README for sources). None of these are claimed to
// cause weight gain on their own; healthy growth depends on total diet,
// illness prevention, and feeding frequency. NOTE: Hausa text is
// AI-drafted and should be reviewed by a native speaker.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const PapRecipe = require("../models/PapRecipe");

const recipes = [
  {
    name: { en: "Classic Brown Pap (Maize, Millet & Guinea Corn)", ha: "Kunun Baki na Gargajiya (Masara, Gero & Dawa)" },
    ingredients: {
      en: ["Fermented maize, millet and guinea corn blend (\"brown pap\" powder)", "Clean water", "Full cream milk or breastmilk (optional, to enrich)"],
      ha: ["Garin kunu na masara, gero da dawa (\"kunun baki\")", "Ruwa mai tsafta", "Madara mai kitse ko nonon uwa (na zaɓi, don ƙarfafa)"],
    },
    steps: {
      en: [
        "Mix a small amount of pap powder with a little cold clean water to form a smooth paste.",
        "Boil clean water separately, then pour it into the paste while stirring continuously to avoid lumps.",
        "Cook on low heat for 2–3 minutes, stirring, until smooth and cooked through.",
        "Cool to a safe warm temperature and stir in milk or breastmilk if using.",
      ],
      ha: [
        "Haɗa ɗan garin kunu da ɗan ruwan sanyi mai tsafta don samun laushi.",
        "Dafa ruwa mai tsafta daban, sannan a zuba a cikin cakuda yayin da ake juyawa don gudun kumbura.",
        "Dafa a kan ƙaramin wuta na mintuna 2–3, ana juyawa, har sai ya laushe kuma ya dahu sosai.",
        "Bari ya sanyaya zuwa zafi mai aminci sannan a zuba madara ko nonon uwa idan ana amfani da shi.",
      ],
    },
    ageSuitability: { en: "From 6 months, start thin and gradually thicken as baby adapts.", ha: "Daga wata 6, fara da laushi sannan a kauta a hankali yayin da jariri ke daidaitawa." },
    nutritionBenefit: {
      en: "Combining maize, millet and guinea corn gives more protein, vitamins and minerals than maize alone — a better everyday base than single-grain pap.",
      ha: "Haɗa masara, gero da dawa na bayar da ƙarin furotin, bitamin da ma'adanai fiye da masara kaɗai — tushe mafi kyau na yau da kullum fiye da kunu na hatsi guda.",
    },
    storageAdvice: {
      en: "Prepare fresh for each feed where possible. If storing dry pap powder, keep in a clean, airtight, dry container. Do not keep cooked pap at room temperature for more than 2 hours.",
      ha: "Idan ya yiwu, ka shirya sabo don kowace ciyarwa. Idan ana ajiye busasshen gari, ka ajiye a wurin da ke da tsafta, rufaffe, kuma bushe. Kada a bar kunun da aka dafa a zafin daki fiye da awa 2.",
    },
    order: 1,
  },
  {
    name: { en: "Soy-Enriched Pap", ha: "Kunu Mai Ƙarin Waken Soya" },
    ingredients: {
      en: ["Maize or brown pap powder", "Roasted, finely ground soybean powder", "Clean water"],
      ha: ["Garin kunu na masara ko kunun baki", "Gasasshen waken soya da aka niƙa sosai", "Ruwa mai tsafta"],
    },
    steps: {
      en: [
        "Mix pap powder with a little cold water into a smooth paste.",
        "Stir in a small spoon of finely ground roasted soybean powder.",
        "Add boiling water while stirring continuously, then cook on low heat for 2–3 minutes until smooth.",
        "Cool to a safe warm temperature before feeding.",
      ],
      ha: ["Haɗa garin kunu da ɗan ruwan sanyi don samun laushi.", "Zuba ƙaramin cokali na waken soya da aka gasa aka niƙa sosai.", "Zuba ruwan zafi yayin juyawa, sannan a dafa a ƙaramin wuta na mintuna 2–3 har ya laushe.", "Bari ya sanyaya zuwa zafi mai aminci kafin ciyarwa."],
    },
    ageSuitability: { en: "From 7 months, after plain pap is well tolerated. Introduce soy alone first, in a small amount, and watch for any allergic reaction before increasing.", ha: "Daga wata 7, bayan kunu na kadai ya dace da jariri. Fara da soya kadai, kadan-kadan, kuma a lura da duk wata illa kafin a ƙara." },
    nutritionBenefit: { en: "Soybean is a good, affordable plant protein source and adds energy density to a cereal-only pap.", ha: "Waken soya kyakkyawan tushen furotin mai araha kuma yana ƙara ƙarfin kuzari ga kunun da hatsi kadai." },
    storageAdvice: { en: "Store roasted soybean powder in an airtight container away from moisture. Prepare cooked pap fresh each time.", ha: "Ajiye garin waken soya da aka gasa a rufaffiyar akwati, nesa da danshi. Ka shirya kunun da aka dafa sabo a kowane lokaci." },
    order: 2,
  },
  {
    name: { en: "Groundnut-Enriched Pap", ha: "Kunu Mai Ƙarin Gyaɗa" },
    ingredients: {
      en: ["Maize or brown pap powder", "Roasted groundnuts, finely ground into powder (no whole nuts)", "Clean water"],
      ha: ["Garin kunu na masara ko kunun baki", "Gyaɗar da aka gasa aka niƙa sosai zuwa gari (ba gyaɗa gaba ɗaya ba)", "Ruwa mai tsafta"],
    },
    steps: {
      en: [
        "Mix pap powder with cold water into a smooth paste.",
        "Stir in a small amount of finely ground roasted groundnut powder — never whole or chopped nuts, which are a choking hazard.",
        "Add boiling water while stirring, cook on low heat 2–3 minutes until smooth.",
        "Cool to a safe warm temperature before feeding.",
      ],
      ha: ["Haɗa garin kunu da ruwan sanyi don samun laushi.", "Zuba ɗan garin gyaɗar da aka gasa aka niƙa sosai — ba gyaɗa gaba ɗaya ko yanyanke ba, saboda hatsarin shaƙewa.", "Zuba ruwan zafi yayin juyawa, dafa a ƙaramin wuta na mintuna 2–3 har ya laushe.", "Bari ya sanyaya zuwa zafi mai aminci kafin ciyarwa."],
    },
    ageSuitability: { en: "From 7 months. Groundnut is a common allergen — introduce a small amount first and watch closely for reaction (rash, swelling, vomiting) before continuing.", ha: "Daga wata 7. Gyaɗa na daga cikin abincin da ke iya haddasa rashin lafiyar jiki — fara da kadan sannan a lura da kyau da duk wata illa (kurji, kumburi, amai) kafin ci gaba." },
    nutritionBenefit: { en: "Groundnut adds energy, healthy fats and some protein, helping meet a growing baby's energy needs from a small volume of food.", ha: "Gyaɗa na ƙara kuzari, mai mai kyau da ɗan furotin, wanda ke taimakawa biyan bukatar kuzarin jariri mai girma daga ɗan ƙaramin abinci." },
    storageAdvice: { en: "Keep ground groundnut powder in a dry, airtight container; discard if it smells musty or off, as spoiled groundnuts can be harmful.", ha: "Ajiye garin gyaɗa a rufaffiyar akwati mai bushewa; a zubar idan yana da wari mara kyau, domin gyaɗa da ta ɓaci na iya cutarwa." },
    order: 3,
  },
  {
    name: { en: "Crayfish & Vegetable Pap", ha: "Kunu Mai Ƙarin Kifin Kifi da Ganye" },
    ingredients: {
      en: ["Maize or brown pap powder", "Finely ground crayfish powder (small amount)", "Finely chopped or pureed pumpkin leaf (ugu) or carrot", "Clean water"],
      ha: ["Garin kunu na masara ko kunun baki", "Garin kifin kifi da aka niƙa sosai (kadan)", "Ganyen kabewa (ugu) ko karas da aka yanyanke sosai ko niƙa", "Ruwa mai tsafta"],
    },
    steps: {
      en: [
        "Mix pap powder with cold water into a smooth paste.",
        "Finely chop or puree the vegetable so there are no large pieces.",
        "Add boiling water to the pap while stirring, then add the crayfish powder and vegetable.",
        "Cook on low heat for 3–4 minutes, stirring, until everything is soft and well combined.",
        "Cool to a safe warm temperature before feeding.",
      ],
      ha: ["Haɗa garin kunu da ruwan sanyi don samun laushi.", "Yanyanke ganyen ko a niƙa sosai don kada a bar manyan yanka.", "Zuba ruwan zafi cikin kunu yayin juyawa, sannan a zuba garin kifin kifi da ganyen.", "Dafa a ƙaramin wuta na mintuna 3–4, ana juyawa, har komai ya laushe kuma ya haɗu sosai.", "Bari ya sanyaya zuwa zafi mai aminci kafin ciyarwa."],
    },
    ageSuitability: { en: "From 8 months, once your baby is used to plain pap and single new foods. Ensure crayfish and vegetables are ground fine enough for baby's stage.", ha: "Daga wata 8, da zarar jaririnki ya saba da kunu kadai da sabbin abinci daya-daya. Ka tabbata an niƙa kifin kifi da ganye sosai daidai da matakin jariri." },
    nutritionBenefit: { en: "Crayfish adds animal-source protein, calcium and iron; leafy greens or carrot add vitamin A and other micronutrients often missing from cereal-only pap.", ha: "Kifin kifi na ƙara furotin daga dabba, calcium da karfe; ganyayen kore ko karas na ƙara bitamin A da sauran ma'adanai da yawanci basa cikin kunun hatsi kadai." },
    storageAdvice: { en: "Use fresh vegetables and prepare this pap fresh — do not store cooked crayfish-vegetable pap for later feeds.", ha: "Yi amfani da sabbin ganye kuma ka shirya wannan kunu sabo — kada a ajiye kunu da aka dafa da kifin kifi da ganye don ciyarwa daga baya." },
    order: 4,
  },
  {
    name: { en: "Tigernut & Date Pap", ha: "Kunu Mai Ƙarin Aya da Dabino" },
    ingredients: {
      en: ["Maize or brown pap powder", "Tigernut milk (blended tigernuts, strained) or finely ground tigernut powder", "1–2 soft, deseeded dates, mashed (no added sugar)", "Clean water"],
      ha: ["Garin kunu na masara ko kunun baki", "Madarar aya (aya da aka daka aka tace) ko garin aya da aka niƙa sosai", "Dabino 1–2 mai laushi, an cire kwaya, an daka (babu ƙarin sukari)", "Ruwa mai tsafta"],
    },
    steps: {
      en: [
        "Mix pap powder with cold water into a smooth paste.",
        "Mash the deseeded dates until smooth, with no lumps or pieces.",
        "Add boiling water to the pap while stirring, then stir in tigernut milk and mashed dates.",
        "Cook on low heat for 2–3 minutes until smooth.",
        "Cool to a safe warm temperature before feeding.",
      ],
      ha: ["Haɗa garin kunu da ruwan sanyi don samun laushi.", "Daka dabinon da aka cire kwaya har ya laushe, babu kumbura ko guntu.", "Zuba ruwan zafi cikin kunu yayin juyawa, sannan a zuba madarar aya da dabinon da aka daka.", "Dafa a ƙaramin wuta na mintuna 2–3 har ya laushe.", "Bari ya sanyaya zuwa zafi mai aminci kafin ciyarwa."],
    },
    ageSuitability: { en: "From 7 months. Mash dates thoroughly — whole or poorly mashed dates and pits are a choking hazard.", ha: "Daga wata 7. Ka daka dabino sosai — dabino gaba ɗaya ko wanda ba a daka sosai ba tare da kwaya na haifar da hatsarin shaƙewa." },
    nutritionBenefit: { en: "Tigernut adds energy and healthy fats; dates add natural sweetness and some iron, without needing added sugar.", ha: "Aya na ƙara kuzari da mai mai kyau; dabino na ƙara zaki na dabi'a da ɗan karfe, ba tare da bukatar ƙarin sukari ba." },
    storageAdvice: { en: "Tigernut milk spoils quickly — prepare in small amounts and refrigerate unused portions, discarding after 24 hours.", ha: "Madarar aya na ɓacewa da sauri — ka shirya kadan-kadan kuma ka ajiye sauran a firji, ka zubar bayan awa 24." },
    order: 5,
  },
];

async function run() {
  await connectDB();
  await PapRecipe.deleteMany({});
  await PapRecipe.insertMany(recipes);
  console.log(`Seeded ${recipes.length} pap recipes.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
