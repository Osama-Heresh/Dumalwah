import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, CartItem, LoyaltyProfile, Language, ShippingMethod, PaymentMethod, Order, FeedbackTicket, Review } from "./types";
import { translations } from "./translations";
import Logo from "./components/Logo";
import Chatbot from "./components/Chatbot";
import { FeedbackForm } from "./components/FeedbackForm";
import { AdminFeedback } from "./components/AdminFeedback";

// @ts-ignore
import usaimiImg from "./assets/images/usaimi_honey_squeeze_1783374285647.jpg";
// @ts-ignore
import doanImg from "./assets/images/doan_honey_bottles_1783374300002.jpg";
// @ts-ignore
import sumarImg from "./assets/images/sumar_honey_jar_1783374310259.jpg";
// @ts-ignore
import maraiImg from "./assets/images/marai_honey_jar_1783374322711.jpg";
// @ts-ignore
import immunityImg from "./assets/images/immunity_gift_box_1783374333437.jpg";
// @ts-ignore
import propolisImg from "./assets/images/propolis_sample_box_1783374344559.jpg";
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Star, 
  Trash2, 
  CheckCircle, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  HelpCircle, 
  MessageSquare, 
  PhoneCall, 
  Globe, 
  CreditCard, 
  Gift, 
  Copy, 
  Check, 
  MapPin, 
  ArrowLeft,
  Coins,
  Sparkles,
  User,
  Lock,
  Mail,
  LogOut,
  FileText,
  Plus,
  Edit3,
  Save,
  AlertTriangle,
  Crown,
  Flower2,
  FlaskConical,
  ThumbsUp,
  Upload
} from "lucide-react";

const PRODUCT_IMAGES: Record<string, string> = {
  "sidr-usaimi": usaimiImg,
  "sidr-doani": doanImg,
  "sumar-taiz": sumarImg,
  "marai-yemeni": maraiImg,
  "dumalwah-immunity": immunityImg,
  "yemeni-propolis": propolisImg,
};

