/**
 * Pure function: transforms ResumeDetailResponse -> HTML string for Tiptap editor.
 * No side effects, no hooks, no DOM access.
 */

// ── Enum display maps ──────────────────────────────────────────────

const DEGREE_TYPE = {
  HIGH_SCHOOL: 'High School',
  ASSOCIATE: 'Associate',
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  DOCTORATE: 'Doctorate',
  CERTIFICATE: 'Certificate',
};

const EMPLOYMENT_TYPE = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  SELF_EMPLOYED: 'Self-employed',
  FREELANCE: 'Freelance',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  APPRENTICESHIP: 'Apprenticeship',
  SEASONAL: 'Seasonal',
};

const WORKING_MODEL = {
  REMOTE: 'Remote',
  ONSITE: 'Onsite',
  HYBRID: 'Hybrid',
};

const PROJECT_TYPE = {
  PERSONAL: 'Personal',
  ACADEMIC: 'Academic',
  PROFESSIONAL: 'Professional',
  OPEN_SOURCE: 'Open Source',
  FREELANCE: 'Freelance',
};

// ── Inline style constants ─────────────────────────────────────────

const STYLES = {
  h1: 'color: #2551A5; font-size: 28px; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;',
  h2Title: 'color: #2551A5; font-size: 18px; font-weight: bold; margin-bottom: 12px;',
  h2Section: 'color: #2551A5; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;',
  hr: 'border-color: #2551A5; border-width: 1.5px; margin: 4px 0 8px 0;',
  hrFirst: 'border-color: #2551A5; border-width: 1.5px; margin: 16px 0 8px 0;',
  contactP: 'font-size: 14px; line-height: 1.4;',
  ul: 'font-size: 14px; line-height: 1.6; padding-left: 24px;',
  ulCompact: 'font-size: 14px; padding-left: 24px;',
  subHeader: 'font-size: 14px;',
  bodyText: 'font-size: 14px; text-align: justify;',
  bodyTextPlain: 'font-size: 14px;',
};

// ── Helpers ────────────────────────────────────────────────────────

const hasValue = (v) => v !== null && v !== undefined && v !== '';

/**
 * Format ISO date string "2022-08-15" -> "Aug 2022"
 */
const formatDate = (dateStr) => {
  if (!hasValue(dateStr)) return null;
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  } catch {
    return null;
  }
};

/**
 * Format a date range with isCurrent support.
 */
const formatDateRange = (startDate, endDate, isCurrent) => {
  const start = formatDate(startDate);
  if (!start) return '';
  if (isCurrent) return `${start} - Present`;
  const end = formatDate(endDate);
  if (!end) return start;
  return `${start} - ${end}`;
};

