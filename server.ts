import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized server-side.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. The chatbot will fallback to pre-programmed expert responses.");
}

// Structured product database
const products = [
  {
    id: "sidr-usaimi",
    category: "sidr",
    nameAr: "عسل سدر عصيمي ملكي فاخر",
    nameEn: "Royal Sidr Usaimi Honey",
    taglineAr: "عسل السدر الأنقى والأقوى علاجياً من جبال العصيمات",
    taglineEn: "The purest and most therapeutic Sidr honey from Usaimat mountains",
    descriptionAr: "يُعتبر عسل السدر العصيمي من أندر وأنقى أنواع العسل اليمني، حيث يجني النحل رحيق شجر السدر في جبال العصيمات الشاهقة. يتميز بقوامه الكثيف المخملي ونكهته المركزة القوية التي تحمل عبق الأرض. يعد خياراً مثالياً لتقوية المناعة ومقاومة الأمراض.",
    descriptionEn: "Sidr Usaimi Honey is one of the rarest and purest types of Yemeni honey, harvested from the towering mountains of Usaimat. It features a thick, velvety texture and a strong, concentrated flavor. It is the ultimate choice for boosting immunity and overall vitality.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 142,
    sizes: [
      { weight: "250g", price: 160, originalPrice: 195 },
      { weight: "500g", price: 290, originalPrice: 340 },
      { weight: "1kg", price: 540, originalPrice: 620 }
    ],
    benefitsAr: ["مقوي عام ومحفز خارق للمناعة", "مضاد طبيعي قوي للميكروبات والالتهابات", "يسرع التئام الجروح ويحسن صحة الجهاز الهضمي"],
    benefitsEn: ["Superb natural immune booster and energizer", "Strong natural antimicrobial and anti-inflammatory", "Accelerates healing and improves digestive wellness"],
    bestSeller: true,
    honeyType: "Sidr"
  },
  {
    id: "sidr-doani",
    category: "sidr",
    nameAr: "عسل سدر دوعني مميز",
    nameEn: "Premium Sidr Do'ani Honey",
    taglineAr: "عسل سدر أصيل من بطون وادي دوعن الشهير بإنتاجه العريق",
    taglineEn: "Authentic Sidr honey from the depths of the famous Wadi Do'an",
    descriptionAr: "من قلب وادي دوعن الشهير في حضرموت، يأتي هذا العسل بخصائصه العلاجية الفريدة وطعمه اللذيذ المعتدل مقارنة بالعصيمي. يتميز بلون ذهبي غامق ساحر ونكهة حلوة زهرية غنية تدوم طويلاً، وهو مفضل للصغار والكبار على حد سواء كعلاج وغذاء.",
    descriptionEn: "From the heart of the legendary Wadi Do'an in Hadramout, this Sidr honey features exceptional therapeutic properties and a smooth, moderately sweet floral flavor. Loved by children and adults alike, it is the perfect daily health companion.",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 98,
    sizes: [
      { weight: "250g", price: 130, originalPrice: 155 },
      { weight: "500g", price: 240, originalPrice: 280 },
      { weight: "1kg", price: 440, originalPrice: 500 }
    ],
    benefitsAr: ["مهدئ للسعال والتهابات الحلق", "منشط طبيعي للدورة الدموية ومغذي للجسم", "يحسن مستويات الطاقة والنشاط اليومي"],
    benefitsEn: ["Soothes coughs and throat irritations", "Natural blood circulation stimulant and nourishing food", "Enhances energy levels and daily endurance"],
    bestSeller: false,
    honeyType: "Sidr"
  },
  {
    id: "sumar-taiz",
    category: "sumar",
    nameAr: "عسل سمر يمني فاخر (الطلح)",
    nameEn: "Royal Yemeni Sumar Honey",
    taglineAr: "عسل السمر الداكن الغني بالحديد والمعادن، صديق الجهاز الهضمي",
    taglineEn: "Dark, mineral-rich Sumar honey, your digestive system's best friend",
    descriptionAr: "يُستخلص عسل السمر (الطلح) من زهور أشجار الأكاسيا الشوكية المنتشرة في سهول وجبال اليمن. يتميز بلونه الداكن المائل للاحمرار، ونكهته القوية المركبة المدخنة وحلاوته المعتدلة. غني جداً بالحديد والمعادن، مما يجعله علاجاً مذهلاً لفقر الدم ومشاكل المعدة.",
    descriptionEn: "Harvested from the blossoms of thorny Acacia trees in Yemen's plains and mountains, Sumar Honey is highly valued for its dark, reddish color, unique smoky herbal flavor, and moderate sweetness. It is incredibly rich in iron and essential minerals.",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 84,
    sizes: [
      { weight: "250g", price: 95, originalPrice: 110 },
      { weight: "500g", price: 175, originalPrice: 200 },
      { weight: "1kg", price: 320, originalPrice: 370 }
    ],
    benefitsAr: ["علاج فعال لفقر الدم (الأنيميا)", "ممتاز لقرحة المعدة، والقولون العصبي، وعسر الهضم", "بديل صحي رائع وآمن لمرضى السكري (بإشراف طبي)"],
    benefitsEn: ["Effective remedy for anemia due to high iron content", "Excellent for stomach ulcers, IBS, and indigestion", "Healthy, lower-glycemic alternative safe for diabetics"],
    bestSeller: true,
    honeyType: "Sumar"
  },
  {
    id: "marai-yemeni",
    category: "marai",
    nameAr: "عسل مراعي يمني طبيعي",
    nameEn: "Natural Yemeni Mara'i Honey",
    taglineAr: "عسل طبيعي مغذٍ واقتصادي للاستخدام اليومي لجميع أفراد العائلة",
    taglineEn: "Economical, multi-flower natural honey for your family's daily wellness",
    descriptionAr: "ينتج عسل المراعي من رحيق الزهور البرية المتنوعة التي تزدهر في ربوع اليمن طوال العام. يتميز بطعم حلو كلاسيكي محبب، قوام خفيف ذهبي مشرق، وقيمة غذائية ممتازة. الخيار الاقتصادي الأمثل ليكون بديلاً صحياً للسكر الأبيض في المشروبات والحلويات اليومية.",
    descriptionEn: "Yemeni Mara'i (pasture) honey is sourced from various wild blossoms throughout the year. It has a beautiful bright golden color, standard sweet flavor, and high nutritional values. It serves as the perfect healthy sweetener for teas, breakfasts, and baking.",
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    reviewsCount: 115,
    sizes: [
      { weight: "250g", price: 55, originalPrice: 70 },
      { weight: "500g", price: 95, originalPrice: 120 },
      { weight: "1kg", price: 170, originalPrice: 210 }
    ],
    benefitsAr: ["مصدر طاقة سريع ومستدام للأطفال والرياضيين", "بديل رائع ومثالي للسكر الأبيض الصناعي", "يساعد في تحسين النوم ومكافحة الأرق"],
    benefitsEn: ["Fast and sustainable energy source for active children and athletes", "Ideal healthy substitute for refined white sugars", "Supports healthy sleep patterns when taken before bed"],
    bestSeller: false,
    honeyType: "Mara'i"
  },
  {
    id: "dumalwah-immunity",
    category: "blends",
    nameAr: "خلطة قلعة الدملوة الملكية للمناعة",
    nameEn: "Al-Dumalwah Castle Royal Immunity Blend",
    taglineAr: "مزيج القوة المبتكر: عسل سدر يمني، غذاء ملكات، بروبوليس، وجينسنج",
    taglineEn: "The Ultimate Synergy: Yemeni Sidr Honey, Royal Jelly, Propolis & Ginseng",
    descriptionAr: "الخلطة الحصرية لقلعتنا! قمنا بتركيبها بعناية فائقة بخلط عسل السدر العصيمي الفاخر مع أعلى تركيز مسموح به من غذاء ملكات النحل الطازج، صمغ النحل (البروبوليس) المعقم، حبوب لقاح النحل، وجينسنج أحمر كوري أصلي. طاقة لا تنضب وحصن مناعي منيع ضد الفيروسات.",
    descriptionEn: "Our castle's signature wellness masterwork! We meticulously blend premium Sidr honey with fresh Royal Jelly, purified Bee Propolis, multi-floral Bee Pollen, and authentic Korean Red Ginseng. Designed for boundless energy, peak physical focus, and ironclad immune defense.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
    rating: 4.95,
    reviewsCount: 176,
    sizes: [
      { weight: "500g", price: 350, originalPrice: 420 },
      { weight: "1kg", price: 620, originalPrice: 750 }
    ],
    benefitsAr: ["تنشيط خارق للطاقة والقدرة الجسدية والذهنية", "يقوي دفاعات الجسم والمناعة بشكل فوري", "يحسن الخصوبة والنشاط الهرموني العام للرجال والنساء"],
    benefitsEn: ["Superb boost to physical power, stamina, and cognitive focus", "Supports and strengthens the body's protective immune defenses", "Promotes hormonal balance and reproductive health for both genders"],
    bestSeller: true,
    honeyType: "Blends"
  },
  {
    id: "yemeni-propolis",
    category: "bee-products",
    nameAr: "بروبوليس (صمغ النحل) يمني خام",
    nameEn: "Raw Yemeni Bee Propolis",
    taglineAr: "المضاد الحيوي الطبيعي الأقوى المستخلص من خلايا نحل جبلية",
    taglineEn: "Nature's strongest defense antibiotic from clean mountain beehives",
    descriptionAr: "صمغ النحل أو العكبر اليمني الجبلي هو مادة صمغية يعقم بها النحل خليته لحمايتها من البكتيريا والفيروسات. يتميز بخصائص معقمة ومطهرة مذهلة، ويُعد أقوى مضاد حيوي طبيعي على الإطلاق لمحاربة نزلات البرد، الفطريات، وحماية الفم واللثة.",
    descriptionEn: "Yemeni Bee Propolis (Purified Resinous Extract) is the natural substance bees gather to sterilize their hive against germs. It acts as an incredible natural antibiotic and antioxidant, outstanding for sore throats, oral hygiene, and deep defense.",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89134292?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 41,
    sizes: [
      { weight: "50g", price: 80, originalPrice: 100 },
      { weight: "100g", price: 150, originalPrice: 180 }
    ],
    benefitsAr: ["مضاد بكتيري وفيروسي وفطري طبيعي فائق القوة", "مطهر رائع للفم واللثة ومكافحة رائحة الفم والتهاب الحلق", "يساعد في تجديد الخلايا وتسريع شفاء الحروق والجروح"],
    benefitsEn: ["Extremely potent antibacterial, antiviral, and antifungal agent", "Sterilizes oral cavity, combats gum bleeding and sore throat", "Promotes cellular regeneration and supports recovery from burns"],
    bestSeller: false,
    honeyType: "Bee Products"
  }
];

