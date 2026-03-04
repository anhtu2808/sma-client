import { useMemo, useState } from "react";
import MatchReportHeader from "@/pages/match-report/header";
import { MATCH_REPORT_DATA } from "@/pages/match-report/mock-data";
import MatchReportResumePreview from "@/pages/match-report/resume-preview";
import MatchReportSidebar from "@/pages/match-report/sidebar";

const MatchReport = () => {
  const [activeSidebarTab, setActiveSidebarTab] = useState("skills");
  const [activeDocumentTab, setActiveDocumentTab] = useState("resume");
  const [expandedSkillKeys, setExpandedSkillKeys] = useState([]);

  const activeSections = useMemo(
    () => MATCH_REPORT_DATA.sidebarContentByTab[activeSidebarTab] || [],
    [activeSidebarTab]
  );

  const handleSidebarTabChange = (tabKey) => {
    setActiveSidebarTab(tabKey);
    setExpandedSkillKeys([]);
  };

  const handleToggleSkill = (skillKey) => {
    setExpandedSkillKeys((previous) => {
      if (previous.includes(skillKey)) {
        return previous.filter((item) => item !== skillKey);
      }
      return [...previous, skillKey];
    });
  };

  return (
    <div className="min-h-screen bg-surface-light text-neutral-900 xl:h-screen">
      <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row">
        <MatchReportSidebar
          scoreCard={MATCH_REPORT_DATA.scoreCard}
          sidebarTabs={MATCH_REPORT_DATA.sidebarTabs}
          activeSidebarTab={activeSidebarTab}
          onSidebarTabChange={handleSidebarTabChange}
          sections={activeSections}
          expandedSkillKeys={expandedSkillKeys}
          onToggleSkill={handleToggleSkill}
        />

        <main className="flex min-w-0 flex-1 flex-col bg-surface-light">
          <MatchReportHeader
            documentTabs={MATCH_REPORT_DATA.documentTabs}
            activeDocumentTab={activeDocumentTab}
            onDocumentTabChange={setActiveDocumentTab}
            editorStatus={MATCH_REPORT_DATA.editorStatus}
          />

          <MatchReportResumePreview
            activeDocumentTab={activeDocumentTab}
            resumePreview={MATCH_REPORT_DATA.resumePreview}
          />
        </main>
      </div>
    </div>
  );
};

export default MatchReport;
