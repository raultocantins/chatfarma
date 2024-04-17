import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@material-ui/core";

const QueueChart = ({ tickets, loading }) => {
  const theme = useTheme();
  var updateMapper = (conversas) => {
    const queues = conversas.reduce((acc, curr) => {
      if (curr.queue) {
        const queueName = curr.queue ? curr.queue.name : "Sem departamento";
        const queueColor = curr.queue ? curr.queue.color : null;
        acc[queueName] = {
          count: (acc[queueName]?.count || 0) + 1,
          color: queueColor,
        };
      }
      return acc;
    }, {});

    const result = Object.entries(queues).map(([name, { count, color }]) => ({
      name,
      value: count,
      color: color || "#f0f0f0",
    }));

    return {
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: result.map((e) => e.name),
        textStyle: {
          color: theme.palette.text.secondary,
        },
      },
      series: [
        {
          name: "Atendimentos",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: result,

          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
      color: result.map((e) => e.color),
    };
  };

  return (
    <>
      <ReactECharts
        option={updateMapper(tickets)}
        style={{ height: 400 }}
        showLoading={loading}
      />
    </>
  );
};

export default QueueChart;
