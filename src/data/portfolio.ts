export interface Fact {
  k: string
  v: string
  ph?: boolean
}

export interface Skill {
  name: string
  glyph: string
  note: string
  tint: string
  wide?: boolean
}

export interface Project {
  title: string
  desc: string
  tags: string[]
  github: string
  tint: string
  art: string
  image?: string
}

export interface AchievementItem {
  title: string
  meta: string
}

export interface Achievement {
  key: string
  blurb: string
  items: AchievementItem[]
}

export interface Contact {
  label: string
  value: string
  href: string
}

export interface PortfolioData {
  name: string
  role: string
  tagline: string
  about: string[]
  facts: Fact[]
  skills: Skill[]
  projects: Project[]
  achievements: Achievement[]
  contacts: Contact[]
  nav: [string, string][]
}

const DATA: PortfolioData = {
  name: "AADIL",
  role: "First-Year Computer Science Student | Developer | Tech Enthusiast",
  tagline: "Exploring technology, building meaningful projects, and turning ideas into reality.",
  about: [
    "I'm a first-year Computer Science student who loves understanding how things work and then building them myself. Programming, software development and emerging technologies are what pull me in every day.",
    "I learn by making things: small programs, web pages, experiments that don't always work the first time. Each one teaches me something I carry into the next.",
    "I'm looking to grow alongside other developers, join teams, take part in hackathons and communities, and keep shipping."
  ],
  facts: [
    { k: "Studying", v: "Computer Science, first year" },
    { k: "Institution", v: "Add your college or university", ph: true },
    { k: "Interests", v: "Software development, emerging tech, UI design" },
    { k: "Currently", v: "Learning, building, exploring" }
  ],
  skills: [
    { name: "C Programming", glyph: "C", note: "Foundations of how programs and memory work.", tint: "#9db4ff", wide: true },
    { name: "Python", glyph: "Py", note: "Scripting and problem solving.", tint: "#f1c9a5" },
    { name: "HTML", glyph: "</>", note: "Semantic page structure.", tint: "#f1a5a5" },
    { name: "CSS", glyph: "{ }", note: "Layouts, responsive design, motion.", tint: "#a5d6f1" },
    { name: "JavaScript", glyph: "JS", note: "Interactivity and logic on the web.", tint: "#f1e3a5" },
    { name: "React", glyph: "Re", note: "Component-based interfaces.", tint: "#9de3ff", wide: true },
    { name: "Git & GitHub", glyph: "git", note: "Version control and collaboration.", tint: "#c5a5f1" },
    { name: "UI/UX Design", glyph: "Ux", note: "Clear, usable, good-looking products.", tint: "#a5f1c9" }
  ],
  projects: [
    { title: "Project name one", desc: "Replace this with a short description of what you built, the problem it solves and what you learned.", tags: ["Add", "Your", "Stack"], github: "https://github.com/heyyaadil", tint: "#6f8fff", art: "linear-gradient(135deg,#5b6bff,#8a3ffc 45%,#1b1040)" },
    { title: "Project name two", desc: "Describe the idea, your role and the outcome. Keep it to two or three honest sentences.", tags: ["Python", "Add more"], github: "https://github.com/heyyaadil", tint: "#ffa66b", art: "linear-gradient(135deg,#ff8a4c,#ff4f8b 50%,#3a1230)" },
    { title: "Project name three", desc: "A third placeholder. Swap in a hackathon build, class project or personal experiment.", tags: ["React", "CSS"], github: "https://github.com/heyyaadil", tint: "#37e3d0", art: "linear-gradient(135deg,#19d3a2,#1b8fd6 55%,#0b2a3a)" }
  ],
  achievements: [
    { key: "Hackathons", blurb: "Events where you built something with a team.", items: [] },
    { key: "Technical workshops", blurb: "Workshops you attended or hosted.", items: [] },
    { key: "Developer communities", blurb: "Communities you are part of, such as GDG chapters or coding clubs.", items: [] },
    { key: "Certifications", blurb: "Courses and certificates you have completed.", items: [] },
    { key: "Campus activities", blurb: "Clubs, events and teams on campus.", items: [] },
    { key: "Leadership & volunteering", blurb: "Roles where you led or helped others.", items: [] }
  ],
  contacts: [
    { label: "Email", value: "warsiaadil5@gmail.com", href: "mailto:warsiaadil5@gmail.com" },
    { label: "LinkedIn", value: "linkedin.com/in/aadil-warsi-944ba3402", href: "https://www.linkedin.com/in/aadil-warsi-944ba3402/" },
    { label: "GitHub", value: "github.com/heyyaadil", href: "https://github.com/heyyaadil" },
    { label: "Instagram", value: "@your.username", href: "https://www.instagram.com/your.username" }
  ],
  nav: [["Home", "home"], ["About", "about"], ["Skills", "skills"], ["Projects", "projects"], ["Achievements", "achievements"], ["Contact", "contact"]]
}

export default DATA
