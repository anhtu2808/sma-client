import { Fragment } from "react";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const renderHighlightedText = (text = "", highlights = [], keyPrefix = "text") => {
  if (!highlights.length) {
    return text;
  }

  const normalizedHighlights = highlights.filter(Boolean);
  if (!normalizedHighlights.length) {
    return text;
  }

  const pattern = normalizedHighlights.map((term) => escapeRegExp(term)).join("|");
  const matcher = new RegExp(`(${pattern})`, "gi");

  return text.split(matcher).map((part, index) => {
    const shouldHighlight = normalizedHighlights.some(
      (term) => term.toLowerCase() === part.toLowerCase()
    );

    if (!shouldHighlight) {
      return <Fragment key={`${keyPrefix}-${index}`}>{part}</Fragment>;
    }

    return (
      <span
        key={`${keyPrefix}-${index}`}
        className="cursor-pointer border-b-2 border-emerald-500 bg-emerald-50/80 transition-colors hover:bg-emerald-100"
      >
        {part}
      </span>
    );
  });
};

const MatchReportResumePreview = ({ activeDocumentTab, resumePreview }) => {
  if (activeDocumentTab !== "resume") {
    const inactiveDocument = resumePreview.otherDocuments[activeDocumentTab] || {
      title: "Document",
      description: "Document preview is currently unavailable.",
      placeholder: "No content available for the selected tab.",
    };
    return (
      <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[820px] rounded-xl border border-neutral-200 bg-white p-8 shadow-soft lg:p-10">
          <h2 className="font-heading text-2xl font-bold text-neutral-900">
            {inactiveDocument.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {inactiveDocument.description}
          </p>
          <div className="mt-8 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-600">
            {inactiveDocument.placeholder}
          </div>
        </div>

        <div className="sticky bottom-4 mt-6 flex justify-center">
          <div className="inline-flex max-w-[720px] items-center gap-2 rounded-full border border-neutral-200 bg-white/95 px-4 py-2 text-xs text-neutral-500 shadow-sm backdrop-blur">
            <span className="material-icons-round text-[14px] text-primary">auto_awesome</span>
            {resumePreview.note}
          </div>
        </div>
      </section>
    );
  }

  const { candidate, summary, skills, experience } = resumePreview.resume;

  return (
    <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <article className="mx-auto min-h-full max-w-[820px] rounded-sm border border-neutral-200 bg-white p-8 text-black shadow-soft sm:p-10 lg:p-12">
        <header className="mb-8 border-b border-neutral-300 pb-4">
          <h1 className="font-heading text-3xl font-bold tracking-wide text-neutral-900">
            {candidate.name}
          </h1>
          <div className="mt-3 space-y-1 text-[13px] leading-tight text-neutral-700">
            {candidate.contacts.map((contact, index) => (
              <p key={`${contact}-${index}`}>{contact}</p>
            ))}
          </div>
        </header>

        <section className="mb-8">
          <h2 className="inline-block border-b-2 border-neutral-900 text-lg font-bold uppercase tracking-wider text-neutral-900">
            {summary.title}
          </h2>
          <div className="mt-2 space-y-2 text-[13px] leading-relaxed text-neutral-800">
            {summary.paragraphs.map((paragraph, index) => (
              <p key={`summary-${index}`}>
                {renderHighlightedText(paragraph, summary.highlights, `summary-${index}`)}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="inline-block border-b-2 border-neutral-900 text-lg font-bold uppercase tracking-wider text-neutral-900">
            {skills.title}
          </h2>
          <div className="mt-2 space-y-1 text-[13px] leading-relaxed text-neutral-800">
            {skills.groups.map((group, index) => (
              <p key={`${group.label}-${index}`}>
                <span className="font-semibold">{group.label}:</span>{" "}
                {renderHighlightedText(group.value, skills.highlights, `skill-${index}`)}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="inline-block border-b-2 border-neutral-900 text-lg font-bold uppercase tracking-wider text-neutral-900">
            {experience.title}
          </h2>

          {experience.entries.map((entry, index) => (
            <div key={`${entry.role}-${index}`} className="mt-4">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <h3 className="text-[14px] font-bold text-neutral-900">{entry.role}</h3>
                <span className="text-[13px] text-neutral-700">{entry.timeline}</span>
              </div>
              <p className="mb-2 text-[13px] italic text-neutral-700">{entry.company}</p>
              <ul className="list-disc space-y-1 pl-5 text-[13px] text-neutral-800">
                {entry.bullets.map((bullet, bulletIndex) => (
                  <li key={`${entry.role}-bullet-${bulletIndex}`}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </article>

      <div className="sticky bottom-4 mt-6 flex justify-center">
        <div className="inline-flex max-w-[720px] items-center gap-2 rounded-full border border-neutral-200 bg-white/95 px-4 py-2 text-xs text-neutral-500 shadow-sm backdrop-blur">
          <span className="material-icons-round text-[14px] text-primary">auto_awesome</span>
          {resumePreview.note}
        </div>
      </div>
    </section>
  );
};

export default MatchReportResumePreview;
