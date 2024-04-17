import React from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@material-ui/core";

const UsersChart = ({ tickets, loading }) => {
  const theme = useTheme();

  const corComOpacidade = (corHex, opacidade) => {
    const r = parseInt(corHex.slice(1, 3), 16);
    const g = parseInt(corHex.slice(3, 5), 16);
    const b = parseInt(corHex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacidade})`;
  };

  const corOriginal = theme.palette.primary.main;
  const opacidade = 0.7;
  const corComNovaOpacidade = corComOpacidade(corOriginal, opacidade);

  var updateMapper = (tickets) => {
    const contagem = {};
    tickets.forEach((ticket) => {
      if (ticket?.user?.name != null) {
        const userName = ticket.user.name;
        contagem[userName] = contagem[userName] ? contagem[userName] + 1 : 1;
      } else {
        return;
      }
    });
    const list = Object.entries(contagem).map(([nome, quantidade]) => ({
      nome,
      quantidade,
    }));

    return {
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "Quantidade <br/>{b} : {c}",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      legend: {
        data: ["Tickets"],
        textStyle: {
          color: theme.palette.text.secondary,
        },
      },
      xAxis: {
        data: list.length === 0 ? [""] : list.map((e) => e.nome),
      },
      yAxis: {},
      series: [
        {
          name: "Tickets",
          type: "bar",
          data: list.length === 0 ? [0] : list.map((e) => e.quantidade),
        },
      ],
      color: [corComNovaOpacidade],
      textStyle: {
        color: theme.palette.text.secondary,
      },
    };
  };

  return (
    <ReactECharts
      option={updateMapper(tickets)}
      style={{ height: 400 }}
      opts={{ renderer: "svg" }}
      showLoading={loading}
    />
  );
};

export default UsersChart;
