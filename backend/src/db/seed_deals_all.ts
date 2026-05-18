/**
 * Single combined seed for all TritonSpend deals.
 * Sources: curated UCSD/manual, ShreyamMaity/student-offers, AchoArnold/discount-for-student-dev
 *
 * Run: ./node_modules/.bin/ts-node src/db/seed_deals_all.ts
 */
import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

interface Deal {
  name: string;
  description: string;
  category: string;
  url: string;
  badge: string;
  source: string;
  requires_edu: boolean;
  is_ucsd_specific: boolean;
}

// ── Category + badge helpers (used for raw database.md data) ────────────────
function mapCategory(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("music"))                                                          return "Music";
  if (t.includes("ai") || t.includes("machine learning"))                           return "AI";
  if (t.includes("stream") || t.includes("cinema") || t.includes("entertainment") || t.includes("video streaming")) return "Entertainment";
  if (t.includes("game"))                                                            return "Entertainment";
  if (t.includes("cloud") || t.includes("hosting") || t.includes("server") || t.includes("infrastructure") || t.includes("database service") || t.includes("dns")) return "Cloud";
  if (t.includes("learn") || t.includes("education") || t.includes("certif") || t.includes("course")) return "Education";
  if (t.includes("shop") || t.includes("product") || t.includes("travel") || t.includes("flight") || t.includes("cellular") || t.includes("electronics")) return "Shopping";
  if (t.includes("productivity") || t.includes("note") || t.includes("password") || t.includes("meditation") || t.includes("marketing") || t.includes("survey")) return "Productivity";
  return "Software";
}

function extractBadge(b: string): string {
  const t = b.replace(/\\\$/g, "$").replace(/\*\*/g, "").trim();
  const l = t.toLowerCase();
  if (/85\s*%\s*off/i.test(t))                 return "85% Off";
  if (/65\s*%\s*off|upto 65/i.test(t))         return "65% Off";
  if (/60\s*%\s*off|upto 60/i.test(t))         return "60% Off";
  if (/50\s*%\s*off|upto 50/i.test(t))         return "50% Off";
  if (/30\s*%\s*off|upto 30/i.test(t))         return "30% Off";
  if (/20\s*%\s*off|upto 20/i.test(t))         return "20% Off";
  if (/10\s*%\s*off|upto 10/i.test(t))         return "10% Off";
  if (/5\s*%\s*off|upto 5/i.test(t))           return "5% Off";
  if (/\$1\.99\s*\/\s*month/i.test(t))         return "$1.99/mo";
  if (/\$200k/i.test(t))                        return "Free";
  if (/\$10[kK]/i.test(t))                      return "$10K Credit";
  if (/\$250/i.test(t))                         return "$250 Credit";
  if (/\$200/i.test(t))                         return "$200 Credit";
  if (/\$100/i.test(t))                         return "$100 Credit";
  if (/\$50\s*credit/i.test(t))                return "$50 Credit";
  if (/12\s*month|1\s*year|annual subscription|one year/i.test(l)) return "1 Year Free";
  if (/6\s*month/i.test(l))                     return "6 Months Free";
  if (/3\s*month/i.test(l))                     return "3 Months Free";
  if (/1\s*month|30\s*day|one month/i.test(l))  return "1 Month Free";
  if (/2\s*year/i.test(l))                      return "Free";
  if (/lifetime|lite plan/i.test(l))            return "Free";
  if (/free|student license|educational license|edu license|pro package|open source/i.test(l)) return "Free";
  if (/discount|concession|off|coupon/i.test(l)) return "Discounted";
  return "Free";
}

