import { useState } from "react";

const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function toISODate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Pazartesi'yi haftanın ilk günü olarak alan offset (Date.getDay() Pazar=0
// döndürüyor, biz Pazartesi=0 istiyoruz).
function mondayFirstDay(date) {
  return (date.getDay() + 6) % 7;
}

/**
 * Şirin, cam temalı ay takvimi — gerçek bir takvim üzerinden gün seçimi.
 * value: seçili tarih (yyyy-mm-dd) ya da null
 * onChange: (yyyy-mm-dd) => void
 */
export default function Calendar({ value, onChange }) {
  const today = startOfDay(new Date());
  const initial = value ? new Date(value + "T00:00:00") : today;

  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const leadingBlanks = mondayFirstDay(firstOfMonth);

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  function goPrevMonth() {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function goNextMonth() {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function isPast(day) {
    const cellDate = startOfDay(new Date(viewYear, viewMonth, day));
    return cellDate < today;
  }

  function isSelected(day) {
    return value === toISODate(viewYear, viewMonth, day);
  }

  function isToday(day) {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  const selectedLabel = value
    ? new Date(value + "T00:00:00").toLocaleDateString("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="hero-calendar">
      <div className="hero-calendar-header">
        <button
          type="button"
          className="hero-calendar-nav"
          onClick={goPrevMonth}
          aria-label="Önceki ay"
        >
          ‹
        </button>
        <span className="hero-calendar-month">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="hero-calendar-nav"
          onClick={goNextMonth}
          aria-label="Sonraki ay"
        >
          ›
        </button>
      </div>

      <div className="hero-calendar-grid hero-calendar-weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w} className="hero-calendar-weekday">
            {w}
          </span>
        ))}
      </div>

      <div className="hero-calendar-grid">
        {cells.map((day, idx) =>
          day === null ? (
            <span key={`blank-${idx}`} className="hero-calendar-day-empty" />
          ) : (
            <button
              key={day}
              type="button"
              disabled={isPast(day)}
              className={[
                "hero-calendar-day",
                isSelected(day) ? "selected" : "",
                isToday(day) && !isSelected(day) ? "today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onChange(toISODate(viewYear, viewMonth, day))}
            >
              {day}
            </button>
          )
        )}
      </div>

      {selectedLabel && (
        <p className="hero-calendar-summary">
          Buluşma günü: <strong>{selectedLabel}</strong>
        </p>
      )}
    </div>
  );
}
