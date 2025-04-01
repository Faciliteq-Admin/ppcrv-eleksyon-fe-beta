import { CalendarDaysIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const DateRangePickerRef = forwardRef((props, ref) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const datepickerRef = useRef<any>(null);
    const popoverRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        getData: () => ({
            selectedEndDate,
            selectedStartDate
        })
    }));

    useEffect(() => {
        if (isOpen && datepickerRef.current && popoverRef.current) {
            const popoverRect = popoverRef.current.getBoundingClientRect();
            const datepickerRect = datepickerRef.current.getBoundingClientRect();

            let top = 0;
            let left = 0;

            if ((datepickerRect.y + datepickerRect.height + popoverRect.height) > window.innerHeight) {
                top = -popoverRect.height - 16;
            } else {
                top = datepickerRect.height;
            }


            setPosition({ top, left });
        }
    }, [isOpen]);


    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysArray = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(<div key={`empty-${i}`}></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(year, month, i);
            const dayString = day.toLocaleDateString("en-US");
            let className =
                "flex items-center justify-center cursor-pointer w-[46px] h-[46px] rounded-full text-dark-3 dark:text-dark-6 hover:bg-primary hover:text-gray-500";

            if (selectedStartDate && dayString === selectedStartDate) {
                className += " bg-blue-500 text-white dark:text-white rounded-r-none";
            }
            if (selectedEndDate && dayString === selectedEndDate) {
                className += " bg-blue-500 text-white dark:text-white rounded-l-none";
            }
            if (
                selectedStartDate &&
                selectedEndDate &&
                new Date(day) > new Date(selectedStartDate) &&
                new Date(day) < new Date(selectedEndDate)
            ) {
                className += " bg-blue-300 rounded-none";
            }

            daysArray.push(
                <div
                    key={i}
                    className={className}
                    data-date={dayString}
                    onClick={() => handleDayClick(dayString)}
                >
                    {i}
                </div>,
            );
        }

        return daysArray;
    };

    const handleDayClick = (selectedDay: any) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(selectedDay);
            setSelectedEndDate(null);
        } else {
            if (new Date(selectedDay) < new Date(selectedStartDate)) {
                setSelectedEndDate(selectedStartDate);
                setSelectedStartDate(selectedDay);
            } else {
                setSelectedEndDate(selectedDay);
            }
        }
    };

    const updateInput = () => {
        if (selectedStartDate && selectedEndDate) {
            return `${selectedStartDate} - ${selectedEndDate}`;
        } else if (selectedStartDate) {
            return selectedStartDate;
        } else {
            return "";
        }
    };

    const toggleDatepicker = () => {
        setIsOpen(!isOpen);
    };

    const handleApply = () => {
        console.log("Applied:", selectedStartDate, selectedEndDate);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setIsOpen(false);
    };

    const handleDocumentClick = (e: any) => {
        if (datepickerRef.current && !datepickerRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    return (
        <section className="bg-white dark:bg-dark">
            <div className="container">
                <div className="flex flex-wrap">
                    <div className="w-full">
                        <div className="">
                            <div className="relative" ref={datepickerRef}>
                                <div className="relative flex items-center">
                                    <span className="absolute left-0 pl-4 text-dark-5">
                                        <CalendarDaysIcon className="size-7" />
                                    </span>
                                    <input
                                        id="datepicker"
                                        type="text"
                                        placeholder="Pick a date"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-[50px] pr-8 text-dark-2 outline-none transition focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                        value={updateInput()}
                                        onClick={toggleDatepicker}
                                        readOnly
                                    />

                                    <span
                                        className="absolute right-0 cursor-pointer pr-4 text-dark-5"
                                        onClick={toggleDatepicker}
                                    >
                                        <ChevronDownIcon className="size-7" />
                                    </span>
                                </div>

                                {isOpen && (
                                    <div
                                        ref={popoverRef}
                                        id="datepicker-container"
                                        style={{ top: `${position.top}px`, left: `${position.left}px` }}
                                        className="shadow-datepicker absolute mt-2 rounded-xl border border-stroke bg-white pt-5 dark:border-dark-3 dark:bg-dark-2"
                                    >
                                        <div className="flex items-center justify-between px-5 text-black">
                                            <button
                                                id="prevMonth"
                                                style={{ top: `${position.top}px`, left: `${position.left}px` }}
                                                // className="rounded-md px-2 py-2 text-gray-500 hover:bg-gray-100 dark:text-white dark:hover:bg-dark"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentDate(
                                                        new Date(
                                                            currentDate.setMonth(currentDate.getMonth() - 1),
                                                        ),
                                                    )

                                                }}
                                            >
                                                <ChevronLeftIcon className="size-8" />
                                            </button>

                                            <div
                                                id="currentMonth"
                                                className="text-lg font-medium"
                                            >
                                                {currentDate.toLocaleString("default", {
                                                    month: "long",
                                                })}{" "}
                                                {currentDate.getFullYear()}
                                            </div>

                                            <button
                                                id="nextMonth"
                                                // className="rounded-md px-2 py-2 text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentDate(
                                                        new Date(
                                                            currentDate.setMonth(currentDate.getMonth() + 1),
                                                        ),
                                                    )
                                                }}
                                            >
                                                <ChevronRightIcon className="size-8" />
                                            </button>
                                        </div>

                                        <div className="mb-4 mt-6 grid grid-cols-7 gap-2 px-5">
                                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                                (day) => (
                                                    <div
                                                        key={day}
                                                        className="text-center text-sm font-medium text-secondary-color"
                                                    >
                                                        {day}
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <div
                                            id="days-container"
                                            className="mt-2 grid grid-cols-7 gap-y-0.5 px-5"
                                        >
                                            {renderCalendar()}
                                        </div>

                                        <div className="mt-5 flex justify-end space-x-2.5 border-t border-stroke p-5 dark:border-dark-3">
                                            <button
                                                id="cancelButton"
                                                className="rounded-lg border border-primary px-5 py-2.5 text-base font-medium text-primary hover:bg-blue-light-5"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                id="applyButton"
                                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-base font-medium text-white hover:bg-[#1B44C8]"
                                                onClick={handleApply}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default DateRangePickerRef;