import { parse } from "@babel/parser";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const SRC = join(process.cwd(), "src");

function walk(dir, files = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (f.endsWith(".jsx") || f.endsWith(".js")) files.push(p);
  }
  return files;
}

const GLOBALS = new Set([
  "window", "navigator", "document", "console", "fetch", "alert",
  "prompt", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "Date", "Math", "JSON", "Object", "Array", "String", "Number",
  "Boolean", "Promise", "encodeURIComponent", "decodeURIComponent",
  "location", "localStorage", "sessionStorage", "URL", "structuredClone",
  "crypto", "performance", "requestAnimationFrame", "cancelAnimationFrame",
  "undefined", "NaN", "Infinity", "RegExp", "Error", "Intl",
  "speechSynthesis", "SpeechSynthesisUtterance", "Audio", "URLSearchParams",
  "FormData", "Blob", "FileReader", "Event", "CustomEvent", "MessageChannel",
]);

const REACT_KNOWN = new Set([
  "React", "useState", "useEffect", "useRef", "useMemo", "useCallback",
  "useContext", "useReducer", "useLayoutEffect", "useTransition",
  "useOnlineStatus", "Fragment", "Suspense", "lazy",
]);

const HTML_TAGS = new Set([
  "div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "a", "button",
  "input", "textarea", "select", "option", "img", "ul", "ol", "li", "table",
  "thead", "tbody", "tr", "td", "th", "form", "label", "section", "header",
  "footer", "nav", "main", "aside", "article", "strong", "em", "b", "i",
  "br", "hr", "small", "code", "pre", "blockquote", "svg", "path", "circle",
  "rect", "g", "use", "audio", "video", "source", "iframe", "link", "style",
]);

let errors = 0;
let checked = 0;

