import { useEffect, useRef, useState } from "react";
import {
  adminEmail,
  consumeAuthRedirect,
  getCloudSession,
  getCloudUser,
  isCloudConfigured,
  loadCloudContent,
  requestAdminLink,
  saveCloudContent,
  signOutCloud,
  uploadPortfolioImage,
} from "./supabase.js";

const defaultImageFrame = {
  aspectRatio: "4 / 3",
  fit: "cover",
  positionX: 50,
  positionY: 50,
  radius: 0,
};

const getImageFrame = (value = {}) => ({ ...defaultImageFrame, ...value });

const getImageFrameStyle = (value = {}) => {
  const frame = getImageFrame(value);
  return {
    aspectRatio: frame.aspectRatio,
    borderRadius: `${frame.radius}px`,
    objectFit: frame.fit,
    objectPosition: `${frame.positionX}% ${frame.positionY}%`,
  };
};

const defaultLayout = {
  order: ["hero", "manifesto", "projects"],
  guides: { vertical: [50], horizontal: [] },
  grid: {
    columns: 2,
    gap: 52,
    pagePadding: 36,
    maxWidth: 1600,
  },
  editor: {
    zoom: 62,
    gridVisible: true,
    gridSize: 8,
    snap: true,
    guidesVisible: true,
  },
  chrome: {
    header: {
      visible: true,
      height: 74,
      background: "#f7f7f4",
      textColor: "#171717",
    },
    menu: {
      visible: true,
      fontSize: 13,
      gap: 42,
      textColor: "#171717",
    },
    footer: {
      visible: true,
      height: 430,
      background: "#171717",
      textColor: "#ffffff",
    },
  },
  blocks: {
    hero: {
      visible: true,
      height: 820,
      background: "#f5f5f2",
      title: {
        visible: true,
        fontSize: 86,
        dx: 0,
        dy: 0,
        color: "#171717",
        accentColor: "#f0a0eb",
        href: "",
      },
      images: {},
      customElements: [],
    },
    manifesto: {
      visible: true,
      height: 400,
      background: "#f4a0d5",
      text: {
        visible: true,
        fontSize: 62,
        dx: 0,
        dy: 0,
        color: "#171717",
        href: "",
      },
      customElements: [],
    },
    projects: {
      visible: true,
      minHeight: 900,
      background: "#f5f5f2",
      heading: {
        visible: true,
        fontSize: 64,
        dx: 0,
        dy: 0,
        color: "#171717",
        href: "",
      },
      customElements: [],
    },
  },
};

const initialContent = {
  schemaVersion: 2,
  name: "Анастасия Пескова",
  nameEn: "Anastasia Peskova",
  role: "Коммуникационный дизайнер",
  roleEn: "Communication designer",
  location: "Москва",
  locationEn: "Moscow",
  intro:
    "Создаю современный визуальный стиль брендов, усиливая классический дизайн технологиями 3D и AI. Помогаю компаниям любого масштаба: от стартапов до Сбера, влюблять в себя клиентов.",
  introEn:
    "I create contemporary visual identities, combining classic design with 3D and AI. I help companies of every scale, from startups to Sber, build brands people want to return to.",
  about:
    "Я коммуникационный дизайнер из Москвы. Создаю айдентику, визуальные системы и digital-коммуникации, работаю с 3D и нейросетями. Мне важно, чтобы дизайн не просто выглядел современно, а помогал бренду говорить яснее и оставаться узнаваемым во всех точках контакта.",
  aboutEn:
    "I am a communication designer based in Moscow. I create identities, visual systems and digital communications using 3D and generative tools. My goal is not just a contemporary look, but a clear and recognisable brand language across every touchpoint.",
  email: "london956@gmail.com",
  telegram: "@anastasiaamero",
  instagram: "@anastasiaamero",
  availability: "Открыта к новым проектам и коллаборациям",
  availabilityEn: "Open to new projects and collaborations",
  layout: defaultLayout,
  projects: [
    {
      id: "sbol-brand",
      number: "01",
      title: "Брендинг платформы СБОЛ.про",
      titleEn: "Sbol.pro platform branding",
      category: "Айдентика",
      categoryEn: "Identity",
      client: "Сбер",
      clientEn: "Sber",
      year: "2024",
      description:
        "Кобрендинг цифровой платформы для дизайн-сообщества Сбера. Система соединяет самостоятельный знак, пластичную графику, типографику и правила для коммуникаций разных форматов.",
      descriptionEn:
        "A co-brand identity for Sber's digital design community platform. The system combines an independent mark, fluid graphics, typography and a scalable set of communication rules.",
      image: "portfolio/web/page-04-09.webp",
      gallery: ["portfolio/web/page-04-01.webp", "portfolio/web/page-04-02.webp", "portfolio/web/page-04-08.webp", "portfolio/web/page-04-10.webp"],
      note: "система, которая умеет меняться",
      noteEn: "a system built to change",
      featured: true,
    },
    {
      id: "ai-library",
      number: "02",
      title: "Библиотека AI-изображений",
      titleEn: "AI image library",
      category: "AI-арт-дирекшен",
      categoryEn: "AI art direction",
      client: "Сбер",
      clientEn: "Sber",
      year: "2024",
      description:
        "Визуальная библиотека для внутренних и внешних коммуникаций. Единый арт-дирекшен помогает генеративным изображениям выглядеть частью бренда, а не набором случайных экспериментов.",
      descriptionEn:
        "A visual library for internal and external communications. A coherent art direction makes generative imagery feel like one brand system instead of disconnected experiments.",
      image: "portfolio/web/page-06-02.webp",
      gallery: ["portfolio/web/page-06-01.webp", "portfolio/web/page-06-03.webp", "portfolio/web/page-06-04.webp", "portfolio/web/page-06-05.webp", "portfolio/web/page-06-06.webp"],
      note: "нейросеть тоже нуждается в арт-директоре",
      noteEn: "AI still needs an art director",
      featured: true,
    },
    {
      id: "sbol-merch",
      number: "03",
      title: "Мерч СБОЛ.про",
      titleEn: "Sbol.pro merchandise",
      category: "Мерч",
      categoryEn: "Merchandise",
      client: "Сбер",
      clientEn: "Sber",
      year: "2024",
      description:
        "Линейка мерча для дизайн-команды Сбера. Служебные обозначения, фрагменты интерфейсов и свободная композиция превратились в узнаваемый визуальный код сообщества.",
      descriptionEn:
        "A merchandise line for Sber's design team. Utility marks, interface fragments and free composition became a recognisable visual code for the community.",
      image: "portfolio/web/page-08-03.webp",
      gallery: ["portfolio/web/page-08-01.webp", "portfolio/web/page-08-02.webp", "portfolio/web/page-08-04.webp", "portfolio/web/page-08-05.webp"],
      note: "дизайн-команда как комьюнити",
      noteEn: "a design team as a community",
      featured: true,
    },
    {
      id: "sber-cards",
      number: "04",
      title: "Концепты карт для AI-офиса",
      titleEn: "Card concepts for an AI office",
      category: "Концепт-дизайн",
      categoryEn: "Concept design",
      client: "Сбер",
      clientEn: "Sber",
      year: "2025",
      description:
        "Серия концептов банковских карт для нового AI-офиса Сбера. Визуальный язык строится на свете, глубине и ощущении цифрового объекта в физическом мире.",
      descriptionEn:
        "A series of bank card concepts for Sber's new AI office. The visual language is built around light, depth and the feeling of a digital object entering the physical world.",
      image: "portfolio/web/page-10-01.webp",
      gallery: ["portfolio/web/page-10-02.webp", "portfolio/web/page-10-03.webp", "portfolio/web/page-10-04.webp"],
      note: "цифровой объект, который можно держать",
      noteEn: "a digital object you can hold",
      featured: true,
    },
    {
      id: "domo",
      number: "05",
      title: "Визуальный стиль Domo",
      titleEn: "Domo visual identity",
      category: "Визуальная система",
      categoryEn: "Visual system",
      client: "Domo (ex-Самолёт)",
      clientEn: "Domo (formerly Samolet)",
      year: "2025",
      description:
        "Визуальный стиль для архитектурного бюро: контрастная типографика, кислотный акцент и модульная композиция помогают рассказывать о сложных проектах ясно и живо.",
      descriptionEn:
        "A visual identity for an architecture studio. Contrasting typography, an acid accent and modular composition make complex projects clear and energetic.",
      image: "portfolio/web/page-13-01.webp",
      gallery: ["portfolio/web/page-13-02.webp", "portfolio/web/page-13-03.webp", "portfolio/web/page-13-04.webp", "portfolio/web/page-13-05.webp"],
      note: "архитектура без скучного официоза",
      noteEn: "architecture without the corporate stiffness",
      featured: true,
    },
    {
      id: "altanina",
      number: "06",
      title: "Айдентика Altanina LLC",
      titleEn: "Altanina LLC identity",
      category: "Айдентика",
      categoryEn: "Identity",
      client: "Altanina LLC",
      clientEn: "Altanina LLC",
      year: "2025",
      description: "Айдентика семейного сервиса по ремонту домов в США. Характерная иллюстрация, честный синий цвет и дружелюбная типографика делают небольшой бизнес заметным и надёжным.",
      descriptionEn: "An identity for a family home repair service in the US. Characterful illustration, honest blue and friendly typography make a small business distinctive and trustworthy.",
      image: "portfolio/web/page-16-05.webp",
      gallery: ["portfolio/web/page-16-01.webp", "portfolio/web/page-16-03.webp", "portfolio/web/page-16-04.webp", "portfolio/web/page-16-06.webp", "portfolio/web/page-16-07.webp"],
      note: "малый бизнес с большим характером",
      noteEn: "a small business with a big character",
      featured: true,
    },
    {
      id: "civil",
      number: "07",
      title: "Обновление стиля Сивил",
      titleEn: "Civil identity refresh",
      category: "Редизайн",
      categoryEn: "Identity refresh",
      client: "Сивил",
      clientEn: "Civil",
      year: "2025",
      description: "Обновление фирменного стиля архитектурного сообщества. Сдержанная система стала гибче для соцсетей, событий, редакционных материалов и презентации проектов.",
      descriptionEn: "An identity refresh for an architecture community. The restrained system became more flexible across social media, events, editorial materials and project presentations.",
      image: "portfolio/web/page-19-05.webp",
      gallery: ["portfolio/web/page-19-01.webp", "portfolio/web/page-19-02.webp", "portfolio/web/page-19-03.webp", "portfolio/web/page-19-04.webp", "portfolio/web/page-19-10.webp"],
      note: "меньше шума, больше архитектуры",
      noteEn: "less noise, more architecture",
      featured: true,
    },
    {
      id: "apex",
      number: "08",
      title: "Айдентика соцсетей Apex",
      titleEn: "Apex social media identity",
      category: "Digital-айдентика",
      categoryEn: "Digital identity",
      client: "Apex",
      clientEn: "Apex",
      year: "2025",
      description: "Айдентика социальных сетей архитектурного бюро. Простая типографическая система удерживает единый голос бренда, не споря с разной по характеру архитектурой.",
      descriptionEn: "A social media identity for an architecture studio. A simple typographic system keeps one brand voice without competing with the studio's diverse architecture.",
      image: "portfolio/web/page-22-01.webp",
      gallery: ["portfolio/web/page-22-02.webp", "portfolio/web/page-22-03.webp", "portfolio/web/page-22-04.webp", "portfolio/web/page-22-05.webp", "portfolio/web/page-22-06.webp", "portfolio/web/page-22-07.webp"],
      note: "одна система, разные истории",
      noteEn: "one system, many stories",
      featured: true,
    },
  ],
};

const osWidgetStorageKey = "portfolio-2025-widget-layout-v17";
const osUserLayoutStorageKey = "portfolio-2025-user-widget-positions-v1";
const osChromeStorageKey = "portfolio-2025-os-chrome-v1";

const defaultOsChrome = {
  header: {
    visible: true,
    language: "ru",
    location: "Москва",
    locationEn: "Moscow",
    textColor: "#24262b",
    fontSize: 23,
    showLanguage: true,
    showSearch: true,
    searchPlaceholder: "Найти проект или раздел",
    searchPlaceholderEn: "Find a project or section",
  },
  footer: {
    visible: true,
    labels: ["Обо мне", "Проекты", "Контакты"],
    labelsEn: ["About", "Projects", "Contacts"],
    icons: [
      "os-portfolio/assets/icons/User_Circle.svg",
      "os-portfolio/assets/icons/Files.svg",
      "os-portfolio/assets/icons/Mail.svg",
    ],
    textColor: "#24262b",
    backgroundOpacity: 0.46,
    bottom: 30,
  },
  motion: {
    hoverLift: true,
    liquidFollow: true,
  },
};

function readOsChrome() {
  try {
    const saved = JSON.parse(localStorage.getItem(osChromeStorageKey));
    return {
      header: { ...defaultOsChrome.header, ...(saved?.header || {}) },
      footer: { ...defaultOsChrome.footer, ...(saved?.footer || {}) },
      motion: { ...defaultOsChrome.motion, ...(saved?.motion || {}) },
    };
  } catch {
    return defaultOsChrome;
  }
}

function createImageFrameFrame(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    x: 24,
    y: 64,
    w: 86,
    h: 86,
    radius: 28,
    fit: "cover",
    imageScale: 100,
    imageX: 50,
    imageY: 50,
    image: "",
    ...overrides,
  };
}

function createTextBlock(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    role: "body",
    text: "Текст",
    x: 24,
    y: 70,
    w: 240,
    align: "left",
    size: 14,
    weight: 520,
    color: "",
    ...overrides,
  };
}

const mediaItems = (items = []) => items.map((item) => (typeof item === "string" ? { title: item, image: "" } : { image: "", ...item }));

const projectCaseLibrary = {
  "Айдентика": {
    label: "Brand system",
    context: "Бренд выходит в новые каналы: презентации, соцсети, лендинги и продуктовые материалы. Нужно собрать визуальный язык, который не разваливается при масштабировании.",
    problem: "Коммуникации выглядели разрозненно: логотип, графика, типографика и носители не складывались в одну узнаваемую систему.",
    process: ["Аудит точек контакта и визуальных повторов", "Поиск характерного графического принципа", "Сборка модульной сетки, типографики и правил", "Проверка системы на разных форматах"],
    proposal: "Айдентика строится как набор гибких модулей: знак, сетка, типографика, паттерны, правила для digital и печати.",
    result: "Бренд получает цельный визуальный голос и понятную систему, которую можно передавать команде без ручного контроля каждого макета.",
    media: ["Логотип и знак", "Сетка и типографика", "Носители и digital-шаблоны"],
  },
  "Web": {
    label: "Digital interface",
    context: "Проекту нужен сайт или лендинг, который объясняет ценность продукта быстро, визуально и без лишней маркетинговой воды.",
    problem: "Пользователь не понимал, что делает продукт, чем он полезен и куда нажимать дальше.",
    process: ["Разбор сценариев и аудитории", "Сборка структуры страницы", "Прототип ключевых экранов", "Визуальная система и адаптив", "Проверка понятности первого экрана"],
    proposal: "Интерфейс строится как маршрут: первый экран отвечает на главный вопрос, далее идут доказательства, сценарии и понятный следующий шаг.",
    result: "Сайт становится инструментом объяснения продукта: меньше хаоса, больше ясности, выше доверие к бренду.",
    media: ["Первый экран", "Секция сценариев", "Адаптивные состояния"],
  },
  "Коммуникации": {
    label: "Campaign design",
    context: "Бренду нужно регулярно говорить с аудиторией: запускать кампании, оформлять соцсети, презентации и спецпроекты.",
    problem: "Материалы выходили как отдельные макеты, без единой интонации и визуального ритма.",
    process: ["Формулировка сообщения кампании", "Поиск визуальной метафоры", "Сборка шаблонов и контент-сетки", "Адаптация под каналы", "Подготовка гайда для команды"],
    proposal: "Коммуникационная система соединяет идею, текст, графику и формат так, чтобы каждое касание работало на общий образ бренда.",
    result: "Команда получает набор понятных шаблонов, а аудитория видит устойчивый и узнаваемый стиль.",
    media: ["Соцсети", "Презентации", "Кампания и спецформаты"],
  },
  "Моушин": {
    label: "Motion & AI visuals",
    context: "Статичной графики уже недостаточно: бренду нужны анимированные сцены, 3D, AI-визуалы и короткие digital-форматы.",
    problem: "Движение часто добавлялось в конце и не было связано с идеей бренда.",
    process: ["Определение роли движения", "Раскадровка и темп", "3D/AI-визуальные пробы", "Сборка motion-системы", "Экспорт под нужные каналы"],
    proposal: "Моушин становится частью системы: задаёт настроение, объясняет идею и усиливает узнаваемость.",
    result: "Появляется набор динамичных материалов для запусков, соцсетей, презентаций и digital-кампаний.",
    media: ["Motion-сцена", "3D/AI-визуал", "Короткие форматы"],
  },
};

function createProjectCaseBlocks(title, summary) {
  const caseData = projectCaseLibrary[title] || {
    label: "Case study",
    context: "Короткий контекст проекта: продукт, стадия, команда и масштаб.",
    problem: "Что именно не работало и почему это было важно решить.",
    process: ["Исследование", "Структура", "Визуальная система", "Проверка на носителях"],
    proposal: "Что было собрано и почему такое решение подходит задаче.",
    result: "Что изменилось после проекта: эффект, ясность, масштабирование или метрики.",
    media: ["Ключевой экран", "Деталь системы", "Финальный носитель"],
  };

  return [
    {
      id: crypto.randomUUID(),
      type: "case-hero",
      label: caseData.label,
      text: title,
      summary,
      meta: ["Роль: визуальная система", "Формат: концепт и дизайн", "Фокус: ясность и масштабирование"],
    },
    {
      id: crypto.randomUUID(),
      type: "case-section",
      label: "01 Context",
      title: "Контекст",
      text: caseData.context,
    },
    {
      id: crypto.randomUUID(),
      type: "case-media-grid",
      label: "Артефакты контекста",
      title: "Что важно показать",
      items: mediaItems(["Продукт и точки контакта", "Материалы до системы", "Среда использования"]),
    },
    {
      id: crypto.randomUUID(),
      type: "case-section",
      label: "02 Problem",
      title: "Проблема",
      text: caseData.problem,
    },
    {
      id: crypto.randomUUID(),
      type: "case-process",
      label: "03 Process",
      title: "Процесс",
      steps: caseData.process,
    },
    {
      id: crypto.randomUUID(),
      type: "case-media-grid",
      label: "Артефакты процесса",
      title: "Визуальные пробы и система",
      items: mediaItems(caseData.media),
    },
    {
      id: crypto.randomUUID(),
      type: "case-section",
      label: "04 Proposal",
      title: "Решение",
      text: caseData.proposal,
    },
    {
      id: crypto.randomUUID(),
      type: "case-media-grid",
      label: "Финальные экраны",
      title: "Как решение выглядит в носителях",
      items: mediaItems(["Ключевой экран", "Деталь системы", "Финальная композиция"]),
    },
    {
      id: crypto.randomUUID(),
      type: "case-result",
      label: "05 Result",
      title: "Результат",
      items: [
        ["Система", "Собран понятный визуальный принцип."],
        ["Контент", "Есть места для ключевых экранов и носителей."],
        ["Масштаб", caseData.result],
      ],
    },
  ];
}

function defaultTextBlocksForWidget(widget) {
  if (Array.isArray(widget.textBlocks) && widget.textBlocks.length) return widget.textBlocks;
  if (widget.type === "bio") {
    return [
      createTextBlock({ role: "title", text: widget.title || "Анастасия\nПескова", x: 108, y: 78, w: Math.max(160, widget.w - 134), size: 28, weight: 680 }),
      createTextBlock({ role: "body", text: widget.text || "", x: 24, y: 154, w: Math.max(220, widget.w - 48), size: 14, weight: 430 }),
    ];
  }
  if (widget.type === "about") {
    return [
      createTextBlock({ role: "title", text: widget.title || "Коммуникационный\nдизайнер", x: 24, y: 210, w: Math.max(220, widget.w - 48), align: "center", size: 25, weight: 680 }),
      createTextBlock({ role: "body", text: widget.text || "", x: 26, y: 278, w: Math.max(220, widget.w - 52), align: "center", size: 13, weight: 600 }),
    ];
  }
  if (widget.type === "project-category") {
    return [
      createTextBlock({ role: "title", text: widget.title || "Проект", x: 18, y: 18, w: Math.max(90, widget.w - 58), size: 12, weight: 600 }),
      createTextBlock({ role: "body", text: widget.text || "", x: 18, y: Math.max(74, widget.h - 68), w: Math.max(90, widget.w - 36), size: 10, weight: 560 }),
    ];
  }
  return [
    createTextBlock({ role: "title", text: widget.title || "Контакты", x: 24, y: 22, w: Math.max(180, widget.w - 48), size: 12, weight: 600 }),
  ];
}

function defaultIconsForWidget(widget) {
  if (Array.isArray(widget.icons) && widget.icons.length) return widget.icons;
  if (widget.type !== "contacts") return [];
  return [
    { id: crypto.randomUUID(), src: "os-portfolio/assets/icons/Paper_Plane.svg", iconColor: "#ffffff", plateColor: "#d4dae4", x: 34, y: 70, plateSize: 64, iconSize: 28 },
    { id: crypto.randomUUID(), src: "os-portfolio/assets/icons/Mail.svg", iconColor: "#ffffff", plateColor: "#d4dae4", x: Math.round(widget.w / 2 - 32), y: 70, plateSize: 64, iconSize: 28 },
    { id: crypto.randomUUID(), src: "os-portfolio/assets/icons/Link_Horizontal.svg", iconColor: "#ffffff", plateColor: "#d4dae4", x: Math.max(34, widget.w - 98), y: 70, plateSize: 64, iconSize: 28 },
  ];
}

