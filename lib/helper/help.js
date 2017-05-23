'use strict'

const help = () => {
  console.error("Parametro invalido!");
  console.error("");
  console.error("Usar:");
  console.error("\tstart  \t\tPara iniciar o agent Tblu");
  console.error("\tconfigure\t\tPara configurar o agent Tblu");
  console.error("\tservice install\t\tPara instalar o agent Tblu como serviço");
  console.error("\tservice uninstall\t\tPara desinstalar o agent Tblu como serviço");
  console.error("\thelp\t\tPara mostrar esse menu");
}

module.exports = help;
