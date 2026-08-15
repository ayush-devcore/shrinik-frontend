export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface TeamGroup {
  id: string;
  name: string;
  category:
    | "core"
    | "technical"
    | "creative"
    | "management"
    | "cultural";
  members: TeamMember[];
  standBy?: TeamMember[];
}

export const teamGroups: TeamGroup[] = [
  // =========================================================
  // CORE TEAM
  // =========================================================

  {
    id: "core-team",
    name: "Core Team",
    category: "core",

    members: [
      {
        id: "core-vibhor-sharma",
        name: "Vibhor Sharma",
        role: "President",
      },
      {
        id: "core-prajjval-verma",
        name: "Prajjval Verma",
        role: "Vice President",
      },
      {
        id: "core-anushka-shukla",
        name: "Anushka Shukla",
        role: "Organizer",
      },
      {
        id: "core-siddhant-singh",
        name: "Siddhant Singh",
        role: "Secretary",
      },
      {
        id: "core-kritika",
        name: "Kritika",
        role: "Joint Secretary",
      },
      {
        id: "core-gaurang-aggarwal",
        name: "Gaurang Aggarwal",
        role: "Student Coordinator",
      },
    ],
  },

  // =========================================================
  // TECH TEAM
  // =========================================================

  {
    id: "tech-team",
    name: "Tech Team",
    category: "technical",

    members: [
      {
        id: "tech-palak-chadha",
        name: "Palak Chadha",
        role: "Director",
      },
      {
        id: "tech-altamish",
        name: "Altamish",
        role: "Co-Director",
      },
      {
        id: "tech-aashish-pandey",
        name: "Aashish Pandey",
        role: "Web Master",
      },
      {
        id: "tech-anurag-singh",
        name: "Anurag Singh",
        role: "Member",
      },
      {
        id: "tech-aabgeen",
        name: "Aabgeen",
        role: "Member",
      },
      {
        id: "tech-ashwani",
        name: "Ashwani",
        role: "Member",
      },
      {
        id: "tech-manjot-kaur",
        name: "Manjot Kaur",
        role: "Member",
      },
      {
        id: "tech-damini",
        name: "Damini",
        role: "Member",
      },
      {
        id: "tech-ayush-bhatnagar",
        name: "Ayush Bhatnagar",
        role: "Member",
      },
      {
        id: "tech-tushar-sharma",
        name: "Tushar Sharma",
        role: "Member",
      },
    ],

    standBy: [
      {
        id: "tech-saksham-kaushik",
        name: "Saksham Kaushik",
        role: "Stand-by",
      },
      {
        id: "tech-akshat-mishra",
        name: "Akshat Mishra",
        role: "Stand-by",
      },
      {
        id: "tech-ojasv",
        name: "Ojasv",
        role: "Stand-by",
      },
      {
        id: "tech-dev-agarwal",
        name: "Dev Agarwal",
        role: "Stand-by",
      },
    ],
  },

  // =========================================================
  // DESIGN & MEDIA TEAM
  // =========================================================

  {
    id: "design-media-team",
    name: "Design & Media Team",
    category: "creative",

    members: [
      {
        id: "design-khyati-prakash",
        name: "Khyati Prakash",
        role: "Director",
      },
      {
        id: "design-ujjwal-maheshwari",
        name: "Ujjwal Maheshwari",
        role: "Campaign Expert",
      },
      {
        id: "design-diya-tyagi",
        name: "Diya Tyagi",
        role: "Co-Director",
      },
      {
        id: "design-rajeshwari-aggarwal",
        name: "Rajeshwari Aggarwal",
        role: "Member",
      },
      {
        id: "design-stuti-jain",
        name: "Stuti Jain",
        role: "Member",
      },
      {
        id: "design-sonia",
        name: "Sonia",
        role: "Member",
      },
    ],

    standBy: [
      {
        id: "design-aayush-srivastava",
        name: "Aayush Srivastava",
        role: "Stand-by",
      },
    ],
  },

  // =========================================================
  // EDITORIAL TEAM
  // =========================================================

  {
    id: "editorial-team",
    name: "Editorial Team",
    category: "creative",

    members: [
      {
        id: "editorial-shruti-dixit",
        name: "Shruti Dixit",
        role: "Director",
      },
      {
        id: "editorial-prateek-sharma",
        name: "Prateek Sharma",
        role: "Co-Director",
      },
      {
        id: "editorial-mantra-srivastava",
        name: "Mantra Srivastava",
        role: "Member",
      },
      {
        id: "editorial-itisha-gupta",
        name: "Itisha Gupta",
        role: "Member",
      },
      {
        id: "editorial-pratap",
        name: "Pratap",
        role: "Member",
      },
      {
        id: "editorial-parikshita-agrawal",
        name: "Parikshita Agrawal",
        role: "Member",
      },
      {
        id: "editorial-anshika",
        name: "Anshika",
        role: "Member",
      },
    ],

    standBy: [
      {
        id: "editorial-jigyasa",
        name: "Jigyasa",
        role: "Stand-by",
      },
      {
        id: "editorial-riya",
        name: "Riya",
        role: "Stand-by",
      },
    ],
  },

  // =========================================================
  // PR TEAM
  // =========================================================

  {
    id: "pr-team",
    name: "PR Team",
    category: "management",

    members: [
      {
        id: "pr-abhinav-raj",
        name: "Abhinav Raj",
        role: "Director",
      },
      {
        id: "pr-ashwani-mishra",
        name: "Ashwani Mishra",
        role: "Co-Director",
      },
      {
        id: "pr-nitya-reja",
        name: "Nitya Reja",
        role: "Expert",
      },
      {
        id: "pr-tanishka-sharma",
        name: "Tanishka Sharma",
        role: "Expert",
      },
      {
        id: "pr-ajita-srivastava",
        name: "Ajita Srivastava",
        role: "Member",
      },
      {
        id: "pr-avisha-saluja",
        name: "Avisha Saluja",
        role: "Member",
      },
      {
        id: "pr-jigyasha-rath",
        name: "Jigyasha Rath",
        role: "Member",
      },
      {
        id: "pr-nishtha-bhardwaj",
        name: "Nishtha Bhardwaj",
        role: "Member",
      },
      {
        id: "pr-rimjhim",
        name: "Rimjhim",
        role: "Member",
      },
      {
        id: "pr-kirti-goyal",
        name: "Kirti Goyal",
        role: "Member",
      },
      {
        id: "pr-abhishek",
        name: "Abhishek",
        role: "Member",
      },
    ],
  },

  // =========================================================
  // SOCIAL MEDIA TEAM
  // =========================================================

  {
    id: "social-media-team",
    name: "Social Media Team",
    category: "creative",

    members: [
      {
        id: "social-satyam-singh",
        name: "Satyam Singh",
        role: "Director",
      },
      {
        id: "social-ayush",
        name: "Ayush",
        role: "Co-Director",
      },
      {
        id: "social-deepesh-ojha",
        name: "Deepesh Ojha",
        role: "Member",
      },
      {
        id: "social-tanu-mishra",
        name: "Tanu Mishra",
        role: "Member",
      },
      {
        id: "social-sarthak-singh",
        name: "Sarthak Singh",
        role: "Member",
      },
      {
        id: "social-sharad-kumar",
        name: "Sharad Kumar",
        role: "Member",
      },
      {
        id: "social-anni-rai",
        name: "Anni Rai",
        role: "Member",
      },
      {
        id: "social-samman-sikhawar",
        name: "Samman Sikhawar",
        role: "Member",
      },
      {
        id: "social-adarsh-verma",
        name: "Adarsh Verma",
        role: "Member",
      },
    ],

    standBy: [
      {
        id: "social-shambhavi-singh",
        name: "Shambhavi Singh",
        role: "Stand-by",
      },
    ],
  },

  // =========================================================
  // EVENT MANAGEMENT TEAM
  // =========================================================

  {
    id: "event-management-team",
    name: "Event Management Team",
    category: "management",

    members: [
      {
        id: "event-abhay-shukla",
        name: "Abhay Shukla",
        role: "Head",
      },
      {
        id: "event-tanish-solanki",
        name: "Tanish Solanki",
        role: "Co-Head",
      },
      {
        id: "event-noorpreet",
        name: "Noorpreet",
        role: "Co-Head",
      },
      {
        id: "event-vishishta-shukla",
        name: "Vishishta Shukla",
        role: "Member",
      },
      {
        id: "event-vaishnavi-sinha",
        name: "Vaishnavi Sinha",
        role: "Member",
      },
      {
        id: "event-adarsh-pandey",
        name: "Adarsh Pandey",
        role: "Member",
      },
      {
        id: "event-vedansh-shukla",
        name: "Vedansh Shukla",
        role: "Member",
      },
      {
        id: "event-roonit-sharma",
        name: "Roonit Sharma",
        role: "Member",
      },
      {
        id: "event-bhumika-bansal",
        name: "Bhumika Bansal",
        role: "Member",
      },
      {
        id: "event-shivam-shukla",
        name: "Shivam Shukla",
        role: "Member",
      },
      {
        id: "event-sreyesh",
        name: "Sreyesh",
        role: "Member",
      },
      {
        id: "event-anoushka-verma",
        name: "Anoushka Verma",
        role: "Member",
      },
    ],

    standBy: [
      {
        id: "event-eklavya-verma",
        name: "Eklavya Verma",
        role: "Stand-by",
      },
      {
        id: "event-vansh-gupta",
        name: "Vansh Gupta",
        role: "Stand-by",
      },
    ],
  },

  // =========================================================
  // DANCE AVENUE
  // =========================================================

  {
    id: "dance-avenue",
    name: "Dance Avenue",
    category: "cultural",

    members: [
      {
        id: "dance-namrata-singh",
        name: "Namrata Singh",
        role: "Western Lead",
      },
      {
        id: "dance-shambhavi-tewari",
        name: "Shambhavi Tewari",
        role: "Semi-Classical Lead",
      },
      {
        id: "dance-sakshi",
        name: "Sakshi",
        role: "Member",
      },
      {
        id: "dance-avni",
        name: "Avni",
        role: "Member",
      },
      {
        id: "dance-agam-raj",
        name: "Agam Raj",
        role: "Member",
      },
      {
        id: "dance-shristi-pradeep",
        name: "Shristi Pradeep",
        role: "Member",
      },
      {
        id: "dance-atifa-zareef",
        name: "Atifa Zareef",
        role: "Member",
      },
      {
        id: "dance-aayushi-sharma",
        name: "Aayushi Sharma",
        role: "Member",
      },
      {
        id: "dance-meghna-pandey",
        name: "Meghna Pandey",
        role: "Member",
      },
      {
        id: "dance-divyanshi-agrahari",
        name: "Divyanshi Agrahari",
        role: "Member",
      },
    ],
  },

  // =========================================================
  // MUSIC AVENUE
  // =========================================================

  {
    id: "music-avenue",
    name: "Music Avenue",
    category: "cultural",

    members: [
      {
        id: "music-bhavya-gupta",
        name: "Bhavya Gupta",
        role: "Lead",
      },
      {
        id: "music-prasiddhi-dwivedi",
        name: "Prasiddhi Dwivedi",
        role: "Co-Lead",
      },
      {
        id: "music-ruchi-mishra",
        name: "Ruchi Mishra",
        role: "Co-Lead",
      },

      // Vocalists

      {
        id: "music-shubh",
        name: "Shubh",
        role: "Vocalist",
      },
      {
        id: "music-satakshi",
        name: "Satakshi",
        role: "Vocalist",
      },
      {
        id: "music-kanishk",
        name: "Kanishk",
        role: "Vocalist",
      },
      {
        id: "music-prakhar",
        name: "Prakhar",
        role: "Vocalist",
      },
      {
        id: "music-ankit",
        name: "Ankit",
        role: "Vocalist",
      },

      // Instrumentalists

      {
        id: "music-adarsh",
        name: "Adarsh",
        role: "Congo",
      },
      {
        id: "music-devanshi",
        name: "Devanshi",
        role: "Ukulele",
      },
      {
        id: "music-aryan",
        name: "Aryan",
        role: "Guitarist",
      },
    ],
  },
];