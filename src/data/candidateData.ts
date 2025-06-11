
export const HARDCODED_CANDIDATE = {
  fullName: "Aditya Joshi" as const,
  email: "adi@sqano.com",
  phoneNumber: "+91 XXXXXXXXX",
  skills: "Python, Javascript",
  experience: "10+"
};

export type CandidateDetailsType = typeof HARDCODED_CANDIDATE;
