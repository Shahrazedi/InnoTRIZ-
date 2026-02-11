
import { InventivePrinciple, TrizParameter } from './types';

export interface TrizExample {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
}

export const TRIZ_EXAMPLES: TrizExample[] = [
  {
    title: { ar: "محرك الطائرة", en: "Aircraft Engine" },
    description: { 
      ar: "أريد زيادة سرعة محرك الطائرة (السرعة)، ولكن هذا يؤدي إلى زيادة هائلة في استهلاك الوقود (فقدان الطاقة) وزيادة وزن المحرك.",
      en: "I want to increase aircraft engine speed, but this leads to massive fuel consumption (energy loss) and increased engine weight."
    }
  },
  {
    title: { ar: "مبنى شاهق", en: "High-rise Building" },
    description: { 
      ar: "أريد بناء برج سكني بارتفاع شاهق (حجم الجسم الثابت)، ولكن تزداد المشكلة في استقرار المبنى ضد الرياح والزلازل (استقرار تكوين الجسم).",
      en: "I want to build a very tall residential tower (object volume), but stability against wind and earthquakes (object stability) becomes a major issue."
    }
  },
  {
    title: { ar: "تطبيق هاتف", en: "Mobile App" },
    description: { 
      ar: "أريد إضافة ميزات ذكاء اصطناعي متطورة للتطبيق (الشمولية/القدرة)، ولكن هذا يجعل حجم التطبيق ضخماً ويستهلك البطارية بسرعة (فقدان الطاقة).",
      en: "I want to add advanced AI features to the app (versatility), but this makes the app size huge and drains battery fast (energy loss)."
    }
  },
  {
    title: { ar: "علبة تعبئة", en: "Packaging Box" },
    description: { 
      ar: "أريد جعل علبة العصير أكثر متانة لتحمل الشحن (المقاومة/القوة)، ولكن هذا يزيد من تكلفة المادة المستخدمة ووزن العلبة (كمية المادة/الوزن).",
      en: "I want to make a juice box more durable for shipping (strength), but this increases material cost and box weight."
    }
  }
];

const CONTRADICTION_MATRIX: Record<string, number[]> = {
  "1_10": [1, 8, 15, 35], "1_27": [2, 10, 28, 35], "1_28": [1, 8, 15, 35], "1_33": [1, 2, 28, 35],
  "9_19": [13, 15, 19, 35], "9_27": [11, 27, 28], "9_39": [10, 19, 20, 38], "10_1": [1, 8, 15, 35],
  "10_36": [1, 2, 12], "39_9": [10, 19, 20, 38], "39_22": [10, 18, 23, 35], "39_36": [1, 10, 20, 35],
  "13_9": [1, 15, 18, 34], "13_1": [1, 8, 15, 35], "14_12": [1, 14, 15, 18], "35_13": [1, 15, 18, 34],
  "35_36": [2, 15, 28, 37], "12_1": [1, 15, 18, 35], "21_19": [1, 18, 19, 35],
};

