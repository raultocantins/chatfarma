import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@material-ui/core";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { MoneyFormatWithoutSpan } from "../../utils/moneyFormat";
const SalesChart = ({ dateRange, queueId, loading }) => {
  const theme = useTheme();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    console.log(dateRange)
    const delayDebounceFn = setTimeout(() => {
      const fetchSales = async () => {
        try {
          const { data } = await api.get("/sales", {
            params: {
              startDate: dateRange[0],
              endDate: dateRange[1],
              queueId: queueId,
            },
          });
          setSales(data.sales);
        } catch (err) {
          toastError(err);
        }
      };
      fetchSales();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [dateRange, queueId]);

  const corComOpacidade = (corHex, opacidade) => {
    const r = parseInt(corHex.slice(1, 3), 16);
    const g = parseInt(corHex.slice(3, 5), 16);
    const b = parseInt(corHex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacidade})`;
  };

  const corOriginal = theme.palette.primary.main;
  const opacidade = 0.7;
  const corComNovaOpacidade = corComOpacidade(corOriginal, opacidade);

  // Função para calcular o total de vendas de uma lista de produtos
  const getTotalSales = (productList) => {
    return productList.reduce((total, product) => total + (product.quantity * product.amount), 0);
  };

  // Função para processar os dados de vendas e somar todas as vendas por usuário
  const processData = (salesData) => {
    const salesByUser = {};

    salesData.forEach(sale => {
      const userName = sale.user.name;
      const totalSales = getTotalSales(sale.productList);

      if (salesByUser[userName]) {
        salesByUser[userName] += totalSales;
      } else {
        salesByUser[userName] = totalSales;
      }
    });

    return Object.entries(salesByUser).map(([user, totalSales]) => ({
      user,
      totalSales
    }));
  };

  // Função para configurar as opções do gráfico
  const getOption = (data) => {
    const users = data.map(sale => sale.user);
    const totalSales = data.map(sale => sale.totalSales);

    return {
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return `${MoneyFormatWithoutSpan({ value: params[0].value })}`;
        }
      },
      legend: {
        data: ["Tickets"],
        textStyle: {
          color: theme.palette.text.secondary,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: users,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => MoneyFormatWithoutSpan({ value })
        }
      },
      series: [
        {
          name: 'Total de Vendas',
          type: 'bar',
          data: totalSales,
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }) => MoneyFormatWithoutSpan({ value })
          }
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
      option={getOption(processData(sales))}
      style={{ height: 400 }}
      opts={{ renderer: "svg" }}
      showLoading={loading}
    />
  );
};

export default SalesChart;
