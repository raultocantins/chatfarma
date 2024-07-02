import React from "react";

function MoneyFormat({ value }) {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

    return <span>{formattedValue}</span>;
}

export default MoneyFormat;
