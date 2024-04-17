import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@material-ui/core";

const DayChart = ({ tickets, loading }) => {
  const theme = useTheme();
  var updateMapper = (tickets) => {
    function contarChamadosPorDia(conversas) {
      const contagemPorDia = {};

      conversas.forEach((conversa) => {
        let dataCriacao = new Date(conversa.createdAt);
        let dataFormatada = `${dataCriacao.getDate()}/${
          dataCriacao.getMonth() + 1
        }/${dataCriacao.getFullYear()}`;

        if (contagemPorDia[dataFormatada]) {
          contagemPorDia[dataFormatada]++;
        } else {
          contagemPorDia[dataFormatada] = 1;
        }
      });

      return contagemPorDia;
    }

    const chamadosPorDia = contarChamadosPorDia(tickets);
    return {
      tooltip: {
        trigger: "axis",
      },
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
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data:
            Object.keys(chamadosPorDia).length === 0
              ? ["", 0]
              : Object.keys(chamadosPorDia),
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Quantidade",
          type: "line",
          stack: "linha",
          areaStyle: { normal: {} },
          data:
            Object.values(chamadosPorDia).length === 0
              ? ["", 0]
              : Object.values(chamadosPorDia),
        },
      ],
      color: [theme.palette.primary.main],
      textStyle: {
        color: theme.palette.text.secondary,
      },
    };
  };

  return (
    <ReactECharts
      option={updateMapper(tickets)}
      style={{ height: 400 }}
      showLoading={loading}
    />
  );
};

export default DayChart;
