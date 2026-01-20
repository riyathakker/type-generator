export type OutputStyle = "interface" | "type";

export function jsonToTs(
  name: string,
  value: any,
  style: OutputStyle = "interface",
) {
  const output: string[] = [];
  const typeName = toPascal(name);

  const typeOutput = convertToTs(value, typeName, output, style);

  const isArrayRoot = Array.isArray(value);
  if (isArrayRoot) {
    output.push(`export type ${typeName} = ${typeOutput};`);
  }

  return output.join("\n\n");
}

function convertToTs(
  val: any,
  typeName: string,
  output: string[],
  style: OutputStyle,
): string {
  if (val === null) return "null";

  if (Array.isArray(val)) {
    if (!val.length) return "any[]";
    const itemType = convertToTs(val[0], typeName + "Item", output, style);
    return `${itemType}[]`;
  }

  if (typeof val === "object") {
    const objOutput: string[] = [];

    for (const key in val) {
      const propType = convertToTs(
        val[key],
        typeName + toPascal(key),
        output,
        style,
      );
      objOutput.push(`  ${convertToString(key)}: ${propType};`);
    }

    const body = `{\n${objOutput.join("\n")}\n}`;

    if (style === "interface") {
      output.push(`export interface ${typeName} ${body}`);
    } else {
      output.push(`export type ${typeName} = ${body};`);
    }

    return typeName;
  }

  return typeof val;
}

function convertToString(key: string) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function toPascal(str: string) {
  const words = str.match(/[a-zA-Z0-9]+/g);
  if (!words) return "Type";

  let result = words
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join("");

  return /^\d/.test(result) ? "T" + result : result;
}