// ── SOURCE 1: Curated / UCSD-specific ───────────────────────────────────────
const CURATED: Deal[] = [
  { name: "GitHub Student Developer Pack", description: "Get $200K+ worth of developer tools — GitHub Pro, Copilot, cloud credits, domains, and more.", category: "Software", url: "https://education.github.com/pack", badge: "Free", source: "GitHub Education", requires_edu: true, is_ucsd_specific: false },
  { name: "JetBrains IDEs", description: "Free access to all professional IDEs: PyCharm, WebStorm, IntelliJ, GoLand, and more.", category: "Software", url: "https://www.jetbrains.com/student/", badge: "Free", source: "JetBrains", requires_edu: true, is_ucsd_specific: false },
  { name: "Figma Pro", description: "Full professional design tool for UI/UX — free for students and educators.", category: "Software", url: "https://www.figma.com/education/", badge: "Free", source: "Figma", requires_edu: true, is_ucsd_specific: false },
  { name: "Unity Student Plan", description: "Free Unity Pro for eligible students. Build games and interactive 3D experiences.", category: "Entertainment", url: "https://unity.com/products/unity-student", badge: "Free", source: "Unity", requires_edu: true, is_ucsd_specific: false },
  { name: "Autodesk Education", description: "Free access to AutoCAD, Fusion 360, Maya, Revit, and the full Autodesk suite.", category: "Software", url: "https://www.autodesk.com/education/edu-software/overview", badge: "Free", source: "Autodesk", requires_edu: true, is_ucsd_specific: false },
  { name: "GitKraken Pro", description: "Free GitKraken Pro kit — GUI client, boards, and timelines for student projects.", category: "Software", url: "https://www.gitkraken.com/github-student-developer-pack-bundle", badge: "Free", source: "GitKraken", requires_edu: true, is_ucsd_specific: false },
  { name: "Namecheap", description: "Free .me domain for 1 year + SSL certificate. Great for your portfolio site.", category: "Software", url: "https://nc.me", badge: "1 Year Free", source: "Namecheap", requires_edu: true, is_ucsd_specific: false },
  { name: "AWS Educate", description: "Get $100 in AWS cloud credits to build, deploy, and scale projects on Amazon Web Services.", category: "Cloud", url: "https://aws.amazon.com/education/awseducate/", badge: "$100 Credit", source: "Amazon", requires_edu: true, is_ucsd_specific: false },
  { name: "Microsoft Azure for Students", description: "$100 credit + 25+ free Azure cloud services including AI and databases. No credit card needed.", category: "Cloud", url: "https://azure.microsoft.com/en-us/free/students/", badge: "$100 Credit", source: "Microsoft", requires_edu: true, is_ucsd_specific: false },
  { name: "DigitalOcean", description: "$50 in cloud hosting credits via the GitHub Student Pack. Deploy apps in minutes.", category: "Cloud", url: "https://www.digitalocean.com/github-students/", badge: "$50 Credit", source: "DigitalOcean", requires_edu: true, is_ucsd_specific: false },
  { name: "MongoDB Atlas", description: "$200 in Atlas credits plus free courses and certification for students.", category: "Cloud", url: "https://www.mongodb.com/students", badge: "$200 Credit", source: "MongoDB", requires_edu: true, is_ucsd_specific: false },
  { name: "Netlify", description: "Free web hosting for static sites and serverless functions. Deploy in seconds.", category: "Cloud", url: "https://www.netlify.com/", badge: "Free", source: "Netlify", requires_edu: false, is_ucsd_specific: false },
  { name: "Spotify Premium", description: "60% off Spotify Premium — just $5.99/month. Ad-free music, podcasts, and offline listening.", category: "Entertainment", url: "https://www.spotify.com/us/student/", badge: "60% Off", source: "Spotify", requires_edu: false, is_ucsd_specific: false },
  { name: "Hulu Student", description: "Stream TV shows and movies for just $1.99/month — over 80% off the regular price.", category: "Entertainment", url: "https://www.hulu.com/student", badge: "$1.99/mo", source: "Hulu", requires_edu: false, is_ucsd_specific: false },
  { name: "YouTube Premium", description: "Discounted YouTube Premium for students — ad-free videos, background play, and YouTube Music.", category: "Entertainment", url: "https://www.youtube.com/premium/student", badge: "Discounted", source: "YouTube", requires_edu: false, is_ucsd_specific: false },
  { name: "Amazon Prime Student", description: "50% off Amazon Prime ($7.49/mo) — free 2-day shipping, Prime Video, and exclusive deals.", category: "Shopping", url: "https://www.amazon.com/amazonprime", badge: "50% Off", source: "Amazon", requires_edu: true, is_ucsd_specific: false },
  { name: "Apple Education Store", description: "Save up to $300 on a new Mac or iPad for college. Exclusive student pricing year-round.", category: "Shopping", url: "https://www.apple.com/us-hed/shop", badge: "Up to $300 Off", source: "Apple", requires_edu: false, is_ucsd_specific: false },
  { name: "Notion Pro", description: "Free Notion Pro plan for students — unlimited blocks, unlimited file uploads, and version history.", category: "Productivity", url: "https://www.notion.so/product/notion-for-education", badge: "Free", source: "Notion", requires_edu: true, is_ucsd_specific: false },
  { name: "Headspace", description: "85% off Headspace for students — meditations, sleep sounds, and focus exercises.", category: "Productivity", url: "https://www.headspace.com/studentplan", badge: "85% Off", source: "Headspace", requires_edu: false, is_ucsd_specific: false },
  { name: "YouNeedABudget (YNAB)", description: "Free YNAB subscription for college students. The top-rated personal budgeting app.", category: "Productivity", url: "https://www.youneedabudget.com/college/", badge: "Free", source: "YNAB", requires_edu: true, is_ucsd_specific: false },
  { name: "Evernote Personal", description: "50% off a full year of Evernote Personal — notes, notebooks, web clipper, and PDF search.", category: "Productivity", url: "https://evernote.com/students", badge: "50% Off", source: "Evernote", requires_edu: false, is_ucsd_specific: false },
  { name: "Dashlane", description: "6 months free Dashlane Premium via the GitHub Student Pack. Secure password manager.", category: "Productivity", url: "https://www.dashlane.com/github-students", badge: "6 Months Free", source: "Dashlane", requires_edu: true, is_ucsd_specific: false },
  { name: "Coursera Financial Aid", description: "Apply for financial aid on any Coursera course or specialization and get it for free.", category: "Education", url: "https://www.coursera.org", badge: "Free", source: "Coursera", requires_edu: false, is_ucsd_specific: false },
  { name: "DataCamp", description: "3 months free DataCamp via GitHub Student Pack — Python, SQL, R, machine learning, and more.", category: "Education", url: "https://www.datacamp.com/github-students", badge: "3 Months Free", source: "DataCamp", requires_edu: true, is_ucsd_specific: false },
  { name: "Frontend Masters", description: "6 months free access to 200+ expert-led courses on JavaScript, React, Node, and more.", category: "Education", url: "https://frontendmasters.com/welcome/github-student-developers/", badge: "6 Months Free", source: "Frontend Masters", requires_edu: true, is_ucsd_specific: false },
  { name: "Grammarly", description: "Free Grammarly Education plan — grammar checker, tone detection, and plagiarism detection.", category: "Productivity", url: "https://www.grammarly.com/edu/signup", badge: "Free", source: "Grammarly", requires_edu: true, is_ucsd_specific: false },
  { name: "Microsoft Certifications", description: "Free access to 8 Microsoft certifications including Azure, Power Platform, and more.", category: "Education", url: "https://msftstudentcert.cloudreadyskills.com/", badge: "Free", source: "Microsoft", requires_edu: true, is_ucsd_specific: false },
  { name: "Dell Student Discount", description: "Up to 20% off laptops, monitors, and accessories. Exclusive student pricing at Dell.", category: "Shopping", url: "https://www.dell.com/en-us/lp/students", badge: "Up to 20% Off", source: "Dell", requires_edu: false, is_ucsd_specific: false },
  { name: "Samsung Student Advantage", description: "10% off Galaxy phones, tablets, and accessories through Samsung's Student Advantage program.", category: "Shopping", url: "https://www.samsung.com/us/shop/offer-program/student/", badge: "10% Off", source: "Samsung", requires_edu: false, is_ucsd_specific: false },
  { name: "Perplexity Pro", description: "Free 1-year Perplexity Pro subscription for eligible college students. AI-powered research.", category: "AI", url: "https://www.perplexity.ai/backtoschool", badge: "1 Year Free", source: "Perplexity", requires_edu: true, is_ucsd_specific: false },
  { name: "GitHub Copilot", description: "Free AI coding assistant via the GitHub Student Developer Pack. Works in VS Code + JetBrains.", category: "AI", url: "https://education.github.com/pack", badge: "Free", source: "GitHub", requires_edu: true, is_ucsd_specific: false },
  { name: "Ableton Live", description: "50% off Ableton Live — industry-leading music production software for making and performing music.", category: "Music", url: "https://www.ableton.com/en/shop/education/", badge: "50% Off", source: "Ableton", requires_edu: true, is_ucsd_specific: false },
  { name: "Spotify + Hulu + Showtime", description: "Spotify Premium + Hulu (ad-supported) + Showtime bundle — all for just $5.99/month.", category: "Entertainment", url: "https://www.spotify.com/us/student/", badge: "$5.99/mo", source: "Spotify", requires_edu: false, is_ucsd_specific: false },
  // UCSD Exclusive
  { name: "UCSD Adobe Creative Cloud", description: "Free full Adobe CC suite (Photoshop, Illustrator, Premiere, etc.) for all active UCSD students.", category: "UCSD", url: "https://blink.ucsd.edu/technology/computers/software-acms/available-software/adobe.html", badge: "Free", source: "UCSD IT", requires_edu: true, is_ucsd_specific: true },
  { name: "MTS College Transit Pass", description: "Discounted monthly MTS pass for UCSD students — unlimited bus and trolley rides in San Diego.", category: "UCSD", url: "https://transportation.ucsd.edu/alternatives/transit/mts.html", badge: "Discounted", source: "UCSD Transportation", requires_edu: true, is_ucsd_specific: true },
  { name: "UCSD LinkedIn Learning", description: "Free unlimited access to LinkedIn Learning via the UCSD Library — 16,000+ video courses.", category: "UCSD", url: "https://library.ucsd.edu/news-events/linkedin-learning/index.html", badge: "Free", source: "UCSD Library", requires_edu: true, is_ucsd_specific: true },
  { name: "New York Times Digital", description: "Free unlimited NYT digital access for UCSD students through the university library subscription.", category: "UCSD", url: "https://library.ucsd.edu", badge: "Free", source: "UCSD Library", requires_edu: true, is_ucsd_specific: true },
  { name: "UCSD Recreation Center", description: "Free gym, pool, courts, and fitness classes at the UCSD Recreation Center — included in student fees.", category: "UCSD", url: "https://recreation.ucsd.edu", badge: "Free", source: "UCSD Recreation", requires_edu: true, is_ucsd_specific: true },
  { name: "Microsoft Office 365 (UCSD)", description: "Free Microsoft 365 — Word, Excel, PowerPoint, Teams, OneDrive — for all active UCSD students.", category: "UCSD", url: "https://blink.ucsd.edu/technology/computers/software-acms/available-software/microsoft-365.html", badge: "Free", source: "UCSD IT", requires_edu: true, is_ucsd_specific: true },
];

