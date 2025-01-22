'use client';
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment';

const CalendarComponent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(moment());

  const startDay = currentDate.clone().startOf('month').startOf('week');
  const endDay = currentDate.clone().endOf('month').endOf('week');

  const day = startDay.clone().subtract(1, 'day');
  const days: moment.Moment[] = [];

  

  while (day.isBefore(endDay, 'day')) {
    days.push(day.add(1, 'day').clone());
  }

  const prevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  return (
    <div className="calendar mt-1 p-4 bg-white rounded-lg">
      <div className="header flex justify-between items-center  mb-4 overflow-hidden">
        <ChevronLeftIcon className="h-6 w-6 cursor-pointer" onClick={prevMonth} />
        <h2 className="text-[16px] font-semibold">{currentDate.format('MMMM YYYY')}</h2>
        <ChevronRightIcon className="h-6 w-6 cursor-pointer" onClick={nextMonth} />
      </div>
      <div className="grid grid-cols-7">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div key={dayName} className="text-center font-normal text-[10px]">
            {dayName}
          </div>
        ))}
        {days.map((dayItem) => (
          <div
            key={dayItem.format('DD-MM-YYYY')}
            className={`text-center p-2 ${
              dayItem.isSame(currentDate, 'month') ? '' : 'text-gray-200'
            } ${dayItem.isSame(new Date(), 'day') ? 'bg-blue-500 text-white rounded-full' : ''}`}
          >
            {dayItem.format('D')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarComponent;
