import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ScoreCard from '@/pages/match-report/sidebar/header/ScoreCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPen } from '../../../utils/icons';

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

  if (!matchData) return null;

  const score = Number.isFinite(matchData.aiOverallScore) ? matchData.aiOverallScore : 0;
  const title = matchData.jobName || 'Matching Report';
  const subtitle = matchData.resumeFullName || matchData.candidateName || 'Candidate';
  const criteriaScores = matchData.criteriaScores || [];

  const totalSuggestions = criteriaScores.reduce((sum, cs) => {
    const details = cs.details || [];
    return sum + details.reduce((s, d) => s + (d.suggestions?.length || 0), 0);
  }, 0);

  const handleEditResume = () => {
    if (!matchData.resumeId || !matchData.jobId) return;
    navigate(`/enhancements/${evaluationId}`, {
      state: { resumeId: matchData.resumeId, jobId: matchData.jobId },
    });
  };

  return (
    <aside className="flex w-full flex-shrink-0 flex-col border-b border-neutral-200 bg-white xl:h-screen xl:w-[420px] xl:border-b-0 xl:border-r">
      {/* Header — Job title + Score */}
      <div className="border-b border-neutral-200 p-5">
        <h2 className="text-base font-bold text-neutral-900 leading-snug">{title}</h2>
        <p className="mt-1 text-[13px] text-neutral-500">{subtitle}</p>

        <div className="mt-4 flex items-center gap-4">
          <ScoreCard score={score} />
          <div>
            <div className="text-primary text-lg font-bold">{totalSuggestions} <span className="text-sm font-normal text-neutral-600">suggestions</span></div>
            <p className="mt-0.5 text-[11px] text-neutral-400">Resumes with a score of 75 or higher are more likely to pass ATS.</p>
          </div>
        </div>
      </div>

      {/* Criteria List with Progress Bars */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-neutral-100">
          {criteriaScores.map((cs) => {
            const criteriaScore = Number.isFinite(cs.aiScore) ? cs.aiScore : 0;
            const details = cs.details || [];
            const missingCount = details.filter(
              (d) => d.status === 'MISSING' || d.status === 'missing'
            ).length;
            const suggestionCount = details.reduce(
              (s, d) => s + (d.suggestions?.length || 0),
              0
            );
            const isComplete = missingCount === 0;

            return (
              <div key={cs.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900">{cs.criteriaName}</span>
                  {/* Progress bar */}
                  <div className="flex w-[140px] items-center gap-2">
                    <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getBarColor(criteriaScore)}`}
                        style={{ width: `${Math.min(criteriaScore, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-500 w-8 text-right">{criteriaScore}%</span>
                  </div>
                </div>
                <div className="mt-1.5 text-xs text-neutral-500">
                  {isComplete ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[13px]" />
                      Complete
                    </span>
                  ) : (
                    <span>{suggestionCount} suggestions</span>
                  )}
                </div>
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
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <FontAwesomeIcon icon={faPen} className="text-[18px]" />
          Edit Resume
        </button>
      </div>
    </aside>
  );
};

export default ReportSidebar;