function defaultFramesForWidget(widget) {
  if (widget.frames) return widget.frames;
  if (widget.type === "bio") {
    return [createImageFrameFrame({ x: 24, y: 82, w: 62, h: 62, radius: 999 })];
  }
  if (widget.type === "about") {
    return [createImageFrameFrame({ x: Math.round(widget.w * 0.22), y: 84, w: Math.round(widget.w * 0.56), h: 112, radius: 38 })];
  }
  return [];
}

function createOsStarterWidgets() {
  const gap = 24;
  const viewportW = 1180;
  const viewportH = 820;
  const usableWidth = 1050;
  const startX = Math.round((viewportW - usableWidth) / 2);
  const leftW = Math.round(usableWidth * 0.31);
  const centerW = Math.round(usableWidth * 0.33);
  const rightW = usableWidth - leftW - centerW - gap * 2;
  const bioH = 236;
  const aboutH = 425;
  const top = Math.round((viewportH - aboutH) / 2) - 24;
  const projectCardW = Math.floor((rightW - gap) / 2);
  const projectCardH = Math.floor((aboutH - gap) / 2);
  const contactH = 148;
  const leftX = startX;
  const centerX = startX + leftW + gap;
  const rightX = startX + leftW + centerW + gap * 2;
  const projectItems = [
    ["Айдентика", "Identity", "Логотипы, айдентика и визуальные системы.", "Logotypes, identity and visual systems."],
    ["Web", "Web", "Лендинги, сайты и digital-интерфейсы.", "Landing pages, websites and digital interfaces."],
    ["Коммуникации", "Communications", "Кампании, соцсети и презентации.", "Campaigns, social content and presentations."],
    ["Моушин", "Motion", "Motion-графика, 3D и AI-визуалы.", "Motion graphics, 3D and AI visuals."],
  ];

  return [
    {
      id: crypto.randomUUID(),
      type: "bio",
      title: "Анастасия\nПескова",
      titleEn: "Anastasia\nPeskova",
      text: "Коммуникационный дизайнер с опытом работы более 3х лет. Делаю так, чтобы бренды выглядели цельно и современно, а аудитория их замечала и любила.",
      textEn: "Communication designer with 3+ years of experience. I help brands look coherent and contemporary, so their audiences notice and remember them.",
      x: leftX,
      y: top,
      w: leftW,
      h: bioH,
      radius: 29,
      glassOpacity: 0.56,
      tintColor: "#f8faff",
      textColor: "#232428",
      fontWeight: 560,
      expandedLayout: { direction: "column", align: "center", gap: 18 },
      expandedBlocks: [],
      frames: [createImageFrameFrame({ x: 24, y: 82, w: 62, h: 62, radius: 999 })],
    },
    ...projectItems.map(([title, titleEn, text, textEn], index) => ({
      id: crypto.randomUUID(),
      type: "project-category",
      title,
      titleEn,
      text,
      textEn,
      x: rightX + (index % 2) * (projectCardW + gap),
      y: top + Math.floor(index / 2) * (projectCardH + gap),
      w: projectCardW,
      h: projectCardH,
      radius: 29,
      glassOpacity: 0.56,
      tintColor: "#f8faff",
      textColor: "#232428",
      fontWeight: 560,
      expandedLayout: { direction: "column", align: "start", gap: 16 },
      expandedBlocks: createProjectCaseBlocks(title, text),
    })),
    {
      id: crypto.randomUUID(),
      type: "about",
      title: "Коммуникационный\nдизайнер",
      titleEn: "Communication\ndesigner",
      text: "Создаю современный визуальный стиль брендов, усиливая классический дизайн технологиями 3D и AI. Помогаю компаниям любого масштаба: от стартапов до Сбера, влюблять в себя клиентов.",
      textEn: "I create contemporary visual styles for brands, amplifying classic design with 3D and AI. I help companies of any scale build identities clients fall for.",
      x: centerX,
      y: top,
      w: centerW,
      h: aboutH,
      radius: 29,
      glassOpacity: 0.56,
      tintColor: "#f8faff",
      textColor: "#232428",
      fontWeight: 560,
      expandedLayout: { direction: "column", align: "center", gap: 20 },
      expandedBlocks: [],
      frames: [createImageFrameFrame({ x: Math.round(centerW * 0.22), y: 84, w: Math.round(centerW * 0.56), h: 112, radius: 38 })],
    },
    {
      id: crypto.randomUUID(),
      type: "contacts",
      title: "Контакты",
      titleEn: "Contacts",
      text: "Telegram, email, LinkedIn",
      textEn: "Telegram, email, LinkedIn",
      x: leftX,
      y: top + bioH + gap,
      w: leftW,
      h: contactH,
      radius: 29,
      glassOpacity: 0.56,
      tintColor: "#f8faff",
      textColor: "#232428",
      fontWeight: 560,
      expandedLayout: { direction: "row", align: "center", gap: 18 },
      expandedBlocks: [],
    },
  ];
}

function readOsWidgets() {
  try {
    const saved = JSON.parse(localStorage.getItem(osWidgetStorageKey));
    if (!Array.isArray(saved) || saved.length < 7) return createOsStarterWidgets().map(normalizeOsWidget);
    const hasCore =
      saved.some((widget) => widget.type === "bio") &&
      saved.some((widget) => widget.type === "about") &&
      saved.some((widget) => widget.type === "contacts") &&
      saved.filter((widget) => widget.type === "project-category").length >= 4;
    const hasUsableFrames = saved.every((widget) => {
      const hasNumbers = ["x", "y", "w", "h"].every((field) => Number.isFinite(widget[field]));
      if (!hasNumbers) return false;
      if (widget.type === "project-category") return widget.w >= 120 && widget.h >= 150;
      if (widget.type === "about") return widget.w >= 300 && widget.h >= 360;
      if (widget.type === "bio") return widget.w >= 280 && widget.h >= 200;
      if (widget.type === "contacts") return widget.w >= 280 && widget.h >= 130;
      return widget.w >= 120 && widget.h >= 120;
    });
    return hasCore && hasUsableFrames
      ? saved.map(normalizeOsWidget)
      : createOsStarterWidgets().map(normalizeOsWidget);
  } catch {
    return createOsStarterWidgets().map(normalizeOsWidget);
  }
}

function normalizeOsWidget(widget) {
  const normalized = {
    radius: 29,
    glassOpacity: 0.56,
    tintColor: "#f8faff",
    textColor: "#232428",
    fontWeight: 560,
    expandedLayout: { direction: "column", align: "center", gap: 18 },
    expandedBlocks: [],
    imageFit: "cover",
    imageX: 50,
    imageY: 50,
    imageScrim: 0.18,
    ...widget,
  };
  normalized.frames = defaultFramesForWidget(normalized).map((frame) => ({
    imageScale: 100,
    ...frame,
  }));
  normalized.textBlocks = defaultTextBlocksForWidget(normalized);
  const hasCaseBlocks = Array.isArray(normalized.expandedBlocks) && normalized.expandedBlocks.some((block) => String(block.type || "").startsWith("case-"));
  const hasLegacyCaseMap = Array.isArray(normalized.expandedBlocks) && normalized.expandedBlocks.some((block) => block.type === "case-map");
  if (normalized.type === "project-category" && (!hasCaseBlocks || hasLegacyCaseMap)) {
    normalized.expandedBlocks = createProjectCaseBlocks(normalized.title, normalized.text);
    normalized.expandedLayout = { direction: "column", align: "start", gap: 18 };
  }
  normalized.icons = defaultIconsForWidget(normalized).map((icon) => ({
    plateSize: icon.size || 64,
    iconSize: Math.round((icon.size || 64) * 0.44),
    plateColor: "#d4dae4",
    iconColor: icon.color || "#ffffff",
    ...icon,
  }));
  return normalized;
}

function hexToRgb(value = "#f8faff") {
  const normalized = value.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((letter) => letter + letter).join("")
    : normalized.padEnd(6, "f").slice(0, 6);
  const int = Number.parseInt(full, 16);
  return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
}

const cloneInitial = () => JSON.parse(JSON.stringify(initialContent));

function normalizeContent(saved) {
  const fallback = cloneInitial();
  if (!saved) return fallback;
  const isCurrentSchema = saved.schemaVersion === fallback.schemaVersion;
  if (!isCurrentSchema) {
    return {
      ...fallback,
      email: saved.email || fallback.email,
      telegram: saved.telegram || fallback.telegram,
      instagram: saved.instagram || fallback.instagram,
    };
  }
  return {
    ...fallback,
    ...saved,
    projects: isCurrentSchema && Array.isArray(saved.projects)
      ? saved.projects.map((project, index) => ({
          ...fallback.projects[index],
          ...project,
          titleEn:
            project.titleEn || fallback.projects[index]?.titleEn || project.title,
          descriptionEn:
            project.descriptionEn ||
            fallback.projects[index]?.descriptionEn ||
            project.description,
          noteEn:
            project.noteEn || fallback.projects[index]?.noteEn || project.note,
          categoryEn: project.categoryEn || project.category,
          gallery: Array.isArray(project.gallery) ? project.gallery : [],
          frame: getImageFrame(project.frame),
        }))
      : fallback.projects,
    layout: {
      ...defaultLayout,
      ...(saved.layout || {}),
      order: saved.layout?.order || defaultLayout.order,
      guides: {
        ...defaultLayout.guides,
        ...(saved.layout?.guides || {}),
      },
      grid: {
        ...defaultLayout.grid,
        ...(saved.layout?.grid || {}),
      },
      editor: {
        ...defaultLayout.editor,
        ...(saved.layout?.editor || {}),
      },
      chrome: {
        header: {
          ...defaultLayout.chrome.header,
          ...(saved.layout?.chrome?.header || {}),
        },
        menu: {
          ...defaultLayout.chrome.menu,
          ...(saved.layout?.chrome?.menu || {}),
        },
        footer: {
          ...defaultLayout.chrome.footer,
          ...(saved.layout?.chrome?.footer || {}),
        },
      },
      blocks: {
        hero: {
          ...defaultLayout.blocks.hero,
          ...(saved.layout?.blocks?.hero || {}),
          title: {
            ...defaultLayout.blocks.hero.title,
            ...(saved.layout?.blocks?.hero?.title || {}),
          },
          images: saved.layout?.blocks?.hero?.images || {},
          customElements: (
            saved.layout?.blocks?.hero?.customElements || []
          ).filter((element) => element.visible !== false),
        },
        manifesto: {
          ...defaultLayout.blocks.manifesto,
          ...(saved.layout?.blocks?.manifesto || {}),
          text: {
            ...defaultLayout.blocks.manifesto.text,
            ...(saved.layout?.blocks?.manifesto?.text || {}),
          },
          customElements:
            saved.layout?.blocks?.manifesto?.customElements?.filter(
              (element) => element.visible !== false,
            ) || [],
        },
        projects: {
          ...defaultLayout.blocks.projects,
          ...(saved.layout?.blocks?.projects || {}),
          heading: {
            ...defaultLayout.blocks.projects.heading,
            ...(saved.layout?.blocks?.projects?.heading || {}),
          },
          customElements:
            saved.layout?.blocks?.projects?.customElements?.filter(
              (element) => element.visible !== false,
            ) || [],
        },
        ...Object.fromEntries(
          Object.entries(saved.layout?.blocks || {}).filter(
            ([id]) => !["hero", "manifesto", "projects"].includes(id),
          ).map(([id, block]) => [
            id,
            {
              ...block,
              customElements: (block.customElements || []).filter(
                (element) => element.visible !== false,
              ),
            },
          ]),
        ),
      },
    },
  };
}

function usePortfolioContent() {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem("peskova-portfolio-content");
      return saved ? normalizeContent(JSON.parse(saved)) : cloneInitial();
    } catch {
      return cloneInitial();
    }
  });

  useEffect(() => {
    if (!isCloudConfigured) return;
    loadCloudContent()
      .then((cloudContent) => {
        if (cloudContent) setContent(normalizeContent(cloudContent));
      })
      .catch(() => {});
  }, []);

  return [content, setContent];
}

function getRoute() {
  const hash = window.location.hash.replace("#", "") || "/";
  const [path, query = ""] = hash.split("?");
  return { path, query: new URLSearchParams(query) };
}

