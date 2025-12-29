import HeatMap from "@uiw/react-heat-map";
import Tooltip from '@uiw/react-tooltip';
import { useUser } from "../utils/useUser";
import { Activity } from "../types/types";

const StreakHeatmap = () => {
  const { userInfo } = useUser();

  const value: Activity[] = Array.isArray(userInfo?.activity) ? userInfo.activity : [];

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="p-4 bg-gray-900/40 border border-cyan-400/40 rounded-2xl shadow-lg">
      <h2 className="text-white font-semibold mb-3">
        Activity Streak
      </h2>

      <div className="flex justify-center">
        <HeatMap
          value={value}
          startDate={oneYearAgo}
          endDate={today}
          width={850}
          rectRender={(props, data) => (
            <Tooltip
              placement="top"
              content={`submissions: ${data?.count ? data.count + 1 : 0}`}
            >
              <rect
                {...props}
                rx={1}
                ry={1}
                style={{
                  stroke: "rgba(0,255,255,0.4)",
                  strokeWidth: data?.count ? 0.7 : 0.2,
                }}
              />
            </Tooltip>
          )}
          panelColors={{
            0: "#0f172a",
            1: "#082f49",
            2: "#083344",
            3: "#0e7490",
            4: "#06b6d4",
            5: "#22d3ee",
            6: "#38e6f5",
            7: "#67e8f9",
            8: "#a5f3fc",
            9: "#cffafe"
          }}
          style={{
            color: "#67e8f9",
            "--rhm-rect-active": "#22d3ee",
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default StreakHeatmap;
