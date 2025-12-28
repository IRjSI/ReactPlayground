import HeatMap, { IActivity } from "@uiw/react-heat-map";
import Tooltip from '@uiw/react-tooltip';
import { useUser } from "../utils/useUser";

const StreakHeatmap = () => {
    const { userInfo } = useUser();

    const value: IActivity[] = Array.isArray(userInfo?.activity) ? userInfo.activity : [];

  return (
    <div className="p-4 bg-gray-900/40 border border-cyan-400/40 rounded-2xl shadow-lg">
      <h2 className="text-white font-semibold mb-3">
        Activity Streak
      </h2>

      <HeatMap
        value={value}
        startDate={new Date("2025/01/01")}
        width={750}
        rectRender={(props, data) => {
          return (
            <Tooltip
              placement="top"
              // content={new Date(data?.date).toLocaleDateString("en-GB", {
              //   day: "2-digit",
              //   month: "short"
              // })}
              content={`submissions: ${data.count ? data.count+1 : 0}`}
            >
              <rect
              {...props}
              rx={1}
              ry={1}
              style={{
                stroke: "rgba(0,255,255,0.4)",
                strokeWidth: data.count ? 0.7 : 0.2,
              }}
              />
            </Tooltip>
          )
        }}
        panelColors={{
          0:  "#0f172a",
          1:  "#083344",
          2:  "#0e7490",
          3:  "#0891b2",
          4:  "#06b6d4",
          5:  "#22cfe9",
          6:  "#2dd4bf",
          7:  "#5eead4",
          8:  "#67e8f9",
          9:  "#a5f3fc"
        }}
        style={{
          color: "#67e8f9",
          "--rhm-rect-active": "#22d3ee",
        } as React.CSSProperties}
      />
    </div>
  );
};

export default StreakHeatmap;
