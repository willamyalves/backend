// Módulos externos
import inquirer from "inquirer";
import chalk from "chalk";

// Módulos internos
import fs from "fs";

const operation = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "operation",
        message: "O que você precisa fazer?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const operationSelected = answer.operation;

      switch (operationSelected) {
        case "Criar conta":
          createAccount();
          break;
        case "Consultar saldo":
          verifyBalance();
          break;
        case "Depositar":
          deposit();
          break;
        case "Sacar":
          withdraw();
          break;
        case "Sair":
          exit();
          break;
      }
    })
    .catch((error) => console.log(error));
};

const createAccount = () => {
  console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));

  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para a sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;
      if (!fs.existsSync("./accounts-bank")) {
        fs.mkdirSync("./accounts-bank");
      }
      if (!accountName) {
        console.log(
          chalk.bgRed.black("Por favor, defina um nome para a sua conta")
        );
        return createAccount();
      }
      fs.writeFileSync(`./accounts-bank/${accountName}.json`, '{"balance": 0}');
      console.log(chalk.blue.bold("Conta criada com sucesso!"));
      operation();
    })
    .catch((error) => console.log(error));
};

const verifyBalance = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;

      if (!accountName) {
        console.log(
          chalk.bgRed.black("Por favor, escreva o nome da sua conta")
        );
        return verifyBalance();
      }
      if (!fs.existsSync(`./accounts-bank/${accountName}.json`)) {
        console.log(
          chalk.bgRed("Esta conta não existe, escolha outro nome da conta")
        );
        return verifyBalance();
      }
      const data = fs.readFileSync(
        `./accounts-bank/${accountName}.json`,
        "utf8"
      );

      try {
        const balance = JSON.parse(data).balance;
        console.log(
          chalk.bgBlue(`Olá, o saldo da sua conta é de R$${balance}`)
        );
        return operation();
      } catch (error) {
        console.log(error);
      }
    })
    .catch((error) => console.log(error));
};

const deposit = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;

      if (!accountName) {
        console.log(
          chalk.bgRed.black("Por favor, escreva o nome da sua conta")
        );
        return deposit();
      }
      if (!fs.existsSync(`./accounts-bank/${accountName}.json`)) {
        console.log(
          chalk.bgRed("Esta conta não existe, escolha outro nome da conta")
        );
        return deposit();
      }
      inquirer
        .prompt([
          {
            name: "valueToDeposit",
            message: "Quanto você deseja depositar?",
          },
        ])
        .then((answer) => {
          const valueToDeposit = Number(answer.valueToDeposit);

          if (isNaN(valueToDeposit) || valueToDeposit <= 0) {
            console.log(chalk.bgRed.black("Valor inválido, tente novamente"));
            return deposit();
          }

          const data = fs.readFileSync(
            `./accounts-bank/${accountName}.json`,
            "utf8"
          );
          try {
            let balance = JSON.parse(data).balance;

            balance = balance + valueToDeposit;

            const stringBalance = JSON.stringify({ balance });

            fs.writeFileSync(
              `./accounts-bank/${accountName}.json`,
              stringBalance
            );
            console.log(chalk.bgGreen.white("Depósito realizado com sucesso!"));
            operation();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

const withdraw = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;

      if (!accountName) {
        console.log(
          chalk.bgRed.black("Por favor, escreva o nome da sua conta")
        );
        return withdraw();
      }
      if (!fs.existsSync(`./accounts-bank/${accountName}.json`)) {
        console.log(
          chalk.bgRed("Esta conta não existe, escolha outro nome da conta")
        );
        return withdraw();
      }

      inquirer
        .prompt([
          {
            name: "valueToWithdraw",
            message: "Quanto você deseja sacar?",
          },
        ])
        .then((answer) => {
          const valueToWithdraw = Number(answer.valueToWithdraw);

          const data = fs.readFileSync(
            `./accounts-bank/${accountName}.json`,
            "utf8"
          );

          try {
            let balance = JSON.parse(data).balance;

            if (isNaN(valueToWithdraw) || valueToWithdraw > balance) {
              console.log(chalk.bgRed("Valor indisponível"));
              return operation();
            }

            balance = balance - valueToWithdraw;

            const stringBalance = JSON.stringify({ balance });

            fs.writeFileSync(
              `./accounts-bank/${accountName}.json`,
              stringBalance
            );

            console.log(
              chalk.green(
                `Foi realizado um saque de R$${valueToWithdraw} da sua conta`
              )
            );

            operation();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

const exit = () => {
  console.log(chalk.bgBlue("Obrigado por usar o Accounts!"));
  process.exit();
};

operation();
