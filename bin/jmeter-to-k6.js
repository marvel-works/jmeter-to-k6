#!/usr/bin/env node
const chalk = require('chalk');
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");
const convert = require("../src/convert");

const argv = yargs
  .usage("jmeter-to-k6 <jmx-file>")
  .usage("jmeter-to-k6 <jmx-file> -o <k6-file>")
  .option("out", {
    alias: "o",
    describe: "Output file",
    type: "string"
  }).argv;

function exit() {
  yargs.showHelp();
  process.exit(1);
}

const input = argv._[0] || exit();
const output = argv.out;

const jmx = fs.readFileSync(input, { encoding: "utf8" });
const script = convert(jmx);


if (output) {
  console.log(`Starting conversion of: ${chalk.green(path.resolve(input))}\n`);
  fs.ensureDirSync(output);
  fs.copySync(path.resolve(__dirname, "../vendor"), `${output}/libs`);

  fs.outputFileSync(`${output}/test.js`, script);
  console.log(`Success! Created test at ${chalk.green(path.resolve(`${output}/test.js`))}`);
} else {
  console.log(`Please specify the test directory: \n  ${chalk.cyan("jmeter-to-jk6")} ${chalk.green("<jmx-file> -o <test-dir>")}\n`);
  console.log(`For example: \n  ${chalk.cyan("jmeter-to-jk6")} ${chalk.green("load-test")}`);
}