// ── SOURCE 2: ShreyamMaity/student-offers database.md ───────────────────────
// [name, url, benefits, type]
const DB_MD_RAW: [string, string, string, string][] = [
  ["Github Student Developer Pack", "https://education.github.com/pack", "$200K worth free software for all your development needs", "Development, Art, Design"],
  ["Bio Link", "https://bio.link/", "Link in bio — the clickable URL you can add to your profile section", "Social Media Links Manager"],
  ["AnyDesk Student", "https://anydesk.com/en/education/free-for-students", "All AnyDesk product licenses while you are a student", "Design, Art"],
  ["Spotify Student Discount", "https://www.spotify.com/us/student/", "Student discount — up to 60% off Premium", "Music"],
  ["Visual Studio Enterprise", "https://visualstudio.microsoft.com/students/", "Visual Studio Enterprise subscription for students", "Development"],
  ["LastPass", "https://www.lastpass.com", "6 months premium subscription for students", "Password Manager"],
  ["SurveyHero", "https://www.surveyhero.com/esurveycreator-is-now-surveyhero", "Student license while you are a student", "Survey creation"],
  ["LucidChart", "https://www.lucidchart.com/pages/", "Lifetime free subscription for students", "Flowchart service"],
  ["Prezi", "https://prezi.com/", "Lifetime subscription for students", "Video Conferencing App"],
  ["BlackBerry QNX", "https://blackberry.qnx.com/en", "Lifetime subscription for students", "Education"],
  ["Name.com", "https://www.name.com/partner/github-students", "One-year domain + Advanced Security SSL Certificate", "Domains"],
  ["Educative", "https://www.educative.io/github-students", "6 months free access to 60+ curated courses", "Learn"],
  ["GitHub Pro", "https://education.github.com/benefits/offers", "GitHub Pro package for free", "Developer"],
  ["Unity Student", "https://unity.com/products/unity-student", "Unity Pro free for eligible students (lifetime while enrolled)", "Game Development"],
  ["JetBrains", "https://www.jetbrains.com/education/", "Free annual subscription to all JetBrains IDEs", "Developer"],
  ["Bootstrap Studio", "https://bootstrapstudio.io/", "Bootstrap Studio Studio License for students", "Design"],
  ["Heroku", "https://www.heroku.com/students", "Free Hobby Dyno for cloud app deployment", "Cloud"],
  [".tech Domains", "https://get.tech/github-student-developer-pack", "Free .tech domain for 1 year + 2 email accounts + 100 MB storage", "Domains"],
  ["PomoDone", "https://pomodoneapp.com/pomodoro-timer-for-students.html", "Lite Plan free for 2 years", "Productivity"],
  ["GitKraken", "https://www.gitkraken.com/github-student-developer-pack-bundle", "GitKraken Pro Kit — GUI client, boards & timelines", "Developing Tools"],
  ["Termius", "https://termius.com/education", "Premium SSH client plan for students", "Mobile"],
  ["One Month", "https://onemonth.com/github/students", "30-day subscription to beginner-friendly coding courses", "Learn"],
  ["Education Host", "https://github-students.educationhost.co.uk/", "1-year hosting plan + upgrade discount", "Cloud"],
  ["Interview Cake", "https://www.interviewcake.com/github-students", "3 weeks free access to coding interview prep", "Learn"],
  ["GitHub Campus Experts", "https://education.github.com/experts", "Complete GitHub Campus Expert training course", "Learn"],
  ["Iconscout", "https://iconscout.com/", "1-year subscription + 60 premium icons", "Design"],
  ["Twilio", "https://www.twilio.com/blog/twilio-perks-students-and-educators-now-available-github-education", "$50 in Twilio API credits for communication APIs", "Infrastructure & APIs"],
  ["Testmail.app", "https://testmail.app/", "Essential plan for email testing", "Developing Tools"],
  ["Polypane", "https://polypane.app/github-students/", "1-year subscription to the developer browser", "Design"],
  ["Pageclip", "https://pageclip.co/github-students", "Basic plan for static site form backend", "Infrastructure"],
  ["Next.tech", "https://next.tech/", "1-year subscription to interactive coding courses", "Developing & Learn"],
  ["ATOM Learning", "https://atomlearning.co.uk/pricing", "Annual subscription for students", "Tools"],
  ["Arduino Education", "https://www.arduino.cc/education/", "6 months access to Arduino IoT kit and courses", "Internet of Things"],
  ["Typeform", "https://product.typeform.com/github/", "1-year subscription to beautiful forms & surveys", "Design & Marketing"],
  ["Netwise", "https://www.netwise.co.uk/students/", "1-year subscription to networking services", "Cloud"],
  ["HazeOver", "https://hazeover.com/", "HazeOver app free for lifetime (focus tool for Mac)", "Productivity"],
  ["ICONS8", "https://icons8.com/github-students", "3 months unlimited access to icons, photos & music", "Design"],
  ["Mailgun", "https://www.mailgun.com/github-students/", "12 months + 20,000 free emails + 100 email validations/month", "Infrastructure"],
  ["GoRails", "https://gorails.com/github-students", "12 months free Ruby on Rails video lessons", "Learn"],
  ["Rhino3D", "https://www.rhino3d.com/for/education/", "Rhino3D educational license for 3D modeling", "3D Rendering"],
  ["Enscape", "https://enscape3d.com/educational-license/", "Enscape educational license for real-time 3D rendering", "3D Rendering"],
  ["Chaos V-Ray", "https://www.chaos.com/education/students", "Student license for V-Ray professional 3D rendering", "3D Work"],
  ["Qt Framework", "https://www.qt.io/qt-educational-license", "Qt educational license for cross-platform development", "Cross Platform"],
  ["Copyright.com", "https://www.copyright.com/solutions-annual-copyright-license-student-assessments/", "Student license for copyright compliance", "Education"],
  ["Gurobi", "https://www.gurobi.com/academia/academic-program-and-licenses/", "Student license for mathematical optimization software", "Software"],
  ["Shapr3D", "https://www.shapr3d.com/education", "1-year student license for 3D modeling on iPad", "3D modeling"],
  ["Gliffy", "https://help.gliffy.com/online/Content/GliffyOnline/free_for_students.htm", "Free account for active students — diagrams & flowcharts", "Design"],
  ["Portfoliobox Pro", "https://www.portfoliobox.net/students", "Student license for portfolio website builder", "Design"],
  ["Lumion Pro", "https://lumion.com/educational-licenses.html", "Student license for architectural visualization software", "3D Rendering"],
  ["Tableau Desktop", "https://www.tableau.com/academic/students", "1-year free Tableau Desktop student license for data viz", "Data Analysing"],
  ["Tableau Prep Builder", "https://www.tableau.com/products/prep", "1-year student license for Tableau data prep tool", "Data Analysing"],
  ["Thinkful", "https://www.thinkful.com/blog/github-adds-thinkful-to-student-developer-pack/", "1 month free web development bootcamp course", "Learn"],
  ["InVision App", "https://support.invisionapp.com/hc/en-us", "Free InVision prototyping tool while you are a student", "UI/UX Design"],
  ["Basecamp", "https://basecamp.com/discounts", "Free Basecamp account for teachers and students", "Project management"],
  ["UniDays", "https://www.myunidays.com/US/en-US", "Student discounts on top brands — fashion, tech, food & more", "Shopping"],
  ["SheerID", "https://www.sheerid.com/shoppers/studentdeals/", "Verified student discounts from hundreds of brands", "Shopping"],
  ["OnTheHub", "https://onthehub.com/", "Discounts on software for students, faculty and staff", "Softwares"],
  ["PTC Creo Student", "https://www.ptc.com/en/products/education/free-software/creo-college-download", "Student license for Creo 3D CAD software", "3D CAD"],
  ["Intel Education Software", "https://www.intel.com/content/www/us/en/education/intel-education.html", "Student license for Intel development and AI tools", "Development"],
  ["Newegg Premier", "https://www.newegg.com/neweggpremier", "Discounts on electronics, PC components and peripherals", "Shopping"],
  ["MNX.io", "https://mnx.io/pricing", "$50 credit in cloud hosting for students, valid for 1 year", "Cloud Server"],
  ["DNSimple", "https://dnsimple.com/signup", "DNSimple student license for domain management", "DNS"],
  ["SendGrid", "https://sendgrid.com/pricing/", "Student license for email delivery API", "Infrastructure"],
  ["Orchestrate.io", "https://orchestration.io/", "Free developer account for database services", "database service"],
  ["Bitnami", "https://bitnami.com/", "Free student license — pre-packaged server software stacks", "Cloud"],
  ["Crowdflower / Figure Eight", "https://www.truelancer.com/crowdflower-online-jobs-freelancer-job", "Student license for AI/ML data training software", "AI ML training"],
  ["Squarespace", "https://www.squarespace.com/coupons", "Discount and free trial months for website builder", "Education"],
  ["Student Beans", "https://www.studentbeans.com/student-discount/us/all", "Free membership for verified student discounts across brands", "Shopping"],
  ["Timescale", "https://www.timescale.com/", "1-year license for time-series database (TimescaleDB)", "Website"],
  ["Hexagon Geospatial", "https://hexagon.com/company/divisions/safety-infrastructure-geospatial/education-program", "Student license for geospatial software", "Education"],
  ["Axure RP", "https://www.axure.com/edu", "Student license for professional UX prototyping tool", "Design"],
  ["Replit", "https://replit.com/site/github-students", "3 months free Hackers Plan — code in 50+ languages in browser", "Developers & Learn"],
  ["B&H Photo Video", "https://www.bhphotovideo.com/find/eduAdvantage.jsp", "Student discount on cameras, lenses and electronics", "Shopping"],
  ["Flatiron School", "https://flatironschool.com/", "1 month free access to software engineering bootcamp prep", "Learn"],
  ["Imgbot", "https://github.com/marketplace/imgbot/", "Free image optimization for GitHub repositories", "Infrastructure"],
  ["PopSQL", "https://popsql.com/github-students", "Free Premium plan for collaborative SQL editor", "Developing Tools"],
  ["Datadog", "https://www.datadoghq.com/blog/datadog-github-student-developer-pack/", "Pro account + 10 servers + 2 years of infrastructure monitoring", "Security & Analytics"],
  ["Kodika.io", "https://kodika.io/pricing/", "6 months free unlimited Pro plan — build iOS apps visually", "Design & Mobile"],
  ["Stripe", "https://stripe.com/", "No transaction fee on first $1,000 in revenue processed", "Infrastructure & APIs"],
  ["Adafruit", "https://www.adafruit.com/github-students", "1-year subscription to Adafruit electronics & IoT kits", "Internet of Things"],
  ["Travis CI", "https://education.travis-ci.com/", "Free open source CI/CD pipelines for student projects", "Developer Tools"],
  ["ScrapingHub", "https://www.scrapehero.com/", "1 free Scrapy Cloud unit for web scraping projects", "Developer Tools"],
  ["Covalence", "https://covalence.io/", "1 month free subscription to coding bootcamp", "Learn"],
  ["DeepSource", "https://deepsource.io/", "Free Pro subscription for automated code review", "Tools"],
  ["Tower", "https://www.git-tower.com/students/windows", "Free Tower Pro Git client for students", "Developer Tools"],
  ["Gitpod", "https://gitpod.io/plans/", "6 months free personal plan for cloud dev environments", "Developer Tools"],
  ["Sentry", "https://sentry.io/for/education/", "Free unlimited team members + 10 GB attachments/month", "Crash Reporting"],
  ["Xojo", "https://www.xojo.com/githubstudent/", "Free desktop license for cross-platform app development", "Design & Developer Tools"],
  ["Working Copy", "https://workingcopyapp.com/", "Free Pro subscription for iOS Git client", "Developer Tools"],
  ["CryptoLens", "https://app.cryptolens.io/user/githubstudent", "Create up to 10 free licenses for your software products", "Software Licensing"],
  ["Jaamly", "https://jaamly.com/", "6 months free startup plan for app growth analytics", "Marketing"],
  ["BrowserStack", "https://www.browserstack.com/", "1-year free Automate plan for cross-browser testing", "Developing Tools"],
  ["blackfire.io", "https://blackfire.io/", "Free Profiler subscription for PHP performance monitoring", "Security & Analytics"],
  ["Neve WordPress Theme", "https://themeisle.com/github-students/", "1-year free agency WordPress theme license", "Design & APIs"],
  ["Codecov", "https://about.codecov.io/", "Free access to public & private repository code coverage", "Developer Tools"],
  ["CART", "https://cart.org/", "2-year free Premium plan for accessibility testing", "Infrastructure"],
  ["Customerly", "https://customerly.io/", "6 months free Pro plan for customer support & marketing", "Infrastructure & Marketing"],
  ["SQLGate", "https://www.sqlgate.com/pricing/subscription?language=en", "1-year free subscription to SQL IDE", "Tools"],
  ["Vaadin", "https://vaadin.com/student-program", "Free Pro subscription for Java web app framework", "Infrastructure & APIs"],
  ["Restyled", "https://restyled.io/", "Free access to private repositories for auto-formatting PRs", "Tools"],
  ["DeepScan", "https://deepscan.io/github-student-pack", "6 months free Premium plan for JavaScript code analysis", "Tools"],
  ["Weglot", "https://weglot.com/", "1-year free subscription for website translation", "Tools & Infrastructure"],
  ["CodeScene", "https://codescene.com/github-students", "Free access to private GitHub repo behavioral code analysis", "Security & Analytics"],
  ["Simple Analytics", "https://simpleanalytics.com/students", "1-year free subscription to privacy-first website analytics", "Infrastructure & Marketing"],
  ["USE Together", "https://www.use-together.com/", "1-year free subscription for remote pair programming", "Productivity"],
  ["Algolia", "https://www.algolia.com/", "1-year free subscription to powerful search-as-a-service", "Infrastructure"],
  ["Better Code Hub", "https://bettercodehub.com/github-student-developer-pack", "Free individual license with private repo access", "Developing Tools"],
  ["DailyBot", "https://www.dailybot.com/pricing", "6 months free Business plan for team standup automation", "Productivity"],
  ["POEditor", "https://poeditor.com/blog/translation-localization-educational-projects/", "1-year free subscription for localization management", "Developer Tools"],
  ["Honeybadger.io", "https://www.honeybadger.io/github-students/", "1-year free subscription for error monitoring & uptime", "Security & Analytics"],
  ["Kaltura", "https://corp.kaltura.com/", "$10,000/year in video platform credits", "Infrastructure"],
  ["Astra Security", "https://www.getastra.com/github-student-developer-pack", "6 months free security suite for websites", "Security & Analytics"],
  ["Pushbots", "https://pushbots.com/for/education/", "6 months free push notification platform", "Infrastructure"],
  ["LingoHub", "https://lingohub.com/github-students", "Free Professional plan with 10,000 translation text segments", "Infrastructure, Productivity"],
  ["Blockchair", "https://blockchair.com/", "100,000 free API requests for blockchain data", "Infrastructure"],
  ["Datree", "https://www.datree.io/", "Free Pro subscription for Kubernetes misconfiguration prevention", "Tools"],
  ["EverSQL", "https://www.eversql.com/github-students/", "6 months free subscription for automatic SQL optimization", "Tools"],
  ["Baremetrics", "https://baremetrics.com/github-students", "Free access up to $2,500 monthly recurring revenue", "Marketing"],
  ["LambdaTest", "https://www.lambdatest.com/github-students", "1-year free Live plan for cross-browser testing on 3000+ browsers", "Test"],
  ["SQLSmash", "https://sqlsmash.com/buy.html", "Free Standard plan for SQL Server productivity plugin", "Developing Tools"],
  ["Wisej", "https://wisej.com/", "Free Premium Plus plan for .NET web app framework", "Infrastructure"],
  ["AccessLint", "https://github.com/AccessLint", "Free access to public and private repos for accessibility CI", "Developer Tools"],
  ["Appfigures", "https://appfigures.com/landing/github-student", "1-year free Premium plan for app store analytics", "Marketing"],
  ["LogDNA (Mezmo)", "https://www.mezmo.com/blog/get-a-free-logdna-account-in-the-github-student-developer-pack", "1-year free plan — 50 GB/month log management", "Security & Analytics"],
  ["Sofy", "https://sofy.ai/", "6 months free Premium plan for no-code mobile app testing", "Tools & Mobile"],
  ["Transloadit", "https://transloadit.com/github-students/", "Free 10 GB Startup plan for file uploading & processing", "Infrastructure & Tools"],
  ["Phrase", "https://phrase.com/", "12 months free Premium plan for software localization", "Infrastructure & Tools"],
  ["Coveralls", "https://coveralls.io/github-students", "Free unlimited private repository access for code coverage", "Tools"],
  ["Yakindu", "https://www.itemis.com/en/yakindu/state-machine/", "12 months free Premium for state machine modeling", "Learn"],
  ["Crowdin", "https://crowdin.com/page/github-students", "12 months free Premium for open source localization", "Productivity"],
  ["Transifex", "https://www.transifex.com/pricing/", "6 months free Premium for software translation management", "Infrastructure & Tools"],
  ["Minecraft Education Edition", "https://education.minecraft.net/en-us/licensing", "Free educational license of Minecraft for students", "Game"],
  ["Udemy", "https://www.udemy.com/", "Student discounts on professional development courses", "Courses"],
  ["CleanMyMac", "https://macpaw.com/store/cleanmymac", "30% off lifetime edition and annual plans", "Tools & PC"],
  ["Qoddi", "https://blog.qoddi.com/flashdrive-student-program/", "$250/year in web hosting credits for students", "Web Hosting"],
  ["Audible", "https://www.amazon.com/hz/audible/mlp", "Access Audible Originals, audiobooks, and exclusive podcasts", "Learning"],
  ["Evernote", "https://evernote.com/students", "50% off Evernote Personal — notes, notebooks, web clipper", "Education"],
  ["Hulu for Students", "https://www.hulu.com/student", "Stream TV shows and movies for just $1.99/month", "Video Streaming"],
  ["Expedia Student Travel", "https://www.expedia.com/student-travel-discounts", "Student travel discounts on hotels, flights and packages", "Tour and Travel"],
  ["Impact Soundworks", "https://impactsoundworks.com/support/#academic-discounts/", "Educational discounts on premium digital instruments", "Music"],
  ["Cursa", "https://cursa.app/en", "Get certified courses for free", "Education"],
  ["Envato Elements", "https://elements.envato.com/pricing/students", "Student discount on unlimited design assets & templates", "Design"],
  ["Alibaba Cloud for Students", "https://www.alibabacloud.com/campaign/education", "Free cloud servers, training courses, and certifications", "Education"],
  ["StudentMoneySaver", "https://www.studentmoneysaver.co.uk/", "Discounts on top brands for students across categories", "Shopping"],
  ["Lenovo Student Store", "https://www.lenovo.com/us/en/d/students/", "Special discounts on laptops and accessories for students", "Products"],
  ["Mubi", "https://mubi.com/promos/student", "90 days of curated hand-picked films free — only for students", "Cinema Streaming"],
  ["VOXI for Students", "https://www.voxi.co.uk/acquisition/students", "First month free on VOXI mobile data plans", "Cellular Data"],
  ["UNiDAYS", "https://www.myunidays.com/US/en-US", "Up to 50% off — tech, fashion, learning and more for students", "Shopping"],
  ["MacPaw Student Discount", "https://macpaw.com/macpaw-student-discount", "Up to 30% off CleanMyMac and MacPaw products", "Productivity"],
  ["HP Student Store", "https://www.hp.com/us-en/shop/cv/student", "Discounts, cashback and free products for students", "Products"],
  ["Udemy Courses", "https://www.udemy.com/", "Student discounts on 200,000+ online courses", "Education"],
  ["Adobe Creative Cloud Student", "https://www.adobe.com/creativecloud/plans/student.html", "Up to 65% off Adobe Creative Cloud for students", "Education"],
  ["Lenovo", "https://www.lenovo.com/us/en/d/students/", "Up to 20% off laptops and accessories for students", "Products"],
  ["Printful", "https://www.printful.com/student-deals", "Free shipping on custom printed products for students", "Products"],
  ["Realme Student Discount", "https://www.realme.com/eu/student-discount", "5% extra discount on phones and gadgets", "Electronics"],
  ["Spitfire Audio", "https://www.spitfireaudio.com/education-program", "30–50% discount on professional digital instruments", "Music Production"],
  ["Steinberg Cubase", "https://www.steinberg.net/education/students-teachers/", "Up to 50% off Steinberg Cubase for students", "Music Production"],
  ["FL Studio", "https://www.image-line.com/edu-licenses/", "Student discounts on FL Studio music production suite", "Music Production"],
  ["Avid Pro Tools", "https://www.avid.com/academic-eligibility", "Student discounts on Avid Pro Tools for audio production", "Music Production"],
  ["Antares Auto-Tune", "https://identit-e.com/antaresaudiotech", "50% off Antares Auto-Tune and audio technology products", "Music Production"],
];

