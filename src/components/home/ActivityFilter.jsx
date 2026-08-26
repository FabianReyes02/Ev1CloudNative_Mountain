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
              group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 border
              ${
                isActive
                  ? 'bg-thermal-500/15 border-thermal-500/40 text-thermal-400 shadow-lg shadow-thermal-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }
            `}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? 'text-thermal-500'
                    : 'text-slate-500 group-hover:text-slate-400'
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
