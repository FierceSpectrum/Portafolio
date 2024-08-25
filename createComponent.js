// createComponent.js
const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

const PALABRAS_CLAVES = ["res", "delt"];
const COMPONENTS_DIR = path.join(__dirname, "src", "Components");

const toPascalCase = (str) => {
  return str
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

// Extrae flags y nombres de componentes de los argumentos
function extraerFlagsAndComponentsName(args) {
  const flags = [];
  const componentNames = [];
  args.forEach((arg) => {
    if (arg.startsWith("-")) {
      let flag = arg.slice(1);
      if (PALABRAS_CLAVES.includes(flag)) {
        flags.push(flag);
      } else {
        flags.push(...flag.split(""));
      }
    } else {
      componentNames.push(toPascalCase(arg));
    }
  });
  return { flags, componentNames };
}

// Verifica si un componente ya existe
function componenteYaExiste(componentName) {
  const componentDir = path.join(COMPONENTS_DIR, componentName);
  return fs.existsSync(componentDir);
}

// Crea un componente
function crearComponente(componentName, isSassInstalled) {
  const componentDir = path.join(COMPONENTS_DIR, componentName);
  const styleExtension = isSassInstalled ? "scss" : "css";

  fs.mkdirSync(componentDir, { recursive: true });

  const componentContent = `
import React from 'react';
import './${componentName}.${styleExtension}';

const ${componentName} = () => {
  return (
    <div className="${componentName}">
      {/* Aquí va el contenido del componente */}
    </div>
  );
}

export default ${componentName};
  `.trim();

  const styleContent = `.${componentName} {\n  // Estilos para el componente ${componentName}\n}\n`;

  fs.writeFileSync(
    path.join(componentDir, `${componentName}.js`),
    componentContent
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.${styleExtension}`),
    styleContent
  );

  console.log(`Componente ${componentName} creado exitosamente.`);
}

// Obtener todos los argumentos
const args = process.argv.slice(2);
const { flags, componentNames } = extraerFlagsAndComponentsName(args);

// Ejemplo de uso posterior con los flags detectados
if (componentNames.length === 0) {
  console.error("Por favor proporciona al menos un nombre de componente.");
  process.exit(1);
}

// Verificar y crear la carpeta 'Components' si no existe
if (!fs.existsSync(COMPONENTS_DIR)) {
  fs.mkdirSync(COMPONENTS_DIR);
}

// Verificar si `sass` está instalado
let isSassInstalled = false;
try {
  execSync("npm list sass", { stdio: "ignore" });
  isSassInstalled = true;
} catch (error) {
  isSassInstalled = false;
}

// Verificar si alguno de los componentes ya existe y no se incluye el flag '-res'
const existingComponents = componentNames.filter(componenteYaExiste);

if (existingComponents.length > 0 && !flags.includes("res")) {
  console.error(
    `Los siguientes componentes ya existen: ${existingComponents.join(
      ", "
    )}. Usa el flag '-res' para sobrescribir. No se creará ninguno de los componentes.`
  );
  process.exit(1); // Terminar si alguno ya existe y no tiene '-res'
}

componentNames.forEach((componentName) => {
  const existe = componenteYaExiste(componentName);

  if (existe && flags.includes("res")) {
    fs.rmSync(path.join(COMPONENTS_DIR, componentName), {
      recursive: true,
      force: true,
    });
  }

  crearComponente(componentName, isSassInstalled);
});
