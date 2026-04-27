const LABEL_KEYWORDS = [
  "Skills and Competencies Gained",
  "Skills & Competencies Gained",
  "Roles & Responsibilities",
  "Role & Responsibility",
  "Key Responsibilities",
  "Tech Stack",
  "Technology",
  "Technologies",
  "Tools",
  "Skills",
  "Video Demo",
  "Demo",
  "Website Link",
  "Website",
  "Repository",
  "GitHub",
  "URL",
  "Link",
  "Position",
  "Role",
  "Responsibilities",
  "Achievements",
  "Project",
];

const URL_REGEX = /(https?:\/\/[^\s,]+[^\s,.;:)\]])/gi;

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const linkifyEscaped = (escapedText) =>
  escapedText.replace(URL_REGEX, (url) => {
    const trimmed = url.replace(/[.,;:)\]]+$/, "");
    const trail = url.slice(trimmed.length);
    return `<a href="${trimmed}" target="_blank" rel="noopener noreferrer">${trimmed}</a>${trail}`;
  });

const looksLikeHtml = (str) => /<\/?(p|ul|ol|li|strong|em|u|br|a|div|span)\b/i.test(str);

const buildLabelRegex = () => {
  const sorted = [...LABEL_KEYWORDS].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\s*:\\s*`, "gi");
};

export const formatDescriptionToHtml = (raw) => {
  if (raw == null) return "";
  const text = String(raw).trim();
  if (!text) return "";
  if (looksLikeHtml(text)) return text;

  const labelRegex = buildLabelRegex();
  const matches = [];
  let m;
  while ((m = labelRegex.exec(text)) !== null) {
    const labelStart = m.index + m[0].indexOf(m[1]);
    matches.push({
      labelStart,
      contentStart: m.index + m[0].length,
      label: m[1],
    });
  }

  if (matches.length === 0) {
    const escaped = linkifyEscaped(escapeHtml(text));
    return `<p>${escaped}</p>`;
  }

  const intro = text.slice(0, matches[0].labelStart).trim().replace(/[•·▪◦\-]+\s*$/, "").trim();
  const items = matches.map((match, idx) => {
    const end = idx + 1 < matches.length ? matches[idx + 1].labelStart : text.length;
    const value = text.slice(match.contentStart, end).trim().replace(/[•·▪◦]+\s*$/, "").trim();
    const label = escapeHtml(match.label);
    const valueHtml = linkifyEscaped(escapeHtml(value));
    return `<li><strong>${label}:</strong> ${valueHtml}</li>`;
  });

  const introHtml = intro ? `<p>${linkifyEscaped(escapeHtml(intro))}</p>` : "";
  return `${introHtml}<ul>${items.join("")}</ul>`;
};

export default formatDescriptionToHtml;
