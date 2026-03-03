const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hashText = (value = "") => {
  const text = `${value}`;
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const getMatchLevel = (overallScore) => {
  if (overallScore >= 85) {
    return {
      label: "Excellent Match",
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-100 text-emerald-700",
    };
  }

  if (overallScore >= 70) {
    return {
      label: "Good Match",
      colorClass: "text-blue-600",
      bgClass: "bg-blue-100 text-blue-700",
    };
  }

  return {
    label: "Potential Match",
    colorClass: "text-amber-600",
    bgClass: "bg-amber-100 text-amber-700",
  };
};

const criterionMeta = [
  { key: "skills", label: "Skills Alignment", icon: "psychology" },
  { key: "experience", label: "Experience Fit", icon: "work_history" },
  { key: "domain", label: "Domain Knowledge", icon: "hub" },
  { key: "education", label: "Education & Cert", icon: "school" },
  { key: "communication", label: "Communication", icon: "chat" },
];

const createCriteriaScores = (seed, overallScore) =>
  criterionMeta.map((criterion, index) => {
    const criterionSeed = hashText(`${seed}-${criterion.key}-${index}`);
    const drift = (criterionSeed % 15) - 7;
    const score = clamp(overallScore + drift, 48, 99);

    return {
      ...criterion,
      score,
      weight: 20,
      insight:
        score >= 80
          ? `Strong signal for ${criterion.label.toLowerCase()}.`
          : `Needs improvement in ${criterion.label.toLowerCase()}.`,
    };
  });

const selectMatchedSkills = (skills, seed) => {
  if (!Array.isArray(skills) || skills.length === 0) {
    return [];
  }

  const matched = skills.filter((skill, index) => {
    const skillName = skill?.name || "";
    const score = hashText(`${seed}-${skillName}-${index}`) % 100;
    return score >= 35;
  });

  if (matched.length > 0) {
    return matched.map((skill) => skill?.name).filter(Boolean);
  }

  return [skills[0]?.name].filter(Boolean);
};

export const buildMockMatchingScore = ({ job, resume }) => {
  const seed = `${job?.id || "job"}-${resume?.id || "resume"}`;
  const base = 66 + (hashText(seed) % 27);
  const overallScore = clamp(base, 52, 97);

  const criteriaScores = createCriteriaScores(seed, overallScore);

  const jobSkills = Array.isArray(job?.skills) ? job.skills : [];
  const matchedSkills = selectMatchedSkills(jobSkills, seed);
  const missingSkills = jobSkills
    .map((skill) => skill?.name)
    .filter(Boolean)
    .filter((skillName) => !matchedSkills.includes(skillName))
    .slice(0, 5);

  const strengths = [
    "Resume structure is clear and ATS-friendly.",
    "Relevant experience is highlighted with measurable outcomes.",
    "Core technical profile aligns with the role expectations.",
  ];

  const recommendations = [
    missingSkills.length
      ? `Add stronger evidence for: ${missingSkills.join(", ")}.`
      : "Keep emphasizing role-specific skills with concrete project impact.",
    "Quantify achievements with numbers to improve recruiter confidence.",
    "Tailor summary and headline to match job keywords more closely.",
  ];

  const matchLevel = getMatchLevel(overallScore);

  return {
    overallScore,
    matchLevel,
    summary:
      overallScore >= 85
        ? "Your resume has strong alignment with this position and is likely to pass early screening."
        : overallScore >= 70
        ? "Your resume is a good fit. A few targeted updates can improve competitiveness."
        : "Your resume shows potential, but several key areas should be strengthened before applying.",
    criteriaScores,
    matchedSkills,
    missingSkills,
    strengths,
    recommendations,
  };
};
