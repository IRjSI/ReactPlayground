import HeatMap from "@uiw/react-heat-map";
import Tooltip from "@uiw/react-tooltip";
import { useUser } from "../hooks/useUser";
import { Activity } from "../types/types";

const StreakHeatmap = () => {
  const { userInfo } = useUser();

  const value: Activity[] = Array.isArray(userInfo?.userActivity)
    ? userInfo.userActivity.map((d: any) => ({
      date: new Date(d.date).toLocaleDateString("en-CA"),
      count: d.count || 0,
    }))
    : [];

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-white mb-6">
        Activity Streak
      </h2>

      <div className="flex justify-start overflow-x-auto pb-4">
        <HeatMap
          value={value}
          startDate={startOfYear}
          endDate={endOfYear}
          width={850}
          rectRender={(props, data) => {
            const dateStr = data?.date ? `${data.date}` : "Date not found";
            return (
              <Tooltip
                placement="top"
                content={`${dateStr}: ${data?.count || 0} submissions`}
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
            );
          }}
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
            9: "#cffafe",
          }}
          style={{
            color: "#67e8f9",
            "--rhm-rect-active": "#22d3ee",
          } as React.CSSProperties}
        />
      </div>

      {value.length === 0 && (
        <p className="text-gray-500 text-sm mt-4 text-center">
          No activity yet. Start solving challenges!
        </p>
      )}
    </div>
  );
};

export default StreakHeatmap;