// ── SOURCE 3: AchoArnold/discount-for-student-dev ────────────────────────────
// [name, url, description, category, badge]
const ACHO_RAW: [string, string, string, string, string][] = [
  ["Bitbucket", "https://bitbucket.org/product/education", "Free unlimited public and private repositories for academic users and teams.", "Software", "Free"],
  ["Visual Studio Community 2022", "https://visualstudio.microsoft.com/vs/community/", "Full-featured free IDE for C#, JavaScript, C++, Python, and more.", "Software", "Free"],
  ["GitHub Codespaces", "https://github.com/features/codespaces", "Cloud dev environment — full VS Code in the browser. Free personal plan for students.", "Cloud", "Free"],
  ["GitHub Desktop", "https://desktop.github.com/", "Simplified Git GUI so you can focus on what matters. Free for everyone.", "Software", "Free"],
  ["Sketch", "https://www.sketch.com/education/", "Professional vector design tool for Mac — free for students and educators.", "Software", "Free"],
  ["MDBootstrap", "https://mdbootstrap.com/general/mdb-edu/", "50% off on slick, responsive Bootstrap UI kits and page templates.", "Software", "50% Off"],
  ["UXPin", "https://www.uxpin.com/pricing", "Online UI design and prototyping tool with code-backed components — free for students.", "Software", "Free"],
  ["Framer", "https://www.framer.com/pricing/", "Interactive prototyping tool with 50% off for students with an educational license.", "Software", "50% Off"],
  ["TailoredCV.ai", "https://tailoredcv.ai/", "AI-powered CV tailoring to match job descriptions. 20% off using code STUDENTS20.", "Productivity", "20% Off"],
  ["Taskade", "https://www.taskade.com/", "Team task management, notes & real-time chat. 50% permanent discount for students.", "Productivity", "50% Off"],
  ["Loom Pro", "https://support.loom.com/hc/en-us/articles/360006579637", "Record and share videos instantly. Free Loom Pro for students and teachers.", "Productivity", "Free"],
  ["Tabula.io", "https://docs.tabula.io/getting-started/plans-and-subscriptions/tabula-for-education", "No-code data analytics and visualisation tool. 60% permanent student discount.", "Productivity", "60% Off"],
  ["Craft", "https://www.craft.do/education", "Beautiful note-taking and document creation app — free for students.", "Productivity", "Free"],
  ["Miro", "https://miro.com/education-whiteboard/", "Free digital whiteboard for collaboration and online education. Valid for 2 years.", "Productivity", "Free"],
  ["Beautiful.ai", "https://www.beautiful.ai/education", "AI-powered presentation builder. Free annual Pro subscription for students.", "Productivity", "Free"],
  ["1Password", "https://www.studentappcentre.com/App/1Password", "Secure password manager — 6 months completely free for students.", "Productivity", "6 Months Free"],
  ["RoboForm", "https://www.roboform.com/promotions/college", "Password manager free for students and professors for the first year.", "Productivity", "1 Year Free"],
  ["ConfigCat", "https://configcat.com/student/", "Feature flag service for developers — 1,000 feature flags with unlimited users, free.", "Software", "Free"],
  ["Doppler", "https://doppler.com/lp/secretsops-for-students", "Secrets and environment variable manager. Free Doppler Team plan for students.", "Software", "Free"],
  ["Requestly", "https://requestly.com/student-program", "Open-source API development, testing and mocking tool. Full access free for students.", "Software", "Free"],
  ["Netlicensing", "https://netlicensing.io/github-students/", "Licensing-as-a-Service for any platform. Free Basic plan for students.", "Cloud", "Free"],
  ["Bump.sh", "https://bump.sh/students", "Publish and sync API docs from OpenAPI files. Free Standard plan ($149/mo value).", "Software", "Free"],
  ["Webflow", "https://webflow.com/classroom/student-application", "Visual web design and CMS platform. Free annual CMS site plan for students.", "Software", "Free"],
  ["Appwrite", "https://appwrite.io/education", "Open-source Backend-as-a-Service for web and mobile apps. Free Pro plan for students.", "Cloud", "Free"],
  ["InterServer", "https://www.interserver.net/webhosting/student-webhosting.html/", "Standard web hosting package free for the first year for students.", "Cloud", "1 Year Free"],
  ["RoseHosting", "https://www.rosehosting.com", "Education-specific and general shared/dedicated hosting at student discounts.", "Cloud", "Discounted"],
  ["Northflank", "https://northflank.com/student-developer-pack", "Deploy microservices, cron jobs and managed databases. Free tier with 4 services.", "Cloud", "Free"],
  ["Google Cloud Platform", "https://cloud.google.com/edu/students", "Free cloud credits and access to 20+ GCP products including AI/ML tools for students.", "Cloud", "Free"],
  ["New Relic", "https://newrelic.com/social-impact/students", "Full-stack observability platform. Free for students — $300/month value.", "Cloud", "Free"],
  ["Mapbox", "https://www.mapbox.com/community/education", "Developer mapping platform — 5 GB of free storage for custom map data.", "Cloud", "Free"],
  ["Lettermint", "https://lettermint.co/promo-codes-and-discounts/students", "Transactional email service. Free Starter plan for 6 months (normally €60).", "Cloud", "6 Months Free"],
  ["Zyte (Scrapy Cloud)", "https://www.zyte.com/scrapy-cloud-student-backpack/", "Cloud web scraping platform. Free tier for students — spiders run forever.", "Cloud", "Free"],
  ["Crawlbase", "https://crawlbase.com/", "Web scraping API — 5,000 free successful requests over 3 months for students.", "Cloud", "Free"],
  ["Semaphore CI", "https://docs.semaphoreci.com/account-management/discounts/", "CI/CD platform — free account for students, 25% discount for institutions.", "Software", "Free"],
  ["Shodan", "https://help.shodan.io/the-basics/academic-upgrade", "Internet-connected device search engine. Free academic upgrade + 100 export credits.", "Software", "Free"],
  ["Malwarebytes", "https://www.malwarebytes.com/student-discount", "50% off device security software — verify student status via ProxID.", "Shopping", "50% Off"],
  ["Astah", "https://astah.net/products/free-student-license/", "One-year free Professional license for UML and system design tools.", "Software", "1 Year Free"],
  ["Vertabelo", "https://my.vertabelo.com/sign-up/create-academic", "Visual database design online — 100% free academic accounts for students.", "Software", "Free"],
  ["CARTO", "https://carto.com/blog/carto-for-education/", "Geospatial analytics platform — free upgrades with extra storage and credits for 2 years.", "Software", "Free"],
  ["SAS OnDemand for Academics", "https://www.sas.com/en_us/software/on-demand-for-academics.html", "Free SAS analytics and data science software hosted in the cloud for students.", "Education", "Free"],
  ["AnyChart", "https://www.anychart.com/buy/non-commercial-license/", "JavaScript charting library — free non-commercial license for student projects.", "Software", "Free"],
  ["Deepnote", "https://deepnote.com/education", "Collaborative data science notebooks. Free Education plan with unlimited teams.", "AI", "Free"],
  ["Neptune.ai", "https://neptune.ai/research", "ML experiment tracker — free for academic research and student projects.", "AI", "Free"],
  ["Comet ML", "https://www.comet.com/signup?plan=academic", "End-to-end ML model evaluation and experiment tracking. Free academic plan.", "AI", "Free"],
  ["Exploratory", "https://exploratory.io/", "No-code data science and analytics platform. Free student registration.", "AI", "Free"],
  ["Unreal Engine", "https://www.unrealengine.com/en-US/learn", "Epic's full professional game engine — completely free for students and learning.", "Entertainment", "Free"],
  ["Solid Edge Student", "https://resources.sw.siemens.com/en-US/download-solid-edge-student-edition/", "Free professional 3D CAD software from Siemens for students.", "Software", "Free"],
  ["SymfonyCasts", "https://symfonycasts.com/github-student", "Master Symfony and PHP with video tutorials. Free 3-month subscription for students.", "Education", "3 Months Free"],
  ["Scrimba", "https://scrimba.com/github-education", "Interactive coding platform. 1 month free Pro access — JavaScript, React, Python & more.", "Education", "1 Month Free"],
  ["LabEx", "https://labex.io/", "Hands-on Linux, DevOps and cybersecurity labs. 50% off Pro plan for students.", "Education", "50% Off"],
  ["Codedex", "https://www.codedex.io/github-students", "Learn to code with fun quests. 6 months free Codédex Club premium for students.", "Education", "6 Months Free"],
  ["AlgoExpert", "https://www.algoexpert.io/github-students", "Coding interview prep — 20 free questions + 10% off all products for students.", "Education", "Free"],
  ["GitHub Foundations Certification", "https://examregistration.github.com/certification/GHF", "Waived exam fee for your first GitHub Foundations Certification ($99 value).", "Education", "Free"],
  ["ACM Student Membership", "https://www.acm.org/membership/membership-options", "Access ACM and its Digital Library for $42/year (vs $198 regular) for CS students.", "Education", "Discounted"],
  ["MATLAB Student", "https://in.mathworks.com/products/matlab/student.html", "Student discount on MATLAB — the industry-standard technical computing language.", "Education", "Discounted"],
  ["Intel Tools for Students", "https://software.intel.com/en-us/qualify-for-free-software/student", "Free access to Intel XDK, Video Pro Analyzer, Parallel Studio XE and more.", "Software", "Free"],
  ["Microsoft Office 365 Education", "https://www.microsoft.com/en-us/education/products/office", "Free Word, Excel, PowerPoint, Teams and OneNote for students and teachers.", "Software", "Free"],
  ["Dashlane Student", "https://www.dashlane.com/students", "1 year free Dashlane Premium for students with eligible school email.", "Productivity", "1 Year Free"],
  ["Datadog Student", "https://studentpack.datadoghq.com/", "2-year free Datadog Pro license — monitor up to 10 servers.", "Cloud", "Free"],
  ["1001 Record", "https://1001record.com/educational-discount", "Screen recording app for Mac with annotation tools. 60% off for students.", "Productivity", "60% Off"],
  ["Semrush Student", "https://www.semrush.com/", "SEO, content marketing and competitive research tools — student discount available.", "Productivity", "Discounted"],
  ["Canva Pro", "https://www.canva.com/education/", "Full Canva Pro design suite — free for students and teachers.", "Software", "Free"],
  ["Grammarly Business", "https://www.grammarly.com/business/students", "Advanced grammar, style and plagiarism checker — free for enrolled students.", "Productivity", "Free"],
  ["Notion AI", "https://www.notion.so/product/notion-for-education", "AI-powered writing assistant built into Notion — included in the free student plan.", "AI", "Free"],
  ["Wolfram Alpha Pro", "https://www.wolframalpha.com/pro/pricing/students/", "Step-by-step solutions, extended computation and professional output for students.", "Education", "Discounted"],
  ["LinkedIn Premium Career", "https://www.linkedin.com/premium/products/", "LinkedIn Premium Career — free 1-month trial and discounted rate for students.", "Productivity", "Discounted"],
  ["Sketch Mirror", "https://www.sketch.com/education/", "Preview your Sketch designs on a real iPhone or iPad — free for students.", "Software", "Free"],
  ["Squarespace Student", "https://www.squarespace.com/coupons", "Website builder with free trial months and student discount pricing.", "Software", "Discounted"],
  ["Amazon Web Services (General)", "https://aws.amazon.com/education/awseducate/", "Full AWS cloud platform access with student credits and training resources.", "Cloud", "Free"],
];

