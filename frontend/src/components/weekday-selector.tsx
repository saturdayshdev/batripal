export default function WeekdaySelector() {
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDay = new Date().getDay() - 1; // 0-indexed, Monday is 0

  return (
    <div className="flex justify-between p-4 gap-1 border-b border-gray-200">
      {weekdays.map((day, index) => (
        <div
          key={day + index}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${
                index === currentDay
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
        >
          <span className="text-xs font-medium">{day}</span>
        </div>
      ))}
    </div>
  );
}
