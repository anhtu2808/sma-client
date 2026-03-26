import React, { useState } from 'react';
import Header from './Header';
import Summary from './Summary';
import Skills from './Skills';
import Education from './Education';
import WorkExperience from './WorkExperience';
import Projects from './Projects';

const initialData = {
  header: {
    avatar: '',
    name: 'ĐẶNG MAI ANH TÚ',
    title: 'Fullstack Software Engineer',
    address: 'Thu Duc City, Ho Chi Minh City',
    phone: '+84 389 275 513',
    email: 'dangmaianhtu@gmail.com',
    website: 'www.anhtudev.com',
    github: 'www.github.com/anhtu2808',
  },
  summary: {
    title: 'SUMMARY',
    content: 'Full-Stack Software Engineer with hands-on experience in developing scalable web applications, backend APIs, and cloud deployments. Experienced in freelance projects, including building and deploying multi-tenant SaaS applications. Skilled in Java, React, AWS (willing to learn and adapt to new technologies such as GCP), CI/CD with strong problem-solving and teamwork abilities.'
  },
  skills: {
    title: 'SKILLS',
    items: [
      { category: 'Programming Languages', skills: 'Java, JavaScript, Python.' },
      { category: 'Backend Development', skills: 'Spring Boot, Spring Security, JPA/Hibernate, Fast API, RESTful API, OOP, Microservices architecture' },
      { category: 'Frontend Development', skills: 'HTML5, CSS, Bootstrap, ReactJS, Ant Design, Responsive Design.' },
      { category: 'DevOps', skills: 'CI/CD (GitHub Actions), Docker, Linux server management, AWS (ECS, Lambda, S3, SQS, SES, IAM), Nginx' },
      { category: 'Databases', skills: 'MySQL, Microsoft SQL Server, Database Design.' },
      { category: 'Software Development', skills: 'SDLC (Software Development Lifecycle), Agile/Scrum Methodologies.' },
      { category: 'Tools & Technologies', skills: 'Git, Maven, Figma, Postman, Jira, AI Integration' },
      { category: 'Soft Skills', skills: 'Project management, communication, quick learning, English (~IELTS 6.0) and Leadership, requirements gathering.' }
    ]
  },
  education: {
    title: 'EDUCATION',
    items: [
      {
        institution: 'FPT University (HCM CAMPUS)',
        duration: 'Aug 2022 - Present',
        major: 'Software Engineering',
        gpa: '3.21'
      }
    ]
  },
  workExperience: {
    title: 'WORK EXPERIENCE',
    items: [
      {
        company: 'Maytrix',
        role: 'Junior Full Stack Developer (Onsite)',
        duration: 'Aug 2025 - Present',
        description: 'Key member of a startup EdTech platform that provides online exam practice for middle school students. Developed and maintained full-stack features for the web application, collaborating closely with BA, PO and UI/UX Designers to translate product requirements into technical solutions. Contributed to the successful launch of the platform, which serves 3,000+ active users, and participated in improving system functionality and user experience based on product needs and user feedback.',
        bullets: [
          { label: 'Technology', value: 'ReactJS, Spring Boot, Java, MySQL, Docker, AWS (Route53, EC2, S3, SES), Redux Toolkit', isLink: false },
          { label: 'Product Link', value: '<u>https://vtest.edu.vn/app/luyenthitrandainghia</u>', isLink: true }
        ]
      },
      {
        company: 'FPT Software',
        role: 'Backend Developer Internship (Onsite)',
        duration: 'Dec 2024 - Jul 2025',
        description: 'Developed and maintained backend API services for a $10 million automotive startup in the Japanese market. Gained hands-on experience in deploying and troubleshooting applications on AWS, utilizing services such as Lambda, EC2, ECS, RDS, S3 and CloudWatch',
        bullets: [
          { label: 'Technology', value: 'Python, Fast API, AWS (EC2, ECS, Lambda, RDS, IAM), Elasticsearch, Microservices, Docker', isLink: false },
          { label: 'Skills and Competencies Gained', value: 'Practical experience in the full development workflow, covering requirement analysis, task estimation and reporting, Git flow and code review, CI/CD pipelines, daily stand-ups, deployment, monitoring, and continuous improvement within an Agile/Scrum environment.', isLink: false }
        ]
      },
      {
        company: 'SAT Chasedream',
        role: 'Full-Stack Developer (Freelance)',
        duration: 'Jan 2024 - Present',
        description: 'As a Full-Stack Developer for <i>SAT Chasedream</i>, I designed and developed a multi-tenant LMS platform specialized for Digital SAT preparation. Built a responsive and realistic test-taking interface, and implemented backend APIs to manage question banks, test assignments, and student performance tracking. Integrate LLM to develop explanation feature. Streamlined deployment with GitHub Actions (CI/CD), ensuring a user-friendly, scalable, reliability system optimized for both mobile and desktop currently serving over 400 active users.',
        bullets: [
          { label: 'Technology', value: 'ReactJS, Redux Toolkit, Spring Boot, AWS(SES, SQS, S3), Docker, MySQL, CI/CD GitHub Action', isLink: false },
          { label: 'Skills and Competencies Gained', value: 'Full-Stack development, Responsive Design, RESTful APIs, CI/CD with GitHub Actions, database design, collaboration, adaptability, working under high pressure.', isLink: false },
          { label: 'Video Demo', value: '<ul class="list-[circle] pl-5 mt-1 text-[13px]"><li><u>https://youtu.be/XAtOByOhjAg?si=q6_6PBLqrm6UxjeO</u></li><li><u>https://youtube.com/playlist?list=PLlolFUWzABBkLRjhKdqdesWla9dsAAFuH&si=g9XMjMna_wVFcel3</u></li></ul>', isLink: false },
          { label: 'Website Link', value: '<u>https://sat.chasedream.edu.vn</u> , <u>https://sat.figogroup.vn</u>', isLink: false }
        ]
      }
    ]
  },
  projects: {
    title: 'PROJECT',
    items: [
      {
        name: 'Metro Ticket System',
        duration: 'May 2025 - June 2025',
        description: 'Developed a metro ticketing system that enables users in Ho Chi Minh City to seamlessly purchase and manage MRT tickets through mobile application.',
        bullets: [
          { label: 'Position', value: 'Full-Stack Developer - Team Leader', isLink: false },
          { label: 'Team Size', value: '5', isLink: false },
          { label: 'Technology', value: '<ul class="list-[circle] pl-5 mt-1 text-[13px]"><li><b>Frontend:</b> ReactJS, React Native, Bootstrap, Ant Design, Redux Toolkit, Redux Thunk, Axios (Interceptor)</li><li><b>Backend:</b> Spring Boot,RESTful API, Microservices, MySQL, Kafka</li></ul>', isLink: false },
          { label: 'Role & Responsibility', value: '<ul class="list-[circle] pl-5 mt-1 text-[13px]"><li>Led a team of 5 members, coordinated team tasks, conducted code reviews.</li><li>Designed the system architecture and implemented CI/CD pipelines .</li><li>Implemented the frontend admin portal for managing tickets, price, routes, stations, and users.</li><li>Developed backend APIs for authentication, ticketing, reporting, and pricing (via API Gateway).</li></ul>', isLink: false },
          { label: 'GitHub', value: '<ul class="list-[circle] pl-5 mt-1 text-[13px]"><li><u>https://github.com/anhtu2808/Metro-Backend</u></li><li><u>https://github.com/anhtu2808/Metro-Admin</u></li><li><u>https://github.com/anhtu2808/Metro-Mobile</u></li></ul>', isLink: false },
          { label: 'Video Demo', value: '<u>https://www.youtube.com/playlist?list=PLlolFUWzABBn56QjcVsYl5H4e6DBpEp0h</u>', isLink: false }
        ]
      }
    ]
  }
};

const CVTemplate = () => {
  const [data, setData] = useState(initialData);

  const updateSection = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateHeader = (field, value) => updateSection('header', field, value);

  return (
    <div className="bg-gray-200 min-h-screen py-10 flex justify-center print:bg-white print:py-0">
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl px-[50px] py-[40px] font-sans text-gray-900 box-border print:shadow-none print:m-0 print:p-[20px] print:w-full">
        <Header 
          data={data.header} 
          onChange={updateHeader}
          onImageChange={(url) => updateHeader('avatar', url)} 
        />
        <Summary 
          data={data.summary} 
          onChange={(field, value) => updateSection('summary', field, value)} 
        />
        <Skills 
          data={data.skills} 
          onChange={(field, value) => updateSection('skills', field, value)} 
        />
        <Education 
          data={data.education} 
          onChange={(field, value) => updateSection('education', field, value)} 
        />
        <WorkExperience 
          data={data.workExperience} 
          onChange={(field, value) => updateSection('workExperience', field, value)} 
        />
        <Projects 
          data={data.projects} 
          onChange={(field, value) => updateSection('projects', field, value)} 
        />
      </div>
    </div>
  );
};

export default CVTemplate;
