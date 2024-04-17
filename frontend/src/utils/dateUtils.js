function formateDateWithHours(dataString) {
  var data = new Date(dataString);
  var dia = ("0" + data.getDate()).slice(-2);
  var mes = ("0" + (data.getMonth() + 1)).slice(-2);
  var ano = data.getFullYear();
  var horas = ("0" + data.getHours()).slice(-2);
  var minutos = ("0" + data.getMinutes()).slice(-2);

  return dia + "/" + mes + "/" + ano + " " + horas + ":" + minutos;
}

export { formateDateWithHours };
