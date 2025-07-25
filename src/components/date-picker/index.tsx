import React, { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';


export interface DatePickerProps {
  // Configurações básicas
  selectedDates?: Date[];
  onDateSelect?: (dates: Date[]) => void;
  selectionMode?: 'single' | 'multiple' | 'range';
  
  // Datas indisponíveis
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  
  // Estilos e tamanhos
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  theme?: 'light' | 'dark' | 'blue' | 'green' | 'purple';
  
  // Customização avançada
  className?: string;
  showWeekNumbers?: boolean;
  showOutsideDays?: boolean;
  locale?: string;
  showFooter?: boolean;
  widthFull?: boolean;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDates = [],
  onDateSelect,
  selectionMode = 'single',
  disabledDates = [],
  minDate,
  maxDate,
  size = 'medium',
  theme = 'light',
  className = '',
  showWeekNumbers = false,
  showOutsideDays = true,
  locale = 'pt-BR',
  showFooter = false,
  widthFull = false

}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  // Utilitários de data
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(disabledDate => isSameDay(date, disabledDate));
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => isSameDay(selectedDate, date));
  };

  const isInRange = (date: Date) => {
    if (selectionMode !== 'range' || selectedDates.length !== 2) return false;
    const [start, end] = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    return date >= start && date <= end;
  };

  const isRangeStart = (date: Date) => {
    if (selectionMode !== 'range' || selectedDates.length === 0) return false;
    const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    return isSameDay(date, sortedDates[0]);
  };

  const isRangeEnd = (date: Date) => {
    if (selectionMode !== 'range' || selectedDates.length < 2) return false;
    const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    return isSameDay(date, sortedDates[sortedDates.length - 1]);
  };

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDay.getMonth() === month;
      const isToday = isSameDay(currentDay, new Date());
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth,
        isToday,
        isSelected: isDateSelected(currentDay),
        isDisabled: isDateDisabled(currentDay),
        isInRange: isInRange(currentDay),
        isRangeStart: isRangeStart(currentDay),
        isRangeEnd: isRangeEnd(currentDay),
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate, selectedDates, disabledDates, minDate, maxDate, selectionMode]);

  // Handlers
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date) || !onDateSelect) return;

    let newSelectedDates: Date[] = [];

    switch (selectionMode) {
      case 'single':
        newSelectedDates = [date];
        break;
      
      case 'multiple':
        if (isDateSelected(date)) {
          newSelectedDates = selectedDates.filter(d => !isSameDay(d, date));
        } else {
          newSelectedDates = [...selectedDates, date];
        }
        break;
      
      case 'range':
        if (selectedDates.length === 0 || selectedDates.length === 2) {
          newSelectedDates = [date];
        } else {
          newSelectedDates = [selectedDates[0], date];
        }
        break;
    }

    onDateSelect(newSelectedDates);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
      return newDate;
    });
  };

  // Classes de estilo baseadas no tema
  const getThemeClasses = () => {
    const themes = {
      light: {
        container: 'bg-white border-gray-200 text-gray-900',
        header: 'bg-gray-50 border-gray-200',
        button: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
        weekday: 'text-gray-500 bg-gray-50',
        day: 'hover:bg-gray-100 text-gray-700',
        selected: 'bg-blue-500 text-white hover:bg-blue-600',
        today: 'bg-blue-100 text-blue-900',
        disabled: 'text-gray-300 cursor-not-allowed',
        range: 'bg-blue-100',
        rangeStart: 'bg-blue-500 text-white',
        rangeEnd: 'bg-blue-500 text-white'
      },
      dark: {
        container: 'bg-gray-800 border-gray-600 text-gray-100',
        header: 'bg-gray-700 border-gray-600',
        button: 'hover:bg-gray-600 text-gray-300 hover:text-gray-100',
        weekday: 'text-gray-400 bg-gray-700',
        day: 'hover:bg-gray-700 text-gray-200',
        selected: 'bg-blue-600 text-white hover:bg-blue-700',
        today: 'bg-blue-900 text-blue-200',
        disabled: 'text-gray-600 cursor-not-allowed',
        range: 'bg-blue-900',
        rangeStart: 'bg-blue-600 text-white',
        rangeEnd: 'bg-blue-600 text-white'
      },
      blue: {
        container: 'bg-blue-50 border-blue-200 text-blue-900',
        header: 'bg-blue-100 border-blue-200',
        button: 'hover:bg-blue-200 text-blue-600 hover:text-blue-900',
        weekday: 'text-blue-600 bg-blue-100',
        day: 'hover:bg-blue-100 text-blue-800',
        selected: 'bg-blue-600 text-white hover:bg-blue-700',
        today: 'bg-blue-200 text-blue-900',
        disabled: 'text-blue-300 cursor-not-allowed',
        range: 'bg-blue-200',
        rangeStart: 'bg-blue-600 text-white',
        rangeEnd: 'bg-blue-600 text-white'
      },
      green: {
        container: 'bg-green-50 border-green-200 text-green-900',
        header: 'bg-green-100 border-green-200',
        button: 'hover:bg-green-200 text-green-600 hover:text-green-900',
        weekday: 'text-green-600 bg-green-100',
        day: 'hover:bg-green-100 text-green-800',
        selected: 'bg-green-600 text-white hover:bg-green-700',
        today: 'bg-green-200 text-green-900',
        disabled: 'text-green-300 cursor-not-allowed',
        range: 'bg-green-200',
        rangeStart: 'bg-green-600 text-white',
        rangeEnd: 'bg-green-600 text-white'
      },
      purple: {
        container: 'bg-purple-50 border-purple-200 text-purple-900',
        header: 'bg-purple-100 border-purple-200',
        button: 'hover:bg-purple-200 text-purple-600 hover:text-purple-900',
        weekday: 'text-purple-600 bg-purple-100',
        day: 'hover:bg-purple-100 text-purple-800',
        selected: 'bg-purple-600 text-white hover:bg-purple-700',
        today: 'bg-purple-200 text-purple-900',
        disabled: 'text-purple-300 cursor-not-allowed',
        range: 'bg-purple-200',
        rangeStart: 'bg-purple-600 text-white',
        rangeEnd: 'bg-purple-600 text-white'
      }
    };
    return themes[theme];
  };

  // Classes de tamanho
  const getSizeClasses = (widthFull?:boolean) => {
    const sizes = {
      small: {
        container: `${widthFull?'w-full':'w-80'} text-sm`,
        cell: 'h-8 w-8 text-xs',
        header: 'p-2',
        button: 'p-1'
      },
      medium: {
        container: `${widthFull?'w-full':'w-96'}  text-base`,
        cell: 'h-10 w-10 text-sm',
        header: 'p-3',
        button: 'p-2'
      },
      large: {
        container: 'w-[500px] text-lg',
        cell: 'h-12 w-12 text-base',
        header: 'p-4',
        button: 'p-2'
      },
      fullscreen: {
        container: 'w-full h-full min-h-screen text-xl',
        cell: 'h-16 w-full text-lg',
        header: 'p-6',
        button: 'p-3'
      }
    };
    return sizes[size];
  };

  const themeClasses = getThemeClasses();
  const sizeClasses = getSizeClasses(widthFull);

  const getDayClasses = (day: any) => {
    let classes = `${sizeClasses.cell} flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer font-medium`;
    
    if (!day.isCurrentMonth && !showOutsideDays) {
      return `${classes} invisible`;
    }
    
    if (!day.isCurrentMonth) {
      classes += ' opacity-40';
    }
    
    if (day.isDisabled) {
      classes += ` ${themeClasses.disabled}`;
    } else if (day.isRangeStart || day.isRangeEnd) {
      classes += ` ${themeClasses.rangeStart}`;
    } else if (day.isSelected) {
      classes += ` ${themeClasses.selected}`;
    } else if (day.isInRange) {
      classes += ` ${themeClasses.range}`;
    } else if (day.isToday) {
      classes += ` ${themeClasses.today}`;
    } else {
      classes += ` ${themeClasses.day}`;
    }
    
    return classes;
  };

  return (
    <div className={`${themeClasses.container} ${sizeClasses.container} border rounded-xl shadow-lg overflow-hidden ${className}`} aria-label='data-picker-container'>
      {/* Header */}
      <div className={`${themeClasses.header} ${sizeClasses.header} flex items-center justify-between border-b`}>
        <button
          onClick={() => navigateMonth('prev')}
          className={`${themeClasses.button} ${sizeClasses.button} rounded-lg transition-colors`}
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'days' ? 'months' : 'days')}
            className="font-semibold hover:underline"
          >
            {MONTHS[currentDate.getMonth()]}
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'days' ? 'years' : 'days')}
            className="font-semibold hover:underline"
          >
            {currentDate.getFullYear()}
          </button>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className={`${themeClasses.button} ${sizeClasses.button} rounded-lg transition-colors`}
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className={`grid ${size === 'fullscreen' ? 'grid-cols-7 gap-2' : 'grid-cols-7 gap-1'} mb-2`}>
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className={`${themeClasses.weekday} ${sizeClasses.cell} flex items-center justify-center font-semibold text-xs rounded-lg`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className={`grid ${size === 'fullscreen' ? 'grid-cols-7 gap-2' : 'grid-cols-7 gap-1'}`}>
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={getDayClasses(day)}
              disabled={day.isDisabled}
            >
              {day.date.getDate()}
            </button>
          ))}
        </div>
      </div>

      {/* Footer com informações */}
      {showFooter && selectedDates.length > 0 && (
        <div className={`${themeClasses.header} border-t p-3 text-sm`}>
          <div className="flex flex-wrap gap-2">
            {selectionMode === 'range' && selectedDates.length === 2 ? (
              <span>
                {selectedDates[0].toLocaleDateString(locale)} - {selectedDates[1].toLocaleDateString(locale)}
              </span>
            ) : (
              selectedDates.map((date, index) => (
                <span key={index} className="bg-opacity-20 bg-current px-2 py-1 rounded">
                  {date.toLocaleDateString(locale)}
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};