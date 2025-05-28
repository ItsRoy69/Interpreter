/**
 * Custom DSL Interpreter
 */

function interpretDSL(commands) {
  const memory = {}; // Stores variables and their values
  const output = []; // Stores output
  const stack = [];  // Stack to handle nested IF conditions

  let i = 0;
  while (i < commands.length) {
    const line = commands[i].trim();

    // If inside an IF block that evaluated to false, skip until ENDIF
    if (stack.length && !stack[stack.length - 1].condition) {
      if (line === "ENDIF") {
        stack.pop();
      }
      i++;
      continue;
    }

    // Handle SET command
    if (line.startsWith("SET ")) {
      const [, variable, value] = line.split(" ");
      memory[variable] = parseInt(value);

    // Handle ADD command
    } else if (line.startsWith("ADD ")) {
      const [, variable, value] = line.split(" ");
      memory[variable] = (memory[variable] || 0) + parseInt(value);

    // Handle MUL command
    } else if (line.startsWith("MUL ")) {
      const [, variable, value] = line.split(" ");
      memory[variable] = (memory[variable] || 0) * parseInt(value);

    // Handle PRINT command
    } else if (line.startsWith("PRINT ")) {
      const [, variable] = line.split(" ");
      output.push(String(memory[variable] ?? 0));

    // Handle IF condition
    } else if (line.startsWith("IF ") && line.includes(" THEN")) {
      const condition = line.slice(3, line.indexOf("THEN")).trim();
      const [left, operator, right] = condition.split(" ");

      const leftVal = isNaN(left) ? (memory[left] || 0) : parseInt(left);
      const rightVal = isNaN(right) ? (memory[right] || 0) : parseInt(right);

      let result = false;
      switch (operator) {
        case ">": result = leftVal > rightVal; break;
        case "<": result = leftVal < rightVal; break;
        case "==": result = leftVal === rightVal; break;
        case "!=": result = leftVal !== rightVal; break;
        case ">=": result = leftVal >= rightVal; break;
        case "<=": result = leftVal <= rightVal; break;
        default: result = false;
      }

      stack.push({ condition: result });

    // Handle ENDIF block
    } else if (line === "ENDIF") {
      if (stack.length) stack.pop();
    }

    i++;
  }

  return output;
}

// Input for testing
const input = [
  "SET x 2",
  "SET y 3",
  "IF y > x THEN",
  " ADD x 1",
  " PRINT x",
  "ENDIF"
];

console.log(interpretDSL(input)); 
// Output: ["3"]
