import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ScoreCard from '@/pages/match-report/sidebar/header/ScoreCard';
import { useGetOrCreateEnhancementQuery } from '@/apis/resumeApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faCircleXmark, faPen } from '../../../utils/icons';

const getBarColor = (score) => {
  if (score >= 80) return 'bg-blue-500';
  if (score >= 60) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

const ReportSidebar = () => {
  const navigate = useNavigate();
  const { evaluationId } = useParams();
  const matchData = useSelector((state) => state.matchingReport.data);
  const { data: enhancement } = useGetOrCreateEnhancementQuery(
    { resumeId: matchData?.resumeId, jobId: matchData?.jobId },
    { skip: !matchData?.resumeId || !matchData?.jobId }
  );

  if (!matchData) return null;

  const score = Number.isFinite(matchData.aiOverallScore) ? matchData.aiOverallScore : 0;
  const title = matchData.jobName || 'Matching Report';
  const subtitle = matchData.resumeFullName || matchData.candidateName || 'Candidate';
  const criteriaScores = matchData.criteriaScores || [];

  const allDetails = criteriaScores.flatMap((cs) => cs.details || []);
  const matchedCount = allDetails.filter((d) => d.status === 'MATCHED').length;
  const partialCount = allDetails.filter((d) => d.status === 'PARTIAL').length;
  const missingCount = allDetails.filter(
    (d) => d.status === 'MISSING' || d.status === 'missing'
  ).length;

  const handleEditResume = () => {
    if (!matchData.resumeId || !matchData.jobId || !enhancement?.id) return;
    navigate(`/match-report/${evaluationId}/enhancements/${enhancement.id}`, {
      state: { resumeId: matchData.resumeId, jobId: matchData.jobId },
    });
  };

  return (
    <aside className="flex w-full flex-shrink-0 flex-col border-b border-neutral-200 bg-white xl:h-screen xl:w-[550px] xl:border-b-0 xl:border-r">
      {/* Header — Job title + Score */}
      <div className="border-b border-neutral-200 p-5">
        <h2 className="text-lg font-bold text-neutral-900 leading-snug">{title}</h2>
        <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>

        <div className="mt-4 flex items-center gap-4">
          <ScoreCard score={score} />
          <div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[14px]" />
                  {matchedCount} matched
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
                  <FontAwesomeIcon icon={faCircleExclamation} className="text-[14px]" />
                  {partialCount} partial
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-500">
                  <FontAwesomeIcon icon={faCircleXmark} className="text-[14px]" />
                  {missingCount} missing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-2 mt-5 flex items-start gap-3 rounded-xl bg-amber-50/70 p-4 border border-amber-100">
        <div className="text-amber-500 mt-0.5 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        </div>
        <p className="text-[12px] leading-relaxed text-amber-900 italic font-medium">
          <b>Note:</b> AI-generated matching results and scores are approximations based on the provided data. Please verify technical details manually to ensure accuracy.
        </p>
      </div>
      {/* Criteria List with Progress Bars */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-neutral-100">
          {criteriaScores.map((cs) => {
            const criteriaScore = Number.isFinite(cs.aiScore) ? cs.aiScore : 0;
            const details = cs.details || [];

            const getDetailIcon = (status) => {
              if (status === 'MATCHED') return { icon: faCircleCheck, cls: 'text-emerald-500' };
              if (status === 'PARTIAL') return { icon: faCircleExclamation, cls: 'text-amber-500' };
              return { icon: faCircleXmark, cls: 'text-red-500' };
            };

            return (
              <div key={cs.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-neutral-900">{cs.criteriaName}</span>
                  {/* Progress bar */}
                  <div className="flex w-[140px] items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getBarColor(criteriaScore)}`}
                        style={{ width: `${Math.min(criteriaScore, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-neutral-700 w-8 text-right">{criteriaScore}%</span>
                  </div>
                </div>
                {details.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1">
                    {details.map((d) => {
                      const { icon, cls } = getDetailIcon(d.status);
                      return (
                        <li key={d.id} className="flex items-start gap-1.5">
                          <FontAwesomeIcon icon={icon} className={`mt-[4px] flex-shrink-0 text-[15px] ${cls}`} />
                          <div>
                            <span className="text-base font-semibold leading-snug text-neutral-900">{d.label}</span>
                            {d.description && (
                              <p className="mt-0.5 text-sm leading-snug text-neutral-700">{d.description}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Resume Button */}
      <div className="border-t border-neutral-200 p-4">
        <button
          type="button"
          onClick={handleEditResume}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <FontAwesomeIcon icon={faPen} className="text-[18px]" />
          Edit Resume
        </button>
      </div>
    </aside>
  );
};

export default ReportSidebar;
