import { Dropdown, Switch, Tooltip } from 'antd';
import { Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHighlightCategory,
  setHighlightEnabled,
} from '../../../store/slices/matchingReportSlice';
import './HighlightVisibilityToggle.css';

const HighlightVisibilityToggle = ({ className = '' }) => {
  const dispatch = useDispatch();
  const visibility = useSelector(
    (state) => state.matchingReport.ui?.highlightVisibility
  ) || { enabled: true, showMatched: true, showMismatch: true };

  const { enabled, showMatched, showMismatch } = visibility;

  const dropdownContent = (
    <div
      className="bg-white rounded-lg shadow-lg border border-neutral-200 p-3 w-60"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-800">
          Show highlights
        </span>
        <Switch
          size="small"
          className="hl-orange-switch"
          checked={enabled}
          onChange={(value) => dispatch(setHighlightEnabled(value))}
        />
      </div>
      <div className="my-2 h-px bg-neutral-200" />
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="flex items-center gap-2 text-sm text-gray-700">
          <span className="inline-block w-3 h-3 rounded-sm bg-orange-500" />
          Mismatched
        </span>
        <Switch
          size="small"
          className="hl-orange-switch"
          disabled={!enabled}
          checked={showMismatch}
          onChange={(value) =>
            dispatch(setHighlightCategory({ key: 'showMismatch', value }))
          }
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm text-gray-700">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500" />
          Matched / Fixed
        </span>
        <Switch
          size="small"
          className="hl-orange-switch"
          disabled={!enabled}
          checked={showMatched}
          onChange={(value) =>
            dispatch(setHighlightCategory({ key: 'showMatched', value }))
          }
        />
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      dropdownRender={() => dropdownContent}
    >
      <Tooltip title="Highlight settings">
        <button
          type="button"
          className={`flex items-center justify-center rounded-lg w-8 h-8 transition-all shadow-sm shrink-0 ${
            enabled
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-200 text-gray-500'
          } ${className}`}
        >
          <Settings size={16} />
        </button>
      </Tooltip>
    </Dropdown>
  );
};

export default HighlightVisibilityToggle;