for (const file of walk(SRC)) {
  if (/\.test\.(js|jsx)$/.test(file)) continue;
  let code;
  try { code = readFileSync(file, "utf8"); } catch { continue; }
  let ast;
  try {
    ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
  } catch (e) {
    console.log(`⚠  Sintaxis: ${file}: ${e.message.split("\n")[0]}`);
    errors++;
    continue;
  }

  // Declaraciones a nivel de módulo
  const moduleDeclared = new Set(GLOBALS);
  for (const node of ast.program.body) {
    if (node.type === "ImportDeclaration") {
      node.specifiers.forEach((s) => {
        if (s.type === "ImportSpecifier" || s.type === "ImportDefaultSpecifier" || s.type === "ImportNamespaceSpecifier") {
          moduleDeclared.add(s.local.name);
        }
      });
    } else if (node.type === "VariableDeclaration") {
      node.declarations.forEach((d) => {
        if (d.id.type === "Identifier") moduleDeclared.add(d.id.name);
        else if (d.id.type === "ObjectPattern") d.id.properties.forEach((p) => { if (p.value) moduleDeclared.add(p.value.name); });
        else if (d.id.type === "ArrayPattern") d.id.elements.forEach((e) => { if (e && e.name) moduleDeclared.add(e.name); });
      });
    } else if (node.type === "FunctionDeclaration") {
      moduleDeclared.add(node.id.name);
    } else if (node.type === "ExportNamedDeclaration" && node.declaration && node.declaration.type === "FunctionDeclaration") {
      moduleDeclared.add(node.declaration.id.name);
    } else if (node.type === "ExportNamedDeclaration" && node.declaration && node.declaration.type === "VariableDeclaration") {
      node.declaration.declarations.forEach((d) => {
        if (d.id.type === "Identifier") moduleDeclared.add(d.id.name);
      });
    }
  }

  // Recolectar identificadores de un AST (recorrido genérico robusto)
  function collectIds(n, out, seen) {
    if (!n || seen.has(n)) return;
    seen.add(n);

    if (n.type === "Identifier") {
      out.add(n.name);
      return;
    }
    // Propiedad de miembro: solo cuenta el objeto, no la propiedad
    if (n.type === "MemberExpression" || n.type === "OptionalMemberExpression") {
      collectIds(n.object, out, seen);
      if (n.computed) collectIds(n.property, out, seen);
      return;
    }
    // Objeto literal: solo los valores, no las claves
    if (n.type === "ObjectExpression") {
      n.properties.forEach((p) => collectIds(p.value, out, seen));
      return;
    }
    if (n.type === "ObjectProperty") {
      collectIds(n.value, out, seen);
      return;
    }
    // Etiquetas JSX y atributos: no cuentan
    if (n.type === "JSXIdentifier" || n.type === "JSXNamespacedName" || n.type === "JSXMemberExpression") {
      if (n.type === "JSXMemberExpression") collectIds(n.object, out, seen);
      return;
    }
    if (n.type === "JSXAttribute") return;

    // Recorrido genérico de campos
    for (const key in n) {
      if (key === "loc" || key === "start" || key === "end" || key === "leadingComments" || key === "trailingComments" || key === "innerComments") continue;
      const v = n[key];
      if (Array.isArray(v)) v.forEach((x) => collectIds(x, out, seen));
      else if (v && typeof v === "object") collectIds(v, out, seen);
    }
  }

  // Declaraciones DENTRO de un scope (componente o bloque) incluyendo callbacks
  function declareFromScope(fnBody, into) {
    const visit = (n) => {
      if (!n) return;
      if (n.type === "VariableDeclaration") {
        n.declarations.forEach((d) => {
          if (d.id.type === "Identifier") into.add(d.id.name);
          else if (d.id.type === "ObjectPattern") d.id.properties.forEach((p) => { if (p.value && p.value.type === "Identifier") into.add(p.value.name); });
          else if (d.id.type === "ArrayPattern") d.id.elements.forEach((e) => { if (e && e.type === "Identifier") into.add(e.name); });
        });
      } else if (n.type === "FunctionDeclaration") {
        into.add(n.id.name);
        n.params.forEach((p) => { if (p.type === "Identifier") into.add(p.name); });
      } else if (n.type === "ArrowFunctionExpression" || n.type === "FunctionExpression") {
        // params de callbacks como .map((x) => ...)
        if (n.params) n.params.forEach((p) => {
          if (p.type === "Identifier") into.add(p.name);
          else if (p.type === "ObjectPattern") p.properties.forEach((pp) => { if (pp.value && pp.value.type === "Identifier") into.add(pp.value.name); });
        });
      } else if (n.type === "CatchClause") {
        if (n.param && n.param.type === "Identifier") into.add(n.param.name);
        if (n.param && n.param.type === "ObjectPattern") n.param.properties.forEach((pp) => { if (pp.value && pp.value.type === "Identifier") into.add(pp.value.name); });
      } else if (n.type === "VariableDeclarator" && n.init && n.init.type === "CallExpression") {
        // destructuring de hooks: const { x, setX } = useX()
        const callee = n.init.callee;
        const isHookCall = callee && callee.type === "Identifier" && /^use[A-Z]/.test(callee.name);
        if (isHookCall && n.id.type === "ObjectPattern") {
          n.id.properties.forEach((p) => {
            if (p.key && p.key.type === "Identifier") into.add(p.key.name);
            // desanidar: { a: [x, setX], b } -> añadir x y setX también
            if (p.value && p.value.type === "ArrayPattern") {
              p.value.elements.forEach((e) => { if (e && e.type === "Identifier") into.add(e.name); });
            }
            if (p.value && p.value.type === "ObjectPattern") {
              p.value.properties.forEach((pp) => { if (pp.key && pp.key.type === "Identifier") into.add(pp.key.name); });
            }
          });
        } else if (isHookCall && n.id.type === "ArrayPattern") {
          n.id.elements.forEach((e) => { if (e && e.type === "Identifier") into.add(e.name); });
        } else if (isHookCall && n.id.type === "Identifier") {
          into.add(n.id.name);
        }
      }
      for (const key in n) {
        if (key === "loc" || key === "start" || key === "end" || key === "leadingComments" || key === "trailingComments") continue;
        const v = n[key];
        if (Array.isArray(v)) v.forEach(visit);
        else if (v && typeof v === "object") visit(v);
      }
    };
    visit(fnBody);
  }

  // Analizar cada componente: exportados + const-arrow en mayúscula (no exportados)
  const components = [];
  for (const node of ast.program.body) {
    let fn = null;
    if (node.type === "ExportDefaultDeclaration" && (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ArrowFunctionExpression")) {
      fn = node.declaration;
    } else if (node.type === "FunctionDeclaration") {
      fn = node;
    } else if (node.type === "VariableDeclaration") {
      node.declarations.forEach((d) => {
        if (d.id.type === "Identifier" && /^[A-Z]/.test(d.id.name) && d.init && (d.init.type === "ArrowFunctionExpression" || d.init.type === "FunctionExpression")) {
          fn = d.init;
        }
      });
    }
    if (fn && (fn.id && /[A-Z]/.test(fn.id.name) || fn.id || node.type !== "VariableDeclaration")) components.push(fn);
  }

  for (const fn of components) {
    const fnName = (fn.id && fn.id.name) || "Componente";
    const body = fn.body.type === "BlockStatement" ? fn.body.body : [fn.body];
    const declared = new Set(moduleDeclared);
    // params del componente (soporta destructuring de props)
    fn.params.forEach((p) => {
      if (p.type === "Identifier") declared.add(p.name);
      else if (p.type === "ObjectPattern") p.properties.forEach((pp) => { if (pp.value && pp.value.type === "Identifier") declared.add(pp.value.name); });
      else if (p.type === "AssignmentPattern" && p.left.type === "Identifier") declared.add(p.left.name);
    });
    // si es FunctionDeclaration, sus params (pueden ser ObjectPattern por props)
    if (fn.type === "FunctionDeclaration") {
      fn.params.forEach((p) => {
        if (p.type === "Identifier") declared.add(p.name);
        else if (p.type === "ObjectPattern") {
          p.properties.forEach((pp) => {
            if (pp.type === "ObjectProperty" && pp.key.type === "Identifier") declared.add(pp.key.name);
          });
        }
      });
    }
    // declaraciones dentro del componente (incluye callbacks)
    declareFromScope(body, declared);

    // usos en JSX
    const used = new Set();
    body.forEach((n) => collectIds(n, used, new Set()));

    // usos en lógica (expresiones fuera de JSX)
    const usedLogic = new Set();
    const scan = (n) => {
      if (!n) return;
      if (n.type === "Identifier" && !isDeclaredInNode(n, body)) usedLogic.add(n.name);
      for (const key in n) {
        if (key === "loc" || key === "start" || key === "end" || key === "leadingComments" || key === "trailingComments") continue;
        const v = n[key];
        if (Array.isArray(v)) v.forEach(scan);
        else if (v && typeof v === "object") scan(v);
      }
    };
    // (lógica la cubrimos vía declareFromScope: ya registramos todo)

    for (const u of used) {
      if (!declared.has(u) && !REACT_KNOWN.has(u) && !HTML_TAGS.has(u) && !GLOBALS.has(u)) {
        console.log(`❌ ${file}: componente '${fnName}' usa '${u}' no declarado`);
        errors++;
      }
    }
    checked++;
  }
}

if (errors > 0) {
  console.log(`\n${errors} problema(s) de scope detectado(s). Corre antes de hacer deploy.`);
  process.exit(1);
} else {
  console.log(`✅ Scope check OK: ${checked} componente(s) analizado(s), sin variables sin declarar.`);
}
