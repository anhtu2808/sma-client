import React from 'react';
import { DatePicker } from "antd";
import Checkbox from "@/components/Checkbox";
import dayjs from "dayjs";

export const EditableDateRange = React.memo(({ startDate, endDate, isCurrent, onStartDateChange, onEndDateChange, onIsCurrentChange, className }) => {
    return (
        <div className={`flex items-center gap-2 flex-nowrap whitespace-nowrap ${className}`}>
            <DatePicker
                picker="month"
                format="MM/YYYY"
                value={startDate && !isNaN(new Date(startDate).getTime()) ? dayjs(startDate) : null}
                onChange={(date) => {
                    if (date) {
                        onStartDateChange(date.startOf('month').format('YYYY-MM-DD'));
                    } else {
                        onStartDateChange('');
                    }
                }}
                placeholder="Start"
                allowClear={false}
                bordered={false}
                className="w-[72px] p-0 text-center font-inherit bg-transparent cursor-pointer flex-shrink-0 flex-nowrap"
                style={{ color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}
            />
            <span className="flex-shrink-0">-</span>
            {isCurrent ? (
                <span className="w-[72px] text-center flex-shrink-0">Now</span>
            ) : (
                <DatePicker
                    picker="month"
                    format="MM/YYYY"
                    value={endDate && !isNaN(new Date(endDate).getTime()) ? dayjs(endDate) : null}
                    onChange={(date) => {
                        if (date) {
                            onEndDateChange(date.startOf('month').format('YYYY-MM-DD'));
                        } else {
                            onEndDateChange('');
                        }
                    }}
                    placeholder="End"
                    allowClear={false}
                    bordered={false}
                    className="w-[72px] p-0 text-center font-inherit bg-transparent cursor-pointer flex-shrink-0 flex-nowrap"
                    style={{ color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}
                />
            )}
            <Checkbox
                label="Now"
                checked={isCurrent}
                onChange={(e) => onIsCurrentChange(e.target.checked)}
                className="ml-1 text-xs opacity-50 hover:opacity-100 flex-shrink-0 print:hidden"
            />
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.startDate === nextProps.startDate &&
        prevProps.endDate === nextProps.endDate &&
        prevProps.isCurrent === nextProps.isCurrent &&
        prevProps.className === nextProps.className;
});
