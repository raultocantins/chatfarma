import React from "react";

export function MoneyFormat({ value }) {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

    return <span>{formattedValue}</span>;
}

export function MoneyFormatWithoutSpan({ value }) {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
    return formattedValue;
}