// ── Build unified list, dedup by name (first-seen wins) ─────────────────────
function buildAllDeals(): Deal[] {
  const seen = new Map<string, Deal>();

  // Priority 1: curated
  for (const d of CURATED) {
    if (!seen.has(d.name)) seen.set(d.name, d);
  }

  // Priority 2: database.md (processed through helpers)
  for (const [name, url, benefits, type] of DB_MD_RAW) {
    if (!seen.has(name)) {
      seen.set(name, {
        name,
        description: benefits.replace(/\\\$/g, "$").replace(/\*\*/g, "").trim(),
        category: mapCategory(type),
        url,
        badge: extractBadge(benefits),
        source: "ShreyamMaity/student-offers",
        requires_edu: false,
        is_ucsd_specific: false,
      });
    }
  }

  // Priority 3: AchoArnold
  for (const [name, url, description, category, badge] of ACHO_RAW) {
    if (!seen.has(name)) {
      seen.set(name, {
        name, description, category, url, badge,
        source: "AchoArnold/discount-for-student-dev",
        requires_edu: false,
        is_ucsd_specific: false,
      });
    }
  }

  return Array.from(seen.values());
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  await client.connect();
  console.log("Connected to Supabase.");

  // Ensure table + link_status column exist
  await client.query(`
    CREATE TABLE IF NOT EXISTS deals (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      description   TEXT,
      category      VARCHAR(50),
      url           TEXT,
      badge         TEXT,
      source        TEXT,
      requires_edu  BOOLEAN DEFAULT false,
      is_ucsd_specific BOOLEAN DEFAULT false,
      link_status   VARCHAR(20) DEFAULT 'unchecked'
    );
  `);
  await client.query(`ALTER TABLE deals ADD COLUMN IF NOT EXISTS link_status VARCHAR(20) DEFAULT 'unchecked';`);
  await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS deals_name_unique ON deals (name);`).catch(() => {});

  // Clear and reseed
  await client.query("DELETE FROM deals;");
  console.log("Cleared existing deals.");

  const all = buildAllDeals();
  console.log(`Inserting ${all.length} unique deals…`);

  for (const d of all) {
    await client.query(
      `INSERT INTO deals (name, description, category, url, badge, source, requires_edu, is_ucsd_specific)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (name) DO NOTHING;`,
      [d.name, d.description, d.category, d.url, d.badge, d.source, d.requires_edu, d.is_ucsd_specific]
    );
  }

  // Summary
  const { rows } = await client.query(`
    SELECT category, COUNT(*) as count FROM deals GROUP BY category ORDER BY count DESC;
  `);
  const total = rows.reduce((s, r) => s + parseInt(r.count), 0);
  console.log(`\n── Seeded ${total} deals ─────────────────────`);
  rows.forEach(r => console.log(`  ${r.category.padEnd(16)} ${r.count}`));

  await client.end();
}

seed().catch(err => { console.error(err); process.exit(1); });