export function App() {
  const [content, setContent] = usePortfolioContent();
  const [route, setRoute] = useState(() => {
    consumeAuthRedirect();
    return getRoute();
  });
  const [language, setLanguage] = useState(
    () => localStorage.getItem("peskova-portfolio-language") || "ru",
  );
  const [adminUser, setAdminUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(isCloudConfigured);

  useEffect(() => {
    const onHash = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!isCloudConfigured) {
      setAuthChecking(false);
      return;
    }
    const session = consumeAuthRedirect() || getCloudSession();
    getCloudUser(session)
      .then((user) => {
        if (user?.email?.toLowerCase() === adminEmail) setAdminUser(user);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };
  const localEditorPreview =
    import.meta.env.DEV && route.path === "/admin" && route.query.get("preview") === "1";

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("peskova-portfolio-language", nextLanguage);
  };

  if (route.path === "/admin") {
    return <WidgetStudio onExit={() => navigate("/")} />;
  }

  return <PortfolioDesktop />;

  const projectId = route.path.startsWith("/project/")
    ? route.path.split("/")[2]
    : null;
  const selectedProject = content.projects.find(
    (project) => project.id === projectId,
  );
  const publicGrid = { ...defaultLayout.grid, ...(content.layout.grid || {}) };

  return (
    <div
      className="site-shell"
      style={{
        "--custom-page-pad": `${publicGrid.pagePadding}px`,
        "--project-columns": publicGrid.columns,
        "--project-gap": `${publicGrid.gap}px`,
        "--content-max": `${publicGrid.maxWidth}px`,
      }}
    >
      <Header
        content={content}
        language={language}
        onLanguageChange={changeLanguage}
        route={route.path}
      />
      {selectedProject ? (
        <ProjectPage
          language={language}
          project={selectedProject}
          projects={content.projects}
          navigate={navigate}
        />
      ) : route.path === "/projects" ? (
        <ProjectsPage content={content} language={language} />
      ) : route.path === "/about" ? (
        <AboutPage content={content} language={language} />
      ) : route.path === "/contacts" ? (
        <ContactsPage content={content} language={language} />
      ) : (
        <HomePage content={content} language={language} />
      )}
      <Footer content={content} language={language} />
    </div>
  );
}

function PortfolioDesktop() {
  return (
    <main className="os-portfolio-shell" aria-label="Портфолио Анастасии Песковой">
      <iframe
        className="os-portfolio-frame"
        src="os-portfolio/index.html"
        aria-label="Портфолио Анастасии Песковой"
      />
    </main>
  );
}

function WidgetStudio({ onExit }) {
  const [widgets, setWidgets] = useState(readOsWidgets);
  const [chrome, setChrome] = useState(readOsChrome);
  const [activeId, setActiveId] = useState(() => widgets[0]?.id || null);
  const [activePanel, setActivePanel] = useState("widgets");
  const [selectedLayer, setSelectedLayer] = useState(() => ({ type: "widget", id: widgets[0]?.id || null }));
  const [selectedItems, setSelectedItems] = useState(() => widgets[0] ? [{ type: "widget", widgetId: widgets[0].id, id: widgets[0].id }] : []);
  const [spacingGap, setSpacingGap] = useState(20);
  const [cropFrameId, setCropFrameId] = useState(null);
  const [notice, setNotice] = useState("Изменения сохраняются локально после кнопки «Сохранить»");
  const [moscowPreviewTime, setMoscowPreviewTime] = useState("09:00");
  const [osGuides, setOsGuides] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("portfolio-2025-os-guides-v1"));
      return {
        vertical: Array.isArray(saved?.vertical) ? saved.vertical : [590],
        horizontal: Array.isArray(saved?.horizontal) ? saved.horizontal : [410],
      };
    } catch {
      return { vertical: [590], horizontal: [410] };
    }
  });
  const dragState = useRef(null);
  const historyRef = useRef([]);
  const canvasViewportRef = useRef(null);
  const [stageScale, setStageScale] = useState(1);
  const activeWidget = widgets.find((widget) => widget.id === activeId) || widgets[0];

  const selectionKey = (item) => `${item.type}:${item.widgetId}:${item.id}`;

  const snapshot = () => ({
    widgets: JSON.parse(JSON.stringify(widgets)),
    chrome: JSON.parse(JSON.stringify(chrome)),
  });

  const remember = () => {
    historyRef.current = [...historyRef.current.slice(-29), snapshot()];
  };

  const undoLast = () => {
    const previous = historyRef.current.pop();
    if (!previous) {
      setNotice("Пока нечего отменять");
      return;
    }
    setWidgets(previous.widgets);
    setChrome(previous.chrome);
    setSelectedItems([]);
    setSelectedLayer({ type: "widget", id: previous.widgets[0]?.id || null });
    setActiveId(previous.widgets[0]?.id || null);
    setNotice("Последнее действие отменено");
  };

  const isSelected = (type, widgetId, id) =>
    selectedItems.some((item) => item.type === type && item.widgetId === widgetId && item.id === id);

  const getSelectedTargets = () => selectedItems
    .map((item) => {
      const widget = widgets.find((candidate) => candidate.id === item.widgetId);
      if (!widget) return null;
      if (item.type === "widget") return { item, widget, target: widget };
      const field = item.type === "text" ? "textBlocks" : item.type === "frame" ? "frames" : "icons";
      const target = (widget[field] || []).find((layer) => layer.id === item.id);
      return target ? { item, widget, target } : null;
    })
    .filter(Boolean);

  useEffect(() => {
    if (!canvasViewportRef.current) return;
    const updateScale = () => {
      const rect = canvasViewportRef.current.getBoundingClientRect();
      setStageScale(Math.min(1, rect.width / 1180, rect.height / 820));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(canvasViewportRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const time = new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Moscow",
      }).format(new Date());
      setMoscowPreviewTime(time);
    };
    updateTime();
    const timer = window.setInterval(updateTime, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const updateWidget = (id, patch) => {
    if (!dragState.current) remember();
    setWidgets((current) =>
      current.map((widget) => (widget.id === id ? { ...widget, ...patch } : widget)),
    );
    setNotice("Есть несохранённые изменения");
  };

  const updateGuides = (nextGuides) => {
    setOsGuides(nextGuides);
    localStorage.setItem("portfolio-2025-os-guides-v1", JSON.stringify(nextGuides));
    setNotice("Направляющие обновлены");
  };

  const addGuide = (axis) => {
    const nextGuides = {
      ...osGuides,
      [axis]: [...osGuides[axis], axis === "vertical" ? 590 : 410],
    };
    updateGuides(nextGuides);
  };

  const removeGuide = (axis, index) => {
    updateGuides({
      ...osGuides,
      [axis]: osGuides[axis].filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const alignActiveWidget = (mode) => {
    if (!activeWidget) return;
    const patch = {};
    if (mode === "left") patch.x = 65;
    if (mode === "center") patch.x = Math.round((1180 - activeWidget.w) / 2);
    if (mode === "right") patch.x = Math.round(1180 - activeWidget.w - 65);
    if (mode === "top") patch.y = 142;
    if (mode === "middle") patch.y = Math.round((820 - activeWidget.h) / 2);
    if (mode === "bottom") patch.y = Math.round(820 - activeWidget.h - 110);
    updateWidget(activeWidget.id, patch);
    setNotice("Виджет выровнен");
  };

  const updateLayer = (widgetId, layerType, layerId, patch) => {
    if (!dragState.current) remember();
    const field = layerType === "text" ? "textBlocks" : layerType === "frame" ? "frames" : "icons";
    setWidgets((current) =>
      current.map((widget) =>
        widget.id === widgetId
          ? {
              ...widget,
              [field]: (widget[field] || []).map((layer) =>
                layer.id === layerId ? { ...layer, ...patch } : layer,
              ),
            }
          : widget,
      ),
    );
    setNotice("Есть несохранённые изменения");
  };

  const selectLayer = (widget, type = "widget", id = widget.id, append = false) => {
    const item = { type, widgetId: widget.id, id };
    setActiveId(widget.id);
    setActivePanel("widgets");
    setSelectedLayer({ type, id });
    setSelectedItems((current) => {
      if (!append) return [item];
      const key = selectionKey(item);
      const exists = current.some((candidate) => selectionKey(candidate) === key);
      const next = exists
        ? current.filter((candidate) => selectionKey(candidate) !== key)
        : [...current, item];
      return next.length ? next : [item];
    });
    if (type !== "frame") setCropFrameId(null);
  };

  const saveWidgets = () => {
    localStorage.setItem(osWidgetStorageKey, JSON.stringify(widgets));
    localStorage.setItem(osChromeStorageKey, JSON.stringify(chrome));
    localStorage.removeItem(osUserLayoutStorageKey);
    setNotice("Настройки сохранены");
  };

  const updateChrome = (section, patch) => {
    remember();
    setChrome((current) => ({
      ...current,
      [section]: { ...current[section], ...patch },
    }));
    setNotice("Есть несохранённые изменения");
  };

  const addWidget = (type = "project-category") => {
    remember();
    const base = {
      id: crypto.randomUUID(),
      type,
      title: type === "contacts" ? "Контакты" : type === "bio" ? "Новый блок" : "Новый виджет",
      text: type === "contacts" ? "Telegram, email, LinkedIn" : "Добавьте описание.",
      x: 420,
      y: 250,
      w: type === "project-category" ? 170 : 300,
      h: type === "project-category" ? 210 : 180,
      radius: 29,
      glassOpacity: 0.56,
      tintColor: "#f8faff",
      textColor: "#232428",
      fontWeight: 560,
      expandedLayout: { direction: "column", align: "center", gap: 18 },
      expandedBlocks: [],
      imageFit: "cover",
      imageX: 50,
      imageY: 50,
      imageScrim: 0.18,
      frames: type === "bio" ? [createImageFrameFrame({ x: 24, y: 82, w: 62, h: 62, radius: 999 })] : [],
    };
    const normalized = normalizeOsWidget(base);
    setWidgets((current) => [...current, normalized]);
    setActiveId(normalized.id);
    setSelectedItems([{ type: "widget", widgetId: normalized.id, id: normalized.id }]);
    setSelectedLayer({ type: "widget", id: normalized.id });
    setNotice("Виджет добавлен");
  };

  const removeWidget = (id) => {
    remember();
    setWidgets((current) => current.filter((widget) => widget.id !== id));
    setActiveId((current) => {
      if (current !== id) return current;
      return widgets.find((widget) => widget.id !== id)?.id || null;
    });
    setSelectedItems((current) => current.filter((item) => item.widgetId !== id));
    setNotice("Виджет удалён");
  };

  const duplicateWidget = () => {
    if (!activeWidget) return;
    remember();
    const copy = {
      ...activeWidget,
      id: crypto.randomUUID(),
      title: `${activeWidget.title} copy`,
      x: activeWidget.x + 24,
      y: activeWidget.y + 24,
    };
    setWidgets((current) => [...current, copy]);
    setActiveId(copy.id);
    setSelectedItems([{ type: "widget", widgetId: copy.id, id: copy.id }]);
    setSelectedLayer({ type: "widget", id: copy.id });
    setNotice("Виджет продублирован");
  };

  const startDrag = (event, widget) => {
    event.preventDefault();
    selectLayer(widget, "widget", widget.id, event.shiftKey);
    setCropFrameId(null);
    remember();
    const selectedTargets = isSelected("widget", widget.id, widget.id)
      ? getSelectedTargets().filter(({ item }) => item.type === "widget")
      : [{ item: { type: "widget", widgetId: widget.id, id: widget.id }, widget, target: widget }];
    dragState.current = {
      kind: "widget",
      id: widget.id,
      selectedTargets: selectedTargets.map(({ item, target }) => ({
        ...item,
        x: target.x || 0,
        y: target.y || 0,
      })),
      startX: event.clientX,
      startY: event.clientY,
      x: widget.x,
      y: widget.y,
      scale: stageScale || 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const startLayerDrag = (event, widget, layerType, layer) => {
    event.preventDefault();
    event.stopPropagation();
    selectLayer(widget, layerType, layer.id, event.shiftKey);
    remember();
    const selectedTargets = isSelected(layerType, widget.id, layer.id)
      ? getSelectedTargets().filter(({ item }) => item.type !== "widget")
      : [{ item: { type: layerType, widgetId: widget.id, id: layer.id }, widget, target: layer }];
    dragState.current = {
      kind: "layer",
      widgetId: widget.id,
      layerType,
      layerId: layer.id,
      selectedTargets: selectedTargets.map(({ item, target }) => ({
        ...item,
        x: target.x || 0,
        y: target.y || 0,
      })),
      startX: event.clientX,
      startY: event.clientY,
      x: layer.x || 0,
      y: layer.y || 0,
      scale: stageScale || 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const startResize = (event, widget, layerType = "widget", layer = widget) => {
    event.preventDefault();
    event.stopPropagation();
    selectLayer(widget, layerType, layer.id);
    remember();
    dragState.current = {
      kind: "resize",
      widgetId: widget.id,
      layerType,
      layerId: layer.id,
      startX: event.clientX,
      startY: event.clientY,
      w: layer.w || layer.plateSize || widget.w,
      h: layer.h || layer.plateSize || widget.h,
      scale: stageScale || 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const startFrameImageDrag = (event, widget, frame) => {
    if (cropFrameId !== frame.id || !frame.image) return startLayerDrag(event, widget, "frame", frame);
    event.preventDefault();
    event.stopPropagation();
    selectLayer(widget, "frame", frame.id);
    remember();
    dragState.current = {
      kind: "frameImage",
      widgetId: widget.id,
      frameId: frame.id,
      startX: event.clientX,
      startY: event.clientY,
      imageX: frame.imageX ?? 50,
      imageY: frame.imageY ?? 50,
      w: frame.w || 1,
      h: frame.h || 1,
      scale: stageScale || 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const startGuideDrag = (event, axis, index) => {
    event.preventDefault();
    event.stopPropagation();
    dragState.current = {
      kind: "guide",
      axis,
      index,
      scale: stageScale || 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragWidget = (event) => {
    const drag = dragState.current;
    if (!drag) return;
    if (drag.kind === "guide") {
      const rect = canvasViewportRef.current?.querySelector(".studio-canvas")?.getBoundingClientRect();
      if (!rect) return;
      const raw = drag.axis === "vertical"
        ? (event.clientX - rect.left) / drag.scale
        : (event.clientY - rect.top) / drag.scale;
      const max = drag.axis === "vertical" ? 1180 : 820;
      const position = Math.round(Math.min(Math.max(raw, 0), max));
      setOsGuides((current) => {
        const next = {
          ...current,
          [drag.axis]: current[drag.axis].map((item, itemIndex) => itemIndex === drag.index ? position : item),
        };
        localStorage.setItem("portfolio-2025-os-guides-v1", JSON.stringify(next));
        return next;
      });
      return;
    }
    const widget = widgets.find((item) => item.id === drag.id);
    if (drag.kind === "layer") {
      const dx = (event.clientX - drag.startX) / drag.scale;
      const dy = (event.clientY - drag.startY) / drag.scale;
      const moving = drag.selectedTargets?.length ? drag.selectedTargets : [{
        type: drag.layerType,
        widgetId: drag.widgetId,
        id: drag.layerId,
        x: drag.x,
        y: drag.y,
      }];
      setWidgets((current) => current.map((widgetItem) => {
        const layersForWidget = moving.filter((item) => item.widgetId === widgetItem.id);
        if (!layersForWidget.length) return widgetItem;
        let nextWidget = widgetItem;
        ["text", "frame", "icon"].forEach((type) => {
          const field = type === "text" ? "textBlocks" : type === "frame" ? "frames" : "icons";
          const layers = layersForWidget.filter((item) => item.type === type);
          if (!layers.length) return;
          nextWidget = {
            ...nextWidget,
            [field]: (nextWidget[field] || []).map((layer) => {
              const source = layers.find((item) => item.id === layer.id);
              if (!source) return layer;
              const maxX = Math.max(0, nextWidget.w - (layer.w || layer.plateSize || 20));
              const maxY = Math.max(0, nextWidget.h - (layer.h || layer.plateSize || 20));
              return {
                ...layer,
                x: Math.round(Math.min(Math.max(source.x + dx, 0), maxX)),
                y: Math.round(Math.min(Math.max(source.y + dy, 0), maxY)),
              };
            }),
          };
        });
        return nextWidget;
      }));
      setNotice("Есть несохранённые изменения");
      return;
    }
    if (drag.kind === "resize") {
      const dx = (event.clientX - drag.startX) / drag.scale;
      const dy = (event.clientY - drag.startY) / drag.scale;
      if (drag.layerType === "widget") {
        updateWidget(drag.widgetId, {
          w: Math.round(Math.min(Math.max(drag.w + dx, 90), 960)),
          h: Math.round(Math.min(Math.max(drag.h + dy, 80), 760)),
        });
        return;
      }
      if (drag.layerType === "icon") {
        const next = Math.round(Math.min(Math.max(drag.w + Math.max(dx, dy), 24), 180));
        updateLayer(drag.widgetId, "icon", drag.layerId, { plateSize: next });
        return;
      }
      updateLayer(drag.widgetId, drag.layerType, drag.layerId, {
        w: Math.round(Math.min(Math.max(drag.w + dx, 24), 900)),
        h: Math.round(Math.min(Math.max(drag.h + dy, 18), 700)),
      });
      return;
    }
    if (drag.kind === "frameImage") {
      const dx = ((event.clientX - drag.startX) / drag.scale / drag.w) * 100;
      const dy = ((event.clientY - drag.startY) / drag.scale / drag.h) * 100;
      updateLayer(drag.widgetId, "frame", drag.frameId, {
        imageX: Math.round(Math.min(Math.max(drag.imageX + dx, 0), 100)),
        imageY: Math.round(Math.min(Math.max(drag.imageY + dy, 0), 100)),
      });
      return;
    }
    if (!widget) return;
    const dx = (event.clientX - drag.startX) / drag.scale;
    const dy = (event.clientY - drag.startY) / drag.scale;
    const moving = drag.selectedTargets?.length ? drag.selectedTargets : [{
      type: "widget",
      widgetId: drag.id,
      id: drag.id,
      x: drag.x,
      y: drag.y,
    }];
    setWidgets((current) => current.map((item) => {
      const source = moving.find((selected) => selected.id === item.id);
      if (!source) return item;
      const maxX = Math.max(0, 1180 - (item.w || 0));
      const maxY = Math.max(0, 820 - (item.h || 0));
      return {
        ...item,
        x: Math.round(Math.min(Math.max(source.x + dx, 0), maxX)),
        y: Math.round(Math.min(Math.max(source.y + dy, 0), maxY)),
      };
    }));
    setNotice("Есть несохранённые изменения");
  };

  const stopDrag = () => {
    dragState.current = null;
  };

  const moveSelectedBy = (dx, dy) => {
    const targets = getSelectedTargets();
    if (!targets.length) return;
    remember();
    setWidgets((current) => current.map((widgetItem) => {
      const widgetTarget = targets.find(({ item }) => item.type === "widget" && item.id === widgetItem.id);
      let nextWidget = widgetTarget
        ? {
            ...widgetItem,
            x: Math.round(Math.min(Math.max((widgetItem.x || 0) + dx, 0), Math.max(0, 1180 - widgetItem.w))),
            y: Math.round(Math.min(Math.max((widgetItem.y || 0) + dy, 0), Math.max(0, 820 - widgetItem.h))),
          }
        : widgetItem;
      ["text", "frame", "icon"].forEach((type) => {
        const field = type === "text" ? "textBlocks" : type === "frame" ? "frames" : "icons";
        const selectedForField = targets.filter(({ item }) => item.widgetId === widgetItem.id && item.type === type);
        if (!selectedForField.length) return;
        nextWidget = {
          ...nextWidget,
          [field]: (nextWidget[field] || []).map((layer) => {
            const selectedTarget = selectedForField.find(({ item }) => item.id === layer.id);
            if (!selectedTarget) return layer;
            const maxX = Math.max(0, nextWidget.w - (layer.w || layer.plateSize || 20));
            const maxY = Math.max(0, nextWidget.h - (layer.h || layer.plateSize || 20));
            return {
              ...layer,
              x: Math.round(Math.min(Math.max((layer.x || 0) + dx, 0), maxX)),
              y: Math.round(Math.min(Math.max((layer.y || 0) + dy, 0), maxY)),
            };
          }),
        };
      });
      return nextWidget;
    }));
    setNotice(`Сдвинуто: ${targets.length} объект(а)`);
  };

  const applySelectionGap = (axis = "horizontal") => {
    const targets = getSelectedTargets()
      .filter(({ item }) => item.type === "widget")
      .sort((a, b) => axis === "horizontal" ? a.target.x - b.target.x : a.target.y - b.target.y);
    if (targets.length < 2) {
      setNotice("Выбери минимум два виджета через Shift-клик");
      return;
    }
    remember();
    const positions = new Map();
    let cursor = axis === "horizontal" ? targets[0].target.x : targets[0].target.y;
    targets.forEach(({ target }, index) => {
      if (index > 0) {
        const previous = targets[index - 1].target;
        cursor += (axis === "horizontal" ? previous.w : previous.h) + Number(spacingGap || 0);
      }
      positions.set(target.id, Math.round(cursor));
    });
    setWidgets((current) => current.map((widgetItem) => {
      if (!positions.has(widgetItem.id)) return widgetItem;
      return axis === "horizontal"
        ? { ...widgetItem, x: positions.get(widgetItem.id) }
        : { ...widgetItem, y: positions.get(widgetItem.id) };
    }));
    setNotice(`Расстояние между виджетами: ${spacingGap}px`);
  };

  const alignSelected = (mode) => {
    const targets = getSelectedTargets();
    if (targets.length < 2) {
      alignActiveWidget(mode);
      return;
    }
    const widgetTargets = targets.filter(({ item }) => item.type === "widget");
    if (widgetTargets.length < 2) {
      setNotice("Групповое выравнивание сейчас работает для виджетов");
      return;
    }
    remember();
    const left = Math.min(...widgetTargets.map(({ target }) => target.x));
    const right = Math.max(...widgetTargets.map(({ target }) => target.x + target.w));
    const top = Math.min(...widgetTargets.map(({ target }) => target.y));
    const bottom = Math.max(...widgetTargets.map(({ target }) => target.y + target.h));
    const center = Math.round((left + right) / 2);
    const middle = Math.round((top + bottom) / 2);
    setWidgets((current) => current.map((widgetItem) => {
      if (!widgetTargets.some(({ target }) => target.id === widgetItem.id)) return widgetItem;
      if (mode === "left") return { ...widgetItem, x: left };
      if (mode === "right") return { ...widgetItem, x: right - widgetItem.w };
      if (mode === "center") return { ...widgetItem, x: center - Math.round(widgetItem.w / 2) };
      if (mode === "top") return { ...widgetItem, y: top };
      if (mode === "bottom") return { ...widgetItem, y: bottom - widgetItem.h };
      if (mode === "middle") return { ...widgetItem, y: middle - Math.round(widgetItem.h / 2) };
      return widgetItem;
    }));
    setNotice(`Выровнено: ${widgetTargets.length} виджета`);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoLast();
        return;
      }
      const step = event.shiftKey ? 10 : 1;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelectedBy(-step, 0);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelectedBy(step, 0);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelectedBy(0, -step);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelectedBy(0, step);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [widgets, chrome, selectedItems, spacingGap]);

  const handleImage = (file) => {
    if (!file || !activeWidget) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      updateWidget(activeWidget.id, { image: reader.result });
    });
    reader.readAsDataURL(file);
  };

  return (
    <main className="studio">
      <aside className="studio-panel studio-panel--left">
        <div className="studio-brand">
          <p>Portfolio OS</p>
          <h1>Личный кабинет</h1>
        </div>
        <div className="studio-nav-group" aria-label="Области сайта">
          <p>Области сайта</p>
          <button className={activePanel === "widgets" ? "active" : ""} type="button" onClick={() => setActivePanel("widgets")}>Виджеты</button>
          <button className={activePanel === "header" ? "active" : ""} type="button" onClick={() => setActivePanel("header")}>Хедер</button>
          <button className={activePanel === "footer" ? "active" : ""} type="button" onClick={() => setActivePanel("footer")}>Футер</button>
        </div>
        <div className="studio-actions">
          <p>Добавить виджет</p>
          <button type="button" onClick={() => addWidget("bio")}>Резюме</button>
          <button type="button" onClick={() => addWidget("project-category")}>Проект</button>
          <button type="button" onClick={() => addWidget("contacts")}>Контакты</button>
        </div>
        <div className="studio-actions studio-actions--tools">
          <p>Align</p>
          <button type="button" onClick={() => alignSelected("left")}>Left</button>
          <button type="button" onClick={() => alignSelected("center")}>Center</button>
          <button type="button" onClick={() => alignSelected("right")}>Right</button>
          <button type="button" onClick={() => alignSelected("top")}>Top</button>
          <button type="button" onClick={() => alignSelected("middle")}>Middle</button>
          <button type="button" onClick={() => alignSelected("bottom")}>Bottom</button>
        </div>
        <div className="studio-actions studio-actions--tools">
          <p>Автолейаут</p>
          <label className="studio-mini-field">
            <span>Gap</span>
            <input type="number" min="0" max="120" value={spacingGap} onChange={(event) => setSpacingGap(Number(event.target.value))} />
          </label>
          <button type="button" onClick={() => applySelectionGap("horizontal")}>Разложить X</button>
          <button type="button" onClick={() => applySelectionGap("vertical")}>Разложить Y</button>
          <span className="studio-selection-note">{selectedItems.length} выбрано</span>
        </div>
        <div className="studio-actions studio-actions--tools">
          <p>Направляющие</p>
          <button type="button" onClick={() => addGuide("vertical")}>+ Vertical</button>
          <button type="button" onClick={() => addGuide("horizontal")}>+ Horizontal</button>
          <button type="button" onClick={() => updateGuides({ vertical: [], horizontal: [] })}>Clear</button>
        </div>
        <div className="studio-list">
          {widgets.map((widget, index) => (
            <button
              className={widget.id === activeWidget?.id ? "active" : ""}
              key={widget.id}
              type="button"
              onClick={() => {
                setActivePanel("widgets");
                setActiveId(widget.id);
                setSelectedLayer({ type: "widget", id: widget.id });
                setSelectedItems([{ type: "widget", widgetId: widget.id, id: widget.id }]);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {widget.title.replaceAll("\n", " ")}
            </button>
          ))}
        </div>
        <div className="studio-bottom">
          <button type="button" onClick={saveWidgets}>Сохранить</button>
          <button type="button" onClick={onExit}>Открыть сайт</button>
        </div>
      </aside>

      <section className="studio-stage">
        <header className="studio-topline">
          <p>{notice}</p>
          <div>
            <button type="button" onClick={undoLast}>Отменить</button>
            <button type="button" onClick={saveWidgets}>Сохранить</button>
            <button type="button" onClick={duplicateWidget}>Дублировать</button>
            <button type="button" onClick={() => activeWidget && removeWidget(activeWidget.id)}>Удалить</button>
          </div>
        </header>
        <div className="studio-canvas-viewport" ref={canvasViewportRef}>
          <div
            className="studio-canvas"
            style={{
              zoom: stageScale,
              backgroundImage: 'linear-gradient(rgba(219, 232, 249, 0.34), rgba(219, 232, 249, 0.18)), url("os-portfolio/assets/sky-wallpaper.jpg")',
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            onPointerMove={dragWidget}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
          >
            <div className="studio-guides-layer" aria-hidden="true">
              {osGuides.vertical.map((position, index) => (
                <span
                  className="studio-guide studio-guide--vertical"
                  key={`v-${index}`}
                  style={{ left: position }}
                  onPointerDown={(event) => startGuideDrag(event, "vertical", index)}
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    removeGuide("vertical", index);
                  }}
                />
              ))}
              {osGuides.horizontal.map((position, index) => (
                <span
                  className="studio-guide studio-guide--horizontal"
                  key={`h-${index}`}
                  style={{ top: position }}
                  onPointerDown={(event) => startGuideDrag(event, "horizontal", index)}
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    removeGuide("horizontal", index);
                  }}
                />
              ))}
            </div>
            {chrome.header.visible && (
              <div className="studio-os-header" style={{ color: chrome.header.textColor }}>
                <span style={{ fontSize: chrome.header.fontSize }}>{moscowPreviewTime} | {chrome.header.location}</span>
                {chrome.header.showLanguage && (
                  <span className="studio-os-language" aria-hidden="true">
                    <span>EN</span>
                    <b>RU</b>
                  </span>
                )}
                {chrome.header.showSearch && (
                  <span className="studio-os-search" aria-hidden="true">⌕</span>
                )}
              </div>
            )}
            {widgets.map((widget) => (
              <button
                className={`studio-widget ${widget.id === activeWidget?.id ? "active" : ""} ${isSelected("widget", widget.id, widget.id) ? "selected" : ""}`}
                key={widget.id}
                type="button"
                style={{
                  left: widget.x,
                  top: widget.y,
                  width: widget.w,
                  height: widget.h,
                  borderRadius: widget.radius ?? 29,
                  color: widget.textColor || "#232428",
                  fontWeight: widget.fontWeight || 560,
                  background: widget.image
                    ? `linear-gradient(rgba(${hexToRgb(widget.tintColor)},${widget.imageScrim ?? 0.18}), rgba(${hexToRgb(widget.tintColor)},${widget.imageScrim ?? 0.18})), url(${widget.image}) ${widget.imageX ?? 50}% ${widget.imageY ?? 50}% / ${widget.imageFit || "cover"} no-repeat`
                    : `rgba(${hexToRgb(widget.tintColor)},${widget.glassOpacity ?? 0.56})`,
                }}
                onPointerDown={(event) => startDrag(event, widget)}
              >
                {(widget.frames || []).map((frame) => (
                  <span
                    className={`studio-image-frame ${selectedLayer.type === "frame" && selectedLayer.id === frame.id ? "selected" : ""} ${isSelected("frame", widget.id, frame.id) ? "selected-group" : ""} ${cropFrameId === frame.id ? "is-cropping" : ""}`}
                    key={frame.id}
                    style={{
                      left: frame.x,
                      top: frame.y,
                      width: frame.w,
                      height: frame.h,
                      borderRadius: frame.radius,
                      backgroundImage: frame.image ? `url(${frame.image})` : undefined,
                      backgroundSize: `${frame.imageScale ?? 100}% auto`,
                      backgroundPosition: `${frame.imageX ?? 50}% ${frame.imageY ?? 50}%`,
                    }}
                    onPointerDown={(event) => startFrameImageDrag(event, widget, frame)}
                    onDoubleClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      selectLayer(widget, "frame", frame.id);
                      setCropFrameId((current) => current === frame.id ? null : frame.id);
                      setNotice(frame.image ? "Режим кадрирования: двигай картинку внутри фрейма" : "Сначала загрузи картинку во фрейм");
                    }}
                    aria-hidden="true"
                  >
                    <span className="studio-resize-handle" onPointerDown={(event) => startResize(event, widget, "frame", frame)}>↘</span>
                  </span>
                ))}
                {(widget.textBlocks || []).map((block) => (
                  <span
                    className={`studio-text-layer studio-text-layer--${block.role || "body"} ${selectedLayer.type === "text" && selectedLayer.id === block.id ? "selected" : ""} ${isSelected("text", widget.id, block.id) ? "selected-group" : ""}`}
                    key={block.id}
                    style={{
                      left: block.x,
                      top: block.y,
                      width: block.w,
                      textAlign: block.align || "left",
                      fontSize: block.size,
                      fontWeight: block.weight,
                      color: block.color || widget.textColor || "#232428",
                    }}
                    onPointerDown={(event) => startLayerDrag(event, widget, "text", block)}
                  >
                    {block.text}
                    <span className="studio-resize-handle" onPointerDown={(event) => startResize(event, widget, "text", block)}>↘</span>
                  </span>
                ))}
                {(widget.icons || []).map((icon) => (
                  <span
                    className={`studio-editable-icon ${selectedLayer.type === "icon" && selectedLayer.id === icon.id ? "selected" : ""} ${isSelected("icon", widget.id, icon.id) ? "selected-group" : ""}`}
                    key={icon.id}
                    style={{
                      left: icon.x,
                      top: icon.y,
                      width: icon.plateSize || icon.size,
                      height: icon.plateSize || icon.size,
                      backgroundColor: icon.plateColor ? `${icon.plateColor}99` : undefined,
                    }}
                    onPointerDown={(event) => startLayerDrag(event, widget, "icon", icon)}
                    aria-hidden="true"
                  >
                    <span
                      style={{
                        width: icon.iconSize || 28,
                        height: icon.iconSize || 28,
                        backgroundColor: icon.iconColor || icon.color || "#ffffff",
                        WebkitMask: `url("${icon.src}") center / contain no-repeat`,
                        mask: `url("${icon.src}") center / contain no-repeat`,
                      }}
                    />
                    <span className="studio-resize-handle" onPointerDown={(event) => startResize(event, widget, "icon", icon)}>↘</span>
                  </span>
                ))}
                <span className="studio-widget-head">
                  <strong>{widget.type === "bio" ? "Резюме" : widget.type === "contacts" ? "" : ""}</strong>
                  {widget.type !== "about" && <img src="os-portfolio/assets/icons/Caret_Right_SM.svg" alt="" />}
                </span>
                <span className="studio-resize-handle studio-widget-resize" onPointerDown={(event) => startResize(event, widget)}>↘</span>
              </button>
            ))}
            {chrome.footer.visible && (
              <div
                className="studio-os-dock"
                style={{
                  "--dock-opacity": chrome.footer.backgroundOpacity,
                  bottom: chrome.footer.bottom,
                  color: chrome.footer.textColor,
                }}
              >
                {chrome.footer.labels.map((label, index) => (
                  <button key={`${label}-${index}`} type="button" aria-hidden="true">
                    <img
                      src={chrome.footer.icons?.[index] || (index === 0 ? "os-portfolio/assets/icons/User_Circle.svg" : index === 1 ? "os-portfolio/assets/icons/Files.svg" : "os-portfolio/assets/icons/Mail.svg")}
                      alt=""
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="studio-panel studio-panel--right">
        {activePanel === "header" ? (
          <ChromeControls
            chrome={chrome}
            section="header"
            updateChrome={updateChrome}
          />
        ) : activePanel === "footer" ? (
          <ChromeControls
            chrome={chrome}
            section="footer"
            updateChrome={updateChrome}
          />
        ) : activeWidget ? (
          <WidgetControls
            widget={activeWidget}
            selectedLayer={selectedLayer}
            setSelectedLayer={setSelectedLayer}
            cropFrameId={cropFrameId}
            setCropFrameId={setCropFrameId}
            update={(patch) => updateWidget(activeWidget.id, patch)}
            onImage={handleImage}
          />
        ) : (
          <p>Выберите виджет</p>
        )}
      </aside>
    </main>
  );
}

function ChromeControls({ chrome, section, updateChrome }) {
  const settings = chrome[section];
  const isHeader = section === "header";

  const updateFooterLabel = (index, value) => {
    const labels = [...settings.labels];
    labels[index] = value;
    updateChrome("footer", { labels });
  };

  const updateFooterLabelEn = (index, value) => {
    const labelsEn = [...(settings.labelsEn || defaultOsChrome.footer.labelsEn)];
    labelsEn[index] = value;
    updateChrome("footer", { labelsEn });
  };

  const updateFooterIcon = (index, src) => {
    const icons = [...(settings.icons || defaultOsChrome.footer.icons)];
    icons[index] = src;
    updateChrome("footer", { icons });
  };

  const handleFooterIconFile = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => updateFooterIcon(index, reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="studio-controls">
      <div>
        <p>{isHeader ? "Хедер сайта" : "Футер сайта"}</p>
        <h2>{isHeader ? "Верхняя панель" : "Нижнее меню"}</h2>
      </div>

      <details open className="studio-frame-tools studio-accordion">
        <summary>Видимость</summary>
        <label className="studio-switch-row">
          <input
            checked={settings.visible}
            type="checkbox"
            onChange={(event) => updateChrome(section, { visible: event.target.checked })}
          />
          Показывать на сайте
        </label>
        {isHeader && (
          <>
            <label className="studio-switch-row">
              <input
                checked={settings.showLanguage}
                type="checkbox"
                onChange={(event) => updateChrome("header", { showLanguage: event.target.checked })}
              />
              Переключатель EN/RU
            </label>
            <label className="studio-switch-row">
              <input
                checked={settings.showSearch}
                type="checkbox"
                onChange={(event) => updateChrome("header", { showSearch: event.target.checked })}
              />
              Поиск по сайту
            </label>
          </>
        )}
      </details>

      <details open className="studio-frame-tools studio-accordion">
        <summary>{isHeader ? "Текст и поиск" : "Кнопки меню"}</summary>
        {isHeader ? (
          <>
            <label className="studio-field">
              <span>Город рядом со временем</span>
              <input
                value={settings.location}
                onChange={(event) => updateChrome("header", { location: event.target.value })}
              />
            </label>
            <label className="studio-field">
              <span>Город на английском</span>
              <input
                value={settings.locationEn || ""}
                onChange={(event) => updateChrome("header", { locationEn: event.target.value })}
              />
            </label>
            <label className="studio-field">
              <span>Плейсхолдер поиска</span>
              <input
                value={settings.searchPlaceholder}
                onChange={(event) => updateChrome("header", { searchPlaceholder: event.target.value })}
              />
            </label>
            <label className="studio-field">
              <span>Плейсхолдер поиска EN</span>
              <input
                value={settings.searchPlaceholderEn || ""}
                onChange={(event) => updateChrome("header", { searchPlaceholderEn: event.target.value })}
              />
            </label>
            <div className="studio-grid-fields">
              <label className="studio-field">
                <span>Кегль времени</span>
                <input
                  max="34"
                  min="14"
                  type="number"
                  value={settings.fontSize}
                  onChange={(event) => updateChrome("header", { fontSize: Number(event.target.value) })}
                />
              </label>
              <label className="studio-field">
                <span>Цвет текста</span>
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(event) => updateChrome("header", { textColor: event.target.value })}
                />
              </label>
            </div>
          </>
        ) : (
          <>
            {settings.labels.map((label, index) => (
              <div className="studio-footer-button-editor" key={index}>
                <label className="studio-field">
                  <span>Кнопка {index + 1} RU</span>
                  <input value={label} onChange={(event) => updateFooterLabel(index, event.target.value)} />
                </label>
                <label className="studio-field">
                  <span>Кнопка {index + 1} EN</span>
                  <input value={(settings.labelsEn || defaultOsChrome.footer.labelsEn)[index] || ""} onChange={(event) => updateFooterLabelEn(index, event.target.value)} />
                </label>
                <div className="studio-footer-icon-row">
                  <span
                    className="studio-footer-icon-preview"
                    style={{
                      WebkitMask: `url("${settings.icons?.[index] || defaultOsChrome.footer.icons[index]}") center / contain no-repeat`,
                      mask: `url("${settings.icons?.[index] || defaultOsChrome.footer.icons[index]}") center / contain no-repeat`,
                    }}
                    aria-hidden="true"
                  />
                  <label className="studio-file-pill">
                    Заменить SVG
                    <input type="file" accept=".svg,image/svg+xml" onChange={(event) => handleFooterIconFile(index, event.target.files?.[0])} />
                  </label>
                </div>
              </div>
            ))}
            <div className="studio-grid-fields">
              <label className="studio-field">
                <span>Отступ снизу</span>
                <input
                  max="120"
                  min="10"
                  type="number"
                  value={settings.bottom}
                  onChange={(event) => updateChrome("footer", { bottom: Number(event.target.value) })}
                />
              </label>
              <label className="studio-field">
                <span>Прозрачность</span>
                <input
                  max="0.9"
                  min="0.12"
                  step="0.01"
                  type="number"
                  value={settings.backgroundOpacity}
                  onChange={(event) => updateChrome("footer", { backgroundOpacity: Number(event.target.value) })}
                />
              </label>
            </div>
            <label className="studio-field">
              <span>Цвет текста</span>
              <input
                type="color"
                value={settings.textColor}
                onChange={(event) => updateChrome("footer", { textColor: event.target.value })}
              />
            </label>
          </>
        )}
      </details>

      <details className="studio-frame-tools studio-accordion">
        <summary>Переходы</summary>
        <label className="studio-switch-row">
          <input
            checked={chrome.motion.hoverLift}
            type="checkbox"
            onChange={(event) => updateChrome("motion", { hoverLift: event.target.checked })}
          />
          Лёгкий подъём при наведении
        </label>
        <label className="studio-switch-row">
          <input
            checked={chrome.motion.liquidFollow}
            type="checkbox"
            onChange={(event) => updateChrome("motion", { liquidFollow: event.target.checked })}
          />
          Живой блик под курсором
        </label>
      </details>
    </div>
  );
}

function WidgetControls({ widget, selectedLayer, setSelectedLayer, cropFrameId, setCropFrameId, update, onImage }) {
  const frames = widget.frames || [];
  const textBlocks = widget.textBlocks || [];
  const icons = widget.icons || [];
  const [activeFrameId, setActiveFrameId] = useState(() => frames[0]?.id || "");
  const [activeTextId, setActiveTextId] = useState(() => textBlocks[0]?.id || "");
  const [activeIconId, setActiveIconId] = useState(() => icons[0]?.id || "");
  const activeFrame = frames.find((frame) => frame.id === activeFrameId) || frames[0];
  const activeText = textBlocks.find((block) => block.id === activeTextId) || textBlocks[0];
  const activeIcon = icons.find((icon) => icon.id === activeIconId) || icons[0];

  useEffect(() => {
    if (!frames.length) {
      setActiveFrameId("");
      return;
    }
    if (selectedLayer?.type === "frame" && frames.some((frame) => frame.id === selectedLayer.id)) {
      setActiveFrameId(selectedLayer.id);
      return;
    }
    if (!frames.some((frame) => frame.id === activeFrameId)) {
      setActiveFrameId(frames[0].id);
    }
  }, [activeFrameId, frames, selectedLayer, widget.id]);

  useEffect(() => {
    if (!textBlocks.length) {
      setActiveTextId("");
      return;
    }
    if (selectedLayer?.type === "text" && textBlocks.some((block) => block.id === selectedLayer.id)) {
      setActiveTextId(selectedLayer.id);
      return;
    }
    if (!textBlocks.some((block) => block.id === activeTextId)) {
      setActiveTextId(textBlocks[0].id);
    }
  }, [activeTextId, selectedLayer, textBlocks, widget.id]);

  useEffect(() => {
    if (!icons.length) {
      setActiveIconId("");
      return;
    }
    if (selectedLayer?.type === "icon" && icons.some((icon) => icon.id === selectedLayer.id)) {
      setActiveIconId(selectedLayer.id);
      return;
    }
    if (!icons.some((icon) => icon.id === activeIconId)) {
      setActiveIconId(icons[0].id);
    }
  }, [activeIconId, icons, selectedLayer, widget.id]);

  const number = (field, label, min, max, step = 1) => (
    <label className="studio-field">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={widget[field] ?? ""}
        onChange={(event) => update({ [field]: Number(event.target.value) })}
      />
    </label>
  );

  const updateFrame = (frameId, patch) => {
    update({
      frames: frames.map((frame) => (frame.id === frameId ? { ...frame, ...patch } : frame)),
    });
  };

  const addFrame = () => {
    const frame = createImageFrameFrame({
      x: Math.max(18, Math.round((widget.w - 112) / 2)),
      y: Math.max(52, Math.round((widget.h - 112) / 2)),
      w: 112,
      h: 112,
      radius: 28,
    });
    update({ frames: [...frames, frame] });
    setActiveFrameId(frame.id);
    setSelectedLayer({ type: "frame", id: frame.id });
  };

  const removeFrame = (frameId) => {
    const nextFrames = frames.filter((frame) => frame.id !== frameId);
    update({ frames: nextFrames });
    setActiveFrameId(nextFrames[0]?.id || "");
  };

  const frameNumber = (field, label, min, max, step = 1) => (
    <label className="studio-field">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={activeFrame?.[field] ?? ""}
        onChange={(event) => activeFrame && updateFrame(activeFrame.id, { [field]: Number(event.target.value) })}
      />
    </label>
  );

  const handleFrameImage = (file) => {
    if (!file || !activeFrame) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      updateFrame(activeFrame.id, { image: reader.result });
    });
    reader.readAsDataURL(file);
  };

  const updateTextBlock = (blockId, patch) => {
    const source = textBlocks.find((block) => block.id === blockId);
    const nextTextBlocks = textBlocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block));
    const titlePatch = source?.role === "title" && typeof patch.text === "string" ? { title: patch.text } : {};
    const bodyPatch = source?.role === "body" && typeof patch.text === "string" ? { text: patch.text } : {};
    update({
      textBlocks: nextTextBlocks,
      ...titlePatch,
      ...bodyPatch,
    });
  };

  const addTextBlock = (role = "body") => {
    const block = createTextBlock({
      role,
      text: role === "title" ? "Новый заголовок" : "Новый текст",
      x: 24,
      y: Math.min(widget.h - 48, 84 + textBlocks.length * 38),
      w: Math.max(120, widget.w - 48),
      size: role === "title" ? 24 : 14,
      weight: role === "title" ? 680 : 520,
    });
    update({ textBlocks: [...textBlocks, block] });
    setActiveTextId(block.id);
    setSelectedLayer({ type: "text", id: block.id });
  };

  const removeTextBlock = (blockId) => {
    const next = textBlocks.filter((block) => block.id !== blockId);
    update({ textBlocks: next });
    setActiveTextId(next[0]?.id || "");
  };

  const textNumber = (field, label, min, max, step = 1) => (
    <label className="studio-field">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={activeText?.[field] ?? ""}
        onChange={(event) => activeText && updateTextBlock(activeText.id, { [field]: Number(event.target.value) })}
      />
    </label>
  );

  const updateIcon = (iconId, patch) => {
    update({
      icons: icons.map((icon) => (icon.id === iconId ? { ...icon, ...patch } : icon)),
    });
  };

  const addIcon = () => {
    const icon = {
      id: crypto.randomUUID(),
      src: "os-portfolio/assets/icons/Caret_Right_SM.svg",
      iconColor: "#ffffff",
      plateColor: "#d4dae4",
      x: 28,
      y: 68,
      plateSize: 58,
      iconSize: 26,
    };
    update({ icons: [...icons, icon] });
    setActiveIconId(icon.id);
    setSelectedLayer({ type: "icon", id: icon.id });
  };

  const removeIcon = (iconId) => {
    const next = icons.filter((icon) => icon.id !== iconId);
    update({ icons: next });
    setActiveIconId(next[0]?.id || "");
  };

  const handleIconFile = (file) => {
    if (!file || !activeIcon) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => updateIcon(activeIcon.id, { src: reader.result }));
    reader.readAsDataURL(file);
  };

  const expandedLayout = {
    direction: "column",
    align: "center",
    gap: 18,
    ...(widget.expandedLayout || {}),
  };
  const expandedBlocks = widget.expandedBlocks || [];
  const updateExpandedLayout = (patch) => update({ expandedLayout: { ...expandedLayout, ...patch } });
  const addExpandedBlock = (type = "text") => {
    let block = {
      id: crypto.randomUUID(),
      type,
      text: type === "heading" ? widget.title.replaceAll("\n", " ") : "Новый текстовый блок",
      align: "center",
      fontWeight: type === "heading" ? 680 : 520,
      image: "",
      radius: 24,
      w: type === "image" ? 240 : 360,
      h: type === "image" ? 160 : 80,
    };
    if (type === "case-section") {
      block = { id: crypto.randomUUID(), type, label: "Новая секция", title: "Заголовок секции", text: "Опиши, что происходило на этом этапе проекта." };
    }
    if (type === "case-process") {
      block = { id: crypto.randomUUID(), type, label: "Процесс", title: "Процесс", steps: ["Первый шаг", "Второй шаг", "Третий шаг"] };
    }
    if (type === "case-media-grid") {
      block = { id: crypto.randomUUID(), type, label: "Артефакты", title: "Визуальные материалы", items: mediaItems(["Картинка 1", "Картинка 2", "Картинка 3"]) };
    }
    if (type === "case-result") {
      block = { id: crypto.randomUUID(), type, label: "Результат", title: "Результат", items: [["Итог", "Что изменилось после проекта."], ["Система", "Что стало понятнее или масштабируемее."]] };
    }
    update({ expandedBlocks: [...expandedBlocks, block] });
  };
  const updateExpandedBlock = (blockId, patch) => {
    update({
      expandedBlocks: expandedBlocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block)),
    });
  };
  const removeExpandedBlock = (blockId) => {
    update({ expandedBlocks: expandedBlocks.filter((block) => block.id !== blockId) });
  };
  const handleExpandedImage = (blockId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => updateExpandedBlock(blockId, { image: reader.result }));
    reader.readAsDataURL(file);
  };
  const updateCaseArray = (blockId, key, nextItems) => updateExpandedBlock(blockId, { [key]: nextItems });
  const handleCaseMediaImage = (blockId, index, file) => {
    if (!file) return;
    const block = expandedBlocks.find((item) => item.id === blockId);
    if (!block) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const items = mediaItems(block.items || []);
      items[index] = { ...items[index], image: reader.result };
      updateCaseArray(blockId, "items", items);
    });
    reader.readAsDataURL(file);
  };

  return (
    <div className="studio-controls">
      <div>
        <p>Выбранный виджет</p>
        <h2>{widget.title.replaceAll("\n", " ")}</h2>
      </div>
      <details open className="studio-frame-tools studio-accordion">
        <summary>Виджет</summary>
      <label className="studio-field">
        <span>Тип</span>
        <select value={widget.type} onChange={(event) => update({ type: event.target.value })}>
          <option value="bio">Резюме</option>
          <option value="about">Обо мне</option>
          <option value="project-category">Проект</option>
          <option value="contacts">Контакты</option>
        </select>
      </label>
      <div className="studio-grid-fields">
        {number("x", "X", 0, 1180)}
        {number("y", "Y", 0, 820)}
        {number("w", "Ширина", 80, 900)}
        {number("h", "Высота", 80, 700)}
      </div>
      <div className="studio-grid-fields">
        {number("radius", "Скругление", 0, 80)}
        {number("glassOpacity", "Прозрачность", 0.08, 0.95, 0.01)}
      </div>
      <label className="studio-field">
        <span>Начертание текста</span>
        <select value={widget.fontWeight || 560} onChange={(event) => update({ fontWeight: Number(event.target.value) })}>
          <option value="420">Regular</option>
          <option value="520">Medium</option>
          <option value="600">Semibold</option>
          <option value="680">Bold</option>
        </select>
      </label>
      </details>
      <details open className="studio-frame-tools studio-accordion">
        <summary>Текст</summary>
        <div className="studio-section-head">
          <div>
            <p>Текстовые слои</p>
            <h3>Заголовки и тексты отдельно</h3>
          </div>
          <button type="button" onClick={() => addTextBlock("body")}>Добавить</button>
        </div>
        <div className="studio-frame-list">
          {textBlocks.map((block, index) => (
            <button className={block.id === activeText?.id ? "active" : ""} key={block.id} type="button" onClick={() => { setActiveTextId(block.id); setSelectedLayer({ type: "text", id: block.id }); }}>
              {block.role === "title" ? "Заголовок" : "Текст"} {index + 1}
            </button>
          ))}
        </div>
        {activeText ? (
          <>
            <label className="studio-field">
              <span>Содержимое слоя</span>
              <textarea value={activeText.text || ""} onChange={(event) => updateTextBlock(activeText.id, { text: event.target.value })} />
            </label>
            <div className="studio-grid-fields">
              {textNumber("x", "Text X", 0, widget.w)}
              {textNumber("y", "Text Y", 0, widget.h)}
              {textNumber("w", "Ширина", 40, widget.w)}
              {textNumber("size", "Кегль", 8, 72)}
            </div>
            <label className="studio-field">
              <span>Начертание слоя</span>
              <select value={activeText.weight || 520} onChange={(event) => updateTextBlock(activeText.id, { weight: Number(event.target.value) })}>
                <option value="420">Regular</option>
                <option value="520">Medium</option>
                <option value="600">Semibold</option>
                <option value="680">Bold</option>
              </select>
            </label>
            <div className="studio-align-row">
              <button className={activeText.align === "left" ? "active" : ""} type="button" onClick={() => updateTextBlock(activeText.id, { align: "left" })}>Left</button>
              <button className={activeText.align === "center" ? "active" : ""} type="button" onClick={() => updateTextBlock(activeText.id, { align: "center" })}>Center</button>
              <button className={activeText.align === "right" ? "active" : ""} type="button" onClick={() => updateTextBlock(activeText.id, { align: "right" })}>Right</button>
            </div>
            <label className="studio-field">
              <span>Цвет слоя</span>
              <input type="color" value={activeText.color || widget.textColor || "#232428"} onChange={(event) => updateTextBlock(activeText.id, { color: event.target.value })} />
            </label>
            <div className="studio-frame-actions">
              <button type="button" onClick={() => addTextBlock("title")}>Добавить заголовок</button>
              <button type="button" onClick={() => removeTextBlock(activeText.id)}>Удалить слой</button>
            </div>
          </>
        ) : (
          <p className="studio-empty-note">Добавь текстовый слой, чтобы управлять текстом отдельно.</p>
        )}
      </details>
      <details open className="studio-frame-tools studio-accordion">
        <summary>Фон и цвет</summary>
      <label className="studio-field">
        <span>Оттенок плашки</span>
        <input type="color" value={widget.tintColor || "#f8faff"} onChange={(event) => update({ tintColor: event.target.value })} />
      </label>
      <label className="studio-field">
        <span>Цвет текста</span>
        <input type="color" value={widget.textColor || "#232428"} onChange={(event) => update({ textColor: event.target.value })} />
      </label>
      <label className="studio-field">
        <span>Картинка на фон</span>
        <input type="file" accept="image/*" onChange={(event) => onImage(event.target.files?.[0])} />
      </label>
      {widget.image && (
        <>
          <button className="studio-muted-button" type="button" onClick={() => update({ image: "" })}>
            Убрать картинку
          </button>
          <label className="studio-field">
            <span>Заполнение картинки</span>
            <select value={widget.imageFit || "cover"} onChange={(event) => update({ imageFit: event.target.value })}>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </label>
          <div className="studio-grid-fields">
            {number("imageX", "Картинка X", 0, 100)}
            {number("imageY", "Картинка Y", 0, 100)}
            {number("imageScrim", "Светлая вуаль", 0, 0.8, 0.01)}
          </div>
        </>
      )}
      </details>
      <details open className="studio-frame-tools studio-accordion">
        <summary>Иконки</summary>
        <div className="studio-section-head">
          <div>
            <p>Иконки</p>
            <h3>SVG-слои и цвет</h3>
          </div>
          <button type="button" onClick={addIcon}>Добавить</button>
        </div>
        {icons.length > 0 && (
          <div className="studio-frame-list">
            {icons.map((icon, index) => (
              <button className={icon.id === activeIcon?.id ? "active" : ""} key={icon.id} type="button" onClick={() => { setActiveIconId(icon.id); setSelectedLayer({ type: "icon", id: icon.id }); }}>
                Icon {index + 1}
              </button>
            ))}
          </div>
        )}
        {activeIcon ? (
          <>
            <div
              className="studio-icon-preview"
              style={{
                width: activeIcon.plateSize ?? activeIcon.size ?? 62,
                height: activeIcon.plateSize ?? activeIcon.size ?? 62,
                backgroundColor: activeIcon.plateColor ? `${activeIcon.plateColor}99` : undefined,
              }}
            >
              <span
                style={{
                  width: activeIcon.iconSize ?? 28,
                  height: activeIcon.iconSize ?? 28,
                  backgroundColor: activeIcon.iconColor || activeIcon.color || "#ffffff",
                  WebkitMask: `url("${activeIcon.src}") center / contain no-repeat`,
                  mask: `url("${activeIcon.src}") center / contain no-repeat`,
                }}
              />
            </div>
            <div className="studio-grid-fields">
              <label className="studio-field"><span>Плашка X</span><input type="number" value={activeIcon.x ?? 0} onChange={(event) => updateIcon(activeIcon.id, { x: Number(event.target.value) })} /></label>
              <label className="studio-field"><span>Плашка Y</span><input type="number" value={activeIcon.y ?? 0} onChange={(event) => updateIcon(activeIcon.id, { y: Number(event.target.value) })} /></label>
              <label className="studio-field"><span>Размер плашки</span><input type="number" min="20" max="180" value={activeIcon.plateSize ?? activeIcon.size ?? 58} onChange={(event) => updateIcon(activeIcon.id, { plateSize: Number(event.target.value) })} /></label>
              <label className="studio-field"><span>Цвет плашки</span><input type="color" value={activeIcon.plateColor || "#d4dae4"} onChange={(event) => updateIcon(activeIcon.id, { plateColor: event.target.value })} /></label>
              <label className="studio-field"><span>Размер SVG</span><input type="number" min="8" max="120" value={activeIcon.iconSize ?? 28} onChange={(event) => updateIcon(activeIcon.id, { iconSize: Number(event.target.value) })} /></label>
              <label className="studio-field"><span>Цвет SVG</span><input type="color" value={activeIcon.iconColor || activeIcon.color || "#ffffff"} onChange={(event) => updateIcon(activeIcon.id, { iconColor: event.target.value })} /></label>
            </div>
            <label className="studio-field">
              <span>Загрузить SVG</span>
              <input type="file" accept=".svg,image/svg+xml" onChange={(event) => handleIconFile(event.target.files?.[0])} />
            </label>
            <button className="studio-muted-button" type="button" onClick={() => removeIcon(activeIcon.id)}>Удалить иконку</button>
          </>
        ) : (
          <p className="studio-empty-note">Добавь SVG-иконку или выбери существующую.</p>
        )}
      </details>
      <details open className="studio-frame-tools studio-accordion">
        <summary>Фреймы</summary>
        <div className="studio-section-head">
          <div>
            <p>Фреймы с картинками</p>
            <h3>Слои внутри виджета</h3>
          </div>
          <button type="button" onClick={addFrame}>Добавить</button>
        </div>
        {frames.length > 0 && (
          <div className="studio-frame-list">
            {frames.map((frame, index) => (
              <button
                className={frame.id === activeFrame?.id ? "active" : ""}
                key={frame.id}
                type="button"
                onClick={() => { setActiveFrameId(frame.id); setSelectedLayer({ type: "frame", id: frame.id }); }}
              >
                Фрейм {index + 1}
              </button>
            ))}
          </div>
        )}
        {activeFrame ? (
          <>
            <div className="studio-grid-fields">
              {frameNumber("x", "Frame X", 0, widget.w)}
              {frameNumber("y", "Frame Y", 0, widget.h)}
              {frameNumber("w", "Ширина", 24, widget.w)}
              {frameNumber("h", "Высота", 24, widget.h)}
            </div>
            <div className="studio-grid-fields">
              {frameNumber("radius", "Скругление", 0, 999)}
              <label className="studio-field">
                <span>Заполнение</span>
                <select value={activeFrame.fit || "cover"} onChange={(event) => updateFrame(activeFrame.id, { fit: event.target.value })}>
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </select>
              </label>
            </div>
            <div className="studio-grid-fields">
              {frameNumber("imageX", "Картинка X", 0, 100)}
              {frameNumber("imageY", "Картинка Y", 0, 100)}
              {frameNumber("imageScale", "Масштаб фото", 40, 260)}
            </div>
            <label className="studio-field">
              <span>Картинка внутри фрейма</span>
              <input type="file" accept="image/*" onChange={(event) => handleFrameImage(event.target.files?.[0])} />
            </label>
            <div className="studio-frame-actions">
              {activeFrame.image && (
                <button type="button" onClick={() => updateFrame(activeFrame.id, { image: "" })}>
                  Очистить фото
                </button>
              )}
              <button type="button" onClick={() => removeFrame(activeFrame.id)}>
                Удалить фрейм
              </button>
            </div>
          </>
        ) : (
          <p className="studio-empty-note">Добавь фрейм, чтобы вставить картинку внутрь виджета и обрезать её по форме.</p>
        )}
      </details>
      <details open className="studio-frame-tools studio-accordion">
        <summary>Большой виджет</summary>
        <div className="studio-section-head">
          <div>
            <p>Большой виджет</p>
            <h3>Блоки и автолейаут</h3>
          </div>
        </div>
        <div className="studio-align-row" aria-label="Автолейаут большого виджета">
          <button className={expandedLayout.direction === "column" ? "active" : ""} type="button" onClick={() => updateExpandedLayout({ direction: "column" })}>Column</button>
          <button className={expandedLayout.direction === "row" ? "active" : ""} type="button" onClick={() => updateExpandedLayout({ direction: "row" })}>Row</button>
          <button className={expandedLayout.align === "start" ? "active" : ""} type="button" onClick={() => updateExpandedLayout({ align: "start" })}>Left</button>
          <button className={expandedLayout.align === "center" ? "active" : ""} type="button" onClick={() => updateExpandedLayout({ align: "center" })}>Center</button>
          <button className={expandedLayout.align === "end" ? "active" : ""} type="button" onClick={() => updateExpandedLayout({ align: "end" })}>Right</button>
        </div>
        <div className="studio-grid-fields">
          <label className="studio-field">
            <span>Gap</span>
            <input type="number" min="0" max="80" value={expandedLayout.gap} onChange={(event) => updateExpandedLayout({ gap: Number(event.target.value) })} />
          </label>
          <label className="studio-field">
            <span>Добавить блок</span>
            <select defaultValue="" onChange={(event) => { if (event.target.value) addExpandedBlock(event.target.value); event.target.value = ""; }}>
              <option value="" disabled>Выбрать</option>
              <option value="heading">Заголовок</option>
              <option value="text">Текст</option>
              <option value="image">Картинка</option>
              <option value="case-section">Секция кейса</option>
              <option value="case-media-grid">Артефакты</option>
              <option value="case-process">Процесс</option>
              <option value="case-result">Результат</option>
            </select>
          </label>
        </div>
        {expandedBlocks.map((block, index) => (
          <div className="studio-block-editor" key={block.id}>
            <div className="studio-section-head">
              <p>Блок {index + 1}</p>
              <button type="button" onClick={() => removeExpandedBlock(block.id)}>Удалить</button>
            </div>
            {block.type === "image" ? (
              <>
                <label className="studio-field">
                  <span>Фото блока</span>
                  <input type="file" accept="image/*" onChange={(event) => handleExpandedImage(block.id, event.target.files?.[0])} />
                </label>
                <div className="studio-grid-fields">
                  <label className="studio-field"><span>Ширина</span><input type="number" value={block.w || 240} onChange={(event) => updateExpandedBlock(block.id, { w: Number(event.target.value) })} /></label>
                  <label className="studio-field"><span>Высота</span><input type="number" value={block.h || 160} onChange={(event) => updateExpandedBlock(block.id, { h: Number(event.target.value) })} /></label>
                  <label className="studio-field"><span>Скругление</span><input type="number" value={block.radius || 24} onChange={(event) => updateExpandedBlock(block.id, { radius: Number(event.target.value) })} /></label>
                </div>
              </>
            ) : block.type === "case-hero" ? (
              <>
                <div className="studio-grid-fields">
                  <label className="studio-field"><span>Лейбл</span><input value={block.label || ""} onChange={(event) => updateExpandedBlock(block.id, { label: event.target.value })} /></label>
                  <label className="studio-field"><span>Заголовок</span><input value={block.text || ""} onChange={(event) => updateExpandedBlock(block.id, { text: event.target.value })} /></label>
                </div>
                <label className="studio-field"><span>Короткое описание</span><textarea value={block.summary || ""} onChange={(event) => updateExpandedBlock(block.id, { summary: event.target.value })} /></label>
                <label className="studio-field"><span>Мета-строки</span><textarea value={(block.meta || []).join("\n")} onChange={(event) => updateExpandedBlock(block.id, { meta: event.target.value.split("\n").filter(Boolean) })} /></label>
              </>
            ) : block.type === "case-section" ? (
              <>
                <div className="studio-grid-fields">
                  <label className="studio-field"><span>Лейбл</span><input value={block.label || ""} onChange={(event) => updateExpandedBlock(block.id, { label: event.target.value })} /></label>
                  <label className="studio-field"><span>Заголовок</span><input value={block.title || ""} onChange={(event) => updateExpandedBlock(block.id, { title: event.target.value })} /></label>
                </div>
                <label className="studio-field"><span>Текст секции</span><textarea value={block.text || ""} onChange={(event) => updateExpandedBlock(block.id, { text: event.target.value })} /></label>
              </>
            ) : block.type === "case-process" ? (
              <>
                <div className="studio-grid-fields">
                  <label className="studio-field"><span>Лейбл</span><input value={block.label || ""} onChange={(event) => updateExpandedBlock(block.id, { label: event.target.value })} /></label>
                  <label className="studio-field"><span>Заголовок</span><input value={block.title || ""} onChange={(event) => updateExpandedBlock(block.id, { title: event.target.value })} /></label>
                </div>
                <div className="studio-case-list">
                  {(block.steps || []).map((step, stepIndex) => (
                    <div className="studio-case-row" key={`${block.id}-step-${stepIndex}`}>
                      <label className="studio-field"><span>Шаг {stepIndex + 1}</span><textarea value={step} onChange={(event) => {
                        const steps = [...(block.steps || [])];
                        steps[stepIndex] = event.target.value;
                        updateCaseArray(block.id, "steps", steps);
                      }} /></label>
                      <button type="button" onClick={() => updateCaseArray(block.id, "steps", (block.steps || []).filter((_, itemIndex) => itemIndex !== stepIndex))}>Удалить</button>
                    </div>
                  ))}
                  <button type="button" className="studio-muted-button" onClick={() => updateCaseArray(block.id, "steps", [...(block.steps || []), "Новый шаг"])}>Добавить шаг</button>
                </div>
              </>
            ) : block.type === "case-media-grid" ? (
              <>
                <div className="studio-grid-fields">
                  <label className="studio-field"><span>Лейбл</span><input value={block.label || ""} onChange={(event) => updateExpandedBlock(block.id, { label: event.target.value })} /></label>
                  <label className="studio-field"><span>Заголовок</span><input value={block.title || ""} onChange={(event) => updateExpandedBlock(block.id, { title: event.target.value })} /></label>
                </div>
                <div className="studio-case-list">
                  {mediaItems(block.items || []).map((item, itemIndex) => (
                    <div className="studio-case-media" key={`${block.id}-media-${itemIndex}`}>
                      <div className="studio-case-media-preview" style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }} />
                      <label className="studio-field"><span>Подпись</span><input value={item.title || ""} onChange={(event) => {
                        const items = mediaItems(block.items || []);
                        items[itemIndex] = { ...items[itemIndex], title: event.target.value };
                        updateCaseArray(block.id, "items", items);
                      }} /></label>
                      <label className="studio-file-pill">Загрузить<input type="file" accept="image/*" onChange={(event) => handleCaseMediaImage(block.id, itemIndex, event.target.files?.[0])} /></label>
                      <button type="button" onClick={() => updateCaseArray(block.id, "items", mediaItems(block.items || []).filter((_, itemIndexCurrent) => itemIndexCurrent !== itemIndex))}>Удалить</button>
                    </div>
                  ))}
                  <button type="button" className="studio-muted-button" onClick={() => updateCaseArray(block.id, "items", [...mediaItems(block.items || []), { title: "Новый артефакт", image: "" }])}>Добавить артефакт</button>
                </div>
              </>
            ) : block.type === "case-result" ? (
              <>
                <div className="studio-grid-fields">
                  <label className="studio-field"><span>Лейбл</span><input value={block.label || ""} onChange={(event) => updateExpandedBlock(block.id, { label: event.target.value })} /></label>
                  <label className="studio-field"><span>Заголовок</span><input value={block.title || ""} onChange={(event) => updateExpandedBlock(block.id, { title: event.target.value })} /></label>
                </div>
                <div className="studio-case-list">
                  {(block.items || []).map((item, itemIndex) => (
                    <div className="studio-case-row" key={`${block.id}-result-${itemIndex}`}>
                      <div className="studio-grid-fields">
                        <label className="studio-field"><span>Короткий итог</span><input value={item[0] || ""} onChange={(event) => {
                          const items = [...(block.items || [])];
                          items[itemIndex] = [event.target.value, items[itemIndex]?.[1] || ""];
                          updateCaseArray(block.id, "items", items);
                        }} /></label>
                        <label className="studio-field"><span>Описание</span><input value={item[1] || ""} onChange={(event) => {
                          const items = [...(block.items || [])];
                          items[itemIndex] = [items[itemIndex]?.[0] || "", event.target.value];
                          updateCaseArray(block.id, "items", items);
                        }} /></label>
                      </div>
                      <button type="button" onClick={() => updateCaseArray(block.id, "items", (block.items || []).filter((_, itemIndexCurrent) => itemIndexCurrent !== itemIndex))}>Удалить</button>
                    </div>
                  ))}
                  <button type="button" className="studio-muted-button" onClick={() => updateCaseArray(block.id, "items", [...(block.items || []), ["Итог", "Описание результата"]])}>Добавить итог</button>
                </div>
              </>
            ) : (
              <>
                <label className="studio-field">
                  <span>Текст блока</span>
                  <textarea value={block.text || ""} onChange={(event) => updateExpandedBlock(block.id, { text: event.target.value })} />
                </label>
                <div className="studio-align-row">
                  <button className={block.align === "left" ? "active" : ""} type="button" onClick={() => updateExpandedBlock(block.id, { align: "left" })}>Left</button>
                  <button className={block.align === "center" ? "active" : ""} type="button" onClick={() => updateExpandedBlock(block.id, { align: "center" })}>Center</button>
                  <button className={block.align === "right" ? "active" : ""} type="button" onClick={() => updateExpandedBlock(block.id, { align: "right" })}>Right</button>
                </div>
              </>
            )}
          </div>
        ))}
      </details>
    </div>
  );
}

function Header({ content, route, language, onLanguageChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const chrome = content.layout.chrome;
  const links = [
    ["/projects", language === "ru" ? "Проекты" : "Projects"],
    ["/about", language === "ru" ? "Обо мне" : "About"],
    ["/contacts", language === "ru" ? "Контакты" : "Contacts"],
  ];

  if (!chrome.header.visible) return null;
  return (
    <header
      className="header"
      style={{
        minHeight: `${chrome.header.height}px`,
        background: chrome.header.background,
        color: chrome.header.textColor,
      }}
    >
      <a className="brand" href="#/">
        {language === "ru" ? content.name : content.nameEn || content.name}
      </a>
      <p className="header-role">
        {language === "ru" ? content.role : content.roleEn}
      </p>
      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen
          ? language === "ru"
            ? "Закрыть"
            : "Close"
          : language === "ru"
            ? "Меню"
            : "Menu"}
      </button>
      {chrome.menu.visible && (
      <nav
        className={menuOpen ? "nav nav--open" : "nav"}
        style={{
          color: chrome.menu.textColor,
          fontSize: `${chrome.menu.fontSize}px`,
          gap: `${chrome.menu.gap}px`,
        }}
      >
        {links.map(([href, label]) => (
          <a
            key={href}
            className={route === href ? "active" : ""}
            href={`#${href}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        <span className="language-switch">
          <button
            className={language === "ru" ? "active" : ""}
            type="button"
            onClick={() => onLanguageChange("ru")}
          >
            RU
          </button>
          <button
            className={language === "en" ? "active" : ""}
            type="button"
            onClick={() => onLanguageChange("en")}
          >
            EN
          </button>
        </span>
      </nav>
      )}
    </header>
  );
}

function HomePage({ content, language }) {
  const featured = content.projects.filter((project) => project.featured);
  const blocks = {
    hero: (
      <HomeHero
        content={content}
        language={language}
        settings={content.layout.blocks.hero}
        key="hero"
      />
    ),
    manifesto: (
      <HomeManifesto
        content={content}
        language={language}
        settings={content.layout.blocks.manifesto}
        key="manifesto"
      />
    ),
    projects: (
      <HomeProjects
        content={content}
        featured={featured}
        language={language}
        settings={content.layout.blocks.projects}
        key="projects"
      />
    ),
  };

  return (
    <main>
      {content.layout.order.map((blockId) => {
        const block = content.layout.blocks[blockId];
        if (!block?.visible) return null;
        return (
          blocks[blockId] || (
            <CustomPublicBlock
              block={block}
              key={blockId}
              language={language}
            />
          )
        );
      })}
    </main>
  );
}

function HomeHero({ content, settings, language }) {
  const heroProjects = content.projects.filter((project) => project.featured).slice(0, 5);
  return (
    <section className="hero" style={{ minHeight: `${settings.height}px`, background: settings.background }}>
      <div className="collage" aria-label={language === "ru" ? "Выбранные проекты" : "Selected projects"}>
        {heroProjects.map((project, index) => {
          const imageSettings = {
            visible: true,
            dx: 0,
            dy: 0,
            scale: 100,
            ...defaultImageFrame,
            ...(settings.images[project.id] || {}),
          };
          if (!imageSettings.visible) return null;
          return (
            <a
              aria-label={language === "ru" ? project.title : project.titleEn}
              className={`collage-card collage-card--${index + 1}`}
              href={`#/project/${project.id}`}
              key={project.id}
              style={{
                "--element-dx": `${imageSettings.dx}px`,
                "--element-dy": `${imageSettings.dy}px`,
                "--element-scale": imageSettings.scale / 100,
                aspectRatio: imageSettings.aspectRatio,
                borderRadius: `${imageSettings.radius}px`,
                height: imageSettings.aspectRatio === "auto" ? undefined : "auto",
              }}
            >
              <img
                src={project.image}
                alt=""
                style={{
                  objectFit: imageSettings.fit,
                  objectPosition: `${imageSettings.positionX}% ${imageSettings.positionY}%`,
                }}
              />
            </a>
          );
        })}
        <p className="scribble scribble--one">{language === "ru" ? "разное, но всё моё" : "different, but all mine"}</p>
        <p className="scribble scribble--two">
          {language === "ru" ? "нажмите, чтобы открыть →" : "tap to open →"}
        </p>
      </div>
      <CustomPublicElements block={settings} language={language} />
    </section>
  );
}

function HomeManifesto({ content, settings, language }) {
  return (
    <section className="manifesto" style={{ minHeight: `${settings.height}px`, background: settings.background }}>
      {settings.text.visible && (
        <p
          style={{
            "--element-dx": `${settings.text.dx}px`,
            "--element-dy": `${settings.text.dy}px`,
            "--custom-font-size": `${settings.text.fontSize}px`,
            color: settings.text.color,
          }}
        >
          {settings.text.href ? (
            <a href={settings.text.href}>
              {language === "ru" ? content.intro : content.introEn}
            </a>
          ) : language === "ru" ? (
            content.intro
          ) : (
            content.introEn
          )}
        </p>
      )}
      <span className="scribble">
        {language === "ru" ? "коротко о главном" : "the short version"}
      </span>
      <CustomPublicElements block={settings} language={language} />
    </section>
  );
}

function HomeProjects({ content, featured, settings, language }) {
  return (
    <section
      className="selected"
      style={{ minHeight: `${settings.minHeight}px`, background: settings.background }}
    >
      <div className="section-line">
        {settings.heading.visible && (
          <h2
            style={{
              "--element-dx": `${settings.heading.dx}px`,
              "--element-dy": `${settings.heading.dy}px`,
              "--custom-font-size": `${settings.heading.fontSize}px`,
              color: settings.heading.color,
            }}
          >
            {settings.heading.href ? (
              <a href={settings.heading.href}>
                {language === "ru" ? "Избранные проекты" : "Selected projects"}
              </a>
            ) : language === "ru" ? (
              "Избранные проекты"
            ) : (
              "Selected projects"
            )}
          </h2>
        )}
        <a href="#/projects">
          {language === "ru" ? "Смотреть все" : "View all"} (
          {content.projects.length})
        </a>
      </div>
      <div className="project-grid project-grid--featured">
        {featured.map((project, index) => (
          <ProjectCard
            language={language}
            project={project}
            index={index}
            key={project.id}
          />
        ))}
      </div>
      <CustomPublicElements block={settings} language={language} />
    </section>
  );
}

function ProjectCard({ project, index, language = "ru" }) {
  const frame = getImageFrame(project.frame);
  return (
    <article className={`project-card project-card--${(index % 3) + 1}`}>
      <a
        href={`#/project/${project.id}`}
        className="project-image-link"
        style={{
          aspectRatio: frame.aspectRatio,
          borderRadius: `${frame.radius}px`,
        }}
      >
        <img
          src={project.image}
          alt={language === "ru" ? project.title : project.titleEn}
          style={{
            height: frame.aspectRatio === "auto" ? "auto" : "100%",
            objectFit: frame.fit,
            objectPosition: `${frame.positionX}% ${frame.positionY}%`,
          }}
        />
      </a>
      <div className="project-caption">
        <div>
          <h3>
            <a href={`#/project/${project.id}`}>
              {language === "ru" ? project.title : project.titleEn}
            </a>
          </h3>
          <p>
            {language === "ru" ? project.category : project.categoryEn || project.category} / {project.year}
          </p>
        </div>
      </div>
      <p className="scribble">
        {language === "ru" ? project.note : project.noteEn}
      </p>
    </article>
  );
}

function CustomPublicElements({ block, language }) {
  return (block.customElements || []).map((element) => {
    if (!element.visible) return null;
    const style = {
      color: element.color,
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      opacity: element.opacity ?? 1,
      transform: `rotate(${element.rotation || 0}deg)`,
    };
    if (element.type === "image") {
      const frame = getImageFrame(element);
      Object.assign(style, {
        aspectRatio: frame.aspectRatio,
        borderRadius: `${frame.radius}px`,
        overflow: "hidden",
      });
      const image = (
        <img
          src={element.src}
          alt=""
          style={{
            height: frame.aspectRatio === "auto" ? "auto" : "100%",
            objectFit: frame.fit,
            objectPosition: `${frame.positionX}% ${frame.positionY}%`,
          }}
        />
      );
      return element.href ? (
        <a
          className="custom-public-element custom-public-image"
          href={element.href}
          key={element.id}
          style={style}
        >
          {image}
        </a>
      ) : (
        <span
          className="custom-public-element custom-public-image"
          key={element.id}
          style={style}
        >
          {image}
        </span>
      );
    }
    const text = language === "ru" ? element.textRu : element.textEn;
    const textStyle = {
      ...style,
      fontSize: `${element.fontSize}px`,
      fontWeight: element.fontWeight || 400,
      lineHeight: element.lineHeight || 1,
      textAlign: element.textAlign || "left",
    };
    return element.href ? (
      <a
        className="custom-public-element custom-public-text"
        href={element.href}
        key={element.id}
        style={textStyle}
      >
        {text}
      </a>
    ) : (
      <span
        className="custom-public-element custom-public-text"
        key={element.id}
        style={textStyle}
      >
        {text}
      </span>
    );
  });
}

function CustomPublicBlock({ block, language }) {
  return (
    <section
      className="custom-public-block"
      style={{
        background: block.background,
        minHeight: `${block.height}px`,
      }}
    >
      <CustomPublicElements block={block} language={language} />
    </section>
  );
}

function ProjectsPage({ content, language }) {
  const allLabel = language === "ru" ? "Все" : "All";
  const [filter, setFilter] = useState(allLabel);
  useEffect(() => setFilter(allLabel), [allLabel]);
  const getCategory = (project) => language === "ru" ? project.category : project.categoryEn || project.category;
  const categories = [allLabel, ...new Set(content.projects.map(getCategory))];
  const projects =
    filter === allLabel
      ? content.projects
      : content.projects.filter((project) => getCategory(project) === filter);

  return (
    <main className="inner-page">
      <section className="page-title">
        <p>{language === "ru" ? "Все работы" : "All work"} / 2024–2026</p>
        <h1>{language === "ru" ? "Проекты" : "Projects"}</h1>
        <span className="scribble">
          {language === "ru" ? "бренды, системы, картинки" : "brands, systems, images"}
        </span>
      </section>
      <div className="filter-bar">
        {categories.map((category) => (
          <button
            className={filter === category ? "active" : ""}
            key={category}
            type="button"
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <section className="project-grid project-grid--archive">
        {projects.map((project, index) => (
          <ProjectCard
            language={language}
            project={project}
            index={index}
            key={project.id}
          />
        ))}
      </section>
    </main>
  );
}

function ProjectPage({ project, projects, navigate, language }) {
  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const next = projects[(currentIndex + 1) % projects.length];
  return (
    <main className="project-page">
      <section className="project-hero">
        <div>
          <p>
            {language === "ru" ? project.category : project.categoryEn || project.category}
          </p>
          <h1>{language === "ru" ? project.title : project.titleEn}</h1>
        </div>
        <p className="project-year">{project.year}</p>
      </section>
      <figure className="project-lead">
        <img
          src={project.image}
          alt={language === "ru" ? project.title : project.titleEn}
        />
        <figcaption className="scribble">
          {language === "ru" ? project.note : project.noteEn}
        </figcaption>
      </figure>
      <section className="project-story">
        <div className="project-facts">
          <p><span>{language === "ru" ? "Клиент" : "Client"}</span>{language === "ru" ? project.client : project.clientEn || project.client}</p>
          <p><span>{language === "ru" ? "Год" : "Year"}</span>{project.year}</p>
          <p><span>{language === "ru" ? "Направление" : "Discipline"}</span>{language === "ru" ? project.category : project.categoryEn || project.category}</p>
        </div>
        <div>
          <p className="project-story-label">{language === "ru" ? "О проекте" : "About the project"}</p>
          <p>{language === "ru" ? project.description : project.descriptionEn}</p>
        </div>
      </section>
      <section className="project-gallery">
        {(project.gallery || []).map((image, index) => (
          <figure className={`gallery-item gallery-item--${index % 4}`} key={`${image}-${index}`}>
            <img src={image} alt="" loading="lazy" />
          </figure>
        ))}
      </section>
      <button
        className="next-project"
        type="button"
        onClick={() => navigate(`/project/${next.id}`)}
      >
        <span>{language === "ru" ? "Следующий проект" : "Next project"}</span>
        <strong>{language === "ru" ? next.title : next.titleEn}</strong>
      </button>
    </main>
  );
}

function AboutPage({ content, language }) {
  return (
    <main className="inner-page about-page">
      <section className="page-title page-title--about">
        <p>
          {language === "ru"
            ? "Обо мне / подход и опыт"
            : "About / approach and experience"}
        </p>
        <h1>
          {language === "ru"
            ? "Дизайн, который выглядит живым и работает как система."
            : "Design that feels alive and works as a system."}
        </h1>
      </section>
      <section className="about-layout">
        <div className="portrait-sheet">
          <img src="portfolio/web/page-06-04.webp" alt={language === "ru" ? "Фрагмент визуального исследования" : "A fragment of visual research"} />
          <span className="scribble">
            {language === "ru" ? "люблю искать новое внутри системы" : "looking for the new inside a system"}
          </span>
        </div>
        <div className="about-copy">
          <p>{language === "ru" ? content.about : content.aboutEn}</p>
          <dl>
            <div>
              <dt>{language === "ru" ? "Фокус" : "Focus"}</dt>
              <dd>
                {language === "ru"
                  ? "Айдентика, digital, 3D, AI-арт-дирекшен"
                  : "Identity, digital, 3D, AI art direction"}
              </dd>
            </div>
            <div>
              <dt>{language === "ru" ? "Подход" : "Approach"}</dt>
              <dd>
                {language === "ru"
                  ? "Исследование, ясная система, смелая деталь"
                  : "Research, clear systems and a bold detail"}
              </dd>
            </div>
            <div>
              <dt>{language === "ru" ? "Доступность" : "Availability"}</dt>
              <dd>
                {language === "ru"
                  ? content.availability
                  : content.availabilityEn}
              </dd>
            </div>
          </dl>
          <a className="text-link" href="#/contacts">
            {language === "ru" ? "Обсудить проект" : "Discuss a project"}
          </a>
        </div>
      </section>
    </main>
  );
}

function ContactsPage({ content, language }) {
  const [sent, setSent] = useState(false);
  return (
    <main className="contacts-page">
      <section className="contact-intro">
        <p>
          {language === "ru" ? content.availability : content.availabilityEn}
        </p>
        <h1>
          {language === "ru" ? "Давайте сделаем" : "Let’s make"}
          <br />
          {language === "ru" ? "что-то " : "something "}
          <span>{language === "ru" ? "сильное вместе." : "strong together."}</span>
        </h1>
        <p className="scribble">
          {language === "ru" ? "расскажите, что у вас в голове" : "tell me what you have in mind"}
        </p>
      </section>
      <section className="contact-grid">
        <div className="contact-list">
          <a href={`mailto:${content.email}`}>{content.email}</a>
          <a href={`https://t.me/${content.telegram.replace("@", "")}`}>
            Telegram {content.telegram}
          </a>
          <a href={`https://instagram.com/${content.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">Instagram {content.instagram}</a>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const subject = encodeURIComponent(
              language === "ru"
                ? `Новый проект от ${form.get("name")}`
                : `New project from ${form.get("name")}`,
            );
            const body = encodeURIComponent(
              `${form.get("message")}\n\n${form.get("name")}\n${form.get("email")}`,
            );
            setSent(true);
            window.location.href = `mailto:${content.email}?subject=${subject}&body=${body}`;
          }}
        >
          <label>
            {language === "ru" ? "Как вас зовут" : "Your name"}
            <input name="name" required />
          </label>
          <label>
            {language === "ru" ? "Почта" : "Email"}
            <input name="email" type="email" required />
          </label>
          <label>
            {language === "ru" ? "Немного о задаче" : "A little about the project"}
            <textarea name="message" rows="5" required />
          </label>
          <button type="submit">
            {sent
              ? language === "ru"
                ? "Получено, спасибо"
                : "Received, thank you"
              : language === "ru"
                ? "Отправить"
                : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Footer({ content, language }) {
  const footer = content.layout.chrome.footer;
  if (!footer.visible) return null;
  return (
    <footer
      className="footer"
      style={{
        minHeight: `${footer.height}px`,
        background: footer.background,
        color: footer.textColor,
      }}
    >
      <div>
        <p>{language === "ru" ? content.name : content.nameEn || content.name}</p>
        <p>{language === "ru" ? content.role : content.roleEn}</p>
      </div>
      <div>
        <a href={`mailto:${content.email}`}>{content.email}</a>
        <a href="#/projects">{language === "ru" ? "Все проекты" : "All projects"}</a>
      </div>
      <strong>{language === "ru" ? "На связи" : "Let’s talk"}</strong>
      <a className="footer-admin" href="#/admin" aria-label={language === "ru" ? "Открыть кабинет" : "Open admin"}>© 2026</a>
    </footer>
  );
}

function AdminLogin({ adminEmail: allowedEmail, onRequestLink, onExit }) {
  const [email, setEmail] = useState(allowedEmail || "");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  return (
    <main className="login-page">
      <button className="plain-button" type="button" onClick={onExit}>
        Вернуться на сайт
      </button>
      <form
        className="login-card"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setSending(true);
          try {
            await onRequestLink(email);
            setSent(true);
          } catch (requestError) {
            setError(requestError.message);
          } finally {
            setSending(false);
          }
        }}
      >
        <p>Личный кабинет</p>
        <h1>{sent ? "Проверьте почту" : "Вход в редактор"}</h1>
        <label>
          Email
          <input
            autoFocus
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        {sent && (
          <p>Мы отправили безопасную ссылку для входа на {email}.</p>
        )}
        <button disabled={sending} type="submit">
          {sending ? "Отправляем..." : sent ? "Отправить ещё раз" : "Получить ссылку"}
        </button>
        <small>Вход разрешён только владельцу сайта.</small>
      </form>
    </main>
  );
}

function Editor({
  content,
  setContent,
  onExit,
  onLock,
  onSave,
  onUploadImage,
}) {
  const [tab, setTab] = useState("projects");
  const [notice, setNotice] = useState(
    "После изменений нажмите «Сохранить настройки»",
  );
  const [preview, setPreview] = useState(false);
  const dragIndex = useRef(null);

  const updateField = (field, value) => {
    setContent((current) => ({ ...current, [field]: value }));
    setNotice("Есть несохранённые изменения");
  };

  const updateProject = (id, field, value) => {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    }));
    setNotice("Есть несохранённые изменения");
  };

  const moveProject = (from, to) => {
    if (from === to || from === null) return;
    setContent((current) => {
      const projects = [...current.projects];
      const [moved] = projects.splice(from, 1);
      projects.splice(to, 0, moved);
      return {
        ...current,
        projects,
      };
    });
    setNotice("Новый порядок сохранён");
  };

  const addProject = () => {
    const id = `project-${Date.now()}`;
    setContent((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          id,
          number: String(current.projects.length + 1).padStart(2, "0"),
          title: "Новый проект",
          titleEn: "New project",
          category: "Айдентика",
          categoryEn: "Identity",
          client: "Новый клиент",
          clientEn: "New client",
          year: new Date().getFullYear().toString(),
          description: "Добавьте описание проекта.",
          descriptionEn: "Add a project description.",
          image: current.projects[0]?.image || "",
          gallery: [],
          note: "подпись от руки",
          noteEn: "handwritten note",
          featured: false,
        },
      ],
    }));
    setNotice("Проект добавлен");
  };

  return (
    <div className="editor">
      <aside className="editor-sidebar">
        <div>
          <p className="editor-kicker">Portfolio OS</p>
          <h1>{content.name}</h1>
        </div>
        <nav>
          <button
            className={tab === "visual" ? "active" : ""}
            onClick={() => {
              setTab("visual");
              setPreview(false);
            }}
            type="button"
          >
            Визуальный редактор <span>Beta</span>
          </button>
          <button
            className={tab === "projects" ? "active" : ""}
            onClick={() => {
              setTab("projects");
              setPreview(false);
            }}
            type="button"
          >
            Проекты <span>{content.projects.length}</span>
          </button>
          <button
            className={tab === "pages" ? "active" : ""}
            onClick={() => setTab("pages")}
            type="button"
          >
            Тексты сайта
          </button>
          <button
            className={tab === "contacts" ? "active" : ""}
            onClick={() => setTab("contacts")}
            type="button"
          >
            Контакты
          </button>
        </nav>
        <div className="editor-sidebar-actions">
          <button type="button" onClick={onExit}>
            Открыть сайт
          </button>
          <button type="button" onClick={onLock}>
            Выйти
          </button>
        </div>
      </aside>

      <main className="editor-main">
        <header className="editor-header">
          <div>
            <p>{notice}</p>
            <h2>
              {tab === "projects"
                ? "Работы"
                : tab === "visual"
                  ? "Главная как холст"
                : tab === "pages"
                  ? "Основные тексты"
                  : "Связь"}
            </h2>
          </div>
          <div className="editor-header-actions">
            <button
              className="save-settings-button"
              type="button"
              onClick={async () => {
                setNotice("Сохраняем настройки...");
                try {
                  await onSave();
                  setNotice("Настройки сохранены в облаке");
                } catch (saveError) {
                  setNotice(saveError.message);
                }
              }}
            >
              Сохранить настройки
            </button>
            <button type="button" onClick={() => setPreview((value) => !value)}>
              {preview ? "Закрыть превью" : "Быстрое превью"}
            </button>
          </div>
        </header>

        {tab === "visual" ? (
          <VisualEditor
            content={content}
            setContent={setContent}
            setNotice={setNotice}
            onUploadImage={onUploadImage}
          />
        ) : preview ? (
          <div className="editor-preview">
            <div className="mini-site">
              <p>{content.name}</p>
              <h3>{content.intro}</h3>
              <div>
                {content.projects.slice(0, 3).map((project) => (
                  <img src={project.image} alt="" key={project.id} />
                ))}
              </div>
            </div>
          </div>
        ) : tab === "projects" ? (
          <section className="editor-projects">
            <div className="editor-toolbar">
              <p>Перетащите карточки, чтобы изменить порядок на сайте.</p>
              <button type="button" onClick={addProject}>
                Добавить проект
              </button>
            </div>
            <div className="editor-project-list">
              {content.projects.map((project, index) => (
                <EditorProject
                  key={project.id}
                  project={project}
                  index={index}
                  updateProject={updateProject}
                  onUploadImage={onUploadImage}
                  onDelete={() => {
                    setContent((current) => ({
                      ...current,
                      projects: current.projects.filter(
                        (item) => item.id !== project.id,
                      ),
                    }));
                    setNotice("Проект удалён");
                  }}
                  onDragStart={() => {
                    dragIndex.current = index;
                  }}
                  onDrop={() => {
                    moveProject(dragIndex.current, index);
                    dragIndex.current = null;
                  }}
                />
              ))}
            </div>
          </section>
        ) : tab === "pages" ? (
          <section className="editor-form">
            <EditorField
              label="Имя"
              value={content.name}
              onChange={(value) => updateField("name", value)}
            />
            <EditorField
              label="Имя — English"
              value={content.nameEn || content.name}
              onChange={(value) => updateField("nameEn", value)}
            />
            <EditorField
              label="Профессия"
              value={content.role}
              onChange={(value) => updateField("role", value)}
            />
            <EditorField
              label="Профессия — English"
              value={content.roleEn}
              onChange={(value) => updateField("roleEn", value)}
            />
            <EditorField
              label="Текст на главной"
              value={content.intro}
              multiline
              onChange={(value) => updateField("intro", value)}
            />
            <EditorField
              label="Текст на главной — English"
              value={content.introEn}
              multiline
              onChange={(value) => updateField("introEn", value)}
            />
            <EditorField
              label="Обо мне"
              value={content.about}
              multiline
              onChange={(value) => updateField("about", value)}
            />
            <EditorField
              label="Обо мне — English"
              value={content.aboutEn}
              multiline
              onChange={(value) => updateField("aboutEn", value)}
            />
            <EditorField
              label="Статус"
              value={content.availability}
              onChange={(value) => updateField("availability", value)}
            />
            <EditorField
              label="Статус — English"
              value={content.availabilityEn}
              onChange={(value) => updateField("availabilityEn", value)}
            />
          </section>
        ) : (
          <section className="editor-form">
            <EditorField
              label="Город"
              value={content.location}
              onChange={(value) => updateField("location", value)}
            />
            <EditorField
              label="Город — English"
              value={content.locationEn}
              onChange={(value) => updateField("locationEn", value)}
            />
            <EditorField
              label="Email"
              value={content.email}
              onChange={(value) => updateField("email", value)}
            />
            <EditorField
              label="Telegram"
              value={content.telegram}
              onChange={(value) => updateField("telegram", value)}
            />
            <EditorField
              label="Instagram"
              value={content.instagram}
              onChange={(value) => updateField("instagram", value)}
            />
            <button
              className="danger-button"
              type="button"
              onClick={() => {
                setContent(cloneInitial());
                setNotice("Демо-контент восстановлен");
              }}
            >
              Сбросить демо-данные
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

const blockNames = {
  hero: "Первый экран",
  manifesto: "Розовый текст",
  projects: "Избранные проекты",
};

function VisualEditor({
  content,
  setContent,
  setNotice,
  onUploadImage,
}) {
  const [selected, setSelected] = useState({
    block: "hero",
    kind: null,
    id: null,
  });
  const dragState = useRef(null);
  const guideDragState = useRef(null);
  const canvasRef = useRef(null);
  const editorSettings = {
    ...defaultLayout.editor,
    ...(content.layout.editor || {}),
  };
  const gridSettings = {
    ...defaultLayout.grid,
    ...(content.layout.grid || {}),
  };
  const editorScale = editorSettings.zoom / 100;

  const updateLayout = (
    updater,
    notice = "Есть несохранённые изменения",
  ) => {
    setContent((current) => ({
      ...current,
      layout: updater(current.layout),
    }));
    setNotice(notice);
  };

  const updateBlock = (blockId, patch) => {
    updateLayout((layout) => ({
      ...layout,
      blocks: {
        ...layout.blocks,
        [blockId]: { ...layout.blocks[blockId], ...patch },
      },
    }));
  };

  const updateChrome = (part, patch) => {
    updateLayout((layout) => ({
      ...layout,
      chrome: {
        ...layout.chrome,
        [part]: { ...layout.chrome[part], ...patch },
      },
    }));
  };

  const updateGrid = (patch) => {
    updateLayout((layout) => ({
      ...layout,
      grid: { ...layout.grid, ...patch },
    }));
  };

  const updateEditor = (patch, notice) => {
    updateLayout(
      (layout) => ({
        ...layout,
        editor: { ...layout.editor, ...patch },
      }),
      notice,
    );
  };

  const getElement = (selection = selected) => {
    if (!selection) return null;
    if (selection.kind === "chrome") {
      return content.layout.chrome[selection.id];
    }
    if (selection.kind === "settings") return editorSettings;
    const block = content.layout.blocks[selection.block];
    if (selection.kind === "custom") {
      return block.customElements.find((element) => element.id === selection.id);
    }
    if (selection.kind === "image") {
      return {
        visible: true,
        dx: 0,
        dy: 0,
        scale: 100,
        ...defaultImageFrame,
        ...(block.images[selection.id] || {}),
      };
    }
    return block[selection.kind];
  };

  const updateElement = (selection, patch, notice) => {
    if (selection.kind === "settings") {
      updateEditor(patch, notice);
      return;
    }
    if (selection.kind === "chrome") {
      updateChrome(selection.id, patch);
      return;
    }
    updateLayout(
      (layout) => {
        const block = layout.blocks[selection.block];
        if (selection.kind === "custom") {
          return {
            ...layout,
            blocks: {
              ...layout.blocks,
              [selection.block]: {
                ...block,
                customElements: block.customElements.map((element) =>
                  element.id === selection.id
                    ? { ...element, ...patch }
                    : element,
                ),
              },
            },
          };
        }
        if (selection.kind === "image") {
          const currentImage = {
            visible: true,
            dx: 0,
            dy: 0,
            scale: 100,
            ...defaultImageFrame,
            ...(block.images[selection.id] || {}),
          };
          return {
            ...layout,
            blocks: {
              ...layout.blocks,
              [selection.block]: {
                ...block,
                images: {
                  ...block.images,
                  [selection.id]: { ...currentImage, ...patch },
                },
              },
            },
          };
        }
        return {
          ...layout,
          blocks: {
            ...layout.blocks,
            [selection.block]: {
              ...block,
              [selection.kind]: { ...block[selection.kind], ...patch },
            },
          },
        };
      },
      notice,
    );
  };

  const startDrag = (event, selection) => {
    event.preventDefault();
    event.stopPropagation();
    setSelected(selection);
    const element = getElement(selection);
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dx: selection.kind === "custom" ? element.x : element.dx || 0,
      dy: selection.kind === "custom" ? element.y : element.dy || 0,
      selection,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragElement = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    let x = Math.round(
      drag.dx + (event.clientX - drag.startX) / editorScale,
    );
    let y = Math.round(
      drag.dy + (event.clientY - drag.startY) / editorScale,
    );
    if (editorSettings.snap) {
      const step = editorSettings.gridSize;
      x = Math.round(x / step) * step;
      y = Math.round(y / step) * step;
    }
    updateElement(
      drag.selection,
      drag.selection.kind === "custom" ? { x, y } : { dx: x, dy: y },
      "Позиция сохранена",
    );
  };

  const stopDrag = (event) => {
    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const moveBlock = (blockId, direction) => {
    updateLayout((layout) => {
      const order = [...layout.order];
      const index = order.indexOf(blockId);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= order.length) return layout;
      [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
      return { ...layout, order };
    }, "Порядок блоков изменён");
  };

  const addBlock = () => {
    const id = `custom-block-${Date.now()}`;
    updateLayout((layout) => ({
      ...layout,
      order: [...layout.order, id],
      blocks: {
        ...layout.blocks,
        [id]: {
          id,
          name: `Новый блок ${layout.order.length - 2}`,
          visible: true,
          height: 520,
          background: "#f7f7f4",
          customElements: [],
        },
      },
    }), "Новый блок добавлен");
    setSelected({ block: id, kind: null, id: null });
  };

  const addElement = (type) => {
    const blockId = selected?.block || "hero";
    const id = `${type}-${Date.now()}`;
    const element =
      type === "text"
        ? {
            id,
            type,
            visible: true,
            textRu: "Новый текст",
            textEn: "New text",
            x: 80,
            y: 100,
            width: 360,
            fontSize: 42,
            fontWeight: 400,
            lineHeight: 1,
            textAlign: "left",
            color: "#171717",
            opacity: 1,
            rotation: 0,
            href: "",
          }
        : {
            id,
            type,
            visible: true,
            src: content.projects[0]?.image || "",
            x: 90,
            y: 140,
            width: 320,
            color: "#171717",
            opacity: 1,
            rotation: 0,
            href: "",
            ...defaultImageFrame,
          };
    updateLayout((layout) => ({
      ...layout,
      blocks: {
        ...layout.blocks,
        [blockId]: {
          ...layout.blocks[blockId],
          customElements: [
            ...(layout.blocks[blockId].customElements || []),
            element,
          ],
        },
      },
    }), type === "text" ? "Текст добавлен" : "Картинка добавлена");
    setSelected({ block: blockId, kind: "custom", id });
  };

  const addGuide = (axis) => {
    updateLayout((layout) => ({
      ...layout,
      guides: {
        ...layout.guides,
        [axis]: [
          ...layout.guides[axis],
          axis === "vertical" ? 50 : 300,
        ],
      },
    }), "Направляющая добавлена");
  };

  const moveCustomElement = (blockId, elementId, direction) => {
    updateLayout((layout) => {
      const block = layout.blocks[blockId];
      const elements = [...(block.customElements || [])];
      const index = elements.findIndex((element) => element.id === elementId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= elements.length) return layout;
      [elements[index], elements[nextIndex]] = [elements[nextIndex], elements[index]];
      return {
        ...layout,
        blocks: {
          ...layout.blocks,
          [blockId]: { ...block, customElements: elements },
        },
      };
    }, "Порядок слоёв изменён");
  };

  const startGuideDrag = (event, axis, index) => {
    event.preventDefault();
    event.stopPropagation();
    guideDragState.current = { axis, index, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragGuide = (event) => {
    const drag = guideDragState.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas || drag.pointerId !== event.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    const nextPosition =
      drag.axis === "vertical"
        ? Math.max(
            0,
            Math.min(100, ((event.clientX - rect.left) / rect.width) * 100),
          )
        : Math.max(0, (event.clientY - rect.top) / editorScale);

    updateLayout((layout) => ({
      ...layout,
      guides: {
        ...layout.guides,
        [drag.axis]: layout.guides[drag.axis].map((position, index) =>
          index === drag.index ? Math.round(nextPosition) : position,
        ),
      },
    }), "Направляющая перемещена");
  };

  const stopGuideDrag = (event) => {
    if (guideDragState.current?.pointerId !== event.pointerId) return;
    guideDragState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const selectedElement = getElement();
  const selectedBlock = selected
    ? content.layout.blocks[selected.block] || null
    : content.layout.blocks.hero;
  const hero = content.layout.blocks.hero;
  const manifesto = content.layout.blocks.manifesto;
  const projects = content.layout.blocks.projects;
  const heroBases = [
    { left: 4, top: 24, width: 30, rotate: -5 },
    { left: 29, top: 16, width: 28, rotate: 7 },
    { left: 62, top: 29, width: 31, rotate: -4 },
    { left: 17, top: 58, width: 28, rotate: 4 },
    { left: 46, top: 61, width: 29, rotate: -7 },
  ];

  const renderCustomElements = (blockId, block) =>
    (block.customElements || []).map((element) => {
      if (!element.visible) return null;
      const selection = { block: blockId, kind: "custom", id: element.id };
      const common = {
        left: element.x * editorScale,
        top: element.y * editorScale,
        width: element.width * editorScale,
      };
      const frame = getImageFrame(element);
      return (
        <button
          className={
            selected?.kind === "custom" && selected?.id === element.id
              ? "visual-element visual-custom-element is-selected"
              : "visual-element visual-custom-element"
          }
          key={element.id}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setSelected(selection);
          }}
          onPointerDown={(event) => startDrag(event, selection)}
          onPointerMove={dragElement}
          onPointerUp={stopDrag}
          style={{
            ...common,
            color: element.color,
            opacity: element.opacity ?? 1,
            fontSize:
              element.type === "text"
                ? element.fontSize * editorScale
                : undefined,
            fontWeight: element.fontWeight || 400,
            lineHeight: element.lineHeight || 1,
            textAlign: element.textAlign || "left",
            aspectRatio: element.type === "image" ? frame.aspectRatio : undefined,
            borderRadius: element.type === "image" ? `${frame.radius}px` : undefined,
            overflow: element.type === "image" ? "hidden" : undefined,
            transform: `translate(${(element.dx || 0) * editorScale}px, ${(element.dy || 0) * editorScale}px) rotate(${element.rotation || 0}deg)`,
          }}
        >
          {element.type === "image" ? (
            <img
              src={element.src}
              alt=""
              style={{
                height: frame.aspectRatio === "auto" ? "auto" : "100%",
                objectFit: frame.fit,
                objectPosition: `${frame.positionX}% ${frame.positionY}%`,
              }}
            />
          ) : (
            element.textRu
          )}
        </button>
      );
    });

  return (
    <section className="visual-editor">
      <div className="visual-global-toolbar">
        <button
          type="button"
          onClick={() =>
            setSelected({ block: null, kind: "chrome", id: "header" })
          }
        >
          Хедер
        </button>
        <button
          type="button"
          onClick={() =>
            setSelected({ block: null, kind: "chrome", id: "menu" })
          }
        >
          Меню
        </button>
        <button
          type="button"
          onClick={() =>
            setSelected({ block: null, kind: "chrome", id: "footer" })
          }
        >
          Футер
        </button>
        <button
          className={selected?.kind === "settings" ? "active" : ""}
          type="button"
          onClick={() => setSelected({ block: null, kind: "settings", id: "grid" })}
        >
          Сетка и холст
        </button>
        <span />
        <button type="button" onClick={() => addElement("text")}>
          + Текст
        </button>
        <button type="button" onClick={() => addElement("image")}>
          + Картинка
        </button>
        <button type="button" onClick={addBlock}>
          + Блок
        </button>
        <button type="button" onClick={() => addGuide("vertical")}>
          + Вертикальная направляющая
        </button>
        <button type="button" onClick={() => addGuide("horizontal")}>
          + Горизонтальная направляющая
        </button>
        <label className="visual-zoom">
          Масштаб
          <input
            min="40"
            max="85"
            type="range"
            value={editorSettings.zoom}
            onChange={(event) =>
              updateEditor({ zoom: Number(event.target.value) }, "Масштаб холста изменён")
            }
          />
          <strong>{editorSettings.zoom}%</strong>
        </label>
      </div>
      <div className="visual-block-manager">
        {content.layout.order.map((blockId, index) => {
          const block = content.layout.blocks[blockId];
          return (
            <div className={block.visible ? "" : "is-hidden"} key={blockId}>
              <button
                type="button"
                onClick={() =>
                  setSelected({ block: blockId, kind: null, id: null })
                }
              >
                {blockNames[blockId] || block.name}
              </button>
              <button
                aria-label="Переместить блок выше"
                disabled={index === 0}
                type="button"
                onClick={() => moveBlock(blockId, -1)}
              >
                ↑
              </button>
              <button
                aria-label="Переместить блок ниже"
                disabled={index === content.layout.order.length - 1}
                type="button"
                onClick={() => moveBlock(blockId, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => updateBlock(blockId, { visible: !block.visible })}
              >
                {block.visible ? "Скрыть" : "Вернуть"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="visual-workspace">
        <aside className="visual-layers">
          <div className="visual-layers-head">
            <p>Слои</p>
            <button
              type="button"
              onClick={() => setSelected({ block: null, kind: "settings", id: "grid" })}
            >
              Сетка
            </button>
          </div>
          {content.layout.order.map((blockId) => {
            const block = content.layout.blocks[blockId];
            return (
              <div className="visual-layer-group" key={`layer-${blockId}`}>
                <button
                  className={selected?.block === blockId && !selected?.kind ? "active" : ""}
                  type="button"
                  onClick={() => setSelected({ block: blockId, kind: null, id: null })}
                >
                  <span>{blockNames[blockId] || block.name}</span>
                  <small>{block.visible ? "Виден" : "Скрыт"}</small>
                </button>
                {(block.customElements || []).map((element, elementIndex) => (
                  <div className="visual-layer-item" key={`layer-${element.id}`}>
                    <button
                      className={selected?.kind === "custom" && selected.id === element.id ? "active" : ""}
                      type="button"
                      onClick={() => setSelected({ block: blockId, kind: "custom", id: element.id })}
                    >
                      {element.type === "text" ? element.textRu || "Текст" : "Картинка"}
                    </button>
                    <button
                      aria-label="Слой выше"
                      disabled={elementIndex === block.customElements.length - 1}
                      type="button"
                      onClick={() => moveCustomElement(blockId, element.id, 1)}
                    >↑</button>
                    <button
                      aria-label="Слой ниже"
                      disabled={elementIndex === 0}
                      type="button"
                      onClick={() => moveCustomElement(blockId, element.id, -1)}
                    >↓</button>
                  </div>
                ))}
              </div>
            );
          })}
        </aside>
        <div className="visual-canvas-wrap">
          <div className="visual-ruler-corner" />
          <div className="visual-ruler visual-ruler--horizontal" />
          <div className="visual-ruler visual-ruler--vertical" />
          <div
            className={editorSettings.gridVisible ? "visual-canvas has-grid" : "visual-canvas"}
            ref={canvasRef}
            style={{
              "--editor-grid-size": `${editorSettings.gridSize * editorScale}px`,
              width: `${1280 * editorScale}px`,
              minWidth: `${1280 * editorScale}px`,
            }}
          >
            {editorSettings.guidesVisible && content.layout.guides.vertical.map((position, index) => (
              <button
                aria-label={`Вертикальная направляющая ${index + 1}`}
                className="visual-guide visual-guide--vertical"
                key={`v-${index}`}
                onPointerDown={(event) =>
                  startGuideDrag(event, "vertical", index)
                }
                onPointerMove={dragGuide}
                onPointerUp={stopGuideDrag}
                onPointerCancel={stopGuideDrag}
                onDoubleClick={() =>
                  updateLayout((layout) => ({
                    ...layout,
                    guides: {
                      ...layout.guides,
                      vertical: layout.guides.vertical.filter(
                        (_, guideIndex) => guideIndex !== index,
                      ),
                    },
                  }))
                }
                style={{ left: `${position}%` }}
                title="Двойной клик — удалить"
                type="button"
              />
            ))}
            {editorSettings.guidesVisible && content.layout.guides.horizontal.map((position, index) => (
              <button
                aria-label={`Горизонтальная направляющая ${index + 1}`}
                className="visual-guide visual-guide--horizontal"
                key={`h-${index}`}
                onPointerDown={(event) =>
                  startGuideDrag(event, "horizontal", index)
                }
                onPointerMove={dragGuide}
                onPointerUp={stopGuideDrag}
                onPointerCancel={stopGuideDrag}
                onDoubleClick={() =>
                  updateLayout((layout) => ({
                    ...layout,
                    guides: {
                      ...layout.guides,
                      horizontal: layout.guides.horizontal.filter(
                        (_, guideIndex) => guideIndex !== index,
                      ),
                    },
                  }))
                }
                style={{ top: `${position * editorScale}px` }}
                title="Двойной клик — удалить"
                type="button"
              />
            ))}
            {content.layout.chrome.header.visible && (
              <section
                className={
                  selected?.kind === "chrome" && selected.id === "header"
                    ? "visual-site-header is-selected"
                    : "visual-site-header"
                }
                onClick={() =>
                  setSelected({ block: null, kind: "chrome", id: "header" })
                }
                style={{
                  background: content.layout.chrome.header.background,
                  color: content.layout.chrome.header.textColor,
                  minHeight: content.layout.chrome.header.height * editorScale,
                }}
              >
                <button
                  className="visual-site-brand"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelected({
                      block: null,
                      kind: "chrome",
                      id: "header",
                    });
                  }}
                >
                  <strong>{content.name}</strong>
                </button>
                <span className="visual-site-role">{content.role}</span>
                {content.layout.chrome.menu.visible && (
                  <button
                    className={
                      selected?.kind === "chrome" && selected.id === "menu"
                        ? "visual-site-menu is-selected"
                        : "visual-site-menu"
                    }
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelected({
                        block: null,
                        kind: "chrome",
                        id: "menu",
                      });
                    }}
                    style={{
                      color: content.layout.chrome.menu.textColor,
                      fontSize:
                        content.layout.chrome.menu.fontSize * editorScale,
                      gap: content.layout.chrome.menu.gap * editorScale,
                    }}
                  >
                    <span>Проекты</span>
                    <span>Обо мне</span>
                    <span>Контакты</span>
                    <span>RU / EN</span>
                  </button>
                )}
              </section>
            )}
            {content.layout.order.map((blockId) => {
              const block = content.layout.blocks[blockId];
              if (!block.visible) return null;
              if (blockId === "hero") {
                return (
                  <section
                    className="visual-block visual-block--hero"
                    key={blockId}
                    onClick={(event) => {
                      if (event.target === event.currentTarget) {
                        setSelected({ block: "hero", kind: null, id: null });
                      }
                    }}
                    style={{ height: hero.height * editorScale, background: hero.background }}
                  >
                    <span className="visual-block-label">Первый экран</span>
                    <div className="visual-collage">
                      {content.projects.slice(0, 5).map((project, index) => {
                        const image = {
                          visible: true,
                          dx: 0,
                          dy: 0,
                          scale: 100,
                          ...defaultImageFrame,
                          ...(hero.images[project.id] || {}),
                        };
                        if (!image.visible) return null;
                        const base = heroBases[index];
                        return (
                          <button
                            className={
                              selected?.kind === "image" &&
                              selected?.id === project.id
                                ? "visual-element visual-image is-selected"
                                : "visual-element visual-image"
                            }
                            key={project.id}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelected({
                                block: "hero",
                                kind: "image",
                                id: project.id,
                              });
                            }}
                            onPointerDown={(event) =>
                              startDrag(event, {
                                block: "hero",
                                kind: "image",
                                id: project.id,
                              })
                            }
                            onPointerMove={dragElement}
                            onPointerUp={stopDrag}
                            style={{
                              left: `${base.left}%`,
                              top: `${base.top}%`,
                              width: `${base.width}%`,
                              aspectRatio: image.aspectRatio,
                              borderRadius: `${image.radius}px`,
                              height: image.aspectRatio === "auto" ? undefined : "auto",
                              overflow: "hidden",
                              transform: `translate(${image.dx * editorScale}px, ${image.dy * editorScale}px) rotate(${base.rotate}deg) scale(${image.scale / 100})`,
                            }}
                          >
                            <img
                              src={project.image}
                              alt=""
                              style={{
                                objectFit: image.fit,
                                objectPosition: `${image.positionX}% ${image.positionY}%`,
                              }}
                            />
                            <span>{project.title}</span>
                          </button>
                        );
                      })}
                    </div>
                    {renderCustomElements("hero", hero)}
                  </section>
                );
              }
              if (blockId === "manifesto") {
                return (
                  <section
                    className="visual-block visual-block--manifesto"
                    key={blockId}
                    onClick={(event) => {
                      if (event.target === event.currentTarget) {
                        setSelected({
                          block: "manifesto",
                          kind: null,
                          id: null,
                        });
                      }
                    }}
                    style={{ height: manifesto.height * editorScale, background: manifesto.background }}
                  >
                    <span className="visual-block-label">Розовый текст</span>
                    {manifesto.text.visible && (
                      <button
                        className={
                          selected?.block === "manifesto" &&
                          selected?.kind === "text"
                            ? "visual-element visual-manifesto-text is-selected"
                            : "visual-element visual-manifesto-text"
                        }
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelected({
                            block: "manifesto",
                            kind: "text",
                            id: null,
                          });
                        }}
                        onPointerDown={(event) =>
                          startDrag(event, {
                            block: "manifesto",
                            kind: "text",
                            id: null,
                          })
                        }
                        onPointerMove={dragElement}
                        onPointerUp={stopDrag}
                        style={{
                          color: manifesto.text.color,
                          fontSize: manifesto.text.fontSize * editorScale,
                          transform: `translate(${manifesto.text.dx * editorScale}px, ${manifesto.text.dy * editorScale}px)`,
                        }}
                      >
                        {content.intro}
                      </button>
                    )}
                    {renderCustomElements("manifesto", manifesto)}
                  </section>
                );
              }
              if (blockId === "projects") return (
                <section
                  className="visual-block visual-block--projects"
                  key={blockId}
                  onClick={(event) => {
                    if (event.target === event.currentTarget) {
                      setSelected({
                        block: "projects",
                        kind: null,
                        id: null,
                      });
                    }
                  }}
                  style={{ minHeight: projects.minHeight * editorScale, background: projects.background }}
                >
                  <span className="visual-block-label">Избранные проекты</span>
                  {projects.heading.visible && (
                    <button
                      className={
                        selected?.block === "projects" &&
                        selected?.kind === "heading"
                          ? "visual-element visual-projects-heading is-selected"
                          : "visual-element visual-projects-heading"
                      }
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelected({
                          block: "projects",
                          kind: "heading",
                          id: null,
                        });
                      }}
                      onPointerDown={(event) =>
                        startDrag(event, {
                          block: "projects",
                          kind: "heading",
                          id: null,
                        })
                      }
                      onPointerMove={dragElement}
                      onPointerUp={stopDrag}
                      style={{
                        color: projects.heading.color,
                        fontSize: projects.heading.fontSize * editorScale,
                        transform: `translate(${projects.heading.dx * editorScale}px, ${projects.heading.dy * editorScale}px)`,
                      }}
                    >
                      Избранные проекты
                    </button>
                  )}
                  <div className="visual-project-thumbs">
                    {content.projects
                      .filter((project) => project.featured)
                      .slice(0, 3)
                      .map((project) => (
                        <img src={project.image} alt="" key={project.id} />
                      ))}
                  </div>
                  {renderCustomElements("projects", projects)}
                </section>
              );
              return (
                <section
                  className="visual-block visual-block--custom"
                  key={blockId}
                  onClick={(event) => {
                    if (event.target === event.currentTarget) {
                      setSelected({ block: blockId, kind: null, id: null });
                    }
                  }}
                  style={{
                    background: block.background,
                    height: block.height * editorScale,
                  }}
                >
                  <span className="visual-block-label">{block.name}</span>
                  {renderCustomElements(blockId, block)}
                </section>
              );
            })}
            {content.layout.chrome.footer.visible && (
              <section
                className={
                  selected?.kind === "chrome" && selected.id === "footer"
                    ? "visual-site-footer is-selected"
                    : "visual-site-footer"
                }
                onClick={() =>
                  setSelected({ block: null, kind: "chrome", id: "footer" })
                }
                style={{
                  background: content.layout.chrome.footer.background,
                  color: content.layout.chrome.footer.textColor,
                  minHeight: content.layout.chrome.footer.height * editorScale,
                }}
              >
                <div>
                  <span>{content.name}</span>
                  <span>{content.location}</span>
                </div>
                <div>
                  <span>{content.email}</span>
                  <span>Редактировать сайт</span>
                </div>
                <strong>На связи</strong>
              </section>
            )}
          </div>
        </div>

        <aside className="visual-inspector">
          <p className="visual-inspector-kicker">
            {selected?.kind === "settings"
              ? "Настройки"
              : selected?.kind === "chrome"
              ? "Область сайта"
              : selected?.kind
                ? "Элемент"
                : "Блок"}
          </p>
          <h3>
            {selected?.kind === "settings"
              ? "Сетка и холст"
              : selected?.kind === "chrome"
              ? selected.id === "header"
                ? "Хедер"
                : selected.id === "menu"
                  ? "Меню"
                  : "Футер"
              : selected?.kind === "custom"
                ? selectedElement?.type === "text"
                  ? "Добавленный текст"
                  : "Добавленная картинка"
              : selected?.kind === "title"
              ? "Заголовок"
              : selected?.kind === "text"
                ? "Основной текст"
                : selected?.kind === "heading"
                  ? "Заголовок раздела"
                  : selected?.kind === "image"
                    ? content.projects.find(
                        (project) => project.id === selected.id,
                      )?.title
                    : blockNames[selected?.block] ||
                      selectedBlock?.name ||
                      "Первый экран"}
          </h3>

          {selected?.kind === "settings" && (
            <>
              <p className="visual-settings-title">Сетка сайта</p>
              <EditorField
                label="Колонки проектов"
                value={String(gridSettings.columns)}
                onChange={(value) =>
                  updateGrid({ columns: Math.max(1, Math.min(4, Number(value) || 1)) })
                }
              />
              <EditorField
                label="Расстояние между колонками"
                value={String(gridSettings.gap)}
                onChange={(value) => updateGrid({ gap: Math.max(0, Number(value) || 0) })}
              />
              <EditorField
                label="Боковые отступы"
                value={String(gridSettings.pagePadding)}
                onChange={(value) => updateGrid({ pagePadding: Math.max(12, Number(value) || 12) })}
              />
              <EditorField
                label="Максимальная ширина"
                value={String(gridSettings.maxWidth)}
                onChange={(value) => updateGrid({ maxWidth: Math.max(960, Number(value) || 960) })}
              />
              <p className="visual-settings-title">Привязка на холсте</p>
              <label className="visual-switch-control">
                <input
                  checked={editorSettings.gridVisible}
                  type="checkbox"
                  onChange={(event) => updateEditor({ gridVisible: event.target.checked })}
                />
                Показывать сетку
              </label>
              <EditorField
                label="Шаг сетки"
                value={String(editorSettings.gridSize)}
                onChange={(value) =>
                  updateEditor({ gridSize: Math.max(2, Number(value) || 8) })
                }
              />
              <label className="visual-switch-control">
                <input
                  checked={editorSettings.snap}
                  type="checkbox"
                  onChange={(event) => updateEditor({ snap: event.target.checked })}
                />
                Привязывать элементы к сетке
              </label>
              <label className="visual-switch-control">
                <input
                  checked={editorSettings.guidesVisible}
                  type="checkbox"
                  onChange={(event) => updateEditor({ guidesVisible: event.target.checked })}
                />
                Показывать направляющие
              </label>
              <button
                type="button"
                onClick={() =>
                  updateLayout((layout) => ({
                    ...layout,
                    guides: { vertical: [], horizontal: [] },
                  }), "Направляющие очищены")
                }
              >
                Очистить направляющие
              </button>
            </>
          )}

          {selected?.kind === "chrome" && selectedElement && (
            <>
              {selected.id !== "menu" && (
                <label className="visual-control">
                  <span>
                    Высота
                    <strong>{selectedElement.height}px</strong>
                  </span>
                  <input
                    min="40"
                    max="700"
                    type="range"
                    value={selectedElement.height}
                    onInput={(event) =>
                      updateElement(selected, {
                        height: Number(event.target.value),
                      })
                    }
                  />
                </label>
              )}
              {selected.id === "menu" && (
                <>
                  <EditorField
                    label="Размер текста меню"
                    value={String(selectedElement.fontSize)}
                    onChange={(value) =>
                      updateElement(selected, { fontSize: Number(value) || 13 })
                    }
                  />
                  <EditorField
                    label="Расстояние между пунктами"
                    value={String(selectedElement.gap)}
                    onChange={(value) =>
                      updateElement(selected, { gap: Number(value) || 0 })
                    }
                  />
                </>
              )}
              {selected.id !== "menu" && (
                <label className="visual-color-control">
                  Фон
                  <input
                    type="color"
                    value={selectedElement.background}
                    onChange={(event) =>
                      updateElement(selected, {
                        background: event.target.value,
                      })
                    }
                  />
                </label>
              )}
              <label className="visual-color-control">
                Цвет текста
                <input
                  type="color"
                  value={selectedElement.textColor}
                  onInput={(event) =>
                    updateElement(selected, { textColor: event.target.value })
                  }
                />
              </label>
              <button
                className="visual-danger"
                type="button"
                onClick={() =>
                  updateElement(selected, { visible: !selectedElement.visible })
                }
              >
                {selectedElement.visible ? "Скрыть" : "Показать"}
              </button>
            </>
          )}

          {!selected?.kind && selectedBlock && (
            <>
              {!blockNames[selected.block] && (
                <>
                  <EditorField
                    label="Название блока"
                    value={selectedBlock.name}
                    onChange={(value) =>
                      updateBlock(selected.block, { name: value })
                    }
                  />
                </>
              )}
              <label className="visual-color-control">
                Фон блока
                <input
                  type="color"
                  value={selectedBlock.background || "#f5f5f2"}
                  onInput={(event) =>
                    updateBlock(selected.block, { background: event.target.value })
                  }
                />
              </label>
              <label className="visual-control">
                <span>
                  Высота блока
                  <strong>
                    {selected.block === "projects"
                      ? selectedBlock.minHeight
                      : selectedBlock.height}
                    px
                  </strong>
                </span>
                <input
                  min="260"
                  max="1200"
                  step="10"
                  type="range"
                  value={
                    selected.block === "projects"
                      ? selectedBlock.minHeight
                      : selectedBlock.height
                  }
                  onChange={(event) =>
                    updateBlock(selected.block, {
                      [selected.block === "projects"
                        ? "minHeight"
                        : "height"]: Number(event.target.value),
                    })
                  }
                />
              </label>
              <button
                className="visual-danger"
                type="button"
                onClick={() => {
                  if (!blockNames[selected.block]) {
                    updateLayout((layout) => {
                      const blocks = { ...layout.blocks };
                      delete blocks[selected.block];
                      return {
                        ...layout,
                        blocks,
                        order: layout.order.filter(
                          (blockId) => blockId !== selected.block,
                        ),
                      };
                    }, "Блок удалён");
                    setSelected({ block: "hero", kind: null, id: null });
                  } else {
                    updateBlock(selected.block, { visible: false });
                  }
                }}
              >
                Удалить блок
              </button>
            </>
          )}

          {selected?.kind &&
            selected.kind !== "chrome" &&
            selected.kind !== "settings" &&
            selectedElement && (
            <>
              {selected.kind === "custom" && selectedElement.type === "text" && (
                <>
                  <EditorField
                    label="Текст на русском"
                    value={selectedElement.textRu}
                    onChange={(value) =>
                      updateElement(selected, { textRu: value })
                    }
                  />
                  <EditorField
                    label="Текст на английском"
                    value={selectedElement.textEn}
                    onChange={(value) =>
                      updateElement(selected, { textEn: value })
                    }
                  />
                  <EditorField
                    label="Ширина текстового блока"
                    value={String(selectedElement.width || 360)}
                    onChange={(value) =>
                      updateElement(selected, { width: Math.max(80, Number(value) || 80) })
                    }
                  />
                  <EditorField
                    label="Межстрочный интервал"
                    value={String(selectedElement.lineHeight || 1)}
                    onChange={(value) =>
                      updateElement(selected, { lineHeight: Math.max(0.7, Number(value) || 1) })
                    }
                  />
                  <div className="visual-inline-controls">
                    <button
                      className={Number(selectedElement.fontWeight) >= 600 ? "active" : ""}
                      type="button"
                      onClick={() =>
                        updateElement(selected, {
                          fontWeight: Number(selectedElement.fontWeight) >= 600 ? 400 : 700,
                        })
                      }
                    >
                      Жирный
                    </button>
                    {["left", "center", "right"].map((align) => (
                      <button
                        className={(selectedElement.textAlign || "left") === align ? "active" : ""}
                        key={align}
                        type="button"
                        onClick={() => updateElement(selected, { textAlign: align })}
                      >
                        {align === "left" ? "Влево" : align === "center" ? "Центр" : "Вправо"}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {selected.kind === "custom" &&
                selectedElement.type === "image" && (
                  <label className="visual-file-control">
                    Заменить картинку
                    <input
                      accept="image/*"
                      type="file"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setNotice("Загружаем изображение...");
                        try {
                          const src = await onUploadImage(file);
                          updateElement(
                            selected,
                            { src },
                            "Изображение загружено",
                          );
                        } catch (uploadError) {
                          setNotice(uploadError.message);
                        }
                      }}
                    />
                  </label>
                )}
              <label className="visual-control">
                <span>
                  {selected.kind === "image" ||
                  (selected.kind === "custom" &&
                    selectedElement.type === "image")
                    ? "Размер картинки"
                    : "Размер текста"}
                  <strong>
                    {selected.kind === "image"
                      ? `${selectedElement.scale}%`
                      : selected.kind === "custom" &&
                          selectedElement.type === "image"
                        ? `${selectedElement.width}px`
                      : `${selectedElement.fontSize}px`}
                  </strong>
                </span>
                <input
                  min={
                    selected.kind === "image" ||
                    (selected.kind === "custom" &&
                      selectedElement.type === "image")
                      ? "45"
                      : "18"
                  }
                  max={
                    selected.kind === "image"
                      ? "180"
                      : selected.kind === "custom" &&
                          selectedElement.type === "image"
                        ? "900"
                        : "150"
                  }
                  type="range"
                  value={
                    selected.kind === "image"
                      ? selectedElement.scale
                      : selected.kind === "custom" &&
                          selectedElement.type === "image"
                        ? selectedElement.width
                      : selectedElement.fontSize
                  }
                  onChange={(event) =>
                    updateElement(selected, {
                      [selected.kind === "image"
                        ? "scale"
                        : selected.kind === "custom" &&
                            selectedElement.type === "image"
                          ? "width"
                          : "fontSize"]: Number(event.target.value),
                    })
                  }
                />
              </label>
              {(selected.kind === "image" ||
                (selected.kind === "custom" && selectedElement.type === "image")) && (
                <ImageFrameControls
                  value={selectedElement}
                  onChange={(patch) => updateElement(selected, patch)}
                />
              )}
              {selected.kind === "custom" && (
                <>
                  <EditorField
                    label="Поворот, градусов"
                    value={String(selectedElement.rotation || 0)}
                    onChange={(value) =>
                      updateElement(selected, { rotation: Number(value) || 0 })
                    }
                  />
                  <label className="visual-control">
                    <span>
                      Прозрачность
                      <strong>{Math.round((selectedElement.opacity ?? 1) * 100)}%</strong>
                    </span>
                    <input
                      min="10"
                      max="100"
                      type="range"
                      value={(selectedElement.opacity ?? 1) * 100}
                      onChange={(event) =>
                        updateElement(selected, { opacity: Number(event.target.value) / 100 })
                      }
                    />
                  </label>
                </>
              )}
              {selected.kind !== "image" && (
                <label className="visual-color-control">
                  Цвет текста
                  <input
                    type="color"
                    value={selectedElement.color || "#171717"}
                    onInput={(event) =>
                      updateElement(selected, { color: event.target.value })
                    }
                  />
                </label>
              )}
              {selected.kind !== "image" && (
                <EditorField
                  label="Ссылка"
                  value={selectedElement.href || ""}
                  onChange={(value) => updateElement(selected, { href: value })}
                />
              )}
              <div className="visual-position-grid">
                <label>
                  X
                  <input
                    type="number"
                    value={
                      selected.kind === "custom"
                        ? selectedElement.x
                        : selectedElement.dx
                    }
                    onChange={(event) =>
                      updateElement(selected, {
                        [selected.kind === "custom" ? "x" : "dx"]: Number(
                          event.target.value,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Y
                  <input
                    type="number"
                    value={
                      selected.kind === "custom"
                        ? selectedElement.y
                        : selectedElement.dy
                    }
                    onChange={(event) =>
                      updateElement(selected, {
                        [selected.kind === "custom" ? "y" : "dy"]: Number(
                          event.target.value,
                        ),
                      })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateElement(
                    selected,
                    selected.kind === "custom"
                      ? { x: 80, y: 100 }
                      : { dx: 0, dy: 0 },
                  )
                }
              >
                Сбросить позицию
              </button>
              <button
                className="visual-danger"
                type="button"
                onClick={() => {
                  if (selected.kind === "custom") {
                    updateLayout((layout) => ({
                      ...layout,
                      blocks: {
                        ...layout.blocks,
                        [selected.block]: {
                          ...layout.blocks[selected.block],
                          customElements: layout.blocks[
                            selected.block
                          ].customElements.filter(
                            (element) => element.id !== selected.id,
                          ),
                        },
                      },
                    }), "Элемент удалён");
                    setSelected({
                      block: selected.block,
                      kind: null,
                      id: null,
                    });
                  } else {
                    updateElement(selected, { visible: false });
                  }
                }}
              >
                Удалить элемент
              </button>
            </>
          )}

          <div className="visual-restore">
            <p>Удалённые элементы</p>
            {!manifesto.text.visible && (
              <button
                type="button"
                onClick={() =>
                  updateElement(
                    { block: "manifesto", kind: "text", id: null },
                    { visible: true },
                  )
                }
              >
                Вернуть розовый текст
              </button>
            )}
            {!projects.heading.visible && (
              <button
                type="button"
                onClick={() =>
                  updateElement(
                    { block: "projects", kind: "heading", id: null },
                    { visible: true },
                  )
                }
              >
                Вернуть заголовок проектов
              </button>
            )}
            {content.projects.slice(0, 5).map((project) =>
              hero.images[project.id]?.visible === false ? (
                <button
                  type="button"
                  key={project.id}
                  onClick={() =>
                    updateElement(
                      { block: "hero", kind: "image", id: project.id },
                      { visible: true },
                    )
                  }
                >
                  Вернуть «{project.title}»
                </button>
              ) : null,
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function EditorProject({
  project,
  index,
  updateProject,
  onUploadImage,
  onDelete,
  onDragStart,
  onDrop,
}) {
  const [open, setOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const uploadImage = async (file) => {
    if (!file) return;
    setUploadError("");
    try {
      const image = await onUploadImage(file);
      updateProject(project.id, "image", image);
    } catch (error) {
      setUploadError(error.message);
    }
  };
  const uploadGallery = async (files) => {
    if (!files?.length) return;
    setUploadError("");
    try {
      const uploaded = [];
      for (const file of files) uploaded.push(await onUploadImage(file));
      updateProject(project.id, "gallery", [...(project.gallery || []), ...uploaded]);
    } catch (error) {
      setUploadError(error.message);
    }
  };
  const moveGalleryImage = (index, direction) => {
    const nextIndex = index + direction;
    const gallery = [...(project.gallery || [])];
    if (nextIndex < 0 || nextIndex >= gallery.length) return;
    [gallery[index], gallery[nextIndex]] = [gallery[nextIndex], gallery[index]];
    updateProject(project.id, "gallery", gallery);
  };

  return (
    <article
      className="editor-project"
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <button
        className="editor-project-summary"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="drag-label">Тянуть</span>
        <img src={project.image} alt="" />
        <span className="editor-project-name">
          <strong>{project.title}</strong>
          <small>
            {project.category} / {project.year}
          </small>
        </span>
        <span>{open ? "Свернуть" : "Редактировать"}</span>
      </button>
      {open && (
        <div className="editor-project-fields">
          <label className="image-upload">
            <img src={project.image} alt="" />
            <span>Загрузить другое изображение</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void uploadImage(event.target.files?.[0])}
            />
            {uploadError && <span className="form-error">{uploadError}</span>}
          </label>
          <div className="project-frame-settings">
            <div>
              <strong>Фрейм обложки</strong>
              <p>Настройки применяются к карточкам проекта на главной и в архиве.</p>
            </div>
            <ImageFrameControls
              value={project.frame}
              onChange={(frame) => updateProject(project.id, "frame", frame)}
            />
          </div>
          <div className="field-grid">
            <EditorField
              label="Название"
              value={project.title}
              onChange={(value) => updateProject(project.id, "title", value)}
            />
            <EditorField
              label="Название — English"
              value={project.titleEn || project.title}
              onChange={(value) => updateProject(project.id, "titleEn", value)}
            />
            <EditorField
              label="Категория"
              value={project.category}
              onChange={(value) => updateProject(project.id, "category", value)}
            />
            <EditorField
              label="Категория — English"
              value={project.categoryEn || project.category}
              onChange={(value) => updateProject(project.id, "categoryEn", value)}
            />
            <EditorField
              label="Клиент"
              value={project.client || ""}
              onChange={(value) => updateProject(project.id, "client", value)}
            />
            <EditorField
              label="Клиент — English"
              value={project.clientEn || project.client || ""}
              onChange={(value) => updateProject(project.id, "clientEn", value)}
            />
            <EditorField
              label="Год"
              value={project.year}
              onChange={(value) => updateProject(project.id, "year", value)}
            />
            <EditorField
              label="Рукописная подпись"
              value={project.note}
              onChange={(value) => updateProject(project.id, "note", value)}
            />
            <EditorField
              label="Подпись — English"
              value={project.noteEn || project.note}
              onChange={(value) => updateProject(project.id, "noteEn", value)}
            />
          </div>
          <EditorField
            label="Описание"
            value={project.description}
            multiline
            onChange={(value) =>
              updateProject(project.id, "description", value)
            }
          />
          <section className="gallery-editor">
            <div className="gallery-editor-head">
              <div>
                <strong>Галерея проекта</strong>
                <p>Изображения можно переставлять и удалять.</p>
              </div>
              <label>
                Добавить изображения
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => void uploadGallery(event.target.files)}
                />
              </label>
            </div>
            <div className="gallery-editor-grid">
              {(project.gallery || []).map((image, imageIndex) => (
                <figure key={`${image}-${imageIndex}`}>
                  <img src={image} alt="" />
                  <div>
                    <button type="button" disabled={imageIndex === 0} onClick={() => moveGalleryImage(imageIndex, -1)}>←</button>
                    <button type="button" disabled={imageIndex === project.gallery.length - 1} onClick={() => moveGalleryImage(imageIndex, 1)}>→</button>
                    <button type="button" onClick={() => updateProject(project.id, "gallery", project.gallery.filter((_, index) => index !== imageIndex))}>Удалить</button>
                  </div>
                </figure>
              ))}
            </div>
          </section>
          <EditorField
            label="Описание — English"
            value={project.descriptionEn || project.description}
            multiline
            onChange={(value) =>
              updateProject(project.id, "descriptionEn", value)
            }
          />
          <div className="project-options">
            <label>
              <input
                type="checkbox"
                checked={project.featured}
                onChange={(event) =>
                  updateProject(project.id, "featured", event.target.checked)
                }
              />
              Показывать на главной
            </label>
            <button type="button" onClick={onDelete}>
              Удалить проект
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function EditorField({ label, value, onChange, multiline = false }) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows="5"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function ImageFrameControls({ value, onChange }) {
  const frame = getImageFrame(value);
  const update = (patch) => onChange({ ...frame, ...patch });
  const ratios = [
    ["auto", "Исходная"],
    ["1 / 1", "1:1"],
    ["4 / 3", "4:3"],
    ["3 / 4", "3:4"],
    ["16 / 9", "16:9"],
  ];

  return (
    <fieldset className="image-frame-controls">
      <legend>Фрейм изображения</legend>
      <div className="frame-control-group">
        <span>Пропорции</span>
        <div className="frame-segments frame-segments--ratios">
          {ratios.map(([ratio, label]) => (
            <button
              className={frame.aspectRatio === ratio ? "active" : ""}
              key={ratio}
              type="button"
              onClick={() => update({ aspectRatio: ratio })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="frame-control-group">
        <span>Заполнение</span>
        <div className="frame-segments">
          <button
            className={frame.fit === "cover" ? "active" : ""}
            type="button"
            onClick={() => update({ fit: "cover" })}
          >
            Обрезать
          </button>
          <button
            className={frame.fit === "contain" ? "active" : ""}
            type="button"
            onClick={() => update({ fit: "contain" })}
          >
            Вписать
          </button>
        </div>
      </div>
      <label className="visual-control">
        <span>Фокус по горизонтали <strong>{frame.positionX}%</strong></span>
        <input min="0" max="100" type="range" value={frame.positionX} onInput={(event) => update({ positionX: Number(event.target.value) })} />
      </label>
      <label className="visual-control">
        <span>Фокус по вертикали <strong>{frame.positionY}%</strong></span>
        <input min="0" max="100" type="range" value={frame.positionY} onInput={(event) => update({ positionY: Number(event.target.value) })} />
      </label>
      <label className="visual-control">
        <span>Скругление <strong>{frame.radius}px</strong></span>
        <input min="0" max="120" type="range" value={frame.radius} onInput={(event) => update({ radius: Number(event.target.value) })} />
      </label>
    </fieldset>
  );
}
