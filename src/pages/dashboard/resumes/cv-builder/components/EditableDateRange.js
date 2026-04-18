import React, { useMemo, useRef, useEffect } from 'react';
import { DatePicker } from "antd";
import Checkbox from "@/components/Checkbox";
import dayjs from "dayjs";

export const EditableDateRange = React.memo(({ startDate, endDate, isCurrent, onStartDateChange, onEndDateChange, onIsCurrentChange, className }) => {
    const onStartDateChangeRef = useRef(onStartDateChange);
    const onEndDateChangeRef = useRef(onEndDateChange);
    const onIsCurrentChangeRef = useRef(onIsCurrentChange);

    useEffect(() => {
        onStartDateChangeRef.current = onStartDateChange;
        onEndDateChangeRef.current = onEndDateChange;
        onIsCurrentChangeRef.current = onIsCurrentChange;
    });

    const parsedStart = useMemo(() => {
        return startDate && !isNaN(new Date(startDate).getTime()) ? dayjs(startDate) : null;
    }, [startDate]);

    const parsedEnd = useMemo(() => {
        return endDate && !isNaN(new Date(endDate).getTime()) ? dayjs(endDate) : null;
    }, [endDate]);

    return (
        <div className={`flex items-center gap-2 flex-nowrap whitespace-nowrap ${className}`}>
            <div className="print:hidden inline-flex">
                <DatePicker
                    picker="month"
                    format="MM/YYYY"
                    suffixIcon={null}
                    value={parsedStart}
                    onChange={(date) => {
                        if (date) {
                            onStartDateChangeRef.current(date.startOf('month').format('YYYY-MM-DD'));
                        } else {
                            onStartDateChangeRef.current('');
                        }
                    }}
                    placeholder="Start"
                    allowClear={false}
                    bordered={false}
                    className="w-[60px] p-0 text-center font-inherit bg-transparent cursor-pointer flex-shrink-0 flex-nowrap"
                    style={{ color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}
                />
            </div>
            <span className="hidden print:inline-block w-[60px] text-center font-inherit flex-shrink-0 truncate overflow-visible">
                {parsedStart ? parsedStart.format('MM/YYYY') : 'Start'}
            </span>
            <span className="flex-shrink-0">-</span>
            {isCurrent ? (
                <span className="w-[60px] text-center flex-shrink-0">Now</span>
            ) : (
                <>
                    <div className="print:hidden inline-flex">
                        <DatePicker
                            picker="month"
                            format="MM/YYYY"
                            suffixIcon={null}
                            value={parsedEnd}
                            onChange={(date) => {
                                if (date) {
                                    onEndDateChangeRef.current(date.startOf('month').format('YYYY-MM-DD'));
                                } else {
                                    onEndDateChangeRef.current('');
                                }
                            }}
                            placeholder="End"
                            allowClear={false}
                            bordered={false}
                            className="w-[60px] p-0 text-center font-inherit bg-transparent cursor-pointer flex-shrink-0 flex-nowrap"
                            style={{ color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}
                        />
                    </div>
                    <span className="hidden print:inline-block w-[60px] text-center font-inherit flex-shrink-0 truncate overflow-visible">
                        {parsedEnd ? parsedEnd.format('MM/YYYY') : 'End'}
                    </span>
                </>
            )}
            <Checkbox
                label="Now"
                checked={isCurrent}
                onChange={(e) => onIsCurrentChangeRef.current(e.target.checked)}
                className="ml-1 text-xs opacity-50 hover:opacity-100 flex-shrink-0 print:hidden"
            />
        </div>
    );
});