export const INVENTIVE_PRINCIPLES: (InventivePrinciple & { nameEn: string; descriptionEn: string; examplesEn: string[] })[] = [
  { 
    id: 1, 
    name: "التجزئة", nameEn: "Segmentation",
    description: "تقسيم الجسم إلى أجزاء مستقلة، أو جعل الجسم سهل التفكيك، أو زيادة درجة التجزئة.", 
    descriptionEn: "Divide an object into independent parts, make an object easy to disassemble, or increase the degree of fragmentation.",
    examples: ["الستائر المعدنية المكونة من شرائح", "أثاث ايكيا القابل للتفكيك"], 
    examplesEn: ["Slatted metal blinds", "IKEA flat-pack furniture"]
  },
  { 
    id: 2, 
    name: "الاستخلاص", nameEn: "Extraction",
    description: "فصل الجزء 'المزعج' أو الخاصية 'المزعجة' عن الجسم، أو استخلاص الجزء الضروري فقط.", 
    descriptionEn: "Separate an interfering part or property from an object, or single out the only necessary part.",
    examples: ["وضع ضاغط المكيف خارج الغرفة", "الفلتر لاستخلاص الشوائب"],
    examplesEn: ["Air conditioner compressor outside the room", "Filters to extract impurities"]
  },
  { 
    id: 3, 
    name: "الجودة الموضعية", nameEn: "Local Quality",
    description: "تغيير هيكل الجسم من متجانس إلى غير متجانس، أو جعل كل جزء يعمل في أفضل ظروفه.", 
    descriptionEn: "Change an object's structure from uniform to non-uniform, or make each part function in its best conditions.",
    examples: ["قلم رصاص مع ممحاة في نهايته", "تقوية حواف أدوات القطع بالألماس"],
    examplesEn: ["Pencil with an eraser on the end", "Reinforcing tool edges with diamond"]
  },
  { 
    id: 4, 
    name: "عدم التماثل", nameEn: "Asymmetry",
    description: "تغيير شكل الجسم من متماثل إلى غير متماثل لزيادة كفاءته.", 
    descriptionEn: "Change the shape of an object from symmetrical to asymmetrical.",
    examples: ["الفأرة (الماوس) المريحة لليد", "إطارات سيارات بنقوش غير متماثلة"],
    examplesEn: ["Ergonomic computer mouse", "Asymmetrical tire treads"]
  },
  { 
    id: 5, 
    name: "الدمج", nameEn: "Merging",
    description: "دمج أجسام متماثلة أو متجاورة لتعمل معاً بشكل متزامن أو متتالي.", 
    descriptionEn: "Combine identical or similar objects, assemble identical or similar parts to perform parallel operations.",
    examples: ["شفرات الحلاقة المتعددة", "الدوائر المتكاملة"],
    examplesEn: ["Multi-blade razors", "Integrated circuits"]
  },
  { 
    id: 6, 
    name: "الشمولية", nameEn: "Universality",
    description: "جعل الجسم يؤدي وظائف متعددة بحيث نستغني عن أجسام أخرى.", 
    descriptionEn: "Make an object or system perform multiple functions; eliminate the need for other parts.",
    examples: ["الأريكة التي تتحول إلى سرير", "الهاتف الذكي"],
    examplesEn: ["Sofa bed", "Smartphone"]
  },
  { 
    id: 7, 
    name: "التداخل", nameEn: "Nesting",
    description: "وضع جسم داخل جسم آخر، أو تمرير جسم عبر تجويف جسم آخر.", 
    descriptionEn: "Place one object inside another; place each object, in turn, inside the other.",
    examples: ["الهوائي التلسكوبي", "صناديق بأحجام متفاوتة داخل بعضها"],
    examplesEn: ["Telescopic antenna", "Nesting measuring cups"]
  },
  { 
    id: 8, 
    name: "الوزن المضاد", nameEn: "Counterweight",
    description: "تعويض وزن الجسم بدمجه مع أجسام أخرى توفر قوة رفع أو موازنة.", 
    descriptionEn: "To compensate for the weight of an object, merge it with other objects that provide lift.",
    examples: ["بالونات الهيليوم للرفع", "أوزان المصاعد لموازنة الثقل"],
    examplesEn: ["Helium balloons for lift", "Elevator counterweights"]
  },
  { 
    id: 9, 
    name: "التفعيل التمهيدي المضاد", nameEn: "Prior Counteraction",
    description: "القيام بعمل مضاد مسبق للسيطرة على الضغوط الناجمة.", 
    descriptionEn: "If it is necessary to do an action with both harmful and useful effects, this action should be replaced by anti-actions to control ill effects.",
    examples: ["الخرسانة سابقة الإجهاد", "اللقاحات الطبية"],
    examplesEn: ["Prestressed concrete", "Medical vaccines"]
  },
  { 
    id: 10, 
    name: "الفعل التمهيدي", nameEn: "Prior Action",
    description: "إنجاز العمل المطلوب كلياً أو جزئياً قبل الحاجة إليه.", 
    descriptionEn: "Perform, before it is needed, the required change of an object (either fully or partially).",
    examples: ["تقطيع الخضروات قبل الطهي", "قوالب العقود الجاهزة"],
    examplesEn: ["Pre-cut vegetables", "Pre-designed contract templates"]
  },
  { 
    id: 11, 
    name: "الوقاية المسبقة", nameEn: "Cushion in Advance",
    description: "التعويض عن الموثوقية المنخفضة للجسم بإجراءات وقائية مسبقة للطوارئ.", 
    descriptionEn: "Prepare emergency means beforehand to compensate for the relatively low reliability of an object.",
    examples: ["الوسائد الهوائية في السيارات", "أحزمة الأمان"],
    examplesEn: ["Airbags", "Safety belts"]
  },
  { 
    id: 12, 
    name: "تساوي الجهد", nameEn: "Equipotentiality",
    description: "تغيير ظروف العمل بحيث لا يحتاج الجسم للرفع أو الخفض.", 
    descriptionEn: "In a potential field, limit condition changes (e.g. change operating conditions so an object need not be raised or lowered).",
    examples: ["أقفال القنوات المائية للسفن", "أحواض بناء السفن الجافة"],
    examplesEn: ["Canal locks", "Dry docks"]
  },
  { 
    id: 13, 
    name: "العكس", nameEn: "The Other Way Around",
    description: "عكس الإجراء المستخدم أو جعل الأجزاء المتحركة ثابتة والعكس.", 
    descriptionEn: "Invert the action used to solve the problem (e.g. instead of cooling an object, heat it).",
    examples: ["جهاز المشي الرياضي", "قلب زجاجات الكاتشب"],
    examplesEn: ["Treadmill", "Upside-down ketchup bottles"]
  },
  { 
    id: 14, 
    name: "الانحناء", nameEn: "Spheroidality",
    description: "استخدام الأشكال المنحنية والكرات بدلاً من الخطوط المستقيمة.", 
    descriptionEn: "Instead of using rectilinear parts, surfaces, or forms, use curvilinear ones; move from flat surfaces to spherical ones.",
    examples: ["الأقواس في العمارة", "كرات المحامل لتقليل الاحتكاك"],
    examplesEn: ["Architectural arches", "Ball bearings"]
  },
  { 
    id: 15, 
    name: "الديناميكية", nameEn: "Dynamicity",
    description: "جعل الجسم أو خصائصه تتغير لتكون في الوضع الأمثل في كل مرحلة.", 
    descriptionEn: "Allow (or design) the characteristics of an object, external environment, or process to change to be optimal at each stage of operation.",
    examples: ["مقاعد السيارات القابلة للتعديل", "التصميم المتجاوب للمواقع"],
    examplesEn: ["Adjustable car seats", "Responsive web design"]
  }
];

