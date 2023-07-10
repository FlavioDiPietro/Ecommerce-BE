const { Command } = require("commander");

const program = new Command();

//declara el flag ovariable, da una descripción, y un valor por defedto
program
  .option("-d", "Variable para debug", false)
  .option("--mode <mode>", "Modo de trabajo", "DEVELOPMENT");

program.parse();

module.exports = program;
