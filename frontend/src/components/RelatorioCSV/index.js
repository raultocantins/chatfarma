import { Button, Tooltip } from "@material-ui/core";
import { Archive } from "@material-ui/icons";
import React from "react";
import { CSVLink } from "react-csv";

const RelatorioCSV = ({ dados, ...rest }) => {
  const calcularAtendimentosPorUsuario = () => {
    const atendimentosPorUsuario = {};
    dados.forEach((item) => {
      const usuario = item.user ? item.user.name : "Sem atendente";
      if (!atendimentosPorUsuario[usuario]) {
        atendimentosPorUsuario[usuario] = 0;
      }
      atendimentosPorUsuario[usuario]++;
    });
    return atendimentosPorUsuario;
  };
  const calcularAtendimentosPorDepartamento = () => {
    const atendimentosPorDepartamento = {};
    dados.forEach((item) => {
      const departamento = item.queue ? item.queue.name : "Sem departamento";
      if (!atendimentosPorDepartamento[departamento]) {
        atendimentosPorDepartamento[departamento] = 0;
      }
      atendimentosPorDepartamento[departamento]++;
    });
    return atendimentosPorDepartamento;
  };

  const totalAtendimentos = dados.length;
  const atendimentosPorUsuario = calcularAtendimentosPorUsuario();
  const atendimentosPorDepartamento = calcularAtendimentosPorDepartamento();

  const dataCSV = [
    [`TOTAL DE ATENDIMENTOS: ${totalAtendimentos}`],
    [],
    ["ATENDIMENTOS POR USUÁRIO"],
    ...Object.entries(atendimentosPorUsuario).map(([usuario, quantidade]) => [
      usuario,
      quantidade,
    ]),
    [],
    ["ATENDIMENTOS POR DEPARTAMENTO"],
    ...Object.entries(atendimentosPorDepartamento).map(
      ([departamento, quantidade]) => [departamento, quantidade]
    ),
  ];

  return (
    <Tooltip title="Relátorio">
      <CSVLink
        {...rest}
        filename={"relátorio.csv"}
        data={dataCSV}
        target="_blank"
      >
        <Button variant="contained" color="primary">
          <Archive />
        </Button>
      </CSVLink>
    </Tooltip>
  );
};

export default RelatorioCSV;
