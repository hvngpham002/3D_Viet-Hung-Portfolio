/* eslint-disable @typescript-eslint/naming-convention */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Existing translations
      about: "About",
      projects: "Projects",
      contact: "Contact",
      
      // Loader translations
      "Welcome to My Journey": "Welcome to My Journey",
      "Explore an interactive timeline of my professional development through an immersive 3D experience.": 
        "Explore an interactive timeline of my professional development through an immersive 3D experience.",
      "Quick Guide": "Quick Guide",
      "Character Movement": "Character Movement",
      "Scene Rotation": "Scene Rotation",
      "Animations": "Animations",
      "Zoom": "Zoom",
      "Left/Right Arrows or Left Mouse Drag": "Left/Right Arrows or Left Mouse Drag",
      "Middle Mouse Button + Drag": "Middle Mouse Button + Drag",
      "Press Q, W, E, or R": "Press Q, W, E, or R",
      "Mouse Wheel": "Mouse Wheel",
      "Click to Start": "Click to Start",
      "Loading assets...": "Loading assets...",
      "Loaded": "Loaded",
      "of": "of",
      "assets": "assets",
      "Click to start experience": "Click to start experience",
      "Loading models": "Loading models"
    }
  },
  vi: {
    translation: {
      // Existing translations
      about: "Giới thiệu",
      projects: "Dự án",
      contact: "Liên hệ",

      // Loader translations
      "Welcome to My Journey": "Chào Mừng Đến Với Hành Trình Của Tôi",
      "Explore an interactive timeline of my professional development through an immersive 3D experience.": 
        "Khám phá lộ trình phát triển nghề nghiệp của tôi thông qua trải nghiệm 3D tương tác.",
      "Quick Guide": "Hướng Dẫn Nhanh",
      "Character Movement": "Di Chuyển",
      "Scene Rotation": "Xoay Cảnh",
      "Animations": "Hoạt Ảnh",
      "Zoom": "Thu Phóng",
      "Left/Right Arrows or Left Mouse Drag": "Phím Mũi Tên Trái/Phải hoặc Kéo Chuột Trái",
      "Middle Mouse Button + Drag": "Nút Giữa Chuột + Kéo",
      "Press Q, W, E, or R": "Nhấn Q, W, E, hoặc R",
      "Mouse Wheel": "Con Lăn Chuột",
      "Click to Start": "Bắt Đầu",
      "Loading assets...": "Đang tải...",
      "Loaded": "Đã tải",
      "of": "trong số",
      "assets": "tài nguyên",
      "Click to start experience": "Nhấn để bắt đầu trải nghiệm",
      "Loading models": "Đang tải mô hình"
    }
  },
  zh: {
    translation: {
      // Existing translations
      about: "关于",
      projects: "项目",
      contact: "联系",

      // Loader translations
      "Welcome to My Journey": "欢迎来到我的旅程",
      "Explore an interactive timeline of my professional development through an immersive 3D experience.": 
        "通过沉浸式3D体验探索我的职业发展时间线。",
      "Quick Guide": "快速指南",
      "Character Movement": "角色移动",
      "Scene Rotation": "场景旋转",
      "Animations": "动画",
      "Zoom": "缩放",
      "Left/Right Arrows or Left Mouse Drag": "左/右方向键或左键拖动",
      "Middle Mouse Button + Drag": "鼠标中键 + 拖动",
      "Press Q, W, E, or R": "按 Q, W, E, 或 R",
      "Mouse Wheel": "鼠标滚轮",
      "Click to Start": "点击开始",
      "Loading assets...": "加载中...",
      "Loaded": "已加载",
      "of": "共",
      "assets": "资源",
      "Click to start experience": "点击开始体验",
      "Loading models": "加载模型中"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en', // Default or saved language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'], // Check localStorage first
  },
});

i18n.on('languageChanged', (lang) => {
  localStorage.setItem('language', lang);
});

export default i18n;