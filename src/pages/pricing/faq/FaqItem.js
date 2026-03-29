import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '../../../utils/icons';
const FaqItem = ({ question, answer }) => {
  return (
    <details className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <span className="text-lg font-semibold text-gray-900">{question}</span>
        <FontAwesomeIcon icon={faChevronDown} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6 text-gray-600 leading-relaxed">{answer}</div>
    </details>
  );
};

export default FaqItem;
