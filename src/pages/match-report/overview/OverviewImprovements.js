import { parseTextToItems } from "./overviewUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '../../../utils/icons';

const OverviewImprovements = ({ text }) => {
  const items = parseTextToItems(text);

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[20px] text-amber-500" />
        <h3 className="text-base font-bold text-neutral-900">Areas for Improvement</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
            <span className="text-base leading-relaxed text-neutral-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OverviewImprovements;
