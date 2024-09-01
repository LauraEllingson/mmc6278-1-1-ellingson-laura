const { program } = require("commander");
const fs = require("fs/promises");
const chalk = require("chalk");
const QUOTE_FILE = "quotes.txt";

program
  .name("quotes")
  .description("CLI tool for inspiration")
  .version("0.1.0");

program
  .command("getQuote")
  .description("Retrieves a random quote")
  .action(async () => {
    try {
      // Read the quotes.txt file
      const data = await fs.readFile("quotes.txt", "utf-8");

      // Split the data into an array of lines and filter out any empty lines
      const quotes = data.split("\n").filter((line) => line.trim() !== "");
      if (quotes.length === 0) {
        console.log(chalk.yellow("No quotes available."));
        return;
      }

      // Select a random quote 
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const [quote, author] = quotes[randomIndex].split("|");

      // Anonymous when no author is
      const formattedAuthor = author && author.trim() ? author.trim() : "Anonymous";

      // Log the quote and author to the console
      console.log(chalk.green.bold(quote.trim())); // Display the quote in green and bold
      console.log(chalk.blue(`- ${author.trim()}`)); // Display the author in blue
    } catch (err) {
      console.error(chalk.red("Error reading the quotes file."), err);
    }
  });


program
  .command("addQuote <quote> [author]")
  .description("Adds a quote to the quotes file")
  .action(async (quote, author) => {
    try {
      // Default to "Anonymous" if no author is provided
      const authorToSave = author ? author.trim() : "Anonymous";
      const quoteToSave = quote.trim();

      // Prepare the new quote with the author
      const newQuote = `${quoteToSave}|${authorToSave}`;

      // Append the new quote to the quotes.txt file
      await fs.appendFile("quotes.txt", `\n${newQuote}`);

      // Alert the user that the quote was added
      console.log(chalk.green("Quote added successfully!"));
    } catch (err) {
      console.error(chalk.red("Error adding the quote to the file."), err);
    }
  });


program.parse();

