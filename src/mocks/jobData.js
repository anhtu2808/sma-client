export const MOCK_JOBS = [
    {
        id: "mock-1",
        name: "Senior Frontend Developer",
        companyName: "Tech Corp",
        companyLogo: "https://ui-avatars.com/api/?name=Tech+Corp&background=0D8ABC&color=fff",
        location: "San Francisco, CA",
        salaryMin: 4000,
        salaryMax: 6000,
        skills: [{ name: "React" }, { name: "TypeScript" }, { name: "Tailwind" }],
        createdDate: new Date().toISOString(),
        isHot: true,
        description: "We are looking for an experienced Senior Frontend Developer to join our product team. You will be responsible for building high-quality, scalable web applications using React and TypeScript. You will work closely with designers and backend engineers to deliver exceptional user experiences. The ideal candidate is passionate about modern web technologies and cares deeply about performance and accessibility.",
        responsibilities: [
            "Design and implement new features using React, Redux, and TypeScript.",
            "Optimize application for maximum speed and scalability.",
            "Collaborate with other team members and stakeholders.",
            "Write clean, maintainable, and reusable code.",
            "Participate in code reviews and mentor junior developers."
        ],
        requirements: [
            "5+ years of experience in frontend development.",
            "Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model.",
            "Thorough understanding of React.js and its core principles.",
            "Experience with popular React.js workflows (such as Flux or Redux).",
            "Familiarity with newer specifications of EcmaScript.",
            "Knowledge of modern authorization mechanisms, such as JSON Web Token."
        ],
        benefits: [
            { icon: "medical_services", text: "Health Insurance" },
            { icon: "flight_takeoff", text: "Unlimited PTO" },
            { icon: "laptop_mac", text: "Remote Friendly" },
            { icon: "fitness_center", text: "Gym Reimbursement" }
        ],
        overview: {
            experience: "5+ Years",
            level: "Senior",
            salary: "$120k-150k",
            posted: "2 days ago",
            type: "Full-time",
            applicationDeadline: "Application closes in 5 days"
        },
        companyInfo: {
            description: "TechCorp is a leading innovator in cloud solutions, dedicated to simplifying digital transformation for businesses worldwide."
        }
    },
    {
        id: "mock-2",
        name: "Backend Engineer",
        companyName: "Data Systems",
        companyLogo: "https://ui-avatars.com/api/?name=Data+Systems&background=ff5722&color=fff",
        location: "Remote",
        salaryMin: 3000,
        salaryMax: 5000,
        skills: [{ name: "Node.js" }, { name: "PostgreSQL" }, { name: "AWS" }],
        createdDate: new Date().toISOString(),
        isHot: false,
        description: "Join our backend team to build robust and scalable APIs. You will work with Node.js, PostgreSQL, and AWS to power our data-driven applications.",
        responsibilities: [
            "Develop and maintain server-side logic using Node.js.",
            "Design and optimize database schemas.",
            "Ensure high performance and responsiveness of requests.",
            "Integrate user-facing elements developed by frontend developers."
        ],
        requirements: [
            "3+ years of experience in backend development.",
            "Proficiency in Node.js and Express.",
            "Experience with relational databases (PostgreSQL).",
            "Familiarity with cloud platforms (AWS)."
        ],
        benefits: [
            { icon: "medical_services", text: "Health Insurance" },
            { icon: "computer", text: "Latest Equipment" }
        ],
        overview: {
            experience: "3+ Years",
            level: "Mid-Level",
            salary: "$80k-120k",
            posted: "1 week ago",
            type: "Full-time",
            applicationDeadline: "Application closes in 10 days"
        },
        companyInfo: {
            description: "Data Systems specializes in big data analytics and processing."
        }
    },
    {
        id: "mock-3",
        name: "UI/UX Designer",
        companyName: "Creative Studio",
        companyLogo: "https://ui-avatars.com/api/?name=Creative+Studio&background=673ab7&color=fff",
        location: "New York, NY",
        salaryMin: 2500,
        salaryMax: 4000,
        skills: [{ name: "Figma" }, { name: "Sketch" }, { name: "Adobe XD" }],
        createdDate: new Date().toISOString(),
        isHot: true,
        description: "We are seeking a talented UI/UX Designer to create amazing user experiences. You will design interfaces for web and mobile applications.",
        responsibilities: [
            "Gather and evaluate user requirements.",
            "Illustrate design ideas using storyboards and process flows.",
            "Design graphic user interface elements.",
            "Develop UI mockups and prototypes."
        ],
        requirements: [
            "Proven work experience as a UI/UX Designer.",
            "Portfolio of design projects.",
            "Knowledge of wireframe tools (e.g., Wireframe.cc and InVision).",
            "Up-to-date knowledge of design software like Adobe Illustrator and Photoshop."
        ],
        benefits: [
            { icon: "palette", text: "Creative Environment" },
            { icon: "schedule", text: "Flexible Hours" }
        ],
        overview: {
            experience: "2+ Years",
            level: "Junior/Mid",
            salary: "$60k-90k",
            posted: "3 days ago",
            type: "Full-time",
            applicationDeadline: "Application closes in 7 days"
        },
        companyInfo: {
            description: "Creative Studio is a design-first agency crafting digital experiences."
        }
    },
    {
        id: "mock-4",
        name: "Full Stack Developer",
        companyName: "Startup Inc",
        companyLogo: "https://ui-avatars.com/api/?name=Startup+Inc&background=4caf50&color=fff",
        location: "Austin, TX",
        salaryMin: 3500,
        salaryMax: 5500,
        skills: [{ name: "React" }, { name: "Node.js" }, { name: "MongoDB" }],
        createdDate: new Date().toISOString(),
        isHot: false,
        description: "Looking for a versatile Full Stack Developer to handle both client-side and server-side code.",
        responsibilities: [
            "Maintain and improve website.",
            "Optimize applications for maximum speed.",
            "Design mobile-based features.",
            "Get feedback from, and build solutions for, users and customers."
        ],
        requirements: [
            "Proven experience as a Full Stack Developer.",
            "Experience with React and Node.js.",
            "Familiarity with databases (e.g. MySQL, MongoDB), web servers (e.g. Apache) and UI/UX design."
        ],
        benefits: [
            { icon: "rocket_launch", text: "Stock Options" },
            { icon: "restaurant", text: "Free Lunch" }
        ],
        overview: {
            experience: "4+ Years",
            level: "Senior",
            salary: "$100k-140k",
            posted: "5 days ago",
            type: "Full-time",
            applicationDeadline: "Application closes in 2 weeks"
        },
        companyInfo: {
            description: "Startup Inc is disrupting the fintech industry with innovative solutions."
        }
    },
    {
        id: "mock-5",
        name: "DevOps Specialist",
        companyName: "Cloud Sol",
        companyLogo: "https://ui-avatars.com/api/?name=Cloud+Sol&background=607d8b&color=fff",
        location: "Remote",
        salaryMin: 4500,
        salaryMax: 7000,
        skills: [{ name: "Docker" }, { name: "Kubernetes" }, { name: "CI/CD" }],
        createdDate: new Date().toISOString(),
        isHot: true,
        description: "We need a DevOps Specialist to manage our infrastructure and deployment pipelines.",
        responsibilities: [
            "Implement integrations requested by customers.",
            "Deploy updates and fixes.",
            "Build tools to reduce occurrences of errors and improve customer experience.",
            "Develop software to integrate with internal back-end systems."
        ],
        requirements: [
            "BSc in Computer Science, Engineering or relevant field.",
            "Experience as a DevOps Engineer or similar software engineering role.",
            "Proficiency with git and git workflows.",
            "Good knowledge of Ruby or Python."
        ],
        benefits: [
            { icon: "wifi", text: "Internet Verification" },
            { icon: "school", text: "Learning Budget" }
        ],
        overview: {
            experience: "5+ Years",
            level: "Senior",
            salary: "$110k-160k",
            posted: "1 day ago",
            type: "Contract",
            applicationDeadline: "Application closes in 3 days"
        },
        companyInfo: {
            description: "Cloud Sol provides enterprise-grade cloud infrastructure management."
        }
    }
];
