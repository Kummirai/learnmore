export type LegalSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const PRIVACY_DOC: LegalDoc = {
  title: "Privacy Policy",
  updated: "Last updated: October 2026",
  intro:
    "This policy explains what RelateWorld collects, why we collect it, and the choices you have. RelateWorld is a community app for church clubs, volunteering, giving, and prayer — we only ask for what that takes.",
  sections: [
    {
      heading: "What we collect",
      body: "We collect the information you give us and the basics needed to run the app:",
      bullets: [
        "Account details — your name, email, and profile photo when you sign up.",
        "Club membership — the club you join and your membership reference.",
        "Community content — prayer requests, help requests, comments, event RSVPs, and volunteer office applications you submit.",
        "Giving records — payment and banking details you provide for pledges and donations (stored securely; never sold).",
        "Device basics — push notification tokens and app version so we can reach you about your own activity.",
      ],
    },
    {
      heading: "How we use it",
      body: "We use your information to operate the community you joined:",
      bullets: [
        "To show your membership, club, and activity to you and club admins.",
        "To notify you about replies, events, payments, and volunteer applications you are part of.",
        "To process and record giving, and produce financial reports for admins.",
        "To keep the service safe and fix problems.",
      ],
    },
    {
      heading: "Who can see it",
      body: "Your content is visible to the community as designed — for example, your prayer request is visible to members, and your membership appears in your club. Club and site admins can see the content they need to run the community. We do not sell your personal information.",
    },
    {
      heading: "Your choices",
      body: "You can:",
      bullets: [
        "Pray anonymously on public prayer walls — your name stays hidden.",
        "Turn notifications on or off at any time in the app's Settings.",
        "Request a copy of your data or ask us to delete your account by contacting the RelateWorld team.",
      ],
    },
    {
      heading: "Contact",
      body: "Questions about this policy? Reach the RelateWorld team through the app's Settings → Report App Issue, via info@relateworld.org, or through your club leadership.",
    },
  ],
};

export const TERMS_DOC: LegalDoc = {
  title: "Terms of Service",
  updated: "Last updated: October 2026",
  intro:
    "These terms are the agreement between you and RelateWorld for using the service. By creating an account or using the community features, you agree to them.",
  sections: [
    {
      heading: "Using RelateWorld",
      body: "RelateWorld is for genuine community use. When you use it you agree to:",
      bullets: [
        "Provide accurate information and keep your login secure.",
        "Use the community respectfully — no harassment, spam, or unlawful content.",
        "Only post content you have the right to share.",
      ],
    },
    {
      heading: "Club membership",
      body: "Joining a club creates a membership record tied to your account. Members belong to one active club at a time; moving up an age-based ladder is handled by your club leadership. Club leaders and admins manage memberships, roles, and applications.",
    },
    {
      heading: "Volunteer offices & giving",
      body: "Volunteer office applications are reviewed by admins and may be approved or declined. Giving, pledges, and payments are processed for the community's purposes; payment records are kept for financial transparency. Consult your club or tax adviser for deductibility questions.",
    },
    {
      heading: "Your content",
      body: "You keep ownership of what you post. By posting, you give RelateWorld the permission needed to display and operate that content within the service for the community it was meant for.",
    },
    {
      heading: "Accounts & removal",
      body: "You can stop using RelateWorld at any time and request account deletion. We may suspend accounts that violate these terms or misuse the community.",
    },
    {
      heading: "Contact",
      body: "Questions about these terms? Reach the RelateWorld team through the app's Settings → Report App Issue, via info@relateworld.org, or through your club leadership.",
    },
  ],
};