// Fallback AI responder if Gemini is not configured
function getFallbackResponse(message: string, isEnglish: boolean) {
  const msg = message.toLowerCase();
  
  if (isEnglish) {
    if (msg.includes("sidr") || msg.includes("seder")) {
      return "Our **Royal Sidr Usaimi Honey** is the highest quality, harvested from the Usaimat mountains. It's potent, thick, and premium. We also offer **Sidr Do'ani**, which has a milder, floral sweetness. Sidr is excellent for general immunity, respiratory health, and wound healing.";
    }
    if (msg.includes("sumar") || msg.includes("somar") || msg.includes("dark")) {
      return "Our **Yemeni Sumar Honey** (sourced from Acacia tortilis) has a beautiful dark color, a rich caramel/smoky flavor, and is heavily loaded with iron. It is highly recommended for stomach ulcers, IBS, indigestion, and is a safe low-glycemic option for diabetics.";
    }
    if (msg.includes("marai") || msg.includes("pasture") || msg.includes("daily")) {
      return "Our **Natural Yemeni Mara'i Honey** is sourced from diverse wild flowers. It's golden, sweet, and has a lighter density. It's our most economical choice, making it perfect for daily family consumption and replacing white sugar in beverages.";
    }
    if (msg.includes("blend") || msg.includes("immunity") || msg.includes("mixture") || msg.includes("royal jelly")) {
      return "The **Al-Dumalwah Castle Royal Immunity Blend** is our signature bestseller! It combines premium Sidr honey with fresh Royal Jelly, Bee Propolis, Bee Pollen, and Red Korean Ginseng. It's perfect for physical endurance, recovery, and peak immunity.";
    }
    if (msg.includes("points") || msg.includes("loyalty") || msg.includes("reward")) {
      return "Our **Loyalty Points Program** is very simple: You earn 1 point for every 10 SAR/AED you spend. When checkout is complete, points are saved to your profile. You can redeem 10 points for a 5 SAR/AED discount on future orders!";
    }
    if (msg.includes("shipping") || msg.includes("delivery") || msg.includes("ship") || msg.includes("aramex") || msg.includes("dhl")) {
      return "We ship worldwide and across the Gulf region (Saudi Arabia, UAE, Oman, Qatar, Bahrain, Kuwait) using **Aramex** (3-5 business days) and **DHL Express** (2-3 business days). Shipping is completely free for orders above 300 SAR/AED! For lower orders, flat shipping is only 25 SAR/AED.";
    }
    if (msg.includes("payment") || msg.includes("pay") || msg.includes("mada")) {
      return "We accept secure payment via **Mada**, **Visa**, **Mastercard**, **Apple Pay**, **Bank Transfer** (Al-Rajhi Bank / National Bank of Yemen), or **Cash on Delivery** (+15 SAR/AED service fee).";
    }
    return "Welcome to **Al-Dumalwah Castle for Yemeni Honey**! I am your AI Honey Sommelier. I can guide you to choose the perfect honey for your wellness goals, explain the differences between Sidr, Sumar, and Mara'i, or explain how our Loyalty points and shipping work. What would you like to know today?";
  } else {
    // Arabic Fallback
    if (msg.includes("سدر") || msg.includes("السدر") || msg.includes("عصيمي") || msg.includes("دوعني")) {
      return "نوفر في متجرنا نوعين فاخرين من عسل السدر اليمني: **عسل السدر العصيمي الملكي** (من جبال العصيمات وهو الأقوى علاجياً والمفضل لتقوية المناعة ومقاومة الفيروسات)، و**عسل السدر الدوعني** المميز (من وادي دوعن بطعمه السلس المعتدل والمنشط العام للجسم).";
    }
    if (msg.includes("سمر") || msg.includes("السمر") || msg.includes("طلح") || msg.includes("معدة") || msg.includes("قولون")) {
      return "**عسل السمر اليمني** (المستخلص من شجرة الطلح) غني جداً بالحديد والمعادن، ويتميز بلونه الداكن وقوامه الثقيل وطعمه المدخن اللذيذ. يُعد العلاج الطبيعي الأقوى لقرَح المعدة، الحموضة، عسر الهضم، فقر الدم (الأنيميا)، وهو آمن وممتاز لمرضى السكري.";
    }
    if (msg.includes("مراعي") || msg.includes("المراعي") || msg.includes("يومي") || msg.includes("سكر")) {
      return "**عسل المراعي اليمني** عسل متعدد الزهور البرية، يتميز بقوام خفيف ونكهة حلوة كلاسيكية محببة وسعر اقتصادي للغاية. مناسب جداً للاستخدام اليومي لجميع أفراد العائلة ولتحلية المشروبات والحلويات كبديل صحي آمن عن السكر الأبيض.";
    }
    if (msg.includes("خلطة") || msg.includes("خلطه") || msg.includes("مناعة") || msg.includes("غذاء ملكات") || msg.includes("جينسنج") || msg.includes("عكبر")) {
      return "**خلطة قلعة الدملوة الملكية للمناعة** هي فخر إنتاجنا! نمزج فيها عسل سدر عصيمي مع غذاء ملكات النحل الطازج، العكبر البروبوليس، حبوب اللقاح المغذية، والجينسنج الأحمر الكوري. الخيار الأفضل للطاقة الخارقة، زيادة التركيز والنشاط البدني، والتحصين الشامل للمناعة.";
    }
    if (msg.includes("نقاط") || msg.includes("نقاطي") || msg.includes("ولاء") || msg.includes("خصم")) {
      return "برنامج **نقاط الولاء** لدينا صُمم لمكافأة عملائنا: تكسب **نقطة واحدة مقابل كل 10 ريالات/درهم** تنفقها في المتجر. عند إتمام طلبك، تضاف النقاط مباشرة لحسابك. يمكنك استبدال كل **10 نقاط بخصم بقيمة 5 ريالات/درهم** في طلباتك القادمة!";
    }
    if (msg.includes("شحن") || msg.includes("توصيل") || msg.includes("ارامكس") || msg.includes("دي اتش ال") || msg.includes("دفع عند الاستلام")) {
      return "نقوم بالشحن لجميع مدن المملكة العربية السعودية ودول الخليج عبر **أرامكس** (توصيل خلال 3-5 أيام عمل) و**DHL Express** السريع (خلال 2-3 أيام عمل). الشحن **مجاني تماماً للطلبات بقيمة 300 ريال/درهم أو أكثر**! للطلبات الأقل، رسوم الشحن الثابتة هي 25 ريالاً فقط.";
    }
    if (msg.includes("دفع") || msg.includes("فيزا") || msg.includes("مدى") || msg.includes("ابل باي") || msg.includes("تحويل")) {
      return "نوفر خيارات دفع آمنة ومتنوعة: **مدى (Mada)**، **فيزا وماستركارد**، **ابل باي (Apple Pay)**، **الدفع عند الاستلام** ( COD برسوم إضافية 15 ريال فقط)، أو **التحويل البنكي** لشركائنا (مصرف الراجحي في السعودية / البنك الأهلي اليمني).";
    }
    return "أهلاً بك في **قلعة الدملوة للعسل اليمني الفاخر**! أنا مستشارك الذكي للعسل اليمني الأصيل ومساعدك الشخصي. يمكنني إرشادك لاختيار العسل الأنسب لاحتياجاتك الصحية والوقائية، وشرح الفروق بين عسل السدر والسمر والمراعي والخلطات العلاجية، ومساعدتك في حساب الشحن ونقاط الولاء. كيف يمكنني خدمتك اليوم؟";
  }
}