// Compress and resize uploaded image base64 strings to prevent QuotaExceededError in localStorage
const compressImage = (base64Str: string, maxWidth = 500, maxHeight = 375): Promise<string> => {
  return new Promise((resolve) => {
    // If it's already a regular URL (not base64), return it as is
    if (!base64Str.startsWith("data:image")) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

// Fallback product data if API is loading or fails
const LOCAL_PRODUCTS: Product[] = [
  {
    id: "sidr-usaimi",
    category: "sidr",
    nameAr: "عسل سدر عصيمي ملكي فاخر",
    nameEn: "Royal Sidr Usaimi Honey",
    taglineAr: "عسل السدر الأنقى والأقوى علاجياً من جبال العصيمات",
    taglineEn: "The purest and most therapeutic Sidr honey from Usaimat mountains",
    descriptionAr: "يُعتبر عسل السدر العصيمي من أندر وأنقى أنواع العسل اليمني، حيث يجني النحل رحيق شجر السدر في جبال العصيمات الشاهقة. يتميز بقوامه الكثيف المخملي ونكهته المركزة القوية التي تحمل عبق الأرض. يعد خياراً مثالياً لتقوية المناعة ومقاومة الأمراض.",
    descriptionEn: "Sidr Usaimi Honey is one of the rarest and purest types of Yemeni honey, harvested from the towering mountains of Usaimat. It features a thick, velvety texture and a strong, concentrated flavor. It is the ultimate choice for boosting immunity and overall vitality.",
    image: usaimiImg,
    rating: 4.9,
    reviewsCount: 142,
    sizes: [
      { weight: "250g", price: 30, originalPrice: 37 },
      { weight: "500g", price: 55, originalPrice: 65 },
      { weight: "1kg", price: 100, originalPrice: 120 }
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
    image: doanImg,
    rating: 4.8,
    reviewsCount: 98,
    sizes: [
      { weight: "250g", price: 25, originalPrice: 30 },
      { weight: "500g", price: 45, originalPrice: 53 },
      { weight: "1kg", price: 85, originalPrice: 95 }
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
    image: sumarImg,
    rating: 4.7,
    reviewsCount: 84,
    sizes: [
      { weight: "250g", price: 18, originalPrice: 21 },
      { weight: "500g", price: 33, originalPrice: 38 },
      { weight: "1kg", price: 60, originalPrice: 70 }
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
    image: maraiImg,
    rating: 4.6,
    reviewsCount: 115,
    sizes: [
      { weight: "250g", price: 10, originalPrice: 13 },
      { weight: "500g", price: 18, originalPrice: 23 },
      { weight: "1kg", price: 32, originalPrice: 40 }
    ],
    benefitsAr: ["مصدر طاقة سريع ومستدام للأطفال والرياضيين", "بديل رائع ومثالي للسكر الأبيض الصناعي", "يساعد في تحسين النوم ومكافحة الأرق"],
    benefitsEn: ["Fast and sustainable energy source for active children and athletes", "Ideal healthy substitute for refined white sugars", "Supports healthy sleep patterns when taken before bed"],
    bestSeller: false,
    honeyType: "Mara'i"
  },
  {
    id: "dumalwah-immunity",
    category: "blends",
    nameAr: "خلطة قلعة الدملؤة الملكية للمناعة",
    nameEn: "Al-Dumalwah Castle Royal Immunity Blend",
    taglineAr: "مزيج القوة المبتكر: عسل سدر يمني، غذاء ملكات، بروبوليس، وجينسنج",
    taglineEn: "The Ultimate Synergy: Yemeni Sidr Honey, Royal Jelly, Propolis & Ginseng",
    descriptionAr: "الخلطة الحصرية لقلعتنا! قمنا بتركيبها بعناية فائقة بخلط عسل السدر العصيمي الفاخر مع أعلى تركيز مسموح به من غذاء ملكات النحل الطازج، صمغ النحل (البروبوليس) المعقم، حبوب لقاح النحل، وجينسنج أحمر كوري أصلي. طاقة لا تنضب وحصن مناعي منيع ضد الفيروسات.",
    descriptionEn: "Our castle's signature wellness masterwork! We meticulously blend premium Sidr honey with fresh Royal Jelly, purified Bee Propolis, multi-floral Bee Pollen, and authentic Korean Red Ginseng. Designed for boundless energy, peak physical focus, and ironclad immune defense.",
    image: immunityImg,
    rating: 4.95,
    reviewsCount: 176,
    sizes: [
      { weight: "500g", price: 65, originalPrice: 80 },
      { weight: "1kg", price: 115, originalPrice: 140 }
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
    image: propolisImg,
    rating: 4.8,
    reviewsCount: 41,
    sizes: [
      { weight: "50g", price: 15, originalPrice: 19 },
      { weight: "100g", price: 28, originalPrice: 34 }
    ],
    benefitsAr: ["مضاد بكتيري وفيروسي وفطري طبيعي فائق القوة", "مطهر رائع للفم واللثة ومكافحة رائحة الفم والتهاب الحلق", "يساعد في تجديد الخلايا وتسريع شفاء الحروق والجروح"],
    benefitsEn: ["Extremely potent antibacterial, antiviral, and antifungal agent", "Sterilizes oral cavity, combats gum bleeding and sore throat", "Promotes cellular regeneration and supports recovery from burns"],
    bestSeller: false,
    honeyType: "Bee Products"
  }
];

export default function App() {
  // --- States ---
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("qd_language");
    return (saved as Language) || "ar";
  });

  // Load products from localStorage or fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("qd_products_db_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        return parsed.map(p => ({
          ...p,
          image: p.image || PRODUCT_IMAGES[p.id]
        }));
      } catch (e) {
        return LOCAL_PRODUCTS;
      }
    }
    return LOCAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("qd_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<string>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({}); // Maps product.id to index of selected size

  // --- Unified User Profiles & Loyalty System Database ---
  const [usersDB, setUsersDB] = useState<Record<string, LoyaltyProfile>>(() => {
    const saved = localStorage.getItem("qd_users_db_v3");
    if (saved) return JSON.parse(saved);

    // Initial pre-seeded user matching earlier profile
    const seed = {
      "abdullah@qrizq.com": {
        username: "عبدالله اليافعي",
        phone: "0791234567",
        email: "abdullah@qrizq.com",
        password: "user123",
        points: 240,
        registrationDate: "2026-05-10",
        history: [
          { id: "1", date: "2026-05-10", actionAr: "رصيد ترحيبي عند التسجيل", actionEn: "Welcome registration bonus points", points: 50 },
          { id: "2", date: "2026-05-24", actionAr: "شراء عسل سدر عصيمي ملكي", actionEn: "Purchased Royal Sidr Usaimi Honey", points: 190 },
          { id: "3", date: "2026-06-02", actionAr: "استبدال نقاط لخصم بقيمة ٢٤ دينار", actionEn: "Redeemed points for 24 JOD discount", points: -240 }
        ]
      }
    };
    localStorage.setItem("qd_users_db_v3", JSON.stringify(seed));
    return seed;
  });

  // User Profile Loyalty login / logout state (treat as currentUser)
  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile | null>(() => {
    const saved = localStorage.getItem("qd_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Input states for customer login/registration
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("admin") === "true") {
      setShowAdmin(true);
    }
  }, []);
  const [authError, setAuthError] = useState<string | null>(null);

  const [loyaltyPhone, setLoyaltyPhone] = useState("");
  const [loyaltyMessage, setLoyaltyMessage] = useState<{ type: "success" | "error" | "register"; text: string } | null>(null);
  const [redeemPointsAmount, setRedeemPointsAmount] = useState<number>(10);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // --- Orders Database & Delivery Tracking ---
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("qd_orders_db_v3");
    if (saved) return JSON.parse(saved);

    // Initial pre-seeded orders matching the customer profile
    const seed: Order[] = [
      {
        id: "QD-84291",
        items: [
          {
            product: LOCAL_PRODUCTS[0], // Sidr Usaimi
            selectedSize: LOCAL_PRODUCTS[0].sizes[1], // 500g, 290 JOD
            quantity: 1
          }
        ],
        subtotal: 290,
        shippingCost: 0,
        discount: 10,
        total: 280,
        pointsEarned: 29,
        pointsRedeemed: 10,
        shippingDetails: {
          fullName: "عبدالله اليافعي",
          email: "abdullah@qrizq.com",
          phone: "0791234567",
          country: "Jordan",
          city: "عمان",
          address: "دوار المدينة الرياضية، عمارة ٤٤",
          postalCode: "11190"
        },
        shippingMethod: "aramex",
        paymentMethod: "mada",
        date: "2026-06-25",
        status: "processing"
      },
      {
        id: "QD-19402",
        items: [
          {
            product: LOCAL_PRODUCTS[2], // Sumar
            selectedSize: LOCAL_PRODUCTS[2].sizes[2], // 1kg, 320 JOD
            quantity: 2
          }
        ],
        subtotal: 640,
        shippingCost: 0,
        discount: 0,
        total: 640,
        pointsEarned: 64,
        pointsRedeemed: 0,
        shippingDetails: {
          fullName: "سارة العلي",
          email: "sara@outlook.com",
          phone: "0509876543",
          country: "Saudi Arabia",
          city: "الرياض",
          address: "حي الملقا، طريق أنس بن مالك",
          postalCode: "13521"
        },
        shippingMethod: "dhl",
        paymentMethod: "visa",
        date: "2026-07-01",
        status: "pending"
      }
    ];
    localStorage.setItem("qd_orders_db_v3", JSON.stringify(seed));
    return seed;
  });

  // --- Complaints & Suggestions (Interactions) Database ---
  const [feedbackTickets, setFeedbackTickets] = useState<FeedbackTicket[]>(() => {
    const saved = localStorage.getItem("qd_feedback_db_v3");
    if (saved) return JSON.parse(saved);

    const seed: FeedbackTicket[] = [
      {
        id: "FB-101",
        type: "complaint",
        senderName: "فيصل الحربي",
        senderEmail: "faisal@gmail.com",
        senderPhone: "0554321098",
        text: "تأخر وصول عسل السدر العصيمي ليومين في الرياض، أرجو التحقق مع أرامكس.",
        date: "2026-06-29",
        status: "pending"
      },
      {
        id: "FB-102",
        type: "suggestion",
        senderName: "ريم القحطاني",
        senderEmail: "reem@qrizq.com",
        senderPhone: "0561112223",
        text: "أقترح إضافة حجم أصغر من خلطة المناعة الملكية (مثلاً ١٠٠ غرام) لتجربتها قبل شراء النصف كيلو.",
        date: "2026-07-02",
        status: "replied",
        replyText: "شكراً لاقتراحكِ الرائع يا أخت ريم! سنقوم بدراسة توفير أحجام تجريبية من خلطة المناعة الملكية قريباً جداً في قائمة المنتجات.",
        replyDate: "2026-07-02"
      }
    ];
    localStorage.setItem("qd_feedback_db_v3", JSON.stringify(seed));
    return seed;
  });

  // --- Reviews Database ---
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("qd_reviews_db_v1");
    if (saved) return JSON.parse(saved);

    const seed: Review[] = [
      {
        id: "rev-1",
        name: "أبو فهد الحارثي",
        rating: 5,
        text: "ما شاء الله، عسل السدر العصيمي روعة روعة روعة! القوام ثقيل ومخملي والنكهة غنية جداً ولها طابع علاجي فريد. ساعدني كثيراً في التخلص من الكحة الشتوية وأعطاني طاقة ممتازة. التغليف قمة في الفخامة ويصلح كهدية راقية. بارك الله في جهودكم.",
        productId: "sidr-usaimi",
        productNameAr: "عسل سدر عصيمي فاخر",
        productNameEn: "Premium Sidr Usaimi Honey",
        date: "2026-06-28",
        isVerified: true,
        likes: 24
      },
      {
        id: "rev-2",
        name: "Sarah K. Al-Saeed",
        rating: 5,
        text: "The Royal Immunity Blend (خلطة المناعة والنشاط) is a game-changer! I purchased it for my husband and kids, and we have noticed a massive difference in our energy levels and focus. The taste is incredibly rich and pleasant. Plus, earning loyalty points saved me JOD 5 on my second purchase! Outstanding service and fast delivery.",
        productId: "dumalwah-immunity",
        productNameAr: "خلطة المناعة والنشاط الملكية",
        productNameEn: "Royal Immunity & Vitality Blend",
        date: "2026-07-03",
        isVerified: true,
        likes: 18
      },
      {
        id: "rev-3",
        name: "د. طارق الجبور",
        rating: 5,
        text: "بصفتي طبيب ومهتم بالعلاجات الطبيعية، قمت بتحليل عينة عسل السمر (الطلح) هذا والنتائج ممتازة ونسبة السكروز منخفضة جداً مما يدل على نقائه المطلق. فعال للغاية لمشاكل القولون والارتداد المريئي، والحديد العالي فيه يجعله خياراً ممتازاً لعلاج فقر الدم. أنصح به بشدة كبديل آمن وطبيعي.",
        productId: "sumar-taiz",
        productNameAr: "عسل سمر (الطلح) البلدي",
        productNameEn: "Yemeni Sumar Honey",
        date: "2026-06-20",
        isVerified: true,
        likes: 31
      },
      {
        id: "rev-4",
        name: "ام معاذ الدويري",
        rating: 4,
        text: "عسل المراعي اليمني خيار ممتاز واقتصادي جداً للاستخدام اليومي في التحلية وصناعة الحلويات للأطفال. طعمه رائع وقوامه مثالي وخفيف. الطلب سهل والتوصيل سريع جداً في عمان. سأكرر التجربة بالتأكيد.",
        productId: "marai-yemeni",
        productNameAr: "عسل مراعي يمني طبيعي",
        productNameEn: "Yemeni Mara'i Pasture Honey",
        date: "2026-06-15",
        isVerified: true,
        likes: 12
      }
    ];
    localStorage.setItem("qd_reviews_db_v1", JSON.stringify(seed));
    return seed;
  });

  // Visitor feedback submission form states
  const [feedbackType, setFeedbackType] = useState<"complaint" | "suggestion">("complaint");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackPhone, setFeedbackPhone] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // User review submission form states
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewProductId, setReviewProductId] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  // --- Site Admin Page states ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("qd_admin_logged_in") === "true";
  });
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<"products" | "users" | "orders" | "feedback">("products");

  // Admin Product Edits/Add States
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductData, setEditingProductData] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    id: "",
    category: "sidr",
    nameAr: "",
    nameEn: "",
    taglineAr: "",
    taglineEn: "",
    descriptionAr: "",
    descriptionEn: "",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 1,
    sizes: [
      { weight: "250g", price: 50, originalPrice: 60 },
      { weight: "500g", price: 90, originalPrice: 110 },
      { weight: "1kg", price: 160, originalPrice: 190 }
    ],
    benefitsAr: ["طبيعي وغني بالمعادن", "مضاد للأكسدة", "يحسن المناعة"],
    benefitsEn: ["100% natural and mineral-rich", "Antioxidant", "Boosts immunity"],
    bestSeller: false,
    honeyType: "Sidr"
  });

  // Checkout State
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in JOD
  const [discountNote, setDiscountNote] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("aramex");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mada");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  // Billing address form
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Jordan",
    city: "",
    address: "",
    postalCode: ""
  });

  // Load language settings on page mount
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    localStorage.setItem("qd_language", language);
  }, [language]);

  // Fetch products from server on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data: Product[]) => {
        const mapped = data.map(p => ({
          ...p,
          image: p.image || PRODUCT_IMAGES[p.id]
        }));
        if (!localStorage.getItem("qd_products_db_v4")) {
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn("Could not load products from API, using robust local dataset instead.", err);
      });
  }, []);

  // Save Cart to local storage
  useEffect(() => {
    localStorage.setItem("qd_cart", JSON.stringify(cart));
  }, [cart]);

  // Save Loyalty/Current user profile
  useEffect(() => {
    if (loyaltyProfile) {
      localStorage.setItem("qd_current_user", JSON.stringify(loyaltyProfile));
      // Sync it back to usersDB
      setUsersDB(prev => ({
        ...prev,
        [loyaltyProfile.email!]: loyaltyProfile
      }));
    } else {
      localStorage.removeItem("qd_current_user");
    }
  }, [loyaltyProfile]);

  // Save users database
  useEffect(() => {
    localStorage.setItem("qd_users_db_v3", JSON.stringify(usersDB));
  }, [usersDB]);

  // Save orders database
  useEffect(() => {
    localStorage.setItem("qd_orders_db_v3", JSON.stringify(orders));
  }, [orders]);

  // Save feedbackTickets database
  useEffect(() => {
    localStorage.setItem("qd_feedback_db_v3", JSON.stringify(feedbackTickets));
  }, [feedbackTickets]);

  // Save products database (for admin edits)
  useEffect(() => {
    try {
      localStorage.setItem("qd_products_db_v4", JSON.stringify(products));
    } catch (e) {
      console.warn("Could not save products to localStorage (limit exceeded):", e);
    }
  }, [products]);

  // Save reviews database
  useEffect(() => {
    localStorage.setItem("qd_reviews_db_v1", JSON.stringify(reviews));
  }, [reviews]);

  // Auto fill checkout and feedback details from logged in user profile
  useEffect(() => {
    if (loyaltyProfile) {
      setCheckoutForm(prev => ({
        ...prev,
        fullName: loyaltyProfile.username || prev.fullName,
        email: loyaltyProfile.email || prev.email,
        phone: loyaltyProfile.phone || prev.phone
      }));
      setFeedbackName(loyaltyProfile.username);
      setFeedbackEmail(loyaltyProfile.email || "");
      setFeedbackPhone(loyaltyProfile.phone);
      setReviewName(loyaltyProfile.username);
    }
  }, [loyaltyProfile]);

  // Scroll to top when tab or checkout mode changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab, checkoutMode]);

  // Translate helpers
  const t = translations[language];

  // Helper: Get product size selection index
  const getSelectedSizeIndex = (productId: string) => {
    return selectedWeights[productId] !== undefined ? selectedWeights[productId] : 0;
  };

  // Helper: Change product size selection
  const handleSizeChange = (productId: string, sizeIdx: number) => {
    setSelectedWeights(prev => ({
      ...prev,
      [productId]: sizeIdx
    }));
  };

  // Helper: Open review form for a specific product
  const handleRateProduct = (productId: string) => {
    setReviewProductId(productId);
    setShowAddReviewForm(true);
    setActiveTab("home");
    setTimeout(() => {
      const el = document.getElementById("customer-reviews-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  // --- Cart Actions ---
  const addToCart = (product: Product) => {
    const sizeIdx = getSelectedSizeIndex(product.id);
    const selectedSize = product.sizes[sizeIdx];

    setCart(prev => {
      // Check if product with this size already exists
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && item.selectedSize.weight === selectedSize.weight
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1
        };
        return updated;
      } else {
        return [...prev, { product, selectedSize, quantity: 1 }];
      }
    });

    setCartOpen(true);
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && item.selectedSize.weight === weight)
    ));
  };

  const updateCartQuantity = (productId: string, weight: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize.weight === weight) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      });
    });
  };

  // --- Calculations ---
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.selectedSize.price * item.quantity), 0);
  const freeShippingThreshold = 60; // JOD
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;

  const getShippingCostValue = (): number => {
    if (isFreeShipping || cart.length === 0) return 0;
    if (shippingMethod === "aramex") return 5; // 5 JOD
    if (shippingMethod === "dhl") return 9; // 9 JOD
    if (shippingMethod === "local") return 3; // 3 JOD
    return 5;
  };

  const shippingCost = getShippingCostValue();
  const checkoutTotal = Math.max(0, cartSubtotal + shippingCost - appliedDiscount + (paymentMethod === "cod" ? 3 : 0));

  // --- Loyalty Actions ---
  const handleCheckLoyalty = () => {
    if (!loyaltyPhone.trim()) {
      setLoyaltyMessage({ type: "error", text: language === "ar" ? "الرجاء إدخال رقم جوال صحيح" : "Please enter a valid phone number" });
      return;
    }

    // Lookup profile by phone number in usersDB
    const profile = (Object.values(usersDB) as LoyaltyProfile[]).find(u => u.phone === loyaltyPhone);
    if (profile) {
      setLoyaltyProfile(profile);
      setLoyaltyMessage({ 
        type: "success", 
        text: language === "ar" 
          ? `أهلاً بك مجدداً يا ${profile.username}! تم تحميل حساب نقاطك بنجاح.` 
          : `Welcome back, ${profile.username}! Your points account has been loaded successfully.` 
      });
    } else {
      setLoyaltyMessage({ type: "register", text: t.loyaltyDemoRegister });
    }
  };

  const handleRegisterLoyalty = () => {
    const randomName = language === "ar" 
      ? `صديق القلعة (${loyaltyPhone.slice(-4)})` 
      : `Castle Friend (${loyaltyPhone.slice(-4)})`;
    const randomEmail = `friend-${Date.now()}@dumalwah.com`;

    const newProfile: LoyaltyProfile = {
      username: randomName,
      phone: loyaltyPhone,
      email: randomEmail,
      points: 50,
      registrationDate: new Date().toISOString().split('T')[0],
      history: [
        {
          id: `reg-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          actionAr: "مكافأة التسجيل والترحيب بنقاط القلعة",
          actionEn: "Welcome registration bonus points",
          points: 50
        }
      ]
    };

    setUsersDB(prev => ({
      ...prev,
      [randomEmail]: newProfile
    }));
    setLoyaltyProfile(newProfile);
    setLoyaltyMessage({
      type: "success",
      text: language === "ar"
        ? "مبارك! تم إنشاء حسابك وحصلت على ٥٠ نقطة ترحيبية مجانية."
        : "Success! Your account has been created with 50 free welcome points."
    });
  };

  const handleRedeemPoints = () => {
    if (!loyaltyProfile || !loyaltyProfile.email) return;

    if (redeemPointsAmount < 10 || redeemPointsAmount > loyaltyProfile.points) {
      alert(language === "ar" ? "النقاط غير كافية أو مدخلة بشكل خاطئ" : "Insufficient points or invalid amount entered.");
      return;
    }

    const discountEarned = Math.floor(redeemPointsAmount / 10) * 1; // 10 points = 1 JOD
    const voucherCode = `DUMALWAH-LOYAL-${Date.now().toString().slice(-4)}`;

    const updatedProfile: LoyaltyProfile = {
      ...loyaltyProfile,
      points: loyaltyProfile.points - redeemPointsAmount,
      history: [
        {
          id: `red-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          actionAr: `استبدال ${redeemPointsAmount} نقطة بكوبون خصم بقيمة ${discountEarned} د.أ`,
          actionEn: `Redeemed ${redeemPointsAmount} points for ${discountEarned} JOD coupon`,
          points: -redeemPointsAmount
        },
        ...loyaltyProfile.history
      ]
    };

    setUsersDB(prev => ({
      ...prev,
      [loyaltyProfile.email!]: updatedProfile
    }));
    setLoyaltyProfile(updatedProfile);

    // Save voucher code to user secrets / checkout session
    setCouponCode(voucherCode);
    setAppliedDiscount(discountEarned);
    setDiscountNote(language === "ar" 
      ? `تم تطبيق كوبون استبدال النقاط خصم بقيمة ${discountEarned} د.أ!`
      : `Redeemed loyalty points coupon applied! -${discountEarned} JOD!`
    );

    alert(language === "ar" 
      ? `تم استبدال نقاطك بنجاح! تم نسخ الكوبون وتطبيقه تلقائياً لطلبك القادم: ${voucherCode}`
      : `Success! Redeemed points. Coupon generated and auto-applied to checkout: ${voucherCode}`
    );
  };

  // --- Promo Code Application ---
  const applyPromoCode = () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) return;

    if (code === "WELCOME10") {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      setDiscountNote(language === "ar" ? "خصم الترحيب المفعّل 10%!" : "Welcome promo discount 10% activated!");
    } else if (code === "DUMALWAH20") {
      const discount = Math.round(cartSubtotal * 0.2);
      setAppliedDiscount(discount);
      setDiscountNote(language === "ar" ? "خصم كود القلعة المفعّل 20%!" : "Castle coupon discount 20% activated!");
    } else if (code.startsWith("DUMALWAH-LOYAL-")) {
      // Simulated loyalty voucher validation
      const randomDiscount = 10; // default for demo vouchers is 10 JOD
      setAppliedDiscount(randomDiscount);
      setDiscountNote(language === "ar" ? `خصم نقاط الولاء المسترد بقيمة ${randomDiscount} د.أ` : `Loyalty points cash back discount -${randomDiscount} JOD`);
    } else {
      alert(t.promoError);
      setAppliedDiscount(0);
      setDiscountNote(null);
    }
  };

  // --- Checkout Processing ---
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Validate checkout inputs
    if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.city || !checkoutForm.address) {
      alert(language === "ar" ? "الرجاء تعبئة كافة الحقول الإلزامية لنتمكن من توصيل العسل إليك!" : "Please fill in all mandatory billing and shipping fields!");
      return;
    }

    setIsProcessingOrder(true);

    // Calculate loyalty points earned (1 point per JOD spent)
    const pointsEarned = Math.floor(cartSubtotal * 1);

    // Process order sequence
    setTimeout(() => {
      const uniqueOrderID = `QD-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newOrder: Order = {
        id: uniqueOrderID,
        items: [...cart],
        subtotal: cartSubtotal,
        shippingCost: shippingCost,
        discount: appliedDiscount,
        total: checkoutTotal,
        pointsEarned: pointsEarned,
        pointsRedeemed: appliedDiscount > 0 ? appliedDiscount * 2 : 0, // mock redemption conversion
        shippingDetails: { ...checkoutForm },
        shippingMethod,
        paymentMethod,
        date: new Date().toISOString().split('T')[0],
        status: "pending"
      };

      // Add to orders list state
      setOrders(prev => [newOrder, ...prev]);

      // Add points to active loyalty profile if exists
      if (loyaltyProfile && loyaltyProfile.email) {
        const updatedPoints = loyaltyProfile.points + pointsEarned;
        const updatedProfile: LoyaltyProfile = {
          ...loyaltyProfile,
          points: updatedPoints,
          history: [
            {
              id: `earn-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              actionAr: `كسب نقاط عن شراء الطلب #${uniqueOrderID}`,
              actionEn: `Earned points for purchase Order #${uniqueOrderID}`,
              points: pointsEarned
            },
            ...loyaltyProfile.history
          ]
        };

        setUsersDB(prev => ({
          ...prev,
          [loyaltyProfile.email!]: updatedProfile
        }));
        setLoyaltyProfile(updatedProfile);
      }

      setOrderSuccess(newOrder);
      setCart([]); // Clear Cart
      setCheckoutMode(false);
      setIsProcessingOrder(false);
    }, 2500);
  };

  // --- Filter Logic ---
  const filteredProducts = products.filter(product => {
    const categoryMatches = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = 
      product.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.taglineAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.taglineEn.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatches && matchesSearch;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const sizeA = a.sizes[getSelectedSizeIndex(a.id)];
    const sizeB = b.sizes[getSelectedSizeIndex(b.id)];

    if (sortBy === "priceLow") return sizeA.price - sizeB.price;
    if (sortBy === "priceHigh") return sizeB.price - sizeA.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // default sort
  });

  // --- Auth Handlers ---
  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const emailKey = loginEmail.toLowerCase().trim();
    const user = usersDB[emailKey];
    if (user && user.password === loginPassword) {
      setLoyaltyProfile(user);
      localStorage.setItem("qd_current_user", JSON.stringify(user));
      // Reset form fields
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setAuthError(language === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Incorrect email or password.");
    }
  };

  const handleUserRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setAuthError(language === "ar" ? "الرجاء تعبئة كافة الحقول" : "All fields are required.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError(language === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match.");
      return;
    }
    const emailKey = regEmail.toLowerCase().trim();
    if (usersDB[emailKey]) {
      setAuthError(language === "ar" ? "هذا البريد الإلكتروني مسجل بالفعل" : "This email is already registered.");
      return;
    }

    const newProfile: LoyaltyProfile = {
      username: regName.trim(),
      phone: regPhone.trim(),
      email: emailKey,
      password: regPassword,
      points: 50, // 50 Welcome points!
      registrationDate: new Date().toISOString().split('T')[0],
      history: [
        {
          id: `reg-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          actionAr: "مكافأة التسجيل والترحيب بنقاط القلعة",
          actionEn: "Welcome registration bonus points",
          points: 50
        }
      ]
    };

    setUsersDB(prev => ({
      ...prev,
      [emailKey]: newProfile
    }));
    setLoyaltyProfile(newProfile);
    localStorage.setItem("qd_current_user", JSON.stringify(newProfile));
    
    // Clear registration fields
    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setRegPassword("");
    setRegConfirmPassword("");
  };

  const handleUserLogout = () => {
    setLoyaltyProfile(null);
    localStorage.removeItem("qd_current_user");
    setAuthError(null);
  };

  const handleSubmissionFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || !feedbackName.trim() || !feedbackEmail.trim() || !feedbackPhone.trim()) {
      alert(language === "ar" ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields.");
      return;
    }

    const newTicket: FeedbackTicket = {
      id: `FB-${Math.floor(100 + Math.random() * 900)}`,
      type: feedbackType,
      senderName: feedbackName.trim(),
      senderEmail: feedbackEmail.toLowerCase().trim(),
      senderPhone: feedbackPhone.trim(),
      text: feedbackText.trim(),
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    setFeedbackTickets(prev => [newTicket, ...prev]);

    setFeedbackSuccess(language === "ar" 
      ? `تم إرسال ${feedbackType === "complaint" ? "شكواكم" : "اقتراحكم"} بنجاح! رقم المتابعة الخاص بكم هو: ${newTicket.id}`
      : `Your ${feedbackType} has been submitted successfully! Ticket ID: ${newTicket.id}`
    );

    setFeedbackText("");
    // If not logged in, clear sender fields
    if (!loyaltyProfile) {
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackPhone("");
    }
  };

  const handleSubmissionReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      alert(language === "ar" ? "الرجاء كتابة الاسم والتعليق" : "Please provide your name and review text.");
      return;
    }

    let selectedProd = products.find(p => p.id === reviewProductId);
    if (!selectedProd) {
      selectedProd = LOCAL_PRODUCTS.find(p => p.id === reviewProductId);
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: reviewName.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
      productId: reviewProductId || undefined,
      productNameAr: selectedProd ? selectedProd.nameAr : undefined,
      productNameEn: selectedProd ? selectedProd.nameEn : undefined,
      date: new Date().toISOString().split('T')[0],
      isVerified: loyaltyProfile ? true : false,
      likes: 0
    };

    setReviews(prev => [newReview, ...prev]);

    setReviewSuccess(language === "ar" 
      ? "شكراً لك! تم إضافة تقييمك بنجاح وعرضه على الصفحة الرئيسية."
      : "Thank you! Your review has been successfully added and is now displayed on the front page."
    );

    setReviewText("");
    setReviewRating(5);
    setReviewProductId("");
    if (!loyaltyProfile) {
      setReviewName("");
    }

    setTimeout(() => {
      setReviewSuccess(null);
      setShowAddReviewForm(false);
    }, 4000);
  };

  const handleLikeReview = (id: string) => {
    const likedKey = `liked_${id}`;
    if (sessionStorage.getItem(likedKey)) {
      return;
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
    sessionStorage.setItem(likedKey, "true");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] font-sans antialiased text-[#4A2F13] selection:bg-[#EADFC9] selection:text-[#4A2F13]" id="app-root-layout">
      
      {/* --- PREMIUM HEADER TOP BAR --- */}
      <div className="bg-[#FAF9F6] text-[#3D3028] text-xs py-2 px-4 flex items-center justify-between border-b border-[#EADFC9] font-medium" id="header-top-banner">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B58A30]" />
            {t.badgeTested}
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#B58A30]" />
            {t.badgeWorldwide}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Switcher Button */}
          <button
            onClick={() => setLanguage(l => l === "ar" ? "en" : "ar")}
            className="flex items-center gap-1 bg-[#F5EFE4] hover:bg-[#EADFC9] border border-[#EADFC9] rounded px-2.5 py-1 text-[11px] transition cursor-pointer"
            id="lang-switcher-btn"
          >
            <Globe className="w-3.5 h-3.5 text-[#B58A30]" />
            <span>{language === "ar" ? "English" : "العربية"}</span>
          </button>
        </div>
      </div>

      {/* --- MAIN HEADER NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md shadow-sm border-b border-[#EADFC9]/50" id="app-navigation-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Logo & Branding Area */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab("home"); setCheckoutMode(false); }} id="brand-identity">
            <Logo className="w-12 h-12 md:w-16 md:h-16" showText={false} />
            <div className="text-right">
              <span className="block font-bold text-lg md:text-2xl text-[#4A2F13] font-sans tracking-tight">
                {t.appName}
              </span>
              <span className="block text-[10px] md:text-xs text-[#B58A30] font-mono tracking-widest leading-none mt-0.5">
                {language === "ar" ? "حصن الجودة والأصالة" : "YEMENI AUTHENTIC HERITAGE"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-[15px]" id="desktop-navbar">
            <button
              onClick={() => { setActiveTab("home"); setCheckoutMode(false); }}
              className={`hover:text-[#B58A30] transition pb-1 border-b-2 cursor-pointer ${activeTab === "home" && !checkoutMode ? "text-[#B58A30] border-[#B58A30]" : "text-[#4A2F13]/80 border-transparent"}`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => { setActiveTab("products"); setCheckoutMode(false); }}
              className={`hover:text-[#B58A30] transition pb-1 border-b-2 cursor-pointer ${activeTab === "products" && !checkoutMode ? "text-[#B58A30] border-[#B58A30]" : "text-[#4A2F13]/80 border-transparent"}`}
            >
              {t.navProducts}
            </button>
            <button
              onClick={() => { setActiveTab("loyalty"); setCheckoutMode(false); }}
              className={`hover:text-[#B58A30] transition pb-1 border-b-2 cursor-pointer ${activeTab === "loyalty" && !checkoutMode ? "text-[#B58A30] border-[#B58A30]" : "text-[#4A2F13]/80 border-transparent"}`}
            >
              {t.navLoyalty}
            </button>
            <button
              onClick={() => { setActiveTab("chat"); setCheckoutMode(false); }}
              className={`hover:text-[#B58A30] transition pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === "chat" ? "text-[#B58A30] border-[#B58A30] font-bold" : "text-[#4A2F13]/80 border-transparent"}`}
            >
              <Sparkles className="w-4 h-4 text-[#B58A30]" />
              {t.navChat}
            </button>
            <button
              onClick={() => { setActiveTab("admin"); setCheckoutMode(false); }}
              className={`hover:text-[#B58A30] transition pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === "admin" ? "text-[#B58A30] border-[#B58A30] font-bold" : "text-[#4A2F13]/80 border-transparent"}`}
            >
              <ShieldCheck className="w-4 h-4 text-[#B58A30]" />
              {language === "ar" ? "لوحة الإدارة" : "Admin"}
            </button>
          </nav>

          {/* Interactive Icons Area */}
          <div className="flex items-center gap-3 md:gap-4" id="header-actions">
            
            {/* Active Loyalty Indicator Badge if signed in */}
            {loyaltyProfile && (
              <div 
                onClick={() => { setActiveTab("loyalty"); setCheckoutMode(false); }}
                className="hidden md:flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F5EFE4] border border-[#EADFC9] px-3.5 py-1.5 rounded-full cursor-pointer transition shadow-sm"
                id="active-loyalty-widget"
              >
                <Award className="w-4.5 h-4.5 text-[#B58A30] animate-pulse" />
                <div className="text-right leading-none">
                  <span className="block text-[10px] text-[#4A2F13]/70 font-sans">{loyaltyProfile.username}</span>
                  <span className="text-xs font-bold text-[#B58A30] font-mono">{loyaltyProfile.points} {language === "ar" ? "نقطة" : "Pts"}</span>
                </div>
              </div>
            )}

            {/* Clear Button for New Users to Register or Login */}
            {!loyaltyProfile && (
              <button
                onClick={() => {
                  setAuthTab("login");
                  setActiveTab("loyalty");
                  setCheckoutMode(false);
                }}
                className="hidden md:flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#F5EFE4] border-2 border-[#B58A30] text-[#B58A30] px-4 py-1.5 rounded-full font-bold text-xs transition duration-200 cursor-pointer shadow-sm hover:shadow"
                id="header-register-login-btn"
              >
                <User className="w-4 h-4 text-[#B58A30]" />
                <span>{language === "ar" ? "تسجيل الدخول / فتح حساب" : "Sign In / Register"}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-11 h-11 md:w-12 md:h-12 rounded-full border border-[#EADFC9] bg-[#FFFFFF] hover:bg-[#F5EFE4] flex items-center justify-center text-[#4A2F13] hover:text-[#B58A30] hover:border-[#B58A30] transition cursor-pointer shadow-sm"
              id="header-cart-button"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B58A30] text-white font-bold font-mono text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FCFAF7] shadow">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden w-11 h-11 rounded-full border border-[#EADFC9] bg-[#FFFFFF] flex items-center justify-center text-[#4A2F13] hover:text-[#B58A30] transition cursor-pointer"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFFFF] border-t border-[#EADFC9] px-4 py-6 space-y-4 shadow-xl flex flex-col absolute top-20 left-0 w-full z-30 animate-in slide-in-from-top duration-300" id="mobile-navbar-drawer">
            <button
              onClick={() => { setActiveTab("home"); setCheckoutMode(false); setMobileMenuOpen(false); }}
              className={`text-right w-full py-2.5 font-bold font-sans text-[16px] border-b border-[#EADFC9]/40 ${activeTab === "home" && !checkoutMode ? "text-[#B58A30]" : "text-[#4A2F13]/80"}`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => { setActiveTab("products"); setCheckoutMode(false); setMobileMenuOpen(false); }}
              className={`text-right w-full py-2.5 font-bold font-sans text-[16px] border-b border-[#EADFC9]/40 ${activeTab === "products" && !checkoutMode ? "text-[#B58A30]" : "text-[#4A2F13]/80"}`}
            >
              {t.navProducts}
            </button>
            <button
              onClick={() => { setActiveTab("loyalty"); setCheckoutMode(false); setMobileMenuOpen(false); }}
              className={`text-right w-full py-2.5 font-bold font-sans text-[16px] border-b border-[#EADFC9]/40 ${activeTab === "loyalty" && !checkoutMode ? "text-[#B58A30]" : "text-[#4A2F13]/80"}`}
            >
              {t.navLoyalty}
            </button>
            <button
              onClick={() => { setActiveTab("chat"); setCheckoutMode(false); setMobileMenuOpen(false); }}
              className={`text-right w-full py-2.5 font-bold font-sans text-[16px] border-b border-[#EADFC9]/40 flex items-center justify-between ${activeTab === "chat" ? "text-[#B58A30]" : "text-[#4A2F13]/80"}`}
            >
              <span>{t.navChat}</span>
              <Sparkles className="w-4 h-4 text-[#B58A30] animate-pulse" />
            </button>
            <button
              onClick={() => { setActiveTab("admin"); setCheckoutMode(false); setMobileMenuOpen(false); }}
              className={`text-right w-full py-2.5 font-bold font-sans text-[16px] border-b border-[#EADFC9]/40 flex items-center justify-between ${activeTab === "admin" ? "text-[#B58A30]" : "text-[#4A2F13]/80"}`}
            >
              <span>{language === "ar" ? "لوحة التحكم للإدارة" : "Admin Panel"}</span>
              <ShieldCheck className="w-4 h-4 text-[#B58A30]" />
            </button>
            {!loyaltyProfile && (
              <button
                onClick={() => {
                  setAuthTab("login");
                  setActiveTab("loyalty");
                  setCheckoutMode(false);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-[#B58A30] to-[#D8B157] text-white font-extrabold font-sans text-sm py-3 px-4 rounded-xl flex items-center justify-between shadow transition cursor-pointer"
                id="mobile-register-login-btn"
              >
                <span>{language === "ar" ? "تسجيل الدخول / فتح حساب" : "Sign In / Register"}</span>
                <User className="w-4.5 h-4.5 text-white" />
              </button>
            )}
            {loyaltyProfile && (
              <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#EADFC9]/70 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-[#4A2F13]/50">{loyaltyProfile.username}</span>
                  <span className="block text-sm font-bold text-[#B58A30]">{loyaltyProfile.phone}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-[#4A2F13]/50">{language === "ar" ? "النقاط المتوفرة:" : "Available Points:"}</span>
                  <span className="text-lg font-bold text-[#B58A30] font-mono">{loyaltyProfile.points}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </header>


      {/* ======================================= */}
      {/* --- CONTENT CONTROLLER / TAB SYSTEM --- */}
      {/* ======================================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* --- GLOBAL ORDER SUCCESS SPLASH SCREEN --- */}
        {orderSuccess && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4" id="order-success-screen">
            <div className="bg-[#FFFFFF] max-w-xl w-full rounded-2xl shadow-2xl border border-[#EADFC9] overflow-hidden transform animate-in zoom-in-95 duration-300" id="order-success-modal">
              {/* Success Header banner */}
              <div className="bg-gradient-to-r from-[#FAF9F6] to-[#FCFAF7] p-8 text-[#4A2F13] text-center flex flex-col items-center gap-3 border-b border-[#EADFC9]">
                <div className="w-16 h-16 rounded-full bg-[#B58A30]/15 border-2 border-[#B58A30] flex items-center justify-center text-[#B58A30] shadow-inner">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-sans text-[#4A2F13]">
                  {t.successTitle}
                </h2>
                <p className="text-xs md:text-sm text-[#4A2F13]/80 leading-relaxed max-w-md">
                  {t.successSubtitle}
                </p>
              </div>

              {/* Order Specifics */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="bg-[#FCFAF7] border border-[#EADFC9]/60 rounded-xl p-4 md:p-5 flex flex-col gap-3 font-medium text-sm text-[#4A2F13]/80">
                  <div className="flex items-center justify-between">
                    <span>{t.successOrderID}</span>
                    <span className="font-mono font-bold text-[#B58A30] text-base">{orderSuccess.id}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#EADFC9]/30 pt-2.5">
                    <span>{language === "ar" ? "قيمة الطلب الإجمالية:" : "Total Order Value:"}</span>
                    <span className="font-mono font-bold text-[#4A2F13] text-base">{orderSuccess.total} {language === "ar" ? "د.أ" : "JOD"}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#EADFC9]/30 pt-2.5 bg-[#B58A30]/5 p-2 rounded-lg">
                    <span className="flex items-center gap-1.5 text-[#B58A30]">
                      <Coins className="w-4.5 h-4.5 text-[#B58A30]" />
                      {t.successPointsEarned}
                    </span>
                    <span className="font-mono font-bold text-[#B58A30]">+{orderSuccess.pointsEarned} {language === "ar" ? "نقطة" : "pts"}</span>
                  </div>
                </div>

                <div className="text-center md:text-right space-y-2.5">
                  <p className="text-xs text-[#4A2F13]/60 leading-relaxed">
                    {t.successInstructions}
                  </p>
                  <div className="flex items-center gap-2 justify-center text-xs font-semibold text-[#B58A30] bg-[#B58A30]/10 border border-[#B58A30]/25 rounded-lg p-2.5">
                    <Truck className="w-4 h-4 text-[#B58A30]" />
                    <span>
                      {language === "ar" 
                        ? `سيتم شحن طلبك عبر: ${orderSuccess.shippingMethod === "aramex" ? "أرامكس" : orderSuccess.shippingMethod === "dhl" ? "دي اتش ال" : "المندوب المحلي"}` 
                        : `Your order will be dispatched via: ${orderSuccess.shippingMethod.toUpperCase()}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => { setOrderSuccess(null); setActiveTab("home"); }}
                  className="w-full bg-gradient-to-r from-[#B58A30] to-[#D8B157] text-[#FCFAF7] font-extrabold font-sans py-4 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer"
                >
                  {t.successBtnClose}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- DYNAMIC CHECKOUT PORTAL SECTION --- */}
        {checkoutMode ? (
          <div className="space-y-8" id="checkout-view-container">
            {/* Back button */}
            <button
              onClick={() => setCheckoutMode(false)}
              className="inline-flex items-center gap-1.5 text-[#4A2F13]/75 hover:text-[#B58A30] transition text-sm font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "ar" ? "العودة لتسوق المنتجات" : "Back to Shopping"}
            </button>

            <h1 className="text-2xl md:text-3.5xl font-black font-sans text-[#4A2F13] border-b border-[#EADFC9]/50 pb-3">
              {t.checkoutTitle}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Details (Lg: 7) */}
              <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-6 md:p-8 shadow-md space-y-8">
                
                {/* 1. Address Block */}
                <div>
                  <h3 className="text-lg font-bold text-[#4A2F13] font-sans flex items-center gap-2 border-b border-[#EADFC9]/50 pb-3 mb-5">
                    <MapPin className="w-5 h-5 text-[#B58A30]" />
                    {t.checkoutBillingDetails}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{t.checkoutFullName} *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.fullName}
                        onChange={(e) => setCheckoutForm({...checkoutForm, fullName: e.target.value})}
                        className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{t.checkoutPhone} *</label>
                      <input
                        type="tel"
                        required
                        placeholder="079xxxxxxx"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                        className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] font-mono transition"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{t.checkoutEmail} *</label>
                      <input
                        type="email"
                        required
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                        className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{t.checkoutCountry} *</label>
                      <select
                        value={checkoutForm.country}
                        onChange={(e) => setCheckoutForm({...checkoutForm, country: e.target.value})}
                        className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3.5 py-2.5 text-sm text-[#4A2F13] outline-none transition cursor-pointer"
                      >
                        <option value="Jordan" className="bg-white text-[#4A2F13]">{language === "ar" ? "الأردن (Jordan)" : "Jordan (الأردن)"}</option>
                        <option value="Saudi Arabia" className="bg-white text-[#4A2F13]">{language === "ar" ? "المملكة العربية السعودية (Saudi Arabia)" : "Saudi Arabia (المملكة العربية السعودية)"}</option>
                        <option value="Yemen" className="bg-white text-[#4A2F13]">{language === "ar" ? "اليمن (Yemen)" : "Yemen (اليمن)"}</option>
                        <option value="United Arab Emirates" className="bg-white text-[#4A2F13]">{language === "ar" ? "الإمارات العربية المتحدة (UAE)" : "United Arab Emirates (الإمارات)"}</option>
                        <option value="Oman" className="bg-white text-[#4A2F13]">{language === "ar" ? "عُمان" : "Oman"}</option>
                        <option value="Qatar" className="bg-white text-[#4A2F13]">{language === "ar" ? "قطر" : "Qatar"}</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{t.checkoutCity} *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                        className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3.5 py-2.5 text-sm text-[#4A2F13] outline-none transition"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{t.checkoutAddress} *</label>
                      <input
                        type="text"
                        required
                        placeholder={language === "ar" ? "اسم الحي، اسم الشارع، رقم المبنى والرمز البريدي" : "District, Street, Building Number"}
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                        className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3.5 py-2.5 text-sm text-[#4A2F13] outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Carrier Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#4A2F13] font-sans flex items-center gap-2 border-b border-[#EADFC9]/50 pb-3 mb-5">
                    <Truck className="w-5 h-5 text-[#B58A30]" />
                    {t.shippingMethodTitle}
                  </h3>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${shippingMethod === "aramex" ? "bg-[#B58A30]/10 border-[#B58A30] shadow-sm" : "border-[#EADFC9]/60 hover:bg-[#FCFAF7]"}`}>
                      <input
                        type="radio"
                        name="shipping_method"
                        checked={shippingMethod === "aramex"}
                        onChange={() => setShippingMethod("aramex")}
                        className="w-4 h-4 text-[#B58A30] focus:ring-[#B58A30] accent-[#B58A30]"
                      />
                      <div className="flex-grow text-right">
                        <span className="block font-bold text-sm text-[#4A2F13]">{t.shipAramex}</span>
                        <span className="text-xs text-[#4A2F13]/60">3-5 {t.shipDays}</span>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#B58A30]">
                        {isFreeShipping ? t.shipFree : (language === "ar" ? "٥ د.أ" : "5 JOD")}
                      </span>
                    </label>

                    <label className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${shippingMethod === "dhl" ? "bg-[#B58A30]/10 border-[#B58A30] shadow-sm" : "border-[#EADFC9]/60 hover:bg-[#FCFAF7]"}`}>
                      <input
                        type="radio"
                        name="shipping_method"
                        checked={shippingMethod === "dhl"}
                        onChange={() => setShippingMethod("dhl")}
                        className="w-4 h-4 text-[#B58A30] focus:ring-[#B58A30] accent-[#B58A30]"
                      />
                      <div className="flex-grow text-right">
                        <span className="block font-bold text-sm text-[#4A2F13]">{t.shipDHL}</span>
                        <span className="text-xs text-[#4A2F13]/60">2-3 {t.shipDays}</span>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#B58A30]">
                        {isFreeShipping ? t.shipFree : (language === "ar" ? "٨ د.أ" : "8 JOD")}
                      </span>
                    </label>

                    <label className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all duration-200 ${shippingMethod === "local" ? "bg-[#B58A30]/10 border-[#B58A30] shadow-sm" : "border-[#EADFC9]/60 hover:bg-[#FCFAF7]"}`}>
                      <input
                        type="radio"
                        name="shipping_method"
                        checked={shippingMethod === "local"}
                        onChange={() => setShippingMethod("local")}
                        className="w-4 h-4 text-[#B58A30] focus:ring-[#B58A30] accent-[#B58A30]"
                      />
                      <div className="flex-grow text-right">
                        <span className="block font-bold text-sm text-[#4A2F13]">{t.shipLocal}</span>
                        <span className="text-xs text-[#4A2F13]/60">1-2 {t.shipDays}</span>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#B58A30]">
                        {isFreeShipping ? t.shipFree : (language === "ar" ? "٣ د.أ" : "3 JOD")}
                      </span>
                    </label>
                  </div>
                </div>

                {/* 3. Payment Method Choice */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#4A2F13] font-sans flex items-center gap-2 border-b border-[#EADFC9]/50 pb-3 mb-5">
                    <CreditCard className="w-5 h-5 text-[#B58A30]" />
                    {t.paymentMethodTitle}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: "mada", name: pm => language === "ar" ? "CliQ / JoMoPay (الدفع المباشر والتحويل)" : "CliQ / JoMoPay (Direct Instant Transfer)" },
                      { id: "visa", name: pm => t.payVisa },
                      { id: "applepay", name: pm => t.payApple },
                      { id: "cod", name: pm => t.payCOD },
                      { id: "transfer", name: pm => t.payTransfer }
                    ].map((pm) => (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-3 border p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === pm.id ? "bg-[#B58A30]/10 border-[#B58A30] shadow-sm" : "border-[#EADFC9]/60 hover:bg-[#FCFAF7]"}`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === pm.id}
                          onChange={() => setPaymentMethod(pm.id as PaymentMethod)}
                          className="w-4 h-4 text-[#B58A30] focus:ring-[#B58A30] accent-[#B58A30]"
                        />
                        <span className="font-bold text-sm text-[#4A2F13]">{typeof pm.name === "function" ? pm.name(pm) : pm.name}</span>
                      </label>
                    ))}
                  </div>

                  {/* Dynamic Bank Transfer details block if selected */}
                  {paymentMethod === "transfer" && (
                    <div className="bg-[#FCFAF7] border border-[#EADFC9] rounded-xl p-4 md:p-5 mt-4 space-y-3 transform animate-in fade-in duration-200 text-[#4A2F13]">
                      <h4 className="font-bold text-sm text-[#4A2F13] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#B58A30]" />
                        {t.transferInfoTitle}
                      </h4>
                      <div className="text-xs text-[#4A2F13]/80 space-y-2 leading-relaxed">
                        <div>
                          <span className="font-bold block text-[#B58A30]">{language === "ar" ? "اسم البنك:" : "Bank Name:"}</span>
                          <span>{t.transferBankName}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[#B58A30]">{language === "ar" ? "اسم الحساب:" : "Account Name:"}</span>
                          <span>{t.transferAccountName}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[#B58A30]">{language === "ar" ? "رقم الآيبان IBAN:" : "IBAN Code:"}</span>
                          <span className="font-mono bg-[#FCFAF7] border border-[#EADFC9] px-2 py-1 rounded text-[#B58A30] block md:inline-block mt-1">{t.transferIBAN}</span>
                        </div>
                        <p className="border-t border-[#EADFC9]/40 pt-2 text-[#4A2F13]/60 mt-2 italic">
                          {t.transferInstruction}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessingOrder}
                  className="w-full bg-gradient-to-r from-[#B58A30] to-[#D8B157] hover:from-[#D8B157] hover:to-[#B58A30] text-[#FCFAF7] font-extrabold font-sans py-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingOrder ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#FCFAF7] border-t-transparent rounded-full animate-spin"></div>
                      <span>{t.processingOrder}</span>
                    </>
                  ) : (
                    <span>{translations[language].placeOrderBtn.replace("{total}", checkoutTotal.toString())}</span>
                  )}
                </button>

              </form>

              {/* Right Column: Order Summary block (Lg: 5) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Promo Code Block */}
                <div className="bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-5 shadow-sm space-y-3.5">
                  <label className="block text-sm font-bold text-[#4A2F13] font-sans">
                    {t.promoCodeLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.promoCodePlaceholder}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3 py-2 text-sm outline-none text-[#4A2F13] placeholder-[#4A2F13]/40 uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      className="bg-[#B58A30] hover:bg-[#D8B157] text-white font-extrabold text-xs px-4 py-2 rounded-lg transition cursor-pointer font-sans"
                    >
                      {t.promoApplyBtn}
                    </button>
                  </div>

                  {/* Loyalty Voucher Demo helper list */}
                  <div className="text-[11px] text-[#4A2F13]/70 bg-[#FCFAF7] p-2.5 rounded-lg border border-[#EADFC9]/40 space-y-1">
                    <p className="font-bold text-[#B58A30]">{language === "ar" ? "أكواد ترويجية للتجربة (اضغط للنسخ):" : "Try these demo promo codes (click to copy):"}</p>
                    <div className="flex flex-wrap gap-2 pt-1 font-mono">
                      <button onClick={() => { setCouponCode("WELCOME10"); }} className="bg-[#FFFFFF] hover:bg-[#B58A30]/10 border border-[#EADFC9] px-1.5 py-0.5 rounded text-[#B58A30] font-bold transition">WELCOME10 (10%)</button>
                      <button onClick={() => { setCouponCode("DUMALWAH20"); }} className="bg-[#FFFFFF] hover:bg-[#B58A30]/10 border border-[#EADFC9] px-1.5 py-0.5 rounded text-[#B58A30] font-bold transition">DUMALWAH20 (20%)</button>
                    </div>
                  </div>

                  {discountNote && (
                    <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 p-2.5 rounded-lg font-medium animate-pulse">
                      {discountNote}
                    </div>
                  )}
                </div>

                {/* Items Checkout list */}
                <div className="bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-6 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-[#4A2F13] font-sans border-b border-[#EADFC9]/40 pb-3 flex items-center justify-between">
                    <span>{t.checkoutSummaryTitle}</span>
                    <span className="text-xs bg-[#B58A30]/10 text-[#B58A30] border border-[#B58A30]/25 rounded-full px-2.5 py-0.5 font-mono">
                      {translations[language].checkoutItemCount.replace("{count}", cart.reduce((sum, item) => sum + item.quantity, 0).toString())}
                    </span>
                  </h3>

                  <div className="divide-y divide-[#EADFC9]/30 max-h-72 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-3 py-3.5 first:pt-0 last:pb-0 items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.nameEn}
                          className="w-14 h-14 rounded-lg object-cover border border-[#EADFC9]/40 shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-xs md:text-sm text-[#4A2F13] truncate">
                            {language === "ar" ? item.product.nameAr : item.product.nameEn}
                          </h4>
                          <span className="text-[11px] text-[#4A2F13]/60 font-mono block mt-0.5">
                            {item.selectedSize.weight} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-[#4A2F13] shrink-0">
                          {item.selectedSize.price * item.quantity} {language === "ar" ? "د.أ" : "JOD"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Sum Breakdown */}
                  <div className="border-t border-[#EADFC9]/40 pt-4 space-y-3.5 text-sm font-medium text-[#4A2F13]/70">
                    <div className="flex justify-between">
                      <span>{t.cartSubtotal}</span>
                      <span className="font-mono font-bold text-[#4A2F13]">{cartSubtotal} {language === "ar" ? "د.أ" : "JOD"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>{t.cartShipping}</span>
                      <span className="font-mono font-bold text-[#4A2F13]">
                        {shippingCost === 0 ? t.shipFree : `${shippingCost} د.أ`}
                      </span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <span>{t.cartDiscount}</span>
                        <span className="font-mono font-bold">-{appliedDiscount} {language === "ar" ? "د.أ" : "JOD"}</span>
                      </div>
                    )}

                    {paymentMethod === "cod" && (
                      <div className="flex justify-between text-[#4A2F13]/80 bg-[#FCFAF7] p-2 rounded-lg text-xs border border-[#EADFC9]/30">
                        <span>{language === "ar" ? "رسوم الدفع عند الاستلام:" : "COD Convenience Fee:"}</span>
                        <span className="font-mono font-bold">+3 {language === "ar" ? "د.أ" : "JOD"}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#4A2F13] font-black text-base md:text-lg border-t border-[#EADFC9]/40 pt-3.5">
                      <span>{t.cartTotal}</span>
                      <span className="font-mono text-[#B58A30]">{checkoutTotal} {language === "ar" ? "د.أ" : "JOD"}</span>
                    </div>

                    <div className="bg-[#B58A30]/10 p-3 rounded-lg border border-[#B58A30]/20 flex items-center justify-between text-xs text-[#B58A30]">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-[#B58A30]" />
                        {language === "ar" ? "النقاط المكتسبة من طلبك:" : "Points you earn from this order:"}
                      </span>
                      <span className="font-mono font-bold">+{Math.floor(cartSubtotal * 1)} {language === "ar" ? "نقطة ولاء" : "Pts"}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ======================================= */}
            {/* --- CORE TAB 1: HOME PAGE --- */}
            {/* ======================================= */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-16"
                id="home-tab-container"
              >
                
                {/* --- HERO BANNER --- */}
                <section className="bg-gradient-to-br from-[#FCFAF7] via-[#FFF8EC] to-[#F3E6CD] rounded-3xl overflow-hidden shadow-md border-2 border-[#EADFC9]/80 relative qamariyah-grid" id="hero-banner-section">
                  {/* Beautiful sunset colorful Qamariyah stained-glass overlay */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-qamariyah-amber/20 via-qamariyah-red/15 to-qamariyah-blue/15"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-14 lg:p-16 relative z-10 items-center">
                    
                    {/* Left: Text headings (Lg: 6) */}
                    <div className="lg:col-span-6 space-y-6 text-center md:text-right flex flex-col md:items-start items-center">
                      <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-qamariyah-amber/15 to-qamariyah-red/15 border border-qamariyah-amber/40 text-[#4A2F13] text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-wider shadow-xs" id="hero-badge">
                        <Star className="w-3.5 h-3.5 text-qamariyah-amber fill-qamariyah-amber" />
                        {language === "ar" ? "حصري وممتاز ١٠٠٪" : "100% EXCLUSIVE & RAW"}
                      </div>
                      
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#4A2F13] font-sans tracking-tight leading-[1.15] md:leading-tight">
                        {t.heroTitle}
                      </h1>
                      
                      <p className="text-sm md:text-base text-[#4A2F13]/90 leading-relaxed max-w-2xl md:text-right text-center">
                        {t.heroSubtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                        <motion.button
                          onClick={() => setActiveTab("products")}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="bg-gradient-to-r from-qamariyah-amber to-qamariyah-red hover:from-qamariyah-red hover:to-qamariyah-amber text-white font-extrabold font-sans px-8 py-4 rounded-xl shadow-lg hover:shadow-xl cursor-pointer text-center"
                        >
                          {t.heroActionBuy}
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab("chat")}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="bg-white hover:bg-[#FCFAF7] border-2 border-qamariyah-blue/20 hover:border-qamariyah-blue/40 text-[#4A2F13] font-extrabold font-sans px-8 py-4 rounded-xl shadow-sm cursor-pointer flex items-center justify-center gap-2 group"
                        >
                          <Sparkles className="w-5 h-5 text-qamariyah-blue group-hover:animate-spin" />
                          {t.heroActionChat}
                        </motion.button>
                      </div>
                    </div>

                    {/* Right: Splendid Logo Showcase (Lg: 6) */}
                    <div className="lg:col-span-6 flex justify-center items-center p-4">
                      <div className="bg-[#FFFFFF] border-4 border-qamariyah-amber/35 rounded-full p-6 md:p-10 shadow-2xl w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] aspect-square flex items-center justify-center transform hover:scale-[1.03] hover:rotate-2 transition-all duration-500 relative group animate-pulse-glow" id="hero-logo-frame">
                        {/* Soft gold glow behind circle */}
                        <div className="absolute inset-0 rounded-full bg-qamariyah-amber/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                        <Logo className="w-full h-full" showText={false} />
                      </div>
                    </div>

                  </div>
                </section>

                {/* --- STATS TRUST BAR (Highly Colorful Medallions) --- */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-6 md:p-8 shadow-md" id="trust-stats-bar">
                  {[
                    { title: t.statHives, subtitle: language === "ar" ? "في جبال العصيمات ودوعن وصال" : "In clean mountain valleys", icon: <TrendingUp className="w-6 h-6 text-qamariyah-amber" />, bg: "bg-qamariyah-amber/10 border-qamariyah-amber/20" },
                    { title: t.statClients, subtitle: language === "ar" ? "ثقة مطلقة في دول الخليج العربي" : "Across the Arab Gulf region", icon: <Star className="w-6 h-6 text-qamariyah-red fill-qamariyah-red/30" />, bg: "bg-qamariyah-red/10 border-qamariyah-red/20" },
                    { title: t.statCertificates, subtitle: language === "ar" ? "خالٍ تماماً من السكر والإضافات" : "Tested free of chemicals", icon: <ShieldCheck className="w-6 h-6 text-qamariyah-green" />, bg: "bg-qamariyah-green/10 border-qamariyah-green/20" },
                    { title: t.statPoints, subtitle: language === "ar" ? "نقطة مقابل كل ١ دينار" : "1 Pt for every 1 JOD spent", icon: <Gift className="w-6 h-6 text-qamariyah-blue" />, bg: "bg-qamariyah-blue/10 border-qamariyah-blue/20" }
                  ].map((stat, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center text-center space-y-2 group cursor-default"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 350, damping: 10 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border ${stat.bg} shadow-xs`}
                      >
                        {stat.icon}
                      </motion.div>
                      <div className="space-y-0.5">
                        <span className="block font-black text-2xl md:text-3xl text-[#4A2F13] font-sans tracking-tight">
                          {stat.title}
                        </span>
                        <span className="block text-xs text-[#4A2F13]/70 font-bold leading-tight">
                          {stat.subtitle}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </section>

                {/* --- CUSTOMER REVIEWS & FEEDBACK SECTION --- */}
                <section className="bg-[#FFFFFF] border-2 border-[#EADFC9]/70 rounded-3xl p-6 md:p-10 shadow-md space-y-8" id="customer-reviews-section">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EADFC9]/50 pb-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 bg-qamariyah-amber/10 border border-qamariyah-amber/30 text-[#4A2F13] text-xs px-3 py-1 rounded-full font-bold">
                        <MessageSquare className="w-3.5 h-3.5 text-qamariyah-amber fill-qamariyah-amber/20" />
                        {language === "ar" ? "آراء قلعتنا المعتمدة" : "Castle Certified Reviews"}
                      </div>
                      <h2 className="text-2xl md:text-3.5xl font-black text-[#4A2F13] font-sans tracking-tight">
                        {language === "ar" ? "تقييمات وآراء عملائنا" : "Customer Reviews & Testimonials"}
                      </h2>
                      <p className="text-xs md:text-sm text-[#4A2F13]/70">
                        {language === "ar" 
                          ? "نفتخر بتقديم أجود أنواع العسل اليمني الأصيل، وهذه شهادات وتجارب عملائنا الموثقة."
                          : "We take absolute pride in our pure honey. Read verified experiences from our beloved customers."}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowAddReviewForm(!showAddReviewForm);
                        setReviewSuccess(null);
                      }}
                      className="bg-gradient-to-r from-qamariyah-amber to-qamariyah-red hover:from-qamariyah-red hover:to-qamariyah-amber text-white font-extrabold font-sans text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
                    >
                      <Edit3 className="w-4 h-4" />
                      {language === "ar" ? "اكتب تقييمك الآن" : "Write a Review"}
                    </button>
                  </div>

                  {/* Reviews Summary Dashboard Cards (Bento grid style) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="reviews-summary-dashboard">
                    {/* Left: Overall Rating Medallion */}
                    <motion.div 
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="md:col-span-4 bg-gradient-to-br from-[#FFFBF2] to-[#FDF8EC] border border-[#EADFC9] rounded-2xl p-6 text-center flex flex-col justify-center items-center space-y-3 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <span className="text-sm font-bold text-[#4A2F13]/70 uppercase tracking-wider">
                        {language === "ar" ? "التقييم العام" : "Overall Rating"}
                      </span>
                      <div className="text-5xl font-black text-[#4A2F13] font-mono tracking-tight flex items-baseline gap-1">
                        <span>{(reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1)}</span>
                        <span className="text-lg font-bold text-[#4A2F13]/50">/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
                          return (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(avg) ? "text-qamariyah-amber fill-qamariyah-amber" : "text-gray-300"}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs font-semibold text-[#4A2F13]/80">
                        {language === "ar" 
                          ? `بناءً على ${reviews.length} تقييم حقيقي من عملائنا`
                          : `Based on ${reviews.length} verified buyer reviews`}
                      </span>
                    </motion.div>

                    {/* Middle: Rating breakdown bars */}
                    <motion.div 
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="md:col-span-5 bg-white border border-[#EADFC9]/60 rounded-2xl p-6 flex flex-col justify-between space-y-2.5 shadow-xs hover:shadow-md transition-shadow"
                    >
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviews.filter(r => r.rating === stars).length;
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-3 text-xs font-bold text-[#4A2F13]">
                            <span className="w-3 text-right">{stars}★</span>
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-qamariyah-amber to-[#F59E0B] rounded-full transition-all duration-500" 
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                            <span className="w-10 text-left text-[#4A2F13]/60">({count})</span>
                          </div>
                        );
                      })}
                    </motion.div>

                    {/* Right: Satisfaction highlight info */}
                    <motion.div 
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="md:col-span-3 bg-gradient-to-br from-qamariyah-green/5 to-emerald-500/5 border border-qamariyah-green/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-2 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-full bg-qamariyah-green/10 border border-qamariyah-green/20 flex items-center justify-center text-qamariyah-green">
                        <CheckCircle className="w-6 h-6 fill-qamariyah-green/15" />
                      </div>
                      <span className="text-2xl font-black text-[#4A2F13] font-sans">98.2%</span>
                      <span className="text-xs text-[#4A2F13]/80 font-bold leading-relaxed px-2">
                        {language === "ar" 
                          ? "من المشترين ينصحون بالتعامل معنا لجودة عسلنا وأمانته."
                          : "of buyers highly recommend our pure honey for medicinal use."}
                      </span>
                    </motion.div>
                  </div>

                  {/* Add Review Form Panel (Stateful collapsible slider) */}
                  <AnimatePresence>
                    {showAddReviewForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="bg-[#FFFFFF] border-2 border-qamariyah-amber/35 rounded-2xl p-6 md:p-8 shadow-lg space-y-6 relative overflow-hidden"
                        id="add-review-form-container"
                      >
                      <div className="flex justify-between items-center pb-4 border-b border-[#EADFC9]/50">
                        <h3 className="font-extrabold text-lg text-[#4A2F13] flex items-center gap-2 font-sans">
                          <Edit3 className="w-5 h-5 text-qamariyah-amber" />
                          {language === "ar" ? "شاركنا رأيك الصادق بالعسل" : "Share Your Honest Experience"}
                        </h3>
                        <button 
                          onClick={() => { setShowAddReviewForm(false); setReviewSuccess(null); }}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {reviewSuccess ? (
                        <div className="bg-emerald-50 border-2 border-emerald-500/30 text-emerald-800 p-5 rounded-xl flex items-start gap-3 shadow-inner">
                          <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-sm">{language === "ar" ? "تم نشر تقييمك بنجاح!" : "Review Published Successfully!"}</h4>
                            <p className="text-xs leading-relaxed font-semibold opacity-90">{reviewSuccess}</p>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmissionReview} className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Name input */}
                            <div className="space-y-2">
                              <label className="block text-xs font-black text-[#4A2F13] uppercase tracking-wider">
                                {language === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-qamariyah-red">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder={language === "ar" ? "أدخل اسمك ليظهر على تقييمك..." : "Enter your name..."}
                                disabled={!!loyaltyProfile}
                                className="w-full bg-[#FCFAF7] border-2 border-[#EADFC9] focus:border-qamariyah-amber focus:ring-0 rounded-xl px-4 py-3 text-sm text-[#4A2F13] font-bold disabled:opacity-75 disabled:bg-gray-100"
                              />
                              {loyaltyProfile && (
                                <span className="text-[10px] text-qamariyah-green font-bold block">
                                  {language === "ar" 
                                    ? "✓ تم تسجيل الاسم تلقائياً من حساب الولاء (تقييم موثق)"
                                    : "✓ Name autofilled from your Loyalty Profile (Verified Badge)"}
                                </span>
                              )}
                            </div>

                            {/* Honey Product Selector */}
                            <div className="space-y-2">
                              <label className="block text-xs font-black text-[#4A2F13] uppercase tracking-wider">
                                {language === "ar" ? "الصنف الذي جربته (اختياري)" : "Product Sourced (Optional)"}
                              </label>
                              <select
                                value={reviewProductId}
                                onChange={(e) => setReviewProductId(e.target.value)}
                                className="w-full bg-[#FCFAF7] border-2 border-[#EADFC9] focus:border-qamariyah-amber focus:ring-0 rounded-xl px-4 py-3 text-sm text-[#4A2F13] font-bold cursor-pointer"
                              >
                                <option value="">
                                  {language === "ar" ? "-- اختر صنف العسل --" : "-- Choose Honey Variety --"}
                                </option>
                                <option value="sidr-usaimi">
                                  {language === "ar" ? "عسل سدر عصيمي فاخر" : "Premium Sidr Usaimi Honey"}
                                </option>
                                <option value="sidr-doani">
                                  {language === "ar" ? "عسل سدر دوعني" : "Sidr Do'ani Honey"}
                                </option>
                                <option value="sumar-taiz">
                                  {language === "ar" ? "عسل سمر (الطلح)" : "Yemeni Sumar Honey"}
                                </option>
                                <option value="marai-yemeni">
                                  {language === "ar" ? "عسل مراعي يمني" : "Yemeni Mara'i Honey"}
                                </option>
                                <option value="dumalwah-immunity">
                                  {language === "ar" ? "خلطة المناعة والنشاط الملكية" : "Royal Immunity & Vitality Blend"}
                                </option>
                                <option value="yemeni-propolis">
                                  {language === "ar" ? "عكبر يمني جبلي" : "Yemeni Bee Propolis"}
                                </option>
                              </select>
                            </div>
                          </div>

                          {/* Star Rating Selectors */}
                          <div className="space-y-2">
                            <label className="block text-xs font-black text-[#4A2F13] uppercase tracking-wider">
                              {language === "ar" ? "تقييمك بالنجوم" : "Your Rating"} <span className="text-qamariyah-red">*</span>
                            </label>
                            <div className="flex items-center gap-2 bg-[#FCFAF7] border-2 border-[#EADFC9] rounded-xl px-4 py-3.5 w-full md:w-fit">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  className="transition transform hover:scale-125 focus:outline-none"
                                >
                                  <Star
                                    className={`w-7 h-7 cursor-pointer ${
                                      star <= reviewRating
                                        ? "text-qamariyah-amber fill-qamariyah-amber"
                                        : "text-gray-300 hover:text-qamariyah-amber/75"
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="text-xs font-extrabold text-[#4A2F13]/70 ml-2 font-mono">
                                {reviewRating} / 5
                              </span>
                            </div>
                          </div>

                          {/* Review comment Textarea */}
                          <div className="space-y-2">
                            <label className="block text-xs font-black text-[#4A2F13] uppercase tracking-wider">
                              {language === "ar" ? "رأيك بالتفصيل" : "Your Review Description"} <span className="text-qamariyah-red">*</span>
                            </label>
                            <textarea
                              required
                              rows={4}
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder={
                                language === "ar"
                                  ? "اكتب تجربتك مع طعم العسل، فوائده العلاجية، التغليف، أو جودة الخدمة..."
                                  : "How was the honey taste, its therapeutic impact, packaging, or customer service experience?..."
                              }
                              className="w-full bg-[#FCFAF7] border-2 border-[#EADFC9] focus:border-qamariyah-amber focus:ring-0 rounded-xl px-4 py-3 text-sm text-[#4A2F13] font-bold placeholder-gray-400"
                            ></textarea>
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <button
                              type="submit"
                              className="bg-gradient-to-r from-qamariyah-amber to-qamariyah-red hover:from-qamariyah-red hover:to-qamariyah-amber text-white font-extrabold font-sans text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                              {language === "ar" ? "نشر التقييم" : "Post Review"}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setShowAddReviewForm(false); setReviewSuccess(null); }}
                              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold font-sans text-sm px-6 py-3.5 rounded-xl transition cursor-pointer"
                            >
                              {language === "ar" ? "إلغاء" : "Cancel"}
                            </button>
                          </div>
                        </form>
                      )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reviews List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="customer-reviews-grid-list">
                    {reviews.map((rev) => {
                      const isLiked = !!sessionStorage.getItem(`liked_${rev.id}`);
                      
                      return (
                        <motion.div 
                          key={rev.id} 
                          initial={{ opacity: 0, scale: 0.96 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: "-40px" }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className="bg-[#FFFFFF] border border-[#EADFC9]/50 hover:border-[#EADFC9] rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            {/* User Header */}
                            <div className="flex items-center gap-3 justify-between">
                              <div className="flex items-center gap-3">
                                {/* Letter Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-qamariyah-amber/10 to-qamariyah-red/10 border border-[#EADFC9] flex items-center justify-center text-[#4A2F13] font-black text-sm">
                                  {rev.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-sm text-[#4A2F13] font-sans">
                                    {rev.name}
                                  </h4>
                                  <span className="text-[10px] text-gray-400 font-mono font-bold block">
                                    {rev.date}
                                  </span>
                                </div>
                              </div>

                              {/* Verified Buyer Badge */}
                              {rev.isVerified && (
                                <div className="flex items-center gap-1 bg-emerald-50 text-qamariyah-green border border-qamariyah-green/20 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase">
                                  <Check className="w-3 h-3" />
                                  <span>{language === "ar" ? "مشتري مؤكد" : "Verified"}</span>
                                </div>
                              )}
                            </div>

                            {/* Stars & Product Tag */}
                            <div className="flex flex-col gap-1.5 pt-0.5">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${s <= rev.rating ? "text-qamariyah-amber fill-qamariyah-amber" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              
                              {rev.productId && (
                                <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#4A2F13]/70 bg-gradient-to-r from-[#FCFAF7] to-[#FFFBF2] border border-[#EADFC9]/50 rounded-lg px-2 py-0.5 w-fit">
                                  <span className="opacity-60">{language === "ar" ? "اشترى:" : "Bought:"}</span>
                                  <span className="text-[#4A2F13]">
                                    {language === "ar" ? (rev.productNameAr || rev.productId) : (rev.productNameEn || rev.productId)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Review Content */}
                            <p className="text-xs md:text-sm text-[#4A2F13]/85 leading-relaxed font-medium">
                              {rev.text}
                            </p>
                          </div>

                          {/* Upvote & Social Actions Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
                            <span className="text-[10px] font-extrabold text-[#4A2F13]/55">
                              {language === "ar" ? "هل كان هذا مفيداً؟" : "Was this helpful?"}
                            </span>
                            
                            <button
                              onClick={() => handleLikeReview(rev.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                                isLiked 
                                  ? "bg-qamariyah-amber/15 text-qamariyah-amber border border-qamariyah-amber/30" 
                                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-[#4A2F13]"
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-qamariyah-amber/30 text-current" : ""}`} />
                              <span>{language === "ar" ? "مفيد" : "Helpful"}</span>
                              <span className="font-mono opacity-80">({rev.likes})</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                {/* --- SECTIONS OF PRODUCTS INTRO --- */}
                <section className="space-y-8" id="products-introduction-section">
                  <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-[#4A2F13] font-sans tracking-tight">
                      {language === "ar" ? "أصناف العسل الفاخرة المعتمدة" : "Our Certified Premium Varieties"}
                    </h2>
                    <p className="text-xs md:text-sm text-[#4A2F13]/70 leading-relaxed">
                      {language === "ar" 
                        ? "نقدم لكم تشكيلة فاخرة من العسل اليمني البري المستخلص بالطرق التقليدية لضمان أقصى تركيز للفوائد الدوائية والطعم الأصيل."
                        : "We offer you a select lineup of wild Yemeni honey extracted using ancient, ethical practices to guarantee medicinal purity and flavor."}
                    </p>
                  </div>

                  {/* Mini categories shortcut tiles (Vibrant Custom Hover Styling) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="categories-shortcut-grid">
                    {[
                      { id: "sidr", title: t.catSidr, icon: <ShieldCheck className="w-8 h-8" />, desc: language === "ar" ? "علاج المناعة والوهن" : "Immunity & vitality", hoverClass: "hover:border-qamariyah-purple hover:bg-qamariyah-purple/5 text-qamariyah-purple" },
                      { id: "sumar", title: t.catSumar, icon: <FlaskConical className="w-8 h-8" />, desc: language === "ar" ? "المعدة والقولون والأنيميا" : "Ulcer & iron-rich remedy", hoverClass: "hover:border-qamariyah-red hover:bg-qamariyah-red/5 text-qamariyah-red" },
                      { id: "marai", title: t.catMarai, icon: <Flower2 className="w-8 h-8" />, desc: language === "ar" ? "للتحلية اليومية العائلية" : "Daily sweetener", hoverClass: "hover:border-qamariyah-green hover:bg-qamariyah-green/5 text-qamariyah-green" },
                      { id: "blends", title: t.catBlends, icon: <Crown className="w-8 h-8" />, desc: language === "ar" ? "غذاء ملكات وجينسنج" : "Fresh royal mixes", hoverClass: "hover:border-qamariyah-blue hover:bg-qamariyah-blue/5 text-qamariyah-blue" }
                    ].map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setActiveTab("products"); }}
                        className={`bg-[#FFFFFF] border-2 border-[#EADFC9]/70 rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 shadow-xs hover:shadow-lg group flex flex-col items-center gap-2 ${cat.hoverClass}`}
                      >
                        <div className="filter drop-shadow group-hover:scale-115 transition duration-300">{cat.icon}</div>
                        <h4 className="font-extrabold text-sm text-[#4A2F13] group-hover:text-current font-sans transition duration-200">{cat.title}</h4>
                        <span className="text-[10px] text-[#4A2F13]/60 group-hover:text-current font-bold leading-none transition duration-200">{cat.desc}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* --- QUICK EXPLAINER FOR PROGRAM --- */}
                <section className="bg-gradient-to-r from-qamariyah-blue/10 via-qamariyah-purple/5 to-qamariyah-amber/10 border-2 border-qamariyah-purple/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between shadow-md" id="loyalty-teaser-section">
                  <div className="flex items-center gap-4 text-center md:text-right flex-col md:flex-row">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-qamariyah-purple to-qamariyah-blue border-2 border-white flex items-center justify-center text-white shadow-md shrink-0">
                      <Gift className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#4A2F13] text-base md:text-lg font-sans">
                        {language === "ar" ? "تسوّق واجمع نقاط الولاء الملكية!" : "Earn Royal Loyalty Points as You Shop!"}
                      </h4>
                      <p className="text-xs text-[#4A2F13]/80 font-bold">
                        {language === "ar" 
                          ? "اكسب نقطة واحدة عن كل دينار تنفقه. استبدل نقاطك بخصومات نقدية فورية تبدأ من ١ دينار وتصل لعشرات الدنانير!"
                          : "Earn 1 point for every 1 JOD spent. Exchange points for cash savings starting from 1 JOD to dozens of Dinars!"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("loyalty")}
                    className="bg-gradient-to-r from-qamariyah-purple to-qamariyah-blue hover:from-qamariyah-blue hover:to-qamariyah-purple text-white font-black font-sans text-xs px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer shrink-0"
                  >
                    {t.navLoyalty}
                  </button>
                </section>

              </motion.div>
            )}


            {/* ======================================= */}
            {/* --- CORE TAB 2: PRODUCTS CATALOGUE --- */}
            {/* ======================================= */}
            {activeTab === "products" && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-8"
                id="products-tab-container"
              >
                
                {/* Title */}
                <div className="space-y-1.5" id="products-tab-title">
                  <h1 className="text-2xl md:text-3.5xl font-black font-sans text-[#4A2F13]">
                    {t.navProducts}
                  </h1>
                  <p className="text-xs md:text-sm text-[#4A2F13]/70 max-w-3xl">
                    {language === "ar" 
                      ? "اختر من قائمتنا الممتازة من أجود أعسال اليمن المختارة بعناية. تصفح التفاصيل والأوزان والفوائد الطبية لكل علبة."
                      : "Browse our premium selection of lab-tested authentic Yemeni honey. Explore weights, detailed pricing, and health benefits."}
                  </p>
                </div>

                {/* Filters Row */}
                <div className="bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm" id="filters-row-bar">
                  
                  {/* Category select badges */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto" id="category-filter-container">
                    {[
                      { id: "all", name: t.catAll, activeClass: "bg-[#B58A30] text-white shadow-md" },
                      { id: "sidr", name: t.catSidr, activeClass: "bg-qamariyah-purple text-white shadow-md shadow-qamariyah-purple/20" },
                      { id: "sumar", name: t.catSumar, activeClass: "bg-qamariyah-red text-white shadow-md shadow-qamariyah-red/20" },
                      { id: "marai", name: t.catMarai, activeClass: "bg-qamariyah-green text-white shadow-md shadow-qamariyah-green/20" },
                      { id: "blends", name: t.catBlends, activeClass: "bg-qamariyah-blue text-white shadow-md shadow-qamariyah-blue/20" },
                      { id: "bee-products", name: t.catBeeProducts, activeClass: "bg-qamariyah-amber text-white shadow-md shadow-qamariyah-amber/20" }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${selectedCategory === cat.id ? cat.activeClass : "bg-[#FCFAF7] hover:bg-[#EADFC9]/50 text-[#4A2F13]/80 hover:text-current hover:border-current border border-[#EADFC9]"}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Search and Sort tools */}
                  <div className="flex gap-3 items-center w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#EADFC9]/40" id="search-sort-container">
                    
                    {/* Search box */}
                    <div className="relative flex-grow md:flex-grow-0 max-w-xs">
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-xl pl-3 pr-9 py-2 text-xs outline-none focus:border-[#B58A30] focus:bg-[#FFFFFF] text-[#4A2F13] placeholder-[#4A2F13]/40 transition"
                      />
                      <Search className={`w-4 h-4 text-[#B58A30]/70 absolute top-2.5 ${language === "ar" ? "left-3" : "right-3"}`} />
                    </div>

                    {/* Sorting dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[#FCFAF7] border border-[#EADFC9] rounded-xl px-2.5 py-2 text-xs text-[#4A2F13] outline-none focus:border-[#B58A30] transition cursor-pointer"
                    >
                      <option value="default">{t.sortDefault}</option>
                      <option value="priceLow">{t.sortPriceLow}</option>
                      <option value="priceHigh">{t.sortPriceHigh}</option>
                      <option value="rating">{t.sortRating}</option>
                    </select>

                  </div>

                </div>

                {/* Grid Output */}
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" id="products-catalog-grid">
                    {sortedProducts.map((prod) => {
                       const selectedSizeIdx = getSelectedSizeIndex(prod.id);
                       const currentSize = prod.sizes[selectedSizeIdx];
  
                       return (
                        <motion.div
                          key={prod.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -6, transition: { duration: 0.25 } }}
                          className={`rounded-2xl overflow-hidden flex flex-col group border border-[#EADFC9]/70 card-theme-${prod.category} hover:shadow-xl hover:shadow-qamariyah-amber/5 transition-shadow`}
                          id={`product-card-${prod.id}`}
                        >
                           {/* Image frame */}
                           <div className="relative aspect-[4/3] overflow-hidden bg-[#FCFAF7]">
                             <motion.img
                               src={prod.image}
                               alt={prod.nameEn}
                               referrerPolicy="no-referrer"
                               whileHover={{ scale: 1.06 }}
                               transition={{ duration: 0.4 }}
                               className="w-full h-full object-cover"
                             />
                             {/* Best seller ribbon */}
                             {prod.bestSeller && (
                               <span className="absolute top-3 right-3 bg-[#B58A30] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                                 {t.bestSellerBadge}
                               </span>
                             )}
                             {/* Honey Type tag */}
                             {prod.honeyType && (
                               <span className="absolute bottom-3 left-3 bg-[#FCFAF7]/90 backdrop-blur-xs text-[#B58A30] text-[10px] font-bold px-2 py-0.5 rounded border border-[#EADFC9]/40">
                                 {prod.honeyType}
                               </span>
                             )}
                           </div>
  
                           {/* Info Block */}
                           <div className="p-5 flex-grow flex flex-col gap-4">
                             
                             {/* Title & Tagline */}
                             <div className="space-y-1">
                               <div className="flex items-center justify-between gap-1.5 text-xs text-[#B58A30] font-bold w-full">
                                 <div className="flex items-center gap-1.5">
                                   <span className="flex items-center gap-0.5">
                                     <Star className="w-3.5 h-3.5 fill-[#B58A30] text-[#B58A30]" />
                                     <span className="font-mono font-bold mt-0.5">{prod.rating}</span>
                                   </span>
                                   <span className="text-[#EADFC9]">|</span>
                                   <span className="text-[#4A2F13]/60 font-mono font-medium">{prod.reviewsCount} {t.reviewsCountLabel}</span>
                                 </div>
                                 <button
                                   onClick={(e) => {
                                      e.stopPropagation();
                                      handleRateProduct(prod.id);
                                   }}
                                   className="text-[11.5px] text-[#B58A30] hover:text-qamariyah-red underline font-extrabold cursor-pointer transition-colors duration-200 flex items-center gap-1 shrink-0"
                                   title={language === "ar" ? "قيم هذا المنتج" : "Rate this product"}
                                 >
                                   <Edit3 className="w-3 h-3" />
                                   <span>{language === "ar" ? "قيم المنتج" : "Rate Product"}</span>
                                 </button>
                               </div>
                               <h3 className="font-extrabold text-base md:text-lg text-[#4A2F13] font-sans tracking-tight">
                                 {language === "ar" ? prod.nameAr : prod.nameEn}
                               </h3>
                               <p className="text-xs text-[#B58A30] italic font-medium leading-normal">
                                 {language === "ar" ? prod.taglineAr : prod.taglineEn}
                               </p>
                             </div>
  
                             {/* Short Description */}
                             <p className="text-xs text-[#4A2F13]/80 leading-relaxed">
                               {language === "ar" ? prod.descriptionAr.slice(0, 110) + "..." : prod.descriptionEn.slice(0, 110) + "..."}
                             </p>
  
                             {/* Sizes options block */}
                             <div className="space-y-1.5">
                               <span className="block text-[11px] font-bold text-[#4A2F13]/60 uppercase tracking-wider">{t.selectSizeLabel}</span>
                               <div className="flex flex-wrap gap-2 font-mono">
                                 {prod.sizes.map((size, sIdx) => (
                                   <button
                                     key={sIdx}
                                     onClick={() => handleSizeChange(prod.id, sIdx)}
                                     className={`px-2.5 py-1 text-xs border rounded-lg transition cursor-pointer ${selectedSizeIdx === sIdx ? "bg-[#B58A30]/10 border-[#B58A30] text-[#B58A30] font-bold" : "bg-[#FCFAF7] border-[#EADFC9]/70 hover:bg-[#FCFAF7] text-[#4A2F13]/80"}`}
                                   >
                                     {size.weight}
                                   </button>
                                 ))}
                               </div>
                             </div>
  
                             {/* Benefits bullets list */}
                             <div className="space-y-1.5 bg-[#FCFAF7] p-3 rounded-xl border border-[#EADFC9]/50">
                               <span className="block text-[11px] font-bold text-[#B58A30] uppercase tracking-wider">{t.benefitsLabel}</span>
                               <ul className="text-[11px] text-[#4A2F13]/70 space-y-1 pr-1 list-disc list-inside">
                                 {(language === "ar" ? prod.benefitsAr : prod.benefitsEn).map((ben, bIdx) => (
                                   <li key={bIdx} className="leading-relaxed">{ben}</li>
                                 ))}
                               </ul>
                             </div>
  
                             {/* Pricing & Add block */}
                             <div className="border-t border-[#EADFC9]/50 pt-4 mt-auto flex items-center justify-between">
                               <div className="text-right leading-none">
                                 {currentSize.originalPrice && (
                                   <span className="block text-[11px] text-[#4A2F13]/40 line-through font-mono mb-1">
                                     {currentSize.originalPrice} {language === "ar" ? "د.أ" : "JOD"}
                                   </span>
                                 )}
                                 <span className="font-mono font-black text-[#B58A30] text-lg md:text-xl">
                                   {currentSize.price} <span className="text-xs md:text-sm">{language === "ar" ? "د.أ" : "JOD"}</span>
                                 </span>
                               </div>
  
                               <button
                                 onClick={() => addToCart(prod)}
                                 className="bg-gradient-to-r from-[#B58A30] to-[#D8B157] hover:from-[#D8B157] hover:to-[#B58A30] text-white font-extrabold font-sans text-xs px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                               >
                                 {t.addToCartButton}
                               </button>
                             </div>
  
                             {/* Loyalty point estimation display */}
                             <div className="text-[10px] text-[#B58A30]/90 font-semibold bg-[#B58A30]/5 px-2.5 py-1 rounded border border-[#B58A30]/20 mt-1 leading-none">
                               {t.pointsReward.replace("{points}", Math.floor(currentSize.price * 1).toString())}
                             </div>
  
                           </div>
                         </motion.div>
                       );
                     })}
                   </div>
                 ) : (
                   <div className="bg-[#FFFFFF] border border-[#EADFC9]/75 rounded-2xl p-10 text-center text-[#4A2F13]/50 font-medium" id="no-products-found">
                     {language === "ar" ? "لم يتم العثور على أي منتج يطابق معايير البحث." : "No premium honey found matching search filters."}
                   </div>
                 )}

              </motion.div>
            )}


            {/* ======================================= */}
            {/* --- CORE TAB 3: LOYALTY PORTAL --- */}
            {/* ======================================= */}
            {activeTab === "loyalty" && (
              <motion.div
                key="loyalty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-10"
                id="loyalty-tab-container"
              >
                
                {/* Intro section */}
                <div className="text-center space-y-2 max-w-3xl mx-auto" id="loyalty-intro">
                   <h1 className="text-2xl md:text-4xl font-black font-sans text-[#4A2F13]">
                    {language === "ar" ? "بوابة العملاء ونقاط الولاء" : "Customer Portal & Loyalty"}
                  </h1>
                   <p className="text-xs md:text-sm text-[#4A2F13]/70">
                    {language === "ar" 
                      ? "قم بإدارة حسابك الفاخر، تتبع طلبياتك ومستوى التسليم، واستبدل نقاط ولائك بكوبونات خصم نقدية فورية."
                      : "Manage your premium profile, track delivery of orders, submit suggestions, and redeem loyalty points."}
                  </p>
                </div>

                {!loyaltyProfile ? (
                  /* --- CUSTOMER AUTHENTICATION FORMS --- */
                  <div className="max-w-md mx-auto bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-6 md:p-8 shadow-xl space-y-6" id="auth-portal-card">
                    
                    {/* Tabs header selector */}
                    <div className="flex border-b border-[#EADFC9]/40 pb-1 justify-center gap-6" id="auth-tabs">
                      <button
                        onClick={() => { setAuthTab("login"); setAuthError(null); }}
                        className={`pb-2.5 text-sm font-bold font-sans transition cursor-pointer ${authTab === "login" ? "text-[#B58A30] border-b-2 border-[#B58A30]" : "text-[#4A2F13]/50 hover:text-[#4A2F13]"}`}
                      >
                        {language === "ar" ? "تسجيل الدخول" : "Sign In"}
                      </button>
                      <button
                        onClick={() => { setAuthTab("register"); setAuthError(null); }}
                        className={`pb-2.5 text-sm font-bold font-sans transition cursor-pointer ${authTab === "register" ? "text-[#B58A30] border-b-2 border-[#B58A30]" : "text-[#4A2F13]/50 hover:text-[#4A2F13]"}`}
                      >
                        {language === "ar" ? "إنشاء حساب جديد" : "Create Account"}
                      </button>
                    </div>

                    {/* Auth error banner */}
                    {authError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2" id="auth-error-banner">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {authTab === "login" ? (
                      /* LOGIN FORM */
                      <form onSubmit={handleUserLogin} className="space-y-4" id="login-form-block">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "البريد الإلكتروني *" : "Email Address *"}</label>
                          <div className="relative">
                            <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2F13]/40" />
                            <input
                              type="email"
                              required
                              placeholder="you@example.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl pr-10 pl-3.5 py-3 text-sm outline-none text-[#4A2F13] transition text-right md:text-right"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "كلمة المرور *" : "Password *"}</label>
                          <div className="relative">
                            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2F13]/40" />
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl pr-10 pl-3.5 py-3 text-sm outline-none text-[#4A2F13] transition text-right md:text-right"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#B58A30] to-[#D8B157] hover:from-[#D8B157] hover:to-[#B58A30] text-white font-extrabold font-sans py-3 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5 text-sm"
                        >
                          <User className="w-4 h-4" />
                          <span>{language === "ar" ? "دخول إلى حسابي" : "Sign In to My Account"}</span>
                        </button>

                        <div className="text-center pt-2 text-[11px] text-[#4A2F13]/50">
                          {language === "ar" ? "البريد التجريبي للتجربة: abdullah@qrizq.com (كلمة المرور: user123)" : "Demo user: abdullah@qrizq.com (pass: user123)"}
                        </div>
                      </form>
                    ) : (
                      /* REGISTRATION FORM */
                      <form onSubmit={handleUserRegister} className="space-y-4" id="register-form-block">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "الاسم الكامل *" : "Full Name *"}</label>
                          <input
                            type="text"
                            required
                            placeholder={language === "ar" ? "عبدالله الحربي" : "Abdullah Al-Harbi"}
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] transition"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "رقم الجوال *" : "Phone Number *"}</label>
                          <input
                            type="tel"
                            required
                            placeholder="079xxxxxxxx"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] font-mono transition"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "البريد الإلكتروني *" : "Email Address *"}</label>
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] transition"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "كلمة المرور *" : "Password *"}</label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] transition"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "تأكيد كلمة المرور *" : "Confirm Password *"}</label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl px-3.5 py-2.5 text-sm outline-none text-[#4A2F13] transition"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#B58A30] to-[#D8B157] hover:from-[#D8B157] hover:to-[#B58A30] text-white font-extrabold font-sans py-3 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{language === "ar" ? "إنشاء حساب جديد" : "Sign Up Now"}</span>
                        </button>
                      </form>
                    )}

                    {/* Member Perk Banner */}
                    <div className="bg-[#B58A30]/5 p-4 rounded-xl border border-[#B58A30]/20 text-center text-xs space-y-1 text-[#B58A30] font-semibold" id="auth-perk-banner">
                      <span>✨ {language === "ar" ? "احصل على ٥٠ نقطة ولاء ترحيبية فورية عند التسجيل!" : "Instantly receive 50 Loyalty points upon registration!"}</span>
                    </div>

                    {/* Guest Lookup block */}
                    <div className="border-t border-[#EADFC9]/50 pt-5 space-y-3">
                      <span className="block text-xs font-bold text-[#4A2F13]/70 text-center">{language === "ar" ? "أو تحقق من نقاطك كزائر باستخدام هاتفك" : "Or check your points balance as a guest by phone"}</span>
                      <div className="flex gap-2.5">
                        <input
                          type="tel"
                          placeholder={t.phonePlaceholder}
                          value={loyaltyPhone}
                          onChange={(e) => setLoyaltyPhone(e.target.value)}
                          className="flex-grow bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl px-3 py-2 text-xs outline-none text-[#4A2F13] placeholder-[#4A2F13]/40 font-mono"
                        />
                        <button
                          onClick={handleCheckLoyalty}
                          className="bg-[#FCFAF7] hover:bg-[#EADFC9]/40 border border-[#EADFC9] text-[#4A2F13] font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                        >
                          {language === "ar" ? "تحقق" : "Check"}
                        </button>
                      </div>
                      {loyaltyMessage && (
                        <div className={`p-3 rounded-xl text-xs border font-medium ${
                          loyaltyMessage.type === "success" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                            : loyaltyMessage.type === "error"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-[#FCFAF7] border-[#EADFC9] text-[#4A2F13] space-y-2"
                        }`}>
                          <p>{loyaltyMessage.text}</p>
                          {loyaltyMessage.type === "register" && (
                            <button
                              onClick={handleRegisterLoyalty}
                              className="w-full bg-[#B58A30] hover:bg-[#D8B157] text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg shadow transition cursor-pointer"
                            >
                              {t.loyaltyRegisterBtn}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* --- CUSTOMER DASHBOARD (LOGGED IN) --- */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="customer-dashboard-view">
                    
                    {/* LEFT COLUMN: Profile info, Loyalty & Support submissions (Lg: 7) */}
                    <div className="lg:col-span-7 space-y-8">
                      
                      {/* Active profile dashboard details if signed in */}
                      <div className="bg-gradient-to-br from-[#06241C] via-[#0E4B3E] to-[#162E28] border-2 border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 transform animate-in fade-in duration-500 text-white relative overflow-hidden" id="loyalty-royal-card">
                        {/* Interactive backdrop patterns mimicking Sana'a glass qamariyahs */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-qamariyah-blue/20 via-qamariyah-purple/25 to-transparent"></div>
                        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-qamariyah-amber/15 blur-3xl"></div>
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-qamariyah-purple/15 blur-3xl"></div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/20 pb-6 relative z-10">
                          <div className="text-center md:text-right space-y-1">
                            <span className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-qamariyah-amber-light text-[10px] px-3 py-1 rounded-full font-black tracking-widest">
                              <Star className="w-3 h-3 text-qamariyah-amber-light fill-qamariyah-amber-light" />
                              AL-DUMALWAH CASTLE ROYAL MEMBER
                            </span>
                            <h3 className="text-2xl font-black font-sans tracking-tight mt-2 text-white drop-shadow-md">
                              {translations[language].loyaltyWelcome.replace("{name}", loyaltyProfile.username)}
                            </h3>
                            <div className="text-xs font-mono text-white/70 block space-y-0.5">
                              <span>📱 {loyaltyProfile.phone}</span>
                              {loyaltyProfile.email && <span className="block">✉️ {loyaltyProfile.email}</span>}
                            </div>
                          </div>
                          
                          <div className="text-center md:text-left bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl min-w-[160px] shadow-inner">
                            <span className="block text-[10px] text-white/80 font-black uppercase tracking-wider">{t.loyaltyBalanceText}</span>
                            <span className="font-mono font-black text-qamariyah-amber-light text-3xl md:text-4xl block mt-1 drop-shadow-[0_2px_8px_rgba(253,186,116,0.4)]">
                              {loyaltyProfile.points} <span className="text-sm font-black">{language === "ar" ? "نقطة" : "Pts"}</span>
                            </span>
                          </div>
                        </div>

                        {/* Equivalency calculator and Voucher generator */}
                        <div className="space-y-4 relative z-10">
                          <h4 className="font-extrabold text-sm text-white font-sans flex items-center gap-1.5 drop-shadow-xs">
                            <Gift className="w-4.5 h-4.5 text-qamariyah-amber-light" />
                            {t.loyaltyRedeemTitle}
                          </h4>
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 justify-between">
                            <div className="text-center md:text-right space-y-1">
                              <span className="text-xs text-white/80 block">{t.loyaltyEquivalentText}</span>
                              <span className="font-mono font-black text-qamariyah-amber-light text-xl drop-shadow-sm">
                                {Math.floor(loyaltyProfile.points / 10) * 1} {language === "ar" ? "دينار خصم" : "JOD Discount"}
                              </span>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                              <select
                                value={redeemPointsAmount}
                                onChange={(e) => setRedeemPointsAmount(Number(e.target.value))}
                                className="bg-stone-900 border-2 border-stone-700 rounded-lg px-2.5 py-2 text-xs font-mono text-white outline-none focus:border-qamariyah-amber cursor-pointer"
                              >
                                {Array.from({ length: Math.floor(loyaltyProfile.points / 10) }, (_, i) => (i + 1) * 10).map((val) => (
                                  <option key={val} value={val} className="text-stone-900">{val} {language === "ar" ? "نقطة" : "Pts"} (= {val / 10 * 1} JOD)</option>
                                ))}
                              </select>
                              <button
                                onClick={handleRedeemPoints}
                                disabled={loyaltyProfile.points < 10}
                                className="bg-gradient-to-r from-qamariyah-amber to-amber-500 hover:from-amber-500 hover:to-qamariyah-amber text-white font-black text-xs px-4 py-2 rounded-lg disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-md"
                              >
                                {t.loyaltyRedeemBtn}
                              </button>
                            </div>
                          </div>
                          <span className="block text-[11px] text-white/70 text-center md:text-right leading-none font-bold italic">
                            {t.loyaltyRateInfo}
                          </span>
                        </div>

                        {/* Transaction history logs */}
                        <div className="space-y-3 relative z-10">
                          <h4 className="font-extrabold text-sm text-white font-sans">{t.loyaltyHistoryTitle}</h4>
                          <div className="border border-white/10 rounded-xl overflow-hidden text-xs shadow-md">
                            <table className="w-full text-right border-collapse bg-white">
                              <thead>
                                <tr className="bg-[#FCFAF7] font-bold border-b border-[#EADFC9]/40 text-[#4A2F13]/70">
                                  <th className="p-3 font-sans">{t.loyaltyHistoryDate}</th>
                                  <th className="p-3 font-sans">{t.loyaltyHistoryAction}</th>
                                  <th className="p-3 font-sans text-left">{t.loyaltyHistoryPoints}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#EADFC9]/30 font-medium text-[#4A2F13]/80">
                                {loyaltyProfile.history.map((log) => (
                                  <tr key={log.id} className="hover:bg-[#FCFAF7] transition">
                                    <td className="p-3 font-mono">{log.date}</td>
                                    <td className="p-3 font-sans">{language === "ar" ? log.actionAr : log.actionEn}</td>
                                    <td className={`p-3 text-left font-mono font-bold ${log.points > 0 ? "text-emerald-600" : "text-[#B58A30]"}`}>
                                      {log.points > 0 ? `+${log.points}` : log.points}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>

                      {/* CUSTOMER COMPLAINTS & SUGGESTIONS */}
                      <div className="bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-6 shadow-sm space-y-6" id="dashboard-support-center">
                        <h3 className="text-base font-bold text-[#4A2F13] font-sans flex items-center gap-1.5 border-b border-[#EADFC9]/40 pb-3">
                          <MessageSquare className="w-5 h-5 text-[#B58A30]" />
                          {language === "ar" ? "قسم المقترحات والشكاوى" : "Suggestions & Complaints Portal"}
                        </h3>

                        {feedbackSuccess && (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span>{feedbackSuccess}</span>
                          </div>
                        )}

                        <form onSubmit={handleSubmissionFeedback} className="space-y-4" id="ticket-submission-form">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "نوع الرسالة *" : "Ticket Type *"}</label>
                              <select
                                value={feedbackType}
                                onChange={(e) => setFeedbackType(e.target.value as "complaint" | "suggestion")}
                                className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-lg px-3 py-2.5 text-sm text-[#4A2F13] outline-none cursor-pointer"
                              >
                                <option value="complaint">{language === "ar" ? "تقديم شكوى (Complaint)" : "Submit Complaint"}</option>
                                <option value="suggestion">{language === "ar" ? "تقديم اقتراح (Suggestion)" : "Submit Suggestion"}</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "الاسم *" : "Your Name *"}</label>
                              <input
                                type="text"
                                disabled
                                value={feedbackName}
                                className="w-full bg-gray-100 border border-[#EADFC9] rounded-lg px-3 py-2.5 text-sm text-gray-500 outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#4A2F13]/60 uppercase tracking-wider">{language === "ar" ? "نص الرسالة أو تفاصيل الشكوى والاقتراح *" : "Message details *"}</label>
                            <textarea
                              required
                              rows={3}
                              placeholder={language === "ar" ? "يرجى كتابة رسالتكم بالتفصيل هنا..." : "Write your message in detail here..."}
                              value={feedbackText}
                              onChange={(e) => { setFeedbackText(e.target.value); setFeedbackSuccess(null); }}
                              className="w-full bg-[#FCFAF7] border border-[#EADFC9] focus:border-[#B58A30] rounded-xl px-3.5 py-3 text-sm outline-none text-[#4A2F13]"
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            className="bg-[#B58A30] hover:bg-[#D8B157] text-white font-bold text-xs py-2.5 px-6 rounded-xl transition cursor-pointer"
                          >
                            {language === "ar" ? "إرسال المعاملة" : "Submit Ticket"}
                          </button>
                        </form>

                        {/* Customer Ticket History list with responses */}
                        <div className="space-y-3 pt-3 border-t border-[#EADFC9]/30">
                          <h4 className="font-extrabold text-sm text-[#4A2F13]">{language === "ar" ? "تذاكري السابقة ومتابعة الحلول" : "My Submission History"}</h4>
                          
                          {feedbackTickets.filter(t => t.senderEmail.toLowerCase() === loyaltyProfile.email?.toLowerCase()).length === 0 ? (
                            <p className="text-xs text-[#4A2F13]/40 italic">{language === "ar" ? "لم تقم بتقديم أي شكاوى أو اقتراحات بعد." : "You have not submitted any tickets yet."}</p>
                          ) : (
                            <div className="space-y-3">
                              {feedbackTickets
                                .filter(t => t.senderEmail.toLowerCase() === loyaltyProfile.email?.toLowerCase())
                                .map((ticket) => (
                                  <div key={ticket.id} className="border border-[#EADFC9]/60 rounded-xl p-4 bg-[#FCFAF7] space-y-2 text-xs" id={`user-ticket-${ticket.id}`}>
                                    <div className="flex justify-between items-center">
                                      <span className="font-mono font-bold text-[#B58A30]">{ticket.id}</span>
                                      <span className="font-mono text-gray-400">{ticket.date}</span>
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        ticket.status === "pending" 
                                          ? "bg-yellow-100 text-yellow-800" 
                                          : ticket.status === "replied" 
                                          ? "bg-[#B58A30]/10 text-[#B58A30]" 
                                          : "bg-emerald-100 text-emerald-800"
                                      }`}>
                                        {ticket.status === "pending" 
                                          ? (language === "ar" ? "قيد الانتظار" : "Pending")
                                          : ticket.status === "replied"
                                          ? (language === "ar" ? "تم الرد" : "Replied")
                                          : (language === "ar" ? "تم الحل" : "Resolved")
                                        }
                                      </span>
                                    </div>
                                    <div className="text-[#4A2F13] font-medium leading-relaxed">
                                      <span className="font-bold block text-[#B58A30] mb-0.5">
                                        {ticket.type === "complaint" ? (language === "ar" ? "⚠️ شكوى:" : "⚠️ Complaint:") : (language === "ar" ? "💡 اقتراح:" : "💡 Suggestion:")}
                                      </span>
                                      {ticket.text}
                                    </div>
                                    {ticket.replyText && (
                                      <div className="mt-2.5 p-3 rounded-lg bg-white border border-[#EADFC9]/50 space-y-1 text-right md:text-right">
                                        <span className="font-black text-[10px] text-[#B58A30] block">👑 {language === "ar" ? "رد المدير زكريى السلام (إدارة قلعة الدملؤة):" : "Reply from Manager Zakaria Al-Salam (Al-Dumalwah Admin):"}</span>
                                        <p className="text-gray-700 leading-relaxed italic">{ticket.replyText}</p>
                                        <span className="block text-[9px] text-gray-400 font-mono text-left">{ticket.replyDate}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                      </div>

                    </div>

                    {/* RIGHT COLUMN: Order history & Logout (Lg: 5) */}
                    <div className="lg:col-span-5 space-y-6 text-right md:text-right">
                      
                      {/* ORDER HISTORY & DISPATCH LIST */}
                      <div className="bg-[#FFFFFF] border border-[#EADFC9]/70 rounded-2xl p-6 shadow-sm space-y-5" id="dashboard-orders-list">
                        <h3 className="text-base font-bold text-[#4A2F13] font-sans flex items-center gap-1.5 border-b border-[#EADFC9]/40 pb-3">
                          <FileText className="w-5 h-5 text-[#B58A30]" />
                          {language === "ar" ? "سجل طلباتي ومتابعة الشحن" : "Order History & Shipping Status"}
                        </h3>

                        {orders.filter(o => o.shippingDetails.email.toLowerCase() === loyaltyProfile.email?.toLowerCase()).length === 0 ? (
                          <div className="text-center py-10 space-y-3">
                            <ShoppingBag className="w-10 h-10 mx-auto text-[#4A2F13]/20" />
                            <p className="text-xs text-[#4A2F13]/50 font-medium italic">{language === "ar" ? "لم تقم بإنشاء أي طلبات حتى الآن." : "You have not placed any orders yet."}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {orders
                              .filter(o => o.shippingDetails.email.toLowerCase() === loyaltyProfile.email?.toLowerCase())
                              .map((order) => (
                                <div key={order.id} className="border border-[#EADFC9]/50 rounded-xl p-4 bg-[#FCFAF7] space-y-3 text-xs" id={`user-order-${order.id}`}>
                                  
                                  {/* Top Row: Order Details */}
                                  <div className="flex justify-between items-center pb-2.5 border-b border-[#EADFC9]/30">
                                    <div className="text-right">
                                      <span className="font-mono font-black text-sm text-[#B58A30] block">{order.id}</span>
                                      <span className="text-[10px] text-gray-400 font-mono">{order.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {/* Colored circle status indicators */}
                                      <span className={`w-2.5 h-2.5 rounded-full ${
                                        order.status === "pending" ? "bg-yellow-500" :
                                        order.status === "processing" ? "bg-blue-500" :
                                        order.status === "shipped" ? "bg-orange-500" : "bg-emerald-500"
                                      }`}></span>
                                      <span className="font-bold text-[#4A2F13]">
                                        {order.status === "pending" ? (language === "ar" ? "قيد الانتظار" : "Pending") :
                                         order.status === "processing" ? (language === "ar" ? "جاري التجهيز" : "Processing") :
                                         order.status === "shipped" ? (language === "ar" ? "تم الشحن" : "Shipped") :
                                         (language === "ar" ? "تم التوصيل" : "Delivered")}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Sub-item list breakdown */}
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center text-gray-700">
                                        <span>
                                          {language === "ar" ? item.product.nameAr : item.product.nameEn} 
                                          <span className="text-[10px] text-gray-400 ml-1 font-mono">({item.selectedSize.weight})</span>
                                        </span>
                                        <span className="font-mono font-bold">x{item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Shipping and Total summary */}
                                  <div className="bg-[#FFFFFF] border border-[#EADFC9]/40 p-2.5 rounded-lg flex justify-between items-center text-[11px] font-bold mt-2 text-[#4A2F13]/80">
                                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                                      🚚 {order.shippingMethod.toUpperCase()}
                                    </span>
                                    <span>
                                      {language === "ar" ? "الإجمالي:" : "Total:"} <span className="font-mono font-black text-sm text-[#B58A30]">{order.total} JOD</span>
                                    </span>
                                  </div>

                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* SIGN OUT BOX */}
                      <button
                        onClick={handleUserLogout}
                        className="w-full bg-[#FCFAF7] hover:bg-red-50 border border-red-200 text-red-600 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        id="logout-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{language === "ar" ? "تسجيل خروج" : "Sign Out from Profile"}</span>
                      </button>

                    </div>

                  </div>
                )}

              </motion.div>
            )}


            {/* ======================================= */}
            {/* --- CORE TAB: SECURE SITE ADMIN PANEL --- */}
            {/* ======================================= */}
            {activeTab === "admin" && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-10"
                id="admin-panel-container"
              >
                
                {/* Title & Badge */}
                <div className="text-center space-y-2 max-w-3xl mx-auto" id="admin-header">
                  <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-1 rounded-full font-bold tracking-widest uppercase">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    SECURE SITE ADMINISTRATOR CONTROL CENTER
                  </span>
                  <h1 className="text-2xl md:text-4xl font-black font-sans text-[#4A2F13]">
                    {language === "ar" ? "لوحة التحكم وإدارة المتجر" : "Al-Dumalwah Admin Control Center"}
                  </h1>
                </div>

                {!isAdminLoggedIn ? (
                  /* --- ADMIN LOGIN PANEL --- */
                  <div className="max-w-md mx-auto bg-stone-900 border-2 border-[#B58A30]/50 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 text-[#FCFAF7]">
                    <div className="text-center space-y-1.5">
                      <Lock className="w-12 h-12 text-[#B58A30] mx-auto" />
                      <h3 className="text-lg font-black font-sans text-white">{language === "ar" ? "تسجيل دخول الإدارة" : "Administrator Sign In"}</h3>
                      <p className="text-xs text-stone-400">{language === "ar" ? "يرجى إدخال بيانات الاعتماد المشفرة للوصول" : "Enter authorized credentials to proceed"}</p>
                    </div>

                    {adminAuthError && (
                      <div className="bg-red-950/50 border border-red-800 text-red-400 p-3 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{adminAuthError}</span>
                      </div>
                    )}

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setAdminAuthError(null);
                      if (adminEmail.trim().toLowerCase() === "admin@qrizq.com" && adminPassword === "admin123") {
                        setIsAdminLoggedIn(true);
                        localStorage.setItem("qd_admin_logged", "true");
                        setAdminPassword("");
                      } else {
                        setAdminAuthError(language === "ar" ? "بيانات الدخول غير صحيحة!" : "Invalid admin username or password!");
                      }
                    }} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{language === "ar" ? "البريد الإلكتروني للإدارة" : "Admin Email"}</label>
                        <input
                          type="email"
                          required
                          placeholder="admin@qrizq.com"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full bg-stone-800 border border-stone-700 focus:border-[#B58A30] rounded-xl px-3.5 py-3 text-sm text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{language === "ar" ? "كلمة المرور السرية" : "Admin Password"}</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-stone-800 border border-stone-700 focus:border-[#B58A30] rounded-xl px-3.5 py-3 text-sm text-white outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#B58A30] to-amber-500 hover:from-amber-500 hover:to-[#B58A30] text-white font-black py-3 rounded-xl shadow transition duration-300 cursor-pointer"
                      >
                        {language === "ar" ? "فتح اللوحة الأمنية" : "Unlock Secure Control"}
                      </button>
                    </form>

                    <div className="bg-stone-800/40 p-3.5 rounded-xl border border-stone-800 text-center text-[11px] space-y-0.5 text-stone-400 font-medium">
                      <p className="font-bold text-stone-300">{language === "ar" ? "بيانات الدخول التجريبية للإدارة:" : "Default Admin Credentials:"}</p>
                      <p className="font-mono mt-1 text-[#B58A30]">Email: admin@qrizq.com</p>
                      <p className="font-mono text-[#B58A30]">Password: admin123</p>
                    </div>
                  </div>
                ) : (
                  /* --- FULL ADMIN PANEL DASHBOARD --- */
                  <div className="space-y-8" id="admin-active-dashboard">
                    
                    {/* Welcome Banner for the Admin */}
                    <div className="bg-stone-900 border border-[#B58A30]/40 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[#FCFAF7] shadow-lg animate-in fade-in duration-300">
                      <div className="text-center sm:text-right">
                        <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-[#B58A30] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                          {language === "ar" ? "المدير العام للمتجر" : "Store Director General"}
                        </span>
                        <h2 className="text-lg md:text-xl font-black font-sans text-white">
                          {language === "ar" ? "أهلاً بك يا زكريى السلام" : "Welcome back, Director Zakaria Al-Salam"}
                        </h2>
                        <p className="text-xs text-stone-400 mt-1">
                          {language === "ar" ? "لوحة الإدارة والمتابعة الأمنية لمتجر قلعة الدملؤة للعسل اليمني" : "Administrative & secure control panel for Al-Dumalwah Castle Honey"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 bg-stone-800/60 px-4 py-2 rounded-xl border border-stone-800 shrink-0">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
                        <span className="text-[11px] font-mono font-bold text-stone-300 tracking-wider">
                          {language === "ar" ? "النظام نشط ومحمي" : "SYSTEM SECURE & LIVE"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Admin Navigation Tabs bar */}
                    <div className="flex flex-wrap border-b border-[#EADFC9]/40 gap-4" id="admin-tabs-row">
                      {[
                        { id: "products", label: language === "ar" ? "📦 المنتجات" : "Products" },
                        { id: "users", label: language === "ar" ? "👥 دليل العملاء" : "Customers" },
                        { id: "orders", label: language === "ar" ? "🚚 الطلبات والشحن" : "Orders" },
                        { id: "tickets", label: language === "ar" ? "💬 الشكاوى والاقتراحات" : "Tickets" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setAdminActiveTab(t.id)}
                          className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold font-sans transition cursor-pointer ${
                            adminActiveTab === t.id 
                              ? "bg-[#B58A30] text-white shadow-md" 
                              : "bg-white hover:bg-[#F5EFE4] border border-[#EADFC9]/40 text-[#4A2F13]"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}

                      {/* Log out administrator */}
                      <button
                        onClick={() => {
                          setIsAdminLoggedIn(false);
                          localStorage.removeItem("qd_admin_logged");
                        }}
                        className="mr-auto px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold font-sans bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer"
                      >
                        🚪 {language === "ar" ? "خروج الإدارة" : "Sign Out"}
                      </button>
                    </div>

                    {/* ======================================= */}
                    {/* --- ADMIN SUBTAB 1: PRODUCTS MANAGER --- */}
                    {/* ======================================= */}
                    {adminActiveTab === "products" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                          <h3 className="text-lg font-black text-[#4A2F13]">{language === "ar" ? "إدارة منتجات العسل الفاخر" : "Premium Products Catalog"}</h3>
                          <button
                            onClick={() => {
                              setEditingProductId(null);
                              setNewProductForm({
                                category: "sidr",
                                nameAr: "",
                                nameEn: "",
                                taglineAr: "",
                                taglineEn: "",
                                descriptionAr: "",
                                descriptionEn: "",
                                image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
                                rating: 4.8,
                                reviewsCount: 30,
                                sizes: [
                                  { weight: "250g", price: 20 },
                                  { weight: "500g", price: 35 },
                                  { weight: "1kg", price: 65 }
                                ]
                              });
                              setShowAddProductModal(true);
                            }}
                            className="bg-[#B58A30] hover:bg-[#D8B157] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{language === "ar" ? "إضافة منتج جديد" : "Add New Honey Product"}</span>
                          </button>
                        </div>

                        {/* ADD/EDIT PRODUCT MODAL FORM OVERLAY */}
                        {showAddProductModal && (
                          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                            <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 text-right">
                              <div className="flex justify-between items-center border-b pb-3 border-[#EADFC9]/50">
                                <button type="button" onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-stone-700 text-lg font-bold font-mono">✕</button>
                                <h4 className="text-base font-black text-[#4A2F13]">
                                  {editingProductId ? (language === "ar" ? "تعديل تفاصيل المنتج" : "Edit Product Details") : (language === "ar" ? "إدخال منتج جديد بالكامل" : "Create New Honey Catalog Entry")}
                                </h4>
                              </div>

                              <form onSubmit={(e) => {
                                e.preventDefault();
                                if (editingProductId) {
                                  // Update existing
                                  setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...newProductForm } : p));
                                } else {
                                  // Create new
                                  const generatedId = `custom-${Date.now()}`;
                                  const freshProduct: Product = {
                                    id: generatedId,
                                    ...newProductForm
                                  };
                                  setProducts(prev => [freshProduct, ...prev]);
                                }
                                setShowAddProductModal(false);
                                alert(language === "ar" ? "تم حفظ التغييرات والمنتجات بنجاح!" : "Catalog products database updated successfully!");
                              }} className="space-y-4 text-xs font-semibold text-[#4A2F13]/80">
                                
                                <div className="grid grid-cols-2 gap-4 text-right">
                                  <div className="space-y-1 text-right">
                                    <label>{language === "ar" ? "الاسم بالعربية *" : "Name (Arabic) *"}</label>
                                    <input
                                      type="text" required
                                      value={newProductForm.nameAr}
                                      onChange={(e) => setNewProductForm(p => ({ ...p, nameAr: e.target.value }))}
                                      className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-2 text-xs"
                                    />
                                  </div>
                                  <div className="space-y-1 text-right">
                                    <label>{language === "ar" ? "الاسم بالإنجليزية *" : "Name (English) *"}</label>
                                    <input
                                      type="text" required
                                      value={newProductForm.nameEn}
                                      onChange={(e) => setNewProductForm(p => ({ ...p, nameEn: e.target.value }))}
                                      className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-2 text-xs font-sans"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-right">
                                  <div className="space-y-1 text-right">
                                    <label>{language === "ar" ? "شعار تسويقي بالعربية *" : "Tagline (Arabic) *"}</label>
                                    <input
                                      type="text" required
                                      value={newProductForm.taglineAr}
                                      onChange={(e) => setNewProductForm(p => ({ ...p, taglineAr: e.target.value }))}
                                      className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-2 text-xs"
                                    />
                                  </div>
                                  <div className="space-y-1 text-right">
                                    <label>{language === "ar" ? "شعار تسويقي بالإنجليزية *" : "Tagline (English) *"}</label>
                                    <input
                                      type="text" required
                                      value={newProductForm.taglineEn}
                                      onChange={(e) => setNewProductForm(p => ({ ...p, taglineEn: e.target.value }))}
                                      className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-2 text-xs font-sans"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-right">
                                  <div className="space-y-1 text-right">
                                    <label>{language === "ar" ? "التصنيف *" : "Category *"}</label>
                                    <select
                                      value={newProductForm.category}
                                      onChange={(e) => setNewProductForm(p => ({ ...p, category: e.target.value }))}
                                      className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-2 text-xs outline-none"
                                    >
                                      <option value="sidr">{language === "ar" ? "عسل سدر" : "Sidr Honey"}</option>
                                      <option value="sumar">{language === "ar" ? "عسل سمر" : "Sumar Honey"}</option>
                                      <option value="sal">{language === "ar" ? "عسل صال" : "Sal Honey"}</option>
                                      <option value="vouchers">{language === "ar" ? "باقات وهدايا" : "Gifts & Vouchers"}</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1 text-right">
                                    <label className="block mb-1">{language === "ar" ? "صورة المنتج *" : "Product Image *"}</label>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        {newProductForm.image && (
                                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#EADFC9] bg-[#FCFAF7] shrink-0">
                                            <img src={newProductForm.image} alt="Preview" className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <label className="flex-grow flex items-center justify-center gap-1.5 bg-[#FCFAF7] hover:bg-[#F5EFE4] border border-dashed border-[#EADFC9] hover:border-[#B58A30] rounded-lg px-2.5 py-2 text-[11px] text-[#4A2F13] cursor-pointer transition duration-200">
                                          <Upload className="w-3.5 h-3.5 text-[#B58A30]" />
                                          <span className="font-bold">
                                            {language === "ar" ? "تحميل صورة مباشرة" : "Upload Direct Image"}
                                          </span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                  if (typeof reader.result === "string") {
                                                    compressImage(reader.result).then((compressed) => {
                                                      setNewProductForm(p => ({ ...p, image: compressed }));
                                                    });
                                                  }
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                      <div className="space-y-0.5">
                                        <span className="text-[10px] text-[#4A2F13]/60 block">{language === "ar" ? "أو أدخل رابط صورة:" : "Or enter image URL:"}</span>
                                        <input
                                          type="text" required
                                          value={newProductForm.image}
                                          onChange={(e) => setNewProductForm(p => ({ ...p, image: e.target.value }))}
                                          className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-1.5 text-xs font-sans"
                                          placeholder="https://..."
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1 text-right">
                                  <label>{language === "ar" ? "الوصف التفصيلي بالعربية *" : "Detailed Description (Arabic) *"}</label>
                                  <textarea
                                    required rows={3}
                                    value={newProductForm.descriptionAr}
                                    onChange={(e) => setNewProductForm(p => ({ ...p, descriptionAr: e.target.value }))}
                                    className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-2 text-xs"
                                  />
                                </div>

                                <div className="space-y-1 text-right">
                                  <label>{language === "ar" ? "الوصف التفصيلي بالإنجليزية *" : "Detailed Description (English) *"}</label>
                                  <textarea
                                    required rows={3}
                                    value={newProductForm.descriptionEn}
                                    onChange={(e) => setNewProductForm(p => ({ ...p, descriptionEn: e.target.value }))}
                                    className="w-full bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-3 py-2 text-xs font-sans"
                                  />
                                </div>

                                {/* Sizes & Pricing block */}
                                <div className="border border-[#EADFC9]/60 p-4 rounded-xl space-y-3 bg-[#FCFAF7] text-right">
                                  <span className="block font-bold text-[#B58A30]">{language === "ar" ? "الأوزان المتوفرة والأسعار المخصصة (د.أ) *" : "Available weights & pricing (JOD) *"}</span>
                                  <div className="grid grid-cols-3 gap-3">
                                    {newProductForm.sizes.map((size, idx) => (
                                      <div key={idx} className="space-y-1 border p-2.5 rounded-lg bg-white text-center">
                                        <span className="block font-mono font-bold text-[#4A2F13]/70">{size.weight}</span>
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-gray-400 block text-center">{language === "ar" ? "السعر د.أ" : "Price JOD"}</label>
                                          <input
                                            type="number" required
                                            value={size.price}
                                            onChange={(e) => {
                                              const updatedSizes = [...newProductForm.sizes];
                                              updatedSizes[idx] = { ...size, price: Number(e.target.value) };
                                              setNewProductForm(p => ({ ...p, sizes: updatedSizes }));
                                            }}
                                            className="w-full border rounded text-center py-1 font-mono text-xs"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-3 justify-end pt-3">
                                  <button
                                    type="button"
                                    onClick={() => setShowAddProductModal(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-stone-700 px-5 py-2.5 rounded-xl cursor-pointer"
                                  >
                                    {language === "ar" ? "إلغاء" : "Cancel"}
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-[#B58A30] hover:bg-[#D8B157] text-white px-6 py-2.5 rounded-xl shadow cursor-pointer font-bold"
                                  >
                                    {language === "ar" ? "حفظ وتثبيت" : "Save Changes"}
                                  </button>
                                </div>

                              </form>
                            </div>
                          </div>
                        )}

                        {/* PRODUCTS MANAGEMENT TABLE */}
                        <div className="bg-white border border-[#EADFC9]/70 rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-right border-collapse text-xs md:text-sm">
                            <thead>
                              <tr className="bg-[#FCFAF7] border-b border-[#EADFC9]/40 text-[#4A2F13]/70 font-bold">
                                <th className="p-4">{language === "ar" ? "المنتج" : "Product"}</th>
                                <th className="p-4">{language === "ar" ? "التصنيف" : "Category"}</th>
                                <th className="p-4">{language === "ar" ? "أسعار الأوزان" : "Weights & Prices"}</th>
                                <th className="p-4">{language === "ar" ? "التقييم" : "Rating"}</th>
                                <th className="p-4 text-left">{language === "ar" ? "الإجراءات" : "Actions"}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EADFC9]/25 text-[#4A2F13] font-medium">
                              {products.map((p) => (
                                <tr key={p.id} className="hover:bg-[#FCFAF7]/50 transition">
                                  <td className="p-4 flex items-center gap-3">
                                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                                    <div>
                                      <span className="block font-bold text-sm text-[#4A2F13]">{language === "ar" ? p.nameAr : p.nameEn}</span>
                                      <span className="text-[10px] text-gray-400 block max-w-xs truncate">{language === "ar" ? p.taglineAr : p.taglineEn}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 font-bold uppercase font-mono text-[11px] text-[#B58A30]">{p.category}</td>
                                  <td className="p-4 font-mono text-xs">
                                    {p.sizes.map(s => `${s.weight}: ${s.price} JOD`).join(" | ")}
                                  </td>
                                  <td className="p-4 text-yellow-500 font-bold font-mono">★ {p.rating} ({p.reviewsCount})</td>
                                  <td className="p-4 text-left space-x-2">
                                    <button
                                      onClick={() => {
                                        setEditingProductId(p.id);
                                        setNewProductForm({
                                          category: p.category,
                                          nameAr: p.nameAr,
                                          nameEn: p.nameEn,
                                          taglineAr: p.taglineAr,
                                          taglineEn: p.taglineEn,
                                          descriptionAr: p.descriptionAr,
                                          descriptionEn: p.descriptionEn,
                                          image: p.image,
                                          rating: p.rating,
                                          reviewsCount: p.reviewsCount,
                                          sizes: [...p.sizes]
                                        });
                                        setShowAddProductModal(true);
                                      }}
                                      className="inline-flex items-center gap-1 bg-[#FCFAF7] hover:bg-[#EADFC9]/40 border border-[#EADFC9] px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-[#B58A30]" />
                                      <span>{language === "ar" ? "تعديل" : "Edit"}</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(language === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا المنتج من الكاتالوج؟" : "Are you sure you want to delete this product?")) {
                                          setProducts(prev => prev.filter(prod => prod.id !== p.id));
                                        }
                                      }}
                                      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                      <span>{language === "ar" ? "حذف" : "Delete"}</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ======================================= */}
                    {/* --- ADMIN SUBTAB 2: CUSTOMERS DIRECTORY --- */}
                    {/* ======================================= */}
                    {adminActiveTab === "users" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-black text-[#4A2F13]">{language === "ar" ? "دليل حسابات ومستويات العملاء" : "Registered Customers Directory"}</h3>
                        
                        <div className="bg-white border border-[#EADFC9]/70 rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-right border-collapse text-xs md:text-sm">
                            <thead>
                              <tr className="bg-[#FCFAF7] border-b border-[#EADFC9]/40 text-[#4A2F13]/70 font-bold">
                                <th className="p-4">{language === "ar" ? "اسم العميل" : "Customer Name"}</th>
                                <th className="p-4">{language === "ar" ? "البريد الإلكتروني" : "Email"}</th>
                                <th className="p-4">{language === "ar" ? "رقم الهاتف" : "Phone"}</th>
                                <th className="p-4">{language === "ar" ? "رصيد النقاط الحالي" : "Loyalty Points Balance"}</th>
                                <th className="p-4">{language === "ar" ? "تاريخ التسجيل" : "Registration Date"}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EADFC9]/25 text-[#4A2F13] font-medium">
                              {(Object.values(usersDB) as LoyaltyProfile[]).map((user, idx) => (
                                <tr key={idx} className="hover:bg-[#FCFAF7]/50 transition">
                                  <td className="p-4 font-bold text-[#4A2F13]">{user.username}</td>
                                  <td className="p-4 font-mono text-gray-500">{user.email}</td>
                                  <td className="p-4 font-mono text-gray-500">{user.phone}</td>
                                  <td className="p-4 font-mono font-bold text-emerald-600 text-sm">★ {user.points} Pts</td>
                                  <td className="p-4 font-mono text-gray-400">{user.registrationDate || "2026-06-15"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ======================================= */}
                    {/* --- ADMIN SUBTAB 3: ORDERS DISPATCH MANAGER --- */}
                    {/* ======================================= */}
                    {adminActiveTab === "orders" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-black text-[#4A2F13]">{language === "ar" ? "متابعة وتحديث حالة شحن الطلبيات" : "E-Commerce Orders & Delivery Dispatch"}</h3>
                        
                        {orders.length === 0 ? (
                          <div className="bg-white border border-[#EADFC9]/70 rounded-2xl p-10 text-center text-gray-400 font-medium">
                            {language === "ar" ? "لا توجد أي طلبيات مسجلة في المتجر حتى الآن." : "No orders have been submitted yet."}
                          </div>
                        ) : (
                          <div className="bg-white border border-[#EADFC9]/70 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-right border-collapse text-xs md:text-sm">
                              <thead>
                                <tr className="bg-[#FCFAF7] border-b border-[#EADFC9]/40 text-[#4A2F13]/70 font-bold">
                                  <th className="p-4">{language === "ar" ? "معرف الطلب" : "Order ID"}</th>
                                  <th className="p-4">{language === "ar" ? "بيانات المستلم" : "Recipient Details"}</th>
                                  <th className="p-4">{language === "ar" ? "المنتجات والأوزان" : "Honey Items Purchased"}</th>
                                  <th className="p-4">{language === "ar" ? "قيمة الطلب الإجمالية" : "Grand Total (JOD)"}</th>
                                  <th className="p-4">{language === "ar" ? "تحديث حالة التوصيل" : "Delivery Follow-up"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#EADFC9]/25 text-[#4A2F13] font-medium">
                                {orders.map((order) => (
                                  <tr key={order.id} className="hover:bg-[#FCFAF7]/50 transition">
                                    <td className="p-4 font-mono font-black text-[#B58A30] text-sm">{order.id}</td>
                                    <td className="p-4 text-stone-700">
                                      <span className="block font-bold">{order.shippingDetails.fullName}</span>
                                      <span className="block font-mono text-[11px] text-gray-500">{order.shippingDetails.phone} | {order.shippingDetails.email}</span>
                                      <span className="block text-[11px] text-gray-400">{order.shippingDetails.city}, {order.shippingDetails.address}</span>
                                    </td>
                                    <td className="p-4 space-y-1">
                                      {order.items.map((it, i) => (
                                        <div key={i} className="text-stone-700 text-xs">
                                          - {language === "ar" ? it.product.nameAr : it.product.nameEn} ({it.selectedSize.weight}) <span className="font-bold">x{it.quantity}</span>
                                        </div>
                                      ))}
                                    </td>
                                    <td className="p-4 font-mono font-black text-[#B58A30]">{order.total} JOD</td>
                                    <td className="p-4">
                                      <div className="flex items-center gap-2">
                                        <select
                                          value={order.status}
                                          onChange={(e) => {
                                            const updatedStatus = e.target.value as "pending" | "processing" | "shipped" | "delivered";
                                            // Update in state
                                            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: updatedStatus } : o));
                                            
                                            // Optional: update points if delivered for the first time
                                            alert(language === "ar" ? `تم تحديث حالة شحن الطلب ${order.id} إلى: ${updatedStatus}` : `Order ${order.id} delivery status updated to: ${updatedStatus}`);
                                          }}
                                          className="bg-[#FCFAF7] border border-[#EADFC9] rounded-lg px-2.5 py-1.5 text-xs text-[#4A2F13] font-bold outline-none cursor-pointer"
                                        >
                                          <option value="pending">⏳ {language === "ar" ? "قيد الانتظار" : "Pending"}</option>
                                          <option value="processing">⚙️ {language === "ar" ? "جاري التجهيز" : "Processing"}</option>
                                          <option value="shipped">🚚 {language === "ar" ? "تم الشحن" : "Shipped"}</option>
                                          <option value="delivered">✅ {language === "ar" ? "تم التوصيل" : "Delivered"}</option>
                                        </select>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ======================================= */}
                    {/* --- ADMIN SUBTAB 4: FEEDBACK RESOLUTION --- */}
                    {/* ======================================= */}
                    {adminActiveTab === "tickets" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-black text-[#4A2F13]">{language === "ar" ? "الرد على الشكاوى والاقتراحات والتفاعل معها" : "Complaints & Suggestions Resolution Hub"}</h3>
                        
                        {feedbackTickets.length === 0 ? (
                          <div className="bg-white border border-[#EADFC9]/70 rounded-2xl p-10 text-center text-gray-400 font-medium">
                            {language === "ar" ? "لا توجد أي رسائل أو شكاوى مرسلة من الزوار." : "No suggestions or complaints have been submitted yet."}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {feedbackTickets.map((ticket) => (
                              <div key={ticket.id} className="bg-white border border-[#EADFC9]/70 rounded-2xl p-6 shadow-sm space-y-4 text-right" id={`admin-ticket-${ticket.id}`}>
                                
                                {/* Info row */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#EADFC9]/30 pb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-sm text-[#B58A30]">{ticket.id}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      ticket.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-emerald-100 text-emerald-800"
                                    }`}>
                                      {ticket.status === "pending" ? (language === "ar" ? "قيد المعالجة" : "Pending Resolution") : (language === "ar" ? "تم الرد" : "Replied")}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-400 space-y-0.5 text-right sm:text-left">
                                    <span className="block font-bold text-[#4A2F13]">👤 {ticket.senderName} ({ticket.senderPhone})</span>
                                    <span className="block font-mono text-right">{ticket.senderEmail} | {ticket.date}</span>
                                  </div>
                                </div>

                                {/* Text details */}
                                <div className="text-sm font-medium text-[#4A2F13] leading-relaxed">
                                  <span className="font-black text-xs text-[#B58A30] block mb-1">
                                    {ticket.type === "complaint" ? (language === "ar" ? "⚠️ تفاصيل الشكوى المقدمة:" : "⚠️ Complaint Statement:") : (language === "ar" ? "💡 تفاصيل المقترح المقدم:" : "💡 Suggestion Statement:")}
                                  </span>
                                  {ticket.text}
                                </div>

                                {/* Display reply input or saved response */}
                                <div className="bg-[#FCFAF7] border border-[#EADFC9]/50 p-4 rounded-xl space-y-3">
                                  <span className="block text-xs font-bold text-stone-600">👑 {language === "ar" ? "الرد الرسمي باسم المدير زكريى السلام:" : "Official Reply by Manager Zakaria Al-Salam:"}</span>
                                  
                                  {ticket.replyText ? (
                                    <div className="space-y-1 text-right">
                                      <p className="text-xs text-stone-700 italic font-medium">"{ticket.replyText}"</p>
                                      <span className="block text-[10px] text-gray-400 font-mono text-left">{language === "ar" ? "تاريخ الرد:" : "Replied on:"} {ticket.replyDate}</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      <textarea
                                        rows={2}
                                        placeholder={language === "ar" ? "اكتب الرد الرسمي للإرسال للعميل..." : "Write official reply to resolve and notify customer..."}
                                        id={`reply-text-input-${ticket.id}`}
                                        className="w-full bg-white border border-[#EADFC9] rounded-lg px-3 py-2 text-xs outline-none text-[#4A2F13]"
                                      ></textarea>
                                      <button
                                        onClick={() => {
                                          const textInput = document.getElementById(`reply-text-input-${ticket.id}`) as HTMLTextAreaElement | null;
                                          if (!textInput || !textInput.value.trim()) {
                                            alert(language === "ar" ? "الرجاء كتابة رد أولاً" : "Please enter a response statement!");
                                            return;
                                          }
                                          const finalReply = textInput.value.trim();

                                          // Update ticket in state
                                          setFeedbackTickets(prev => prev.map(t => t.id === ticket.id ? {
                                            ...t,
                                            status: "replied",
                                            replyText: finalReply,
                                            replyDate: new Date().toISOString().split('T')[0]
                                          } : t));

                                          alert(language === "ar" ? "تم إرسال ردك بنجاح! سيتمكن العميل من رؤيته على الفور في حسابه." : "Your response was submitted! The customer can read it instantly under their profile.");
                                        }}
                                        className="bg-[#B58A30] hover:bg-[#D8B157] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition shadow"
                                      >
                                        {language === "ar" ? "إرسال الرد وحل التذكرة" : "Submit Reply & Resolve"}
                                      </button>
                                    </div>
                                  )}
                                </div>

                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

              </motion.div>
            )}


            {/* ======================================= */}
            {/* --- CORE TAB 4: CHATBOT SOMMELIER --- */}
            {/* ======================================= */}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-8 max-w-4xl mx-auto"
                id="chatbot-tab-container"
              >
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold text-[#B58A30] font-mono tracking-widest uppercase">AL-DUMALWAH AI SOMMELIER</span>
                  <h1 className="text-2xl md:text-4xl font-black font-sans text-[#4A2F13]">
                    {t.navChat}
                  </h1>
                  <p className="text-xs md:text-sm text-[#4A2F13]/70">
                    {language === "ar" 
                      ? "اطرح على مستشارنا الذكي أي سؤال طبيعي في كبسولة تواصل مشفرة وسيساعدك في إيجاد العسل الأمثل لأهدافك وصحتك."
                      : "Unleash our AI advisor to map your health goals with the corresponding Yemeni therapeutic honey variety."}
                  </p>
                </div>
                <Chatbot language={language} />
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </main>


      {/* ======================================= */}
      {/* --- CART SLIDING DRAWER COMPONENT --- */}
      {/* ======================================= */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end" id="cart-drawer-overlay">
          {/* Inner panel */}
          <div className="bg-[#FFFFFF] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#EADFC9] transform animate-in slide-in-from-left duration-300" id="cart-drawer-panel">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#EADFC9]/50 flex items-center justify-between bg-[#FCFAF7]" id="cart-header">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#B58A30]" />
                <h3 className="font-black text-base md:text-lg text-[#4A2F13] font-sans">
                  {t.cartTitle}
                </h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FCFAF7] hover:bg-[#EADFC9]/50 flex items-center justify-center text-[#4A2F13]/70 hover:text-[#4A2F13] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body - Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4" id="cart-items-window">
              
              {/* Free shipping banner meter */}
              {cart.length > 0 && (
                <div className="bg-[#FCFAF7] border border-[#EADFC9]/70 p-3.5 rounded-xl text-center space-y-2 text-xs text-[#4A2F13]/80 font-semibold" id="shipping-progress-meter">
                  {isFreeShipping ? (
                    <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>{t.freeShippingUnlocked}</span>
                    </div>
                  ) : (
                    <span>
                      {translations[language].freeShippingMessage.replace("{amount}", (freeShippingThreshold - cartSubtotal).toString())}
                    </span>
                  )}
                  {/* Gauge bar */}
                  <div className="w-full bg-[#FFFFFF] rounded-full h-2 overflow-hidden shadow-inner border border-[#EADFC9]/30">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isFreeShipping ? "bg-emerald-500" : "bg-[#B58A30]"}`}
                      style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {cart.length > 0 ? (
                <div className="divide-y divide-[#EADFC9]/30" id="cart-items-list">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 py-4 first:pt-0 last:pb-0 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.nameEn}
                        className="w-16 h-16 rounded-xl object-cover border border-[#EADFC9]/40 shrink-0"
                      />
                      
                      <div className="flex-grow min-w-0 text-right md:text-right">
                        <h4 className="font-extrabold text-sm text-[#4A2F13] truncate">
                          {language === "ar" ? item.product.nameAr : item.product.nameEn}
                        </h4>
                        <span className="block text-[11px] text-[#4A2F13]/60 font-mono mt-0.5">{item.selectedSize.weight}</span>
                        
                        {/* Qty controller buttons */}
                        <div className="flex items-center gap-2 mt-2" id="qty-controller">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.selectedSize.weight, -1)}
                            className="w-6 h-6 rounded border border-[#EADFC9] hover:bg-[#EADFC9]/40 text-[#4A2F13] text-xs font-bold flex items-center justify-center transition cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs text-[#4A2F13] w-5 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.selectedSize.weight, 1)}
                            className="w-6 h-6 rounded border border-[#EADFC9] hover:bg-[#EADFC9]/40 text-[#4A2F13] text-xs font-bold flex items-center justify-center transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Rightmost Pricing & Delete */}
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0" id="cart-item-actions">
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize.weight)}
                          className="text-[#4A2F13]/40 hover:text-red-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-mono font-bold text-sm text-[#4A2F13] mt-2">
                          {item.selectedSize.price * item.quantity} {language === "ar" ? "د.أ" : "JOD"}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-[#4A2F13]/40 text-center gap-3 p-6" id="empty-cart-display">
                  <ShoppingBag className="w-12 h-12 text-[#4A2F13]/30" />
                  <p className="text-xs leading-relaxed font-medium">
                    {t.cartEmpty}
                  </p>
                </div>
              )}

            </div>

            {/* Drawer Footer - Summary & Action */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#EADFC9] bg-[#FCFAF7] space-y-4" id="cart-drawer-footer">
                
                <div className="space-y-2 text-sm font-semibold text-[#4A2F13]/80">
                  <div className="flex justify-between">
                    <span>{t.cartSubtotal}</span>
                    <span className="font-mono font-bold text-[#4A2F13]">{cartSubtotal} {language === "ar" ? "د.أ" : "JOD"}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#EADFC9]/30 pt-2.5 text-[#4A2F13] font-black text-base md:text-lg">
                    <span>{t.cartTotal}</span>
                    <span className="font-mono text-[#B58A30]">{cartSubtotal} {language === "ar" ? "د.أ" : "JOD"}</span>
                  </div>
                </div>

                <button
                  onClick={() => { setCartOpen(false); setCheckoutMode(true); }}
                  className="w-full bg-gradient-to-r from-[#B58A30] to-[#D8B157] hover:from-[#D8B157] hover:to-[#B58A30] text-white font-extrabold font-sans py-3.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.checkoutButton}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}


      {/* ======================================= */}
      {/* --- PRESTIGIOUS FOOTER --- */}
      {/* ======================================= */}
      <footer className="bg-gradient-to-br from-[#140D07] to-[#1C120A] text-[#FCFAF7]/85 border-t-2 border-[#B58A30] mt-16 py-12 md:py-16 px-4 md:px-6 relative" id="app-footer-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo & Description (Md: 5) */}
          <div className="md:col-span-5 space-y-5 text-center md:text-right flex flex-col md:items-start items-center">
            <div className="flex items-center gap-3">
              <Logo className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl p-1 shadow-md" showText={false} />
              <div className="text-right">
                <span className="block font-bold text-lg md:text-xl text-[#FCFAF7] font-sans tracking-tight leading-none">{t.appName}</span>
                <span className="text-[10px] text-[#B58A30] font-mono tracking-widest">{t.appSubtitle}</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#FCFAF7]/70 max-w-sm">
              {t.footerDesc}
            </p>
            <span className="block text-[11px] font-mono text-[#B58A30]">
              📍 {t.footerAddress}
            </span>
          </div>

          {/* Nav quicklinks (Md: 3) */}
          <div className="md:col-span-3 space-y-4 text-center md:text-right">
            <h4 className="font-extrabold text-[#FCFAF7] text-sm font-sans uppercase tracking-wider border-b border-[#3A2A1A]/60 pb-2 inline-block md:block">
              {language === "ar" ? "وصول سريع" : "Quick Navigation"}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold">
              <button onClick={() => { setActiveTab("home"); setCheckoutMode(false); }} className="hover:text-[#B58A30] transition text-right">{t.navHome}</button>
              <button onClick={() => { setActiveTab("products"); setCheckoutMode(false); }} className="hover:text-[#B58A30] transition text-right">{t.navProducts}</button>
              <button onClick={() => { setActiveTab("loyalty"); setCheckoutMode(false); }} className="hover:text-[#B58A30] transition text-right">{t.navLoyalty}</button>
              <button onClick={() => { setActiveTab("chat"); setCheckoutMode(false); }} className="hover:text-[#B58A30] transition text-right">{t.navChat}</button>
              <button onClick={() => { setActiveTab("admin"); setCheckoutMode(false); }} className="hover:text-[#B58A30] transition text-right text-[#B58A30] font-bold">🔒 {language === "ar" ? "لوحة الإدارة" : "Admin Portal"}</button>
            </div>
          </div>

          {/* Customer support (Md: 4) */}
          <div className="md:col-span-4 space-y-4 text-center md:text-right flex flex-col md:items-start items-center">
            <h4 className="font-extrabold text-[#FCFAF7] text-sm font-sans uppercase tracking-wider border-b border-[#3A2A1A]/60 pb-2 inline-block md:block">
              {t.footerSupport}
            </h4>
            <div className="space-y-3 text-xs">
              <p className="leading-relaxed text-[#FCFAF7]/70">
                {language === "ar" 
                  ? "لأي استفسارات طبية أو صحية أو لمتابعة طلبياتكم الفاخرة، يسعد طاقم خدمة العملاء بقلعة الدملؤة خدمتكم على مدار الساعة." 
                  : "For therapeutic inquiries, order status tracking, or phone ordering, our helpdesk team is operational 24/7."}
              </p>
              
              {/* WhatsApp direct CTA button */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <span className="font-mono text-stone-300 text-xs tracking-wider">📞 00962799695547</span>
                <a
                  href="https://wa.me/962799695547?text=السلام%20عليكم%20قلعة%20الدملؤة%20للعسل%20اليمني%20أود%20الاستفسار"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition hover:-translate-y-0.5"
                  id="footer-whatsapp-cta"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>{t.footerWhatsApp}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal copyright line */}
        <div className="max-w-7xl mx-auto border-t border-[#3A2A1A]/50 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FCFAF7]/40 font-medium" id="footer-copyright-row">
          <span>{t.footerCopy}</span>
          <span className="mt-2 sm:mt-0 font-mono tracking-wider text-[#B58A30]/70">SECURED & LAB GUARANTEED CERTIFIED</span>
        </div>

        {/* Floating WhatsApp Action button */}
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="fixed bottom-6 left-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-blue-400 flex items-center justify-center group"
          id="floating-feedback-button"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-sans text-xs font-bold leading-none pl-0 group-hover:pl-2">
            {language === "ar" ? "اقتراحات وشكاوى" : "Suggestions & Complaints"}
          </span>
        </button>
        <a
          href="https://wa.me/962799695547?text=السلام%20عليكم%20قلعة%20الدملؤة%20أود%20الاستفسار%20عن%20العسل"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-emerald-400 flex items-center justify-center group"
          id="floating-whatsapp-action"
        >
          <PhoneCall className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-sans text-xs font-bold leading-none pr-0 group-hover:pr-2">
            {language === "ar" ? "واتساب المتجر" : "WhatsApp Shop"}
          </span>
        </a>
        {showFeedbackForm && <FeedbackForm onClose={() => setShowFeedbackForm(false)} language={language} />}
        {showAdmin && <AdminFeedback />}

      </footer>

    </div>
  );
}
