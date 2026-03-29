import { parseTextToItems } from "./overviewUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '../../../utils/icons';

const OverviewStrengths = ({ text }) => {
  const items = parseTextToItems(text);

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faCircleCheck} className="text-[20px] text-emerald-500" />
        <h3 className="text-base font-bold text-neutral-900">Strengths</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-sm leading-relaxed text-neutral-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OverviewStrengths;