// API for products catalog
app.get("/api/products", (req, res) => {
  res.json(products);
});

// API for Chatbot using server-side Gemini AI
app.post("/api/chat", async (req, res) => {
  const { message, history = [], isEnglish = false } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  // If Gemini AI client is initialized, use it!
  if (ai) {
    try {
      const systemInstruction = `You are "Al-Dumalwah Castle Honey Sommelier" (مستشار عسل قلعة الدملوة), a professional, warm, and highly knowledgeable expert in authentic Yemeni Honey and traditional bee products.
Your tone should be premium, welcoming, and culturally respectful, reflecting the heritage of Yemen and its rich honey-making history.
You speak both Arabic and English fluently. Answer in the language the user speaks to you, or respect their preference.
You can answer questions about the differences between Sidr (سدر), Sumar (سمر), Mara'i (مراعي), and Sal (صال) honey, explain the medical and health benefits of honey mixtures (such as Sidr with royal jelly and ginseng), recommend products from our catalogue based on user symptoms (like cold, cough, low energy, digestive issues, or general immunity), and guide them on how to earn and redeem loyalty points.
Our products catalog:
${JSON.stringify(products, null, 2)}

Our loyalty program:
- Users earn 1 Loyalty Point for every 10 SAR/AED spent.
- 10 points can be redeemed for a 5 SAR/AED discount on future orders.
- Users can check their points on the loyalty portal.
If they ask about ordering or delivery:
- We deliver via Aramex and DHL.
- Shipping is free for orders above 300 SAR/AED, otherwise flat 25 SAR/AED.
- We support Cash on Delivery, Mada, Visa, Apple Pay, and Bank Transfer.
Keep your answers relatively concise, beautifully formatted in markdown, helpful, and highly professional.`;

      // Build chat contents from history and current message
      // The history format expected by the client might be different from GoogleGenAI SDK's format.
      // Let's use simple prompt with context or standard generateContent if history is simple
      let promptWithContext = `User is interacting with Al-Dumalwah Castle Honey Store chatbot.
Language Preferred: ${isEnglish ? "English" : "Arabic"}

Chat History:
${history.map((h: any) => `${h.role === "user" ? "User" : "Sommelier"}: ${h.text || h.content}`).join("\n")}

User Message: ${message}

Provide your helpful, premium response directly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptWithContext,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || getFallbackResponse(message, isEnglish);
      return res.json({ response: responseText });
    } catch (error) {
      console.error("Gemini API error, falling back to pre-programmed responses:", error);
      const fallbackText = getFallbackResponse(message, isEnglish);
      return res.json({ response: fallbackText, note: "Fallback response triggered due to API error." });
    }
  } else {
    // If Gemini is not set up, provide a highly intelligent local expert matcher
    const fallbackText = getFallbackResponse(message, isEnglish);
    return res.json({ response: fallbackText });
  }
});

// Setup Vite Dev server / static build server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer();
}

export default app;
