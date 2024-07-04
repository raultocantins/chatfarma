import { Button, Tooltip } from "@material-ui/core";
import { Archive } from "@material-ui/icons";
import React from "react";
import { CSVLink } from "react-csv";
import { formateDate, formateDateWithHours } from "../../utils/dateUtils";

const FormattedData = (data) => {
  const formattedData = [];

  // Ordenar os dados pelo ID da venda
  const sortedData = data.sort((a, b) => a.id - b.id);

  sortedData.forEach((sale) => {
    sale.productList.forEach((product) => {
      formattedData.push({
        'ID da Venda': `Venda #${sale.id}`,
        'Data da venda': formateDateWithHours(sale.createdAt),
        'Nome do Produto': product.name,
        Quantidade: product.quantity,
        Valor: product.amount,
        "Status da venda": sale.condition.name,
        'Atendente': sale.user.name,
      });
    });
  });

  return formattedData;
};

const headers = [
  { label: 'ID da Venda', key: 'ID da Venda' },
  { label: 'Data da venda', key: 'Data da venda' },
  { label: 'Nome do Produto', key: 'Nome do Produto' },
  { label: 'Quantidade', key: 'Quantidade' },
  { label: 'Valor', key: 'Valor' },
  { label: 'Status da venda', key: 'Status da venda' },
  { label: 'Atendente', key: 'Atendente' },
];

const RelatorioSalesCSV = ({ salesData }) => (
  <Tooltip title="Relatório de vendas">
    <CSVLink
      data={FormattedData(salesData)}
      headers={headers}
      filename={`dados_vendas_${formateDate(new Date())}.csv`}
    >
      <Button variant="contained" color="primary">
        <Archive />
      </Button>
    </CSVLink>
  </Tooltip>
);

export default RelatorioSalesCSV;
