export const MATCH_REPORT_DATA = {
  scoreCard: {
    score: 88,
    companyName: "NAB Innovation Team",
    jobTitle: "Java/Javascript Engineer",
    resumeTitle: "Java/Javascript Engineer Resume",
    atsTipLabel: "ATS tip",
  },
  sidebarTabs: [
    { key: "skills", label: "Skills", progress: 40 },
    { key: "searchability", label: "Searchability", progress: 60 },
    { key: "recruiterTips", label: "Recruiter Tips", progress: 30, badgeCount: 6 },
  ],
  sidebarContentByTab: {
    skills: [
      {
        key: "required-skills",
        title: "Required skills",
        metrics: [{ label: "Matched skills", value: 1, tone: "success" }],
        items: [
          {
            key: "javascript",
            label: "Javascript",
            status: "matched",
            progressLabel: "Added 2/2",
            asTag: true,
          },
        ],
      },
      {
        key: "hard-skills",
        title: "Hard skills",
        metrics: [
          { label: "Matched skills", value: 4, tone: "success" },
          { label: "Missing skills", value: 1, tone: "danger" },
        ],
        items: [
          {
            key: "software-development",
            label: "Software Development",
            status: "matched",
            progressLabel: "Added 4/2",
            asTag: true,
            suggestions: [
              "Applied Software Development best practices to design, build, and maintain scalable web applications.",
              "Contributed to the full Software Development lifecycle, from concept to deployment, for diverse projects.",
              "Leveraged Software Development expertise to create robust and efficient user-facing features.",
            ],
          },
          {
            key: "information-technology",
            label: "Information technology",
            status: "matched",
            progressLabel: "Added 1/1",
            asTag: true,
          },
          {
            key: "information-systems",
            label: "Information Systems",
            status: "matched",
            progressLabel: "Added 1/1",
            asTag: true,
          },
          {
            key: "recruitment",
            label: "Recruitment",
            status: "missing",
            progressLabel: "0/1",
            asTag: false,
          },
          {
            key: "hcm",
            label: "HCM",
            status: "matched",
            progressLabel: "1/1",
            asTag: false,
          },
        ],
      },
    ],
    searchability: [
      {
        key: "keyword-density",
        title: "Keyword density",
        metrics: [
          { label: "Matched keywords", value: 3, tone: "success" },
          { label: "Missing keywords", value: 2, tone: "danger" },
        ],
        items: [
          {
            key: "action-verbs",
            label: "Action verbs",
            status: "matched",
            progressLabel: "11/12",
            asTag: true,
          },
          {
            key: "impact-numbers",
            label: "Impact numbers",
            status: "missing",
            progressLabel: "2/6",
            asTag: false,
            suggestions: [
              "Add measurable outcomes in each role, such as conversion uplift or cycle-time reduction.",
              "Include metrics for API performance, deployment frequency, and bug-fix turnaround.",
              "Quantify project scope: users served, services managed, or automation savings.",
            ],
          },
          {
            key: "role-keywords",
            label: "Role-specific keywords",
            status: "matched",
            progressLabel: "8/10",
            asTag: true,
          },
        ],
      },
      {
        key: "ats-formatting",
        title: "ATS formatting",
        metrics: [{ label: "Checklist passed", value: 5, tone: "success" }],
        items: [
          {
            key: "heading-structure",
            label: "Heading structure",
            status: "matched",
            progressLabel: "Ready",
            asTag: false,
          },
          {
            key: "readability",
            label: "Readability score",
            status: "matched",
            progressLabel: "Good",
            asTag: false,
          },
        ],
      },
    ],
    recruiterTips: [
      {
        key: "priority-feedback",
        title: "Recruiter tips",
        metrics: [{ label: "Open items", value: 6, tone: "danger" }],
        items: [
          {
            key: "summary-focus",
            label: "Strengthen profile summary",
            status: "missing",
            progressLabel: "High priority",
            asTag: false,
            suggestions: [
              "Start summary with your strongest role-fit statement and 3-4 years equivalent project exposure.",
              "Emphasize ownership scope for backend APIs, frontend delivery, and CI/CD pipeline automation.",
            ],
          },
          {
            key: "project-depth",
            label: "Deepen project outcomes",
            status: "missing",
            progressLabel: "High priority",
            asTag: false,
            suggestions: [
              "For each project, add impact before tech stack to improve recruiter scan speed.",
              "Highlight collaboration with product, QA, and cross-functional teams.",
            ],
          },
          {
            key: "language-consistency",
            label: "Keep wording consistent",
            status: "matched",
            progressLabel: "In progress",
            asTag: false,
          },
        ],
      },
    ],
  },
  documentTabs: [
    { key: "resume", label: "Resume" },
    { key: "coverLetter", label: "Cover Letter" },
    { key: "jobDescription", label: "Job Description" },
  ],
  editorStatus: {
    aiSuggestionsLabel: "AI Suggestions (22/22)",
    editStepLabel: "Edit",
    editStepValue: "2",
    downloadLabel: "Download",
  },
  resumePreview: {
    note:
      "AI helps improve your resume, but always review it to make sure every detail is correct.",
    resume: {
      candidate: {
        name: "DANG MAI ANH TU",
        contacts: [
          "Address: Thu Duc City, Ho Chi Minh City",
          "Phone: +84 389 275 513",
          "Email: dangmaianhtu@gmail.com",
          "Website: www.anhtudev.com",
          "GitHub: www.github.com/anhtu2808",
        ],
      },
      summary: {
        title: "Summary",
        paragraphs: [
          "Final-year Software Engineering student and aspiring Full-Stack Software Engineer with hands-on experience in scalable web application development, backend APIs, and cloud deployment.",
          "Seeking to leverage skills in Java and JavaScript in an international software development environment. Strong analytical and collaborative skills, with fast learning ability and practical ownership mindset.",
        ],
        highlights: [
          "JavaScript",
          "software development",
          "analytical",
          "collaborative",
        ],
      },
      skills: {
        title: "Skills",
        groups: [
          { label: "Programming Languages", value: "Java, JavaScript, C#, Python." },
          {
            label: "Backend Development",
            value:
              "Spring Boot, Spring Security, RESTful API, OOP, Microservices architecture.",
          },
          {
            label: "Frontend Development",
            value: "HTML5, CSS, Bootstrap, ReactJS, Ant Design, Responsive Design.",
          },
          {
            label: "DevOps",
            value:
              "CI/CD with GitHub Actions, Docker, Linux server administration, AWS and Nginx.",
          },
          { label: "Databases", value: "MySQL, Microsoft SQL Server, Database Design." },
          {
            label: "Software Development",
            value:
              "SDLC, Agile/Scrum Methodologies, Information Technology, Information Systems.",
          },
          {
            label: "Tools and Technologies",
            value: "Git, Maven, Figma, Postman, Jira, AI integration workflows.",
          },
          {
            label: "Soft Skills",
            value:
              "Project management, communication, quick learning, leadership, analytical and collaborative delivery.",
          },
        ],
        highlights: [
          "JavaScript",
          "Software Development",
          "Information Technology",
          "Information Systems",
          "analytical",
          "collaborative",
        ],
      },
      experience: {
        title: "Work Experience",
        entries: [
          {
            role: "Full-Stack Developer (Freelance)",
            timeline: "January 2024 - Present",
            company: "SAT Chasedream",
            bullets: [
              "Developed and maintained features for a multi-tenant SaaS platform.",
              "Implemented backend services using Spring Boot and integrated third-party APIs.",
              "Built responsive frontend components with React and Ant Design.",
            ],
          },
        ],
      },
    },
    otherDocuments: {
      coverLetter: {
        title: "Cover Letter",
        description:
          "This panel is reserved for cover-letter optimization flow. You can keep using the same editor controls and ATS insight panel.",
        placeholder:
          "Cover Letter editing mode is in UI-only scope for this phase and uses static placeholder content.",
      },
      jobDescription: {
        title: "Job Description",
        description:
          "Use this mode to inspect job requirements side by side with the optimized resume content.",
        placeholder:
          "Job Description view is currently static and prepared for API integration in a later phase.",
      },
    },
  },
};