export const TRIZ_PARAMETERS: (TrizParameter & { nameEn: string })[] = [
  { id: 1, name: "وزن الجسم المتحرك", nameEn: "Weight of moving object" },
  { id: 2, name: "وزن الجسم الثابت", nameEn: "Weight of stationary object" },
  { id: 3, name: "طول الجسم المتحرك", nameEn: "Length of moving object" },
  { id: 4, name: "طول الجسم الثابت", nameEn: "Length of stationary object" },
  { id: 5, name: "مساحة الجسم المتحرك", nameEn: "Area of moving object" },
  { id: 6, name: "مساحة الجسم الثابت", nameEn: "Area of stationary object" },
  { id: 7, name: "حجم الجسم المتحرك", nameEn: "Volume of moving object" },
  { id: 8, name: "حجم الجسم الثابت", nameEn: "Volume of stationary object" },
  { id: 9, name: "السرعة", nameEn: "Speed" },
  { id: 10, name: "القوة", nameEn: "Force" },
  { id: 11, name: "الإجهاد أو الضغط", nameEn: "Stress or pressure" },
  { id: 12, name: "الشكل", nameEn: "Shape" },
  { id: 13, name: "استقرار تكوين الجسم", nameEn: "Stability of object composition" },
  { id: 14, name: "المقاومة (القوة)", nameEn: "Strength" },
  { id: 15, name: "زمن عمل الجسم المتحرك", nameEn: "Duration of action of moving object" },
  { id: 16, name: "زمن عمل الجسم الثابت", nameEn: "Duration of action of stationary object" },
  { id: 17, name: "درجة الحرارة", nameEn: "Temperature" },
  { id: 18, name: "السطوع (الإنارة)", nameEn: "Illumination" },
  { id: 19, name: "الطاقة التي يستهلكها الجسم المتحرك", nameEn: "Energy consumed by moving object" },
  { id: 20, name: "الطاقة التي يستهلكها الجسم الثابت", nameEn: "Energy consumed by stationary object" },
  { id: 21, name: "القدرة (القوة/الزمن)", nameEn: "Power" },
  { id: 22, name: "فقدان الطاقة", nameEn: "Loss of Energy" },
  { id: 23, name: "فقدان المادة", nameEn: "Loss of substance" },
  { id: 24, name: "فقدان المعلومات", nameEn: "Loss of Information" },
  { id: 25, name: "فقدان الوقت", nameEn: "Loss of Time" },
  { id: 26, name: "كمية المادة", nameEn: "Quantity of substance" },
  { id: 27, name: "الموثوقية", nameEn: "Reliability" },
  { id: 28, name: "دقة التصنيع", nameEn: "Precision of manufacturing" },
  { id: 29, name: "دقة القياس", nameEn: "Precision of measurement" },
  { id: 30, name: "عوامل الضرر الخارجية", nameEn: "External harm affects the object" },
  { id: 31, name: "عوامل الضرر الداخلية", nameEn: "Object-generated harmful factors" },
  { id: 32, name: "سهولة التصنيع", nameEn: "Ease of manufacture" },
  { id: 33, name: "سهولة الاستخدام", nameEn: "Ease of operation" },
  { id: 34, name: "سهولة الإصلاح", nameEn: "Ease of repair" },
  { id: 35, name: "التكيف (المرونة)", nameEn: "Adaptability or versatility" },
  { id: 36, name: "تعقيد الجهاز", nameEn: "Device complexity" },
  { id: 37, name: "صعوبة الكشف والقياس", nameEn: "Difficulty of detecting and measuring" },
  { id: 38, name: "درجة التشغيل الآلي", nameEn: "Extent of automation" },
  { id: 39, name: "الإنتاجية", nameEn: "Productivity" }
];

export const getPrinciplesForContradiction = (improve: number, worsen: number): number[] => {
  const key = `${improve}_${worsen}`;
  const suggested = CONTRADICTION_MATRIX[key];
  if (suggested) return suggested;
  const seed = (improve * worsen) % 40;
  const list = [ ((seed + 1) % 40) || 1, ((seed * 2) % 40) || 13, ((seed + 15) % 40) || 15, ((seed + 25) % 40) || 2 ];
  return Array.from(new Set(list)).filter(id => id <= 15); // Limited to first 15 for demo consistency
};