const sortByOrder = (arr) =>
  [...(arr || [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

const escapeHtml = (str) => {
  if (!hasValue(str)) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Build a single-line entry header: [left bold text]    [right date text]
 * Uses custom EntryHeader Tiptap node for flex layout.
 */
const buildEntryHeaderLine = (leftHtml, dateRange) => {
  const dateAttr = dateRange ? ` data-date="${escapeHtml(dateRange)}"` : '';
  return `<div data-type="entryHeader"${dateAttr}><strong>${leftHtml}</strong></div>`;
};

// ── Section builders ───────────────────────────────────────────────

const buildHeader = (data) => {
  const parts = [];

  if (hasValue(data.fullName)) {
    parts.push(`<h1 style="${STYLES.h1}">${escapeHtml(data.fullName)}</h1>`);
  }
  if (hasValue(data.jobTitle)) {
    parts.push(`<h2 style="${STYLES.h2Title}">${escapeHtml(data.jobTitle)}</h2>`);
  }

  const contactLines = [];
  if (hasValue(data.phoneInResume)) {
    contactLines.push(`<strong>Phone:</strong> ${escapeHtml(data.phoneInResume)}`);
  }
  if (hasValue(data.emailInResume)) {
    contactLines.push(`<strong>Email:</strong> ${escapeHtml(data.emailInResume)}`);
  }
  if (hasValue(data.addressInResume)) {
    contactLines.push(`<strong>Address:</strong> ${escapeHtml(data.addressInResume)}`);
  }
  if (hasValue(data.portfolioLink)) {
    contactLines.push(
      `<strong>Website:</strong> <a href="${escapeHtml(data.portfolioLink)}">${escapeHtml(data.portfolioLink)}</a>`
    );
  }
  if (hasValue(data.githubLink)) {
    contactLines.push(
      `<strong>GitHub:</strong> <a href="${escapeHtml(data.githubLink)}">${escapeHtml(data.githubLink)}</a>`
    );
  }
  if (hasValue(data.linkedinLink)) {
    contactLines.push(
      `<strong>LinkedIn:</strong> <a href="${escapeHtml(data.linkedinLink)}">${escapeHtml(data.linkedinLink)}</a>`
    );
  }

  if (contactLines.length > 0) {
    parts.push(`<p style="${STYLES.contactP}">${contactLines.join('<br>')}</p>`);
  }

  return parts.join('\n');
};

const buildSummary = (summary) => {
  if (!hasValue(summary)) return '';

  return [
    `<h2 style="${STYLES.h2Section}">SUMMARY</h2>`,
    `<hr style="${STYLES.hr}">`,
    `<p style="${STYLES.bodyText}">${escapeHtml(summary)}</p>`,
  ].join('\n');
};

const buildSkills = (skillGroups) => {
  if (!Array.isArray(skillGroups) || skillGroups.length === 0) return '';
  const sorted = sortByOrder(skillGroups);

  const items = sorted
    .filter((g) => hasValue(g.name) && Array.isArray(g.skills) && g.skills.length > 0)
    .map((g) => {
      const skillNames = g.skills.map((s) => escapeHtml(s.skillName)).join(', ');
      return `<li><strong>${escapeHtml(g.name)}:</strong> ${skillNames}</li>`;
    });

  if (items.length === 0) return '';

  return [
    `<h2 style="${STYLES.h2Section}">SKILLS</h2>`,
    `<hr style="${STYLES.hr}">`,
    `<ul style="${STYLES.ul}">${items.join('\n')}</ul>`,
  ].join('\n');
};

const buildEducation = (educations) => {
  if (!Array.isArray(educations) || educations.length === 0) return '';
  const sorted = sortByOrder(educations);

  const entries = sorted.map((edu) => {
    const lines = [];
    const dateRange = formatDateRange(edu.startDate, edu.endDate, edu.isCurrent);

    if (hasValue(edu.institution)) {
      lines.push(buildEntryHeaderLine(escapeHtml(edu.institution), dateRange));
    }

    const bullets = [];
    const degreeParts = [];
    if (hasValue(edu.degree) && DEGREE_TYPE[edu.degree]) {
      degreeParts.push(DEGREE_TYPE[edu.degree]);
    }
    if (hasValue(edu.majorField)) {
      degreeParts.push(escapeHtml(edu.majorField));
    }
    if (degreeParts.length > 0) {
      bullets.push(`<li>${degreeParts.join(' - ')}</li>`);
    }
    if (hasValue(edu.gpa)) {
      bullets.push(`<li>GPA: ${edu.gpa}</li>`);
    }

    if (bullets.length > 0) {
      lines.push(`<ul style="${STYLES.ulCompact}">${bullets.join('\n')}</ul>`);
    }

    return lines.join('\n');
  });

  return [
    `<h2 style="${STYLES.h2Section}">EDUCATION</h2>`,
    `<hr style="${STYLES.hr}">`,
    ...entries,
  ].join('\n');
};

const buildExperience = (experiences) => {
  if (!Array.isArray(experiences) || experiences.length === 0) return '';
  const sorted = sortByOrder(experiences);

  const entries = sorted.map((exp) => {
    const lines = [];
    const parentDateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);

    // Render details (roles under this company)
    const details = sortByOrder(exp.details || []);

    if (details.length === 0) {
      // No details - just company + date
      lines.push(buildEntryHeaderLine(escapeHtml(exp.company), parentDateRange));
    } else {
      details.forEach((detail) => {
        // Build qualifiers
        const qualifiers = [];
        if (hasValue(exp.workingModel) && WORKING_MODEL[exp.workingModel]) {
          qualifiers.push(WORKING_MODEL[exp.workingModel]);
        }
        if (hasValue(exp.employmentType) && EMPLOYMENT_TYPE[exp.employmentType]) {
          qualifiers.push(EMPLOYMENT_TYPE[exp.employmentType]);
        }
        const qualifierStr = qualifiers.length > 0 ? ` (${qualifiers.join(', ')})` : '';

        // Date: detail-level or fallback to parent
        const detailDateRange = formatDateRange(
          detail.startDate || exp.startDate,
          detail.endDate || exp.endDate,
          detail.isCurrent ?? exp.isCurrent
        ) || parentDateRange;

        // Format: Company - JobTitle (qualifier)          Date
        const titleParts = [escapeHtml(exp.company)];
        if (hasValue(detail.title)) {
          titleParts.push(`${escapeHtml(detail.title)}${qualifierStr}`);
        }
        lines.push(buildEntryHeaderLine(titleParts.join(' - '), detailDateRange));

        // Description
        if (hasValue(detail.description)) {
          lines.push(`<p style="${STYLES.bodyText}">${escapeHtml(detail.description)}</p>`);
        }

        // Technology skills
        if (Array.isArray(detail.skills) && detail.skills.length > 0) {
          const skillNames = detail.skills.map((s) => escapeHtml(s.skillName)).join(', ');
          lines.push(
            `<ul style="${STYLES.ulCompact}"><li><strong>Technology:</strong> ${skillNames}</li></ul>`
          );
        }
      });
    }

    return lines.join('\n');
  });

  return [
    `<h2 style="${STYLES.h2Section}">WORK EXPERIENCE</h2>`,
    `<hr style="${STYLES.hr}">`,
    ...entries,
  ].join('\n');
};

const buildProjects = (projects) => {
  if (!Array.isArray(projects) || projects.length === 0) return '';
  const sorted = sortByOrder(projects);

  const entries = sorted.map((proj) => {
    const lines = [];
    const dateRange = formatDateRange(proj.startDate, proj.endDate, proj.isCurrent);

    // Title line: [Project Name] - [Project Type]          [Date]
    const titleParts = [escapeHtml(proj.title)];
    if (hasValue(proj.projectType) && PROJECT_TYPE[proj.projectType]) {
      titleParts.push(PROJECT_TYPE[proj.projectType]);
    }
    lines.push(buildEntryHeaderLine(titleParts.join(' - '), dateRange));

    if (hasValue(proj.description)) {
      lines.push(`<p style="${STYLES.bodyText}">${escapeHtml(proj.description)}</p>`);
    }

    const bullets = [];
    if (hasValue(proj.position)) {
      bullets.push(`<li><strong>Position:</strong> ${escapeHtml(proj.position)}</li>`);
    }
    if (hasValue(proj.teamSize)) {
      bullets.push(`<li><strong>Team Size:</strong> ${proj.teamSize}</li>`);
    }
    if (Array.isArray(proj.skills) && proj.skills.length > 0) {
      const skillNames = proj.skills.map((s) => escapeHtml(s.skillName)).join(', ');
      bullets.push(`<li><strong>Technology:</strong> ${skillNames}</li>`);
    }
    if (hasValue(proj.projectUrl)) {
      bullets.push(
        `<li><strong>URL:</strong> <a href="${escapeHtml(proj.projectUrl)}">${escapeHtml(proj.projectUrl)}</a></li>`
      );
    }

    if (bullets.length > 0) {
      lines.push(`<ul style="${STYLES.ulCompact}">${bullets.join('\n')}</ul>`);
    }

    return lines.join('\n');
  });

  return [
    `<h2 style="${STYLES.h2Section}">PROJECTS</h2>`,
    `<hr style="${STYLES.hr}">`,
    ...entries,
  ].join('\n');
};

const buildCertifications = (certifications) => {
  if (!Array.isArray(certifications) || certifications.length === 0) return '';

  const entries = certifications.map((cert) => {
    const lines = [];

    if (hasValue(cert.name)) {
      lines.push(`<p><strong>${escapeHtml(cert.name)}</strong></p>`);
    }
    if (hasValue(cert.issuer)) {
      lines.push(`<p style="${STYLES.bodyTextPlain}">Issued by: ${escapeHtml(cert.issuer)}</p>`);
    }
    if (hasValue(cert.description)) {
      lines.push(`<p style="${STYLES.bodyTextPlain}">${escapeHtml(cert.description)}</p>`);
    }
    if (hasValue(cert.credentialUrl)) {
      lines.push(
        `<p style="${STYLES.bodyTextPlain}"><a href="${escapeHtml(cert.credentialUrl)}">View Credential</a></p>`
      );
    }

    return lines.join('\n');
  });

  return [
    `<h2 style="${STYLES.h2Section}">CERTIFICATIONS</h2>`,
    `<hr style="${STYLES.hr}">`,
    ...entries,
  ].join('\n');
};

// ── Main export ────────────────────────────────────────────────────

/**
 * Transforms ResumeDetailResponse data into a formatted HTML string
 * for use as Tiptap editor initial content.
 *
 * @param {object} data - ResumeDetailResponse from the API
 * @returns {string} HTML string
 */
export const buildResumeHtml = (data) => {
  if (!data) return '';

  const sections = [
    buildHeader(data),
    buildSummary(data.summary),
    buildSkills(data.skillGroups),
    buildEducation(data.educations),
    buildExperience(data.experiences),
    buildProjects(data.projects),
    buildCertifications(data.certifications),
  ].filter(Boolean);

  return sections.join('\n');
};

export default buildResumeHtml;
