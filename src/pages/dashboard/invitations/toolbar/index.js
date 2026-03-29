import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort } from '../../../../utils/icons';

const Toolbar = ({
  filterMode,
  sortBy,
  filterOptions,
  sortOptions,
  onFilterChange,
  onSortChange,
}) => {
  const currentFilterLabel =
    filterOptions.find((option) => option.key === filterMode)?.label || 'Filter';
  const currentSortLabel =
    sortOptions.find((option) => option.key === sortBy)?.label || 'Sort';

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Dropdown
        menu={{
          items: filterOptions.map((option) => ({
            key: option.key,
            label: option.label,
          })),
          selectable: true,
          selectedKeys: [filterMode],
          onClick: ({ key }) => onFilterChange(key),
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <div>
          <Button
            type="button"
            mode="secondary"
            shape="rounded"
            className="!px-4 !pt-[9px] !pb-[7px] !text-sm inline-flex items-center gap-2"
            iconLeft={<FontAwesomeIcon icon={faFilter} className="text-[18px]" />}
          >
            <div className="flex items-center gap-1.5">
              <span>{currentFilterLabel}</span>
              <DownOutlined className="text-[10px] mt-[1px]" />
            </div>
          </Button>
        </div>
      </Dropdown>

      <Dropdown
        menu={{
          items: sortOptions.map((option) => ({
            key: option.key,
            label: option.label,
          })),
          selectable: true,
          selectedKeys: [sortBy],
          onClick: ({ key }) => onSortChange(key),
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <div>
          <Button
            type="button"
            mode="secondary"
            shape="rounded"
            className="!px-4 !pt-[9px] !pb-[7px] !text-sm inline-flex items-center gap-2"
            iconLeft={<FontAwesomeIcon icon={faSort} className="text-[18px]" />}
          >
            <div className="flex items-center gap-1.5">
              <span>{currentSortLabel}</span>
              <DownOutlined className="text-[10px] mt-[1px]" />
            </div>
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Toolbar;
