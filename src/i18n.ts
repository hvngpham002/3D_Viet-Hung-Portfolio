/* eslint-disable @typescript-eslint/naming-convention */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {

      // Navbar translations
      About: "Giới Thiệu",
      Projects: "Dự Án",
      Contact: "Liên Hệ",

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
      "Loading models": "Đang tải mô hình",

      // HomeInfo translations
      "View Project": "Xem Dự Án",
      "In 2020, I first embarked on the path as a self-taught engineer, developing an e-commerce application for a local firm.": 
        "Năm 2020, tôi bắt đầu con đường kỹ sư tự học, phát triển ứng dụng thương mại điện tử cho một công ty địa phương.",
      "In 2021, I ventured to the U.S to further pursue software engineering in Massachusetts.": 
        "Năm 2021, tôi đến Mỹ để tiếp tục học ngành phát triển phần mềm tại Massachusetts.",
      "In 2023, I journeyed to the tech hubs of Hangzhou, China to investigate high-technology recruitment and development.": 
        "Năm 2023, tôi đến trung tâm công nghệ Hàng Châu, Trung Quốc để nghiên cứu về tuyển dụng và phát triển công nghệ cao.",
      "In 2024, I conquered my final quest before graduation at NVIDIA.": 
        "Năm 2024, tôi hoàn thành thực tập cuối cùng tại NVIDIA trước khi tốt nghiệp.",

        // Contact
        "Want To Work With Me": "Muốn làm việc với tôi",
        "Email": "Email",
        "Name": "Họ và Tên",
        "Message": "Tin Nhắn",
        "Let me know how I can be of service!": "Hãy để lại tin nhắn của bạn!"
    }
  },
  zh: {
    translation: {

      // Navbar translations
      About: "关于",
      Projects: "项目",
      Contact: "联系",

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
      "Loading models": "加载模型中",

      // HomeInfo translations
      "View Project": "查看项目",
      "In 2020, I first embarked on the path as a self-taught engineer, developing an e-commerce application for a local firm.": 
        "2020年，我开始了自学工程师的道路，为一家本地公司开发电子商务应用。",
      "In 2021, I ventured to the U.S to further pursue software engineering in Massachusetts.": 
        "2021年，我来到美国马萨诸塞州继续深造软件工程。",
      "In 2023, I journeyed to the tech hubs of Hangzhou, China to investigate high-technology recruitment and development.": 
        "2023年，我前往中国杭州科技中心研究高科技人才招聘与发展。",
      "In 2024, I conquered my final quest before graduation at NVIDIA.": 
        "2024年，我在英伟达完成了毕业前的最后一次实习。",


      // Contact
      "Want To Work With Me": "想和我一起工作",
      "Email": "电子邮件",
      "Name": "名字",
      "Message": "留言",
      "Let me know how I can be of service!": "请告诉我如何提供帮助!"
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