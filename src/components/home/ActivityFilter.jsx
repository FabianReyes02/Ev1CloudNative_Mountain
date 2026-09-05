import {
  Mountain,
  Footprints,
  Anchor,
  Wind,
  CloudLightning,
  Tent,
  Compass,
} from 'lucide-react';

const iconMap = {
  Mountain,
  Footprints,
  Anchor,
  Wind,
  CloudLightning,
  Tent,
  Compass,
};

export const ActivityFilter = ({ activities, selected, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {activities.map((activity) => {
        const Icon = iconMap[activity.icon];
        const isActive = selected.includes(activity.id);

        return (
          <button
            key={activity.id}
            onClick={() => onToggle(activity.id)}
            className={`
              group flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium
              transition-all duration-200 active:scale-95
              ${
                isActive
                  ? 'border-thermal-500/40 bg-thermal-500/15 text-thermal-400 shadow-lg shadow-thermal-500/10'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:-translate-y-0.5 hover:border-slate-700 hover:text-slate-200'
              }
            `}
          >
            {Icon && (
              <Icon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isActive
                    ? 'text-thermal-500'
                    : 'text-slate-500 group-hover:scale-110 group-hover:text-slate-400'
                }`}
              />
            )}
            {activity.label}
          </button>
        );
      })}
    </div>
  );
};