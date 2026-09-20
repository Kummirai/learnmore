export type ManualStage = {
  label: string;
  name: string;
  items: string[];
};

export type ManualBadge = "Board" | "Officer" | "Team" | "Partner";

export type ManualSection = {
  title: string;
  body?: string;
  list?: string[];
  tags?: string[];
  note?: string;
  highlight?: boolean;
  badge?: ManualBadge;
  stages?: ManualStage[];
};

export type ManualChapter = {
  id: string;
  number: string;
  title: string;
  icon: string;
  tagline: string;
  content?: string | null;
  sections: ManualSection[];
};

export const chapters: ManualChapter[] = [
  {
    id: "welcome",
    number: "00",
    title: "Welcome & Introduction",
    icon: "\u25CE",
    tagline: "Your guide to Relate",
    content:
      "Welcome to Relate. This handbook serves as your guide to understanding the heart, mind, and operational framework of our organization. Whether you are a board member, a volunteer, a sponsor, or a community partner, you are now part of a mission dedicated to transforming lives through sustainable empowerment.\n\nRelate exists at the intersection of compassion and practical action. We believe that every individual and family possesses inherent strength and potential. Our role is not to create dependence but to help you be self-reliant and sustainable — this is the promise of our mission statement.\n\nThis document outlines our core objectives, the values that guide our every interaction, the structure of our leadership, and the detailed responsibilities of each role. Please familiarize yourself with its contents, as they form the foundation of our shared commitment to serving the less privileged in our community.",
    sections: [],
  },
  {
    id: "identity",
    number: "01",
    title: "Our Identity",
    icon: "\u25C8",
    tagline: "Who we are",
    sections: [
      {
        title: "Organization Name: Relate",
        body: "The name \"Relate\" signifies our foundational principle: authentic, supportive relationships. We believe lasting change happens through connection — relating to individuals' stories, struggles, and aspirations. We are not a distant charity; we are engaged partners.",
      },
      {
        title: "Core Objectives",
        list: [
          "To Help the Less Privileged: We proactively identify and reach out to individuals and families facing systemic or circumstantial disadvantages.",
          "To Provide Mentoring: We establish one-on-one or group mentoring relationships to offer guidance, support, and skill development.",
          "To Attend to Social Needs: We address immediate and long-term social determinants of well-being, including food security, housing stability, educational access, and emotional health.",
          "To Guide to Relevant Authorities: We act as a knowledgeable bridge, connecting individuals with appropriate government agencies, non-profits, healthcare providers, and legal services.",
        ],
      },
      {
        title: "Mission Statement",
        body: "\"To help you be self-reliant and sustainable.\" This mission is a commitment to an outcome, not just an activity. Every program, interaction, and resource is evaluated against this goal: does it move the individual or family closer to independence and long-term stability?",
        highlight: true,
      },
      {
        title: "Core Values",
        tags: [
          "Empowerment over Aid",
          "Dignity in Every Interaction",
          "Integrity in Stewardship",
          "Sustainability in Solutions",
          "Community through Partnership",
        ],
      },
    ],
  },
  {
    id: "principles",
    number: "02",
    title: "Our Guiding Principles",
    icon: "\u25C7",
    tagline: "How we work",
    sections: [
      {
        title: "Compassionate Empowerment",
        body: "We lead with empathy but focus on activating an individual's own agency. We ask, \"How can we help you achieve your goal?\" rather than deciding unilaterally.",
      },
      {
        title: "Dignity & Respect",
        body: "All service is rendered with utmost respect for privacy, cultural background, and personal autonomy. We practice active listening and uphold confidentiality.",
      },
      {
        title: "Integrity & Stewardship",
        body: "We are transparent and accountable for all resources — financial, material, and human. Donations and time are used efficiently and for their intended purpose.",
      },
      {
        title: "Sustainability & Self-Reliance",
        body: "We favor solutions that teach skills, create opportunities, and build networks, ensuring help today doesn't create a need for help tomorrow.",
      },
      {
        title: "Community & Partnership",
        body: "We acknowledge we cannot do everything alone. We build strong networks with other organizations, businesses, and government entities to provide a web of support.",
      },
    ],
  },
  {
    id: "governance",
    number: "03",
    title: "Leadership & Governance",
    icon: "\u25C9",
    tagline: "How Relate is led",
    content:
      "Relate is governed by a Board of Directors, which holds ultimate responsibility for the organization's health, strategy, and fiduciary integrity. Day-to-day operations are managed by an Executive Director supported by officers and programme teams.",
    sections: [
      {
        title: "The Relate Board",
        list: [
          "Chairman",
          "Vice Chairman",
          "Secretary",
          "Treasurer",
          "Director of Family Support",
          "Director of Youth & Community",
          "Director of Sponsorship & Partnerships",
          "Non-executive Board Members",
        ],
        note: "The Board meets quarterly to set policy, review programs, and ensure alignment with the mission.",
      },
      {
        title: "Officers & Programme Teams",
        body: "An Executive Director leads day-to-day operations, supported by officers (Finance, Records, Communications, IT, Events). Programme teams carry out field work under the guidance of their directors.",
      },
    ],
  },
  {
    id: "roles",
    number: "04",
    title: "Role Descriptions",
    icon: "\u25D0",
    tagline: "Offices, responsibilities",
    content:
      "Every role at Relate carries clear responsibilities. This chapter sets out what each office, team, and partner position is accountable for, so that everyone knows what is expected of them and who to look to for support.",
    sections: [
      {
        title: "Board of Directors",
        body: "The Board governs Relate. It sets policy, safeguards the mission, and is ultimately accountable for the organization's health and finances. Board members act in the interests of Relate, not for personal gain.",
        badge: "Board",
      },
      {
        title: "Chairman",
        body: "Provides strategic leadership and chairs Board and annual meetings. Ensures the organization remains true to its mission, values, and objectives.",
        badge: "Board",
        list: [
          "Chair and manage all Board and annual meetings with order and fairness",
          "Set the agenda in consultation with the Secretary and Executive Director",
          "Provide strategic leadership and keep the Board focused on mission and values",
          "Act as the primary liaison for high-level community partners and stakeholders",
          "Support and review the Executive Director's performance",
          "Represent Relate publicly where required",
        ],
      },
      {
        title: "Vice Chairman",
        body: "Deputises for the Chairman and supports governance continuity across meetings and initiatives.",
        badge: "Board",
        list: [
          "Chair meetings when the Chairman is unavailable",
          "Support the Chairman in setting agendas and leading the Board",
          "Champion specific board projects or committees as agreed",
          "Provide continuity during transitions in leadership",
        ],
      },
      {
        title: "Secretary",
        body: "Maintains the official record of Relate and ensures lawful, orderly administration of meetings and documents.",
        badge: "Board",
        list: [
          "Keep accurate minutes of all Board and annual meetings",
          "Maintain official records and legal documents of Relate",
          "Manage correspondence and official communication",
          "Ensure timely notice is given for all meetings",
          "Maintain the official member/volunteer roster and contact information",
          "Prepare meeting packs and track decisions and follow-ups",
        ],
      },
      {
        title: "Treasurer",
        body: "Oversees the financial health of Relate, ensuring that every rand is recorded, accounted for, and used for its intended purpose.",
        badge: "Board",
        list: [
          "Oversee budgeting, bookkeeping, and financial reporting",
          "Present clear financial statements at each Board meeting",
          "Ensure strict financial controls and compliance with relevant laws",
          "Approve expenditure within agreed authority limits",
          "Chair the finance function together with the Finance & Accounts Officer",
          "Safeguard reserves and ensure donations are used as intended",
        ],
      },
      {
        title: "Director of Family Support",
        body: "Leads the Family Liaison Team and owns the quality of all direct family work — from intake to long-term support.",
        badge: "Board",
        list: [
          "Lead and develop the Family Liaison Team",
          "Own the intake and assessment process for families",
          "Approve individualized support plans in collaboration with families",
          "Ensure casework is documented, reviewed, and confidential",
          "Report on family support outcomes to the Board",
        ],
      },
      {
        title: "Director of Youth & Community",
        body: "Leads youth ministry and community engagement, ensuring young people are nurtured, protected, and included.",
        badge: "Board",
        list: [
          "Oversee youth activities, the youth quiz league, and outreach",
          "Lead community engagement and relationship-building",
          "Champion safeguarding of children and young people",
          "Coordinate with the Events & Logistics Officer on youth events",
          "Report on youth and community outcomes to the Board",
        ],
      },
      {
        title: "Director of Sponsorship & Partnerships",
        body: "Builds the partnerships and sponsorship pathways that fund sustainable change.",
        badge: "Board",
        list: [
          "Develop and manage financial, employment, and entrepreneurial sponsorship programs",
          "Cultivate relationships with sponsors, businesses, and partner organizations",
          "Create pathways for job shadowing, internships, and skills training",
          "Ensure sponsorship aligns with the mission of empowerment",
          "Report on sponsorship outcomes to the Board",
        ],
      },
      {
        title: "Non-executive Board Members",
        body: "Serve as independent voices, bringing expertise and oversight without managing day-to-day operations.",
        badge: "Board",
        list: [
          "Provide independent advice and constructive challenge",
          "Serve on Board committees (e.g., finance, safeguarding) as assigned",
          "Review and approve policy with the wider Board",
          "Bring professional or community expertise to decision-making",
        ],
      },
      {
        title: "Executive Director",
        body: "Runs the day-to-day operations of Relate, turning Board policy into action and coordinating all officers, teams, and volunteers.",
        badge: "Officer",
        list: [
          "Implement Board decisions and manage daily operations",
          "Coordinate officers, programme teams, and volunteers",
          "Prepare operational plans and progress reports for the Board",
          "Manage risk and ensure policies are followed",
          "Be the main point of contact for operational matters",
          "Report to the Chairman and Board",
        ],
      },
      {
        title: "Finance & Accounts Officer",
        body: "Handles the day-to-day money: recording payments, event fees, and expenses so that the books are always current and accurate.",
        badge: "Officer",
        list: [
          "Record all income and expenditure accurately and on time",
          "Process event fees and record proof-of-payment submissions",
          "Reconcile accounts and prepare reports for the Treasurer",
          "Maintain receipts and payment records in line with policy",
          "Support the Treasurer in budgeting and year-end reporting",
        ],
      },
      {
        title: "Records & Data Officer",
        body: "Owns the family records system and data quality, ensuring information is accurate, lawful, and confidential.",
        badge: "Officer",
        list: [
          "Create and maintain family records in the records system",
          "Ensure data is complete, accurate, and up to date",
          "Apply confidentiality and data-protection rules",
          "Produce reports and statistics to support decision-making",
          "Manage record access and hand-over processes",
        ],
      },
      {
        title: "Communications & PR Officer",
        body: "Tells the Relate story well: announcing events, sharing good news, and protecting the organization's reputation.",
        badge: "Officer",
        list: [
          "Send announcements and updates through the Relate app",
          "Manage social media, the website, and public communication",
          "Prepare newsletters and media statements",
          "Support event promotion and community outreach",
          "Ensure all communication upholds dignity and confidentiality",
        ],
      },
      {
        title: "IT & Systems Officer",
        body: "Keeps the technology that powers Relate running securely — accounts, access, and data safety.",
        badge: "Officer",
        list: [
          "Manage user accounts and access levels in the Relate app",
          "Provide help to members, volunteers, and officers using the systems",
          "Support data backups and information security",
          "Troubleshoot and report system issues",
          "Assist with onboarding new users onto the app",
        ],
      },
      {
        title: "Events & Logistics Officer",
        body: "Plans and delivers events well — venues, registrations, and the practical detail behind gatherings and outreach.",
        badge: "Officer",
        list: [
          "Plan events, gatherings, and outreach activities",
          "Manage venues, dates, capacity, and registrations",
          "Coordinate event volunteers and logistics",
          "Work with the Finance & Accounts Officer on event fees",
          "Ensure events are safe, dignified, and well-run",
        ],
      },
      {
        title: "Family Liaison Team",
        body: "Carries out the direct, hands-on work with individuals and families — respectfully, consistently, and safely.",
        badge: "Team",
        list: [
          "Conduct respectful home visits and assessments",
          "Build trusting, professional relationships with assigned families",
          "Implement support plans through check-ins, mentoring, and practical help",
          "Document visits and progress in the records system",
          "Report concerns promptly to the Director of Family Support",
        ],
      },
      {
        title: "Youth & Children's Team",
        body: "Creates safe, joyful, and formative experiences for young people across Relate's youth work.",
        badge: "Team",
        list: [
          "Run youth activities and the youth quiz league",
          "Supervise young people with two-adult cover",
          "Apply safeguarding rules at all times",
          "Support young people to grow in faith, skills, and confidence",
          "Report any safeguarding concern immediately",
        ],
      },
      {
        title: "Prayer & Spiritual Life Team",
        body: "Nurtures the spiritual heartbeat of Relate — prayer groups, prayer requests, and devotion.",
        badge: "Team",
        list: [
          "Lead prayer groups and prayer requests",
          "Handle sensitive prayer requests with confidentiality",
          "Encourage daily prayer and Bible reading among members",
          "Coordinate with facilitators and group moderators",
        ],
      },
      {
        title: "Skills & Mentorship Team",
        body: "Connects people who have skills with people who need them, through structured mentoring relationships.",
        badge: "Team",
        list: [
          "Support the skills exchange and job opportunities",
          "Match mentors and mentees thoughtfully",
          "Train and support mentors",
          "Track mentoring outcomes and relationships",
        ],
      },
      {
        title: "Community Outreach Team",
        body: "Takes Relate into the community — identifying needs, building trust, and connecting people to support.",
        badge: "Team",
        list: [
          "Identify families and individuals in need of support",
          "Build relationships with communities and local organizations",
          "Support events, campaigns, and awareness drives",
          "Feed insights back to the Directors",
        ],
      },
      {
        title: "General Members & Volunteers",
        body: "The lifeblood of Relate — any member or volunteer who serves on a team or contributes to a project under guidance.",
        badge: "Team",
        list: [
          "Serve on teams and contribute to projects",
          "Represent Relate with integrity and respect",
          "Follow policies, especially confidentiality and safeguarding",
          "Grow through training, mentoring, and feedback",
        ],
      },
      {
        title: "Relate Sponsor",
        body: "Invests in sustainable change — funding, opportunity, or mentorship — committed to empowerment rather than paternalism.",
        badge: "Partner",
        list: [
          "Provide financial support, job opportunities, or seed funding",
          "Offer professional mentorship or networking connections",
          "Engage with the individuals they support where appropriate",
          "Build a relationship based on empowerment and dignity",
        ],
      },
      {
        title: "Mentor",
        body: "Walks alongside an individual, teaching skills and offering guidance within the mentoring framework.",
        badge: "Partner",
        list: [
          "Meet regularly with the assigned mentee",
          "Teach skills and offer practical guidance",
          "Respect confidentiality and boundaries",
          "Report progress through the support structures",
        ],
      },
      {
        title: "Community Partner",
        body: "An organization, business, or institution that collaborates with Relate to widen the web of support.",
        badge: "Partner",
        list: [
          "Provide services, referrals, venues, or expertise",
          "Collaborate on shared programs and referrals",
          "Support Relate's mission in the community",
        ],
      },
    ],
  },
  {
    id: "performance",
    number: "05",
    title: "Performance Management",
    icon: "\u25D1",
    tagline: "Expectations & support",
    sections: [
      {
        title: "Performance Expectations & Standards",
        list: [
          "Minimum service and attendance requirements",
          "Quality standards for client interactions",
          "Documentation and reporting expectations",
          "Team collaboration and communication standards",
          "Adherence to Relate values in all activities",
        ],
      },
      {
        title: "Supportive Intervention Process",
        stages: [
          {
            label: "Stage 1 — Days 1–30",
            name: "Informal Support",
            items: [
              "Private conversation with immediate supervisor",
              "Clarification of expectations and standards",
              "Identification of potential barriers",
              "Agreement on simple corrective actions",
            ],
          },
          {
            label: "Stage 2 — Days 31–60",
            name: "Formal Development Plan",
            items: [
              "Written Performance Improvement Plan (PIP)",
              "Specific, measurable goals with clear timelines",
              "Required training or skill development",
              "Weekly progress reviews",
            ],
          },
          {
            label: "Stage 3 — Days 61–90",
            name: "Board Review & Decision",
            items: [
              "Formal presentation to Board if improvement insufficient",
              "Consideration of extenuating circumstances",
              "Determination of next steps",
              "Compassionate but firm decision-making",
            ],
          },
        ],
      },
      {
        title: "Progressive Discipline",
        list: [
          "Verbal Warning — Documented conversation about specific concerns",
          "Written Warning — Formal letter outlining issues and required changes",
          "Probation Period — 30–60-day period with specific conditions",
          "Suspension — Temporary removal from duties",
          "Termination — Final step after all interventions exhausted",
        ],
      },
    ],
  },
  {
    id: "programs",
    number: "06",
    title: "Programs & Methodology",
    icon: "\u25D2",
    tagline: "How we deliver change",
    sections: [
      {
        title: "The Intake Process",
        body: "A standardized but compassionate assessment identifies immediate crises, long-term challenges, strengths, and goals of the individual/family.",
      },
      {
        title: "Mentoring Framework",
        body: "We match mentors and mentees based on goals, personality, and background. Mentors receive training and ongoing support.",
      },
      {
        title: "Addressing Social Needs",
        body: "We use a \"wraparound\" model, coordinating multiple types of support — connecting a family with a food bank while helping a parent enrol in a vocational program.",
      },
      {
        title: "Guidance and Referral",
        body: "We maintain an updated directory of vetted service providers (social services, medical, legal) and provide warm referrals — often making the initial contact with the individual.",
      },
      {
        title: "The Sponsorship Pathway",
        body: "A structured program where sponsors invest in sustainable change: funding a certification course, providing a vehicle for work, or offering a small business loan with partnered mentorship.",
      },
      {
        title: "Community Activities",
        body: "Gatherings, events, and youth activities bring the community together, celebrate progress, and build belonging.",
      },
    ],
  },
  {
    id: "philosophy",
    number: "07",
    title: "Why We Help",
    icon: "\u25D3",
    tagline: "Our conviction",
    content:
      "Relate helps because we recognize our shared humanity and the interdependence of community. We believe that when one member struggles, the collective well-being is diminished. Our work is driven by a conviction that every person deserves the opportunity to live with dignity and hope.\n\nFurthermore, we operate on the principle of \"teaching to fish.\" Alleviating immediate suffering is urgent and moral, but our deeper purpose is to break cycles of dependency and poverty. We are not just giving help; we are investing in the restoration of human potential.",
    sections: [],
  },
  {
    id: "policies",
    number: "08",
    title: "Policies & Procedures",
    icon: "\u25D4",
    tagline: "Our rules & safeguards",
    sections: [
      {
        title: "Confidentiality Agreement",
        body: "All members will sign an agreement to protect the personal information of clients, sponsors, and other members. Breaches are taken seriously.",
      },
      {
        title: "Conflict of Interest Policy",
        body: "Board members and directors must disclose any personal or business interests that could influence their decisions for Relate.",
      },
      {
        title: "Resource Allocation Guidelines",
        body: "A clear process for approving financial assistance, ensuring it is fair, documented, and aligned with the mission of self-reliance.",
      },
      {
        title: "Safety & Boundaries Protocol",
        body: "Guidelines for safe home visits, communication (e.g., using official channels, not personal social media), and maintaining professional boundaries at all times.",
      },
    ],
  },
  {
    id: "structure",
    number: "09",
    title: "Organisational Structure & Reporting Lines",
    icon: "\u25D6",
    tagline: "Who answers to whom",
    content:
      "Clear structure prevents confusion. This chapter explains how Relate is organized, who reports to whom, and where decisions are made.",
    sections: [
      {
        title: "Overview of the Structure",
        body: "Relate is a three-tier organization: the Board governs, the Executive Director and officers manage daily operations, and programme teams and volunteers deliver the work. Sponsors, mentors, and community partners support from outside the formal structure.",
        list: [
          "Board of Directors — governance and policy",
          "Executive Director & Officers — day-to-day operations",
          "Programme Teams — field delivery",
          "Members & Volunteers — service on teams and projects",
          "Sponsors, Mentors & Partners — external support",
        ],
      },
      {
        title: "Reporting Lines",
        list: [
          "The Chairman reports to and chairs the Board",
          "The Executive Director reports to the Chairman and the Board",
          "Officers report to the Executive Director",
          "Team Leads report to their respective Board Director (e.g., Family Liaison Team to the Director of Family Support)",
          "Volunteers and members report to their Team Lead",
          "The Treasurer works closely with the Finance & Accounts Officer, who reports to the Executive Director",
        ],
      },
      {
        title: "Decision Authority",
        list: [
          "The Board decides policy, major spending, and strategic direction",
          "The Executive Director decides day-to-day operational matters",
          "Officers decide matters within their own function",
          "Team Leads decide routine matters within their team's work",
          "Major financial commitments require Board approval (see Chapter 11)",
        ],
      },
      {
        title: "Terms & Reviews",
        list: [
          "Board positions are held for a set term and reviewed regularly",
          "Officer appointments are reviewed by the Executive Director",
          "Team membership is open and reviewed with each member",
          "A succession plan is maintained for key roles",
        ],
      },
    ],
  },
  {
    id: "meetings",
    number: "10",
    title: "Meetings & Communication",
    icon: "\u25D7",
    tagline: "How we stay in step",
    sections: [
      {
        title: "Board Meetings",
        body: "The Board meets quarterly to set policy, review programs, and ensure alignment with the mission.",
        list: [
          "A quarterly schedule is agreed at the start of each year",
          "The Chairman sets the agenda with the Secretary",
          "Papers are circulated at least 5 days before the meeting",
          "Decisions are recorded in minutes with clear owners and due dates",
        ],
      },
      {
        title: "Annual General Meeting (AGM)",
        list: [
          "Held once a year for all members",
          "Reports from the Chairman, Treasurer, and Executive Director",
          "Election or re-election of Board positions",
          "Members have the opportunity to ask questions",
        ],
      },
      {
        title: "Team Meetings",
        list: [
          "Each programme team meets regularly as agreed by its lead",
          "Team meetings review progress, share updates, and solve problems",
          "Key updates are shared with the Executive Director",
        ],
      },
      {
        title: "Minutes & Records",
        body: "The Secretary keeps accurate minutes of all Board and annual meetings and tracks decisions and follow-ups.",
      },
      {
        title: "Quorum & Voting",
        list: [
          "Board decisions require a quorum as defined in the constitution",
          "Votes are taken openly unless a confidential matter is declared",
          "The Chairman holds a casting vote when needed",
        ],
      },
      {
        title: "Communication Channels",
        list: [
          "The Relate app — announcements, notifications, and records",
          "WhatsApp and email — day-to-day coordination",
          "In-person meetings — important and sensitive matters",
          "Sensitive information is never shared on unsecured channels",
        ],
      },
    ],
  },
  {
    id: "finance",
    number: "11",
    title: "Finance & Stewardship",
    icon: "\u25D9",
    tagline: "Money with integrity",
    content:
      "Relate is accountable for every cent it handles. This chapter sets out how money is received, recorded, approved, and reported.",
    sections: [
      {
        title: "Guiding Principles",
        list: [
          "Every amount received or spent is recorded accurately",
          "Funds are used only for their intended purpose",
          "Financial records are transparent and available to the Board",
          "No personal use of organization funds, ever",
        ],
      },
      {
        title: "Fee Policy",
        list: [
          "Event fees are published when an event is announced",
          "Attendees register and pay as described for the event",
          "Proof of payment (POP) must be submitted for the payment to be reviewed",
          "Partner bookings may be charged double the individual fee where applicable",
        ],
      },
      {
        title: "Payment Recording & Approval",
        list: [
          "The Finance & Accounts Officer records each payment against the attendee",
          "Payments are reviewed against the proof of payment",
          "Approved payments count toward the attendee's balance",
          "Disputed or unclear payments are returned to the attendee",
          "Payments made by attendees may be marked pending approval by an authorized officer",
        ],
      },
      {
        title: "Budgeting & Reporting",
        list: [
          "An annual budget is prepared by the Treasurer and approved by the Board",
          "The Treasurer presents financial statements at each Board meeting",
          "Expenditure over the agreed threshold requires Board approval",
          "A simple cash report is kept current by the Finance & Accounts Officer",
        ],
      },
      {
        title: "Approvals & Authority",
        list: [
          "Day-to-day expenses within a small limit: Executive Director",
          "Larger expenses: Treasurer's approval",
          "Major spending or commitments: Board approval",
          "All approvals are documented",
        ],
      },
      {
        title: "Resource Allocation",
        list: [
          "Assistance is approved through a documented, fair process",
          "Allocation decisions are aligned with the mission of self-reliance",
          "Emergency needs are prioritized and escalated promptly",
        ],
      },
      {
        title: "Transparency & Audit",
        list: [
          "Financial records are reviewed by the Board quarterly",
          "An independent review is arranged as required",
          "Donors may request a report on how their gift was used",
        ],
      },
    ],
  },
  {
    id: "casework",
    number: "12",
    title: "Case Management & Data Protection",
    icon: "\u25E2",
    tagline: "From need to support",
    content:
      "Relate's core work is supporting individuals and families. This chapter explains the journey from first contact to sustainable outcome — and how we protect every person's information.",
    sections: [
      {
        title: "The Family Support Journey",
        stages: [
          {
            label: "Stage 1",
            name: "Intake",
            items: [
              "A need is raised through the app, a visit, or a referral",
              "A structured, compassionate assessment is completed",
              "Immediate crises are identified and prioritized",
            ],
          },
          {
            label: "Stage 2",
            name: "Triage & Assignment",
            items: [
              "The request is reviewed by the Family Support Director",
              "A case manager is assigned to own the case",
              "Urgency and support needs are agreed",
            ],
          },
          {
            label: "Stage 3",
            name: "Support & Monitoring",
            items: [
              "An individualized support plan is agreed with the family",
              "Visits, check-ins, and referrals are carried out",
              "Progress is documented in the action log",
            ],
          },
          {
            label: "Stage 4",
            name: "Conversion & Continuity",
            items: [
              "Ongoing cases are formalized as family records",
              "Long-term needs are tracked and reviewed",
              "Referrals to partners are coordinated",
            ],
          },
          {
            label: "Stage 5",
            name: "Closure & Review",
            items: [
              "The case is closed when goals are met or the family withdraws",
              "A closing review records outcomes and lessons",
              "Records are retained securely per policy",
            ],
          },
        ],
      },
      {
        title: "Intake & Assessment",
        list: [
          "Every case begins with a compassionate, structured assessment",
          "The person's own goals and strengths are recorded",
          "Immediate risks are flagged to the case manager immediately",
        ],
      },
      {
        title: "Assignment & Ownership",
        list: [
          "Each case has one named case manager",
          "The case manager is accountable for progress and follow-up",
          "Case hand-over is documented whenever a manager changes",
        ],
      },
      {
        title: "Action Logs & Reviews",
        list: [
          "Each visit and action is logged with a date and next step",
          "Cases are reviewed regularly by the Family Support Director",
          "Review findings are documented",
        ],
      },
      {
        title: "Data Protection & Confidentiality",
        list: [
          "Personal information is only accessed by those who need it",
          "Confidential information is never shared on public channels",
          "Consent is obtained before sharing information with partners",
          "Data is stored only in approved systems (records, app)",
        ],
      },
      {
        title: "Record Retention & Hand-over",
        list: [
          "Records are kept as long as required by policy and law",
          "Closed records are archived securely",
          "Hand-over to another organization follows documented consent",
        ],
      },
    ],
  },
  {
    id: "youth",
    number: "13",
    title: "Youth & Child Safeguarding",
    icon: "\u25E3",
    tagline: "Protecting young people",
    content:
      "The safety and wellbeing of children and young people are non-negotiable. Every person who works with young people must apply this chapter without exception.",
    sections: [
      {
        title: "Our Commitment",
        body: "Relate is committed to the protection of every child and young person in our care. We create safe environments, screen those who work with youth, and respond without delay to any concern.",
        highlight: true,
      },
      {
        title: "Safeguarding Principles",
        list: [
          "The welfare of the child is always the first consideration",
          "Every adult working with youth is known, trusted, and authorized",
          "Safeguarding rules apply to all activities, online and offline",
          "No adult works one-on-one with a child in an unobserved setting",
        ],
      },
      {
        title: "Supervision & Two-Adult Rule",
        list: [
          "At least two approved adults supervise all youth activities",
          "Youth events are held in open, observable spaces",
          "Transport and overnight arrangements follow written protocol",
          "Records of attendance and supervision are kept",
        ],
      },
      {
        title: "Consent & Permissions",
        list: [
          "Parental or guardian consent is obtained for youth activities",
          "Photo and video consent is obtained before any use",
          "Medical information and emergency contacts are collected in advance",
          "Activity-specific permissions (e.g., trips) are obtained separately",
        ],
      },
      {
        title: "Age-Appropriate Activities",
        list: [
          "Content and activities match the age and maturity of participants",
          "The youth quiz league and activities are supervised and fair",
          "Online engagement is moderated and public",
          "Young people are never pressured into activities",
        ],
      },
      {
        title: "Reporting Concerns",
        list: [
          "Any concern is reported immediately to the Director of Youth & Community",
          "Serious concerns are reported to the Chairman the same day",
          "No one investigates a concern alone; the Board coordinates next steps",
          "Reporting a concern in good faith is protected",
        ],
      },
    ],
  },
  {
    id: "code",
    number: "14",
    title: "Code of Conduct & Discipline",
    icon: "\u25E4",
    tagline: "How we behave",
    sections: [
      {
        title: "Purpose",
        body: "The Code of Conduct sets the standard for how everyone associated with Relate behaves — toward the people we serve, toward each other, and toward the organization itself.",
      },
      {
        title: "Expected Conduct",
        list: [
          "Treat every person with dignity, respect, and kindness",
          "Act with integrity and honesty in all dealings",
          "Protect confidentiality at all times",
          "Serve within your role and follow your lead's guidance",
          "Represent Relate positively and truthfully",
          "Refuse and report any abuse, fraud, or misconduct",
        ],
      },
      {
        title: "Using the Relate App",
        list: [
          "Post appropriate, truthful content only",
          "Respect others' privacy and boundaries",
          "Report misuse rather than responding in kind",
          "Admin and staff use their access only for authorized purposes",
        ],
      },
      {
        title: "Conflicts of Interest",
        list: [
          "Declare any personal or business interest that could influence decisions",
          "Step aside from decisions where a conflict exists",
          "Never use Relate resources for personal benefit",
        ],
      },
      {
        title: "Breaches of the Code",
        list: [
          "Minor issues are addressed through supportive intervention",
          "Serious breaches are handled under the disciplinary procedure",
          "Discipline follows the stages in Chapter 05",
          "Appeals follow the process in Chapter 16",
        ],
      },
    ],
  },
  {
    id: "onboarding",
    number: "15",
    title: "Recruitment, Onboarding & Training",
    icon: "\u25E5",
    tagline: "Joining & growing",
    sections: [
      {
        title: "Who Can Join",
        body: "Relate welcomes members, volunteers, and partners who share our values and are willing to serve with integrity.",
        list: [
          "Members commit to the mission and values of Relate",
          "Volunteers serve on teams under a lead",
          "Partners bring resources, skills, or opportunities",
        ],
      },
      {
        title: "Joining Process",
        list: [
          "Express interest through the app, an existing member, or a team lead",
          "Meet with the relevant lead or officer",
          "Complete any required forms and the confidentiality agreement",
          "Receive a role, a team, and a named point of contact",
        ],
      },
      {
        title: "Onboarding Checklist",
        list: [
          "Welcome and introduction to Relate's mission and values",
          "Clear explanation of role and responsibilities",
          "App account setup and access to the right tools",
          "Required training and safeguarding briefing",
          "A mentor or buddy for the first weeks",
        ],
      },
      {
        title: "Training & Development",
        list: [
          "Bible study and discipleship resources",
          "Skills courses and workshops",
          "Mentoring and on-the-job coaching",
          "Safeguarding and confidentiality training for relevant roles",
        ],
      },
      {
        title: "Supervision & Reviews",
        list: [
          "New members check in regularly with their lead",
          "Performance follows Chapter 05",
          "Feedback is given kindly and promptly",
        ],
      },
      {
        title: "Recognition",
        list: [
          "Service is acknowledged and celebrated",
          "Growth and milestones are recognized",
          "A thank-you goes a long way — give it freely",
        ],
      },
    ],
  },
  {
    id: "grievance",
    number: "16",
    title: "Grievance & Appeals",
    icon: "\u25D8",
    tagline: "Raising concerns",
    sections: [
      {
        title: "Purpose",
        body: "Anyone associated with Relate may raise a concern, a complaint, or a grievance without fear. This chapter sets out how concerns are heard and resolved fairly.",
      },
      {
        title: "Raising a Concern",
        list: [
          "Speak first with your team lead or line manager",
          "If the matter involves your lead, speak to the Executive Director",
          "Serious or sensitive matters may go directly to the Chairman",
        ],
      },
      {
        title: "Formal Grievance",
        list: [
          "Submit the grievance in writing or through a trusted officer",
          "Include what happened, when, and who was involved",
          "A response is given within a reasonable, stated time",
          "The process is confidential and impartial",
        ],
      },
      {
        title: "Appeals Against Decisions",
        list: [
          "Decisions under performance or discipline may be appealed",
          "The appeal is heard by a different, independent person",
          "The appeal decision is final unless new facts emerge",
        ],
      },
      {
        title: "Protection from Retaliation",
        list: [
          "No one is penalized for raising a concern in good faith",
          "Malicious or false claims are dealt with separately",
        ],
      },
    ],
  },
  {
    id: "glossary",
    number: "17",
    title: "Glossary & Quick Reference",
    icon: "\u25D5",
    tagline: "Terms & contacts",
    sections: [
      {
        title: "Key Terms",
        list: [
          "Board — the governing body of Relate",
          "Officer — a staff lead managing a function (Finance, Records, Communications, IT, Events)",
          "Team — a group of members/volunteers delivering field work",
          "Case Manager — the named person who owns a family case",
          "Family Record — the formal record of a family's support journey",
          "POP — Proof of Payment submitted with a fee payment",
          "Sponsorship — sustainable funding or opportunity provided by a partner",
          "Streak — consecutive days of prayer or reading completed",
        ],
      },
      {
        title: "Positions at a Glance",
        list: [
          "Board: Chairman, Vice Chairman, Secretary, Treasurer, Directors, Non-executive Members",
          "Officers: Executive Director, Finance & Accounts, Records & Data, Communications & PR, IT & Systems, Events & Logistics",
          "Teams: Family Liaison, Youth & Children's, Prayer & Spiritual Life, Skills & Mentorship, Community Outreach",
          "Partners: Sponsors, Mentors, Community Partners",
        ],
      },
      {
        title: "Sections at a Glance",
        list: [
          "Chapters 00–02 — Welcome, identity, principles",
          "Chapters 03–04 — Governance and roles",
          "Chapters 05–06 — Performance and programs",
          "Chapters 07–08 — Why we help, policies",
          "Chapters 09–11 — Structure, meetings, finance",
          "Chapters 12–16 — Casework, safeguarding, conduct, onboarding, grievances",
          "Chapter 17 — Glossary",
        ],
      },
    ],
  },
];

export const navGroups: { title: string; ids: string[] }[] = [
  { title: "Getting Started", ids: ["welcome"] },
  { title: "Who We Are", ids: ["identity", "principles", "philosophy"] },
  {
    title: "Leadership & Governance",
    ids: ["governance", "roles", "structure"],
  },
  { title: "Our Work", ids: ["programs", "casework", "youth"] },
  { title: "Finance & Events", ids: ["finance", "meetings"] },
  {
    title: "Conduct & Accountability",
    ids: ["performance", "policies", "code", "grievance"],
  },
  { title: "People & Growth", ids: ["onboarding"] },
  { title: "Reference", ids: ["glossary"] },
];

export const badgeStyles: Record<ManualBadge, { bg: string; text: string }> = {
  Board: { bg: "#fbf3d9", text: "#92400e" },
  Officer: { bg: "#d4eef5", text: "#0fa3c4" },
  Team: { bg: "#ede9fe", text: "#6d28d9" },
  Partner: { bg: "#fee2e2", text: "#b91c1c" },
};
