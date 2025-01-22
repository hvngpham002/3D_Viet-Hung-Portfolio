/* eslint-disable @typescript-eslint/naming-convention */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      about_bio: "I'm a dedicated and detail-focused software engineer with 5 years of hands-on experience in full-stack web development, systems software engineering, and technical internships. With a strong foundation in languages like Java, Python, C, and C++, I love tackling challenges both in web-development and at the system level. From creating sleek user interfaces to optimizing back-end performance, I'm passionate about building software solutions that are both efficient and user-friendly.",
    }
  },
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
        "Let me know how I can be of service!": "Hãy để lại tin nhắn của bạn!",
        "Send Message": "Gửi Tin Nhắn",

        // About
        "Hello, I'm": "Xin chào, tôi là",
        "Hung": "Hưng",
        "Full Stack Developer specializing in 3D web experiences": "Kỹ sư phát triển phần mềm chuyên nghiệp, chuyên về trải nghiệm web 3D",
        "Skills": "Kỹ năng",
        "Experiences": "Kinh nghiệm",
        "about_bio": "Tôi là một kỹ sư phần mềm tận tâm và chú trọng đến chi tiết với 5 năm kinh nghiệm thực tế trong phát triển web full-stack, kỹ thuật phần mềm hệ thống và các đợt thực tập kỹ thuật. Với nền tảng vững chắc về các ngôn ngữ như Java, Python, C và C++, tôi đam mê giải quyết các thách thức trong cả phát triển web và ở cấp độ hệ thống. Từ việc tạo ra giao diện người dùng thanh lịch đến tối ưu hóa hiệu suất back-end, tôi luôn nhiệt huyết trong việc xây dựng các giải pháp phần mềm vừa hiệu quả vừa thân thiện với người dùng.",

        "Teaching Assistant": "Trợ giảng viên",
        "Technical Staff": "Nhân viên kỹ thuật",
        "Systems Software Engineer": "Kỹ sư phần mềm hệ thống",
        "Market Analyst": "Phân tích thị trường",
        "Web Developer": "Kỹ sư phát triển web",
        "NVIDIA": "NVIDIA",
        "Mingju Consulting & Management": "Công ty tư vấn và quản lý Mingju",
        "Worcester Polytechnic Institute": "Đại học bách khoa Worcester",
        "New England Clean Energy": "Công ty năng lượng sạch New England",
        "Minh Hung Investment & Development JSC": "Công ty cổ phần ĐTPT Minh Hưng",
        "Contributed to NVIDIA Drive OS, NVIDIA’s autonomous vehicles operating system solution, display architecture by integrating host-side tool support for unreleased Tegra system-on-chip (SoC).": "Đóng góp cho NVIDIA Drive OS, hệ thống phần mềm tự động hóa xe hơi của NVIDIA, kiến trúc hiển thị bằng cách tích hợp hỗ trợ công cụ phía máy chủ cho chip Tegra hệ thống không được phát hành (SoC).",
        "Collaborated on updating build profile variants to optimize display performance and expand error reporting.": "Hợp tác để cập nhật biến phiên dựng để tối ưu hiệu suất hiển thị và mở rộng báo cáo lỗi.",
        "Holding regular office hours and grading for programming assignments and exams in courses on algorithms, systems & object-oriented, software engineering courses in Java, C/C++, and the Python Flask framework.": "Tổ chức các buổi học chuyên cần và chấm điểm bài tập và bài kiểm tra trong các khóa học về thuật toán, hệ thống và lập trình hướng đối tượng, các khóa học về kỹ thuật phần mềm trong Java, C/C++ và framework Python Flask.",
        "Provide mentorship for teams of four software engineers to build feature-complete applications.": "Cung cấp hướng dẫn cho các nhóm bốn kỹ sư phần mềm để xây dựng các ứng dụng hoàn chỉnh.",
        "Maintain social media accounts and website to maximize traffic by complying with best SEO practices.": "Bảo trì các tài khoản trang mạng xã hội và trang web để tối đa lưu lượng bằng cách tuân thủ các thực hành SEO tốt nhất.",
        "Aid the technical team with leading-edge AI mapping technology such as Aurora Solar and Google Project Sunroof.": "Hỗ trợ đội kỹ thuật với công nghệ AI dẫn đầu như Aurora Solar và Google Project Sunroof.",
        "Developed an enterprise-grade web-app using CMS-based Laravel framework, and front-end development using Bootstrap.": "Phát triển ứng dụng web doanh nghiệp cấp độ công ty sử dụng framework Laravel cơ sở dữ liệu và phát triển giao diện người dùng sử dụng Bootstrap.",
        "Collaborate with the marketing team to implement intuitive design & centralized content management.": "Hợp tác với đội marketing để triển khai thiết kế trực quan và quản lý nội dung tập trung.",
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
        "2024年，我在 NVIDIA 完成了毕业前的最后一次实习。",


      // Contact
      "Want To Work With Me": "想和我一起工作",
      "Email": "电子邮件",
      "Name": "名字",
      "Message": "留言",
      "Let me know how I can be of service!": "请告诉我如何提供帮助!",
      "Send Message": "发送留言",

      // About
      "about_bio": "我是一个专注于细节的软件工程师，拥有5年的全栈web开发、系统软件工程和实习经验。我拥有Java、Python、C和C++等语言的坚实基础，热爱在web开发和系统层面解决挑战。从创建优雅的用户界面到优化后端性能，我致力于构建既高效又用户友好的软件解决方案。",
      "Hello, I'm": "您好，我是",
      "Hung": "范越兴",
      "Skills": "技能",
      "Experiences": "经验",
      "Teaching Assistant": "助教",
      "Technical Staff": "技术员",
      "Systems Software Engineer": "系统软件工程师",
      "Market Analyst": "市场分析师",
      "Web Developer": "Web开发",
      "Worcester Polytechnic Institute": "伍斯特理工学院",
      "New England Clean Energy": "新英格兰清洁能源",
      "Mingju Consulting & Management": "名驹猎头公司",
      "Minh Hung Investment & Development JSC": "明兴投资与发展有限公司",
      "Contributed to NVIDIA Drive OS, NVIDIA’s autonomous vehicles operating system solution, display architecture by integrating host-side tool support for unreleased Tegra system-on-chip (SoC).": "为NVIDIA Drive OS，NVIDIA的自动驾驶汽车操作系统解决方案，显示架构贡献了主机端工具支持，用于未发布的Tegra系统级芯片（SoC）。",
      "Collaborated on updating build profile variants to optimize display performance and expand error reporting.": "与团队合作，更新构建配置文件变体，以优化显示性能并扩展错误报告。",
      "Collaborate with a mixed-team of American and Chinese co-workers to interview industry leaders.": "与美国和中国同事合作，采访行业领导者。",
      "Conduct a market analysis on high-profile recruiting in high-technology industries.": "对高科技行业的顶尖招聘进行市场分析。",
      "Holding regular office hours and grading for programming assignments and exams in courses on algorithms, systems & object-oriented, software engineering courses in Java, C/C++, and the Python Flask framework.": "定期参加办公室小时和评分编程作业和考试，在算法、系统与面向对象、软件工程课程中，使用Java、C/C++和Python Flask框架。",
      "Provide mentorship for teams of four software engineers to build feature-complete applications.": "为四人软件工程师团队提供指导，构建功能完整的应用程序。",
      "Maintain social media accounts and website to maximize traffic by complying with best SEO practices.": "维护社交媒体账户和网站，通过遵守最佳SEO实践来最大化流量。",
      "Aid the technical team with leading-edge AI mapping technology such as Aurora Solar and Google Project Sunroof.": "与技术团队合作，使用领先的AI地图技术，如Aurora Solar和Google Project Sunroof。",
      "Developed an enterprise-grade web-app using CMS-based Laravel framework, and front-end development using Bootstrap.": "使用基于CMS的Laravel框架开发企业级Web应用程序，并使用Bootstrap进行前端开发。",
      "Collaborate with the marketing team to implement intuitive design & centralized content management.": "与营销团队合作，实现直观的设计和集中式内容管理。",
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