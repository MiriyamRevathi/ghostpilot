import re
from typing import Dict, Any, List

class CodeASTAnalyzer:
    """Multi-language AST and structure parser for JavaScript, TypeScript, and Python."""

    @classmethod
    def analyze(cls, code: str, language: str = "TypeScript") -> Dict[str, Any]:
        lang_lower = language.lower()
        if "python" in lang_lower or "py" in lang_lower:
            return cls._analyze_python(code)
        return cls._analyze_ts_js(code, language)

    @classmethod
    def _analyze_ts_js(cls, code: str, language: str) -> Dict[str, Any]:
        lines = code.splitlines()
        functions = []
        classes = []
        variables = []
        imports = []
        calls = []
        syntax_errors = []
        conditions_count = 0
        return_count = 0

        # Regex patterns for JS/TS
        func_regex = re.compile(r'(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\((.*?)\)|(?:public|private|protected|static)?\s*(?:async\s+)?([A-Za-z0-9_$]+)\s*\((.*?)\)\s*(?::\s*.*?)?\s*\{')
        arrow_regex = re.compile(r'(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\((.*?)\)\s*(?::\s*.*?)?\s*=>')
        class_regex = re.compile(r'(?:export\s+)?class\s+([A-Za-z0-9_$]+)(?:\s+extends\s+[A-Za-z0-9_$]+)?')
        var_regex = re.compile(r'(const|let|var)\s+([A-Za-z0-9_$]+)\s*(?::\s*.*?)?\s*=')
        import_regex = re.compile(r'import\s+(?:\{([^}]+)\}|([A-Za-z0-9_$]+))\s+from\s+[\'"]([^\'"]+)[\'"]')
        call_regex = re.compile(r'\b([A-Za-z0-9_$]+)\s*\(')
        if_regex = re.compile(r'\b(?:if|else\s+if|switch|case|while|for)\b')
        return_regex = re.compile(r'\breturn\b')

        # Check bracket balancing for simple syntax checking
        stack = []
        for i, line in enumerate(lines, start=1):
            stripped = line.strip()
            if not stripped or stripped.startswith("//") or stripped.startswith("/*"):
                continue

            # Check brackets
            for char in line:
                if char in "{[(":
                    stack.append((char, i))
                elif char in "}])":
                    if not stack:
                        syntax_errors.append(f"Unmatched closing '{char}' at line {i}")
                    else:
                        top, top_line = stack.pop()
                        matches = {'{': '}', '[': ']', '(': ')'}
                        if matches.get(top) != char:
                            syntax_errors.append(f"Mismatched bracket '{top}' (line {top_line}) closed by '{char}' at line {i}")

            # Imports
            imp_match = import_regex.search(line)
            if imp_match:
                specifiers = []
                if imp_match.group(1):
                    specifiers = [s.strip() for s in imp_match.group(1).split(",")]
                elif imp_match.group(2):
                    specifiers = [imp_match.group(2).strip()]
                imports.append({
                    "source": imp_match.group(3),
                    "specifiers": specifiers,
                    "line": i
                })

            # Classes
            cls_match = class_regex.search(line)
            if cls_match:
                classes.append({"name": cls_match.group(1), "line": i, "methodsCount": 0})

            # Functions
            fn_match = func_regex.search(line)
            if fn_match:
                name = fn_match.group(1) or fn_match.group(3)
                raw_params = fn_match.group(2) or fn_match.group(4) or ""
                if name not in ("if", "for", "while", "switch", "catch"):
                    params = [p.strip() for p in raw_params.split(",") if p.strip()]
                    functions.append({"name": name, "line": i, "params": params, "complexity": 1})
            else:
                arrow_match = arrow_regex.search(line)
                if arrow_match:
                    name = arrow_match.group(1)
                    raw_params = arrow_match.group(2) or ""
                    params = [p.strip() for p in raw_params.split(",") if p.strip()]
                    functions.append({"name": name, "line": i, "params": params, "complexity": 1})

            # Variables
            var_match = var_regex.search(line)
            if var_match:
                variables.append({"kind": var_match.group(1), "name": var_match.group(2), "line": i})

            # Calls
            for match in call_regex.finditer(line):
                callee = match.group(1)
                if callee not in ("if", "for", "while", "switch", "function", "catch", "return"):
                    calls.append({"callee": callee, "line": i})

            # Conditions
            if if_regex.search(line):
                conditions_count += 1
            if return_regex.search(line):
                return_count += 1

        if stack:
            for top, top_line in stack:
                syntax_errors.append(f"Unclosed opening bracket '{top}' from line {top_line}")

        complexity = 1 + conditions_count + (len(functions) * 0.5)

        return {
            "language": language,
            "functions": functions,
            "classes": classes,
            "variables": variables[:20],
            "imports": imports,
            "calls": calls[:25],
            "conditionsCount": conditions_count,
            "returnStatementsCount": return_count,
            "estimatedComplexity": round(complexity, 1),
            "syntaxErrors": syntax_errors,
            "rawTreeSummary": f"AST: {len(classes)} classes, {len(functions)} functions, {len(imports)} imports, {conditions_count} branches",
        }

    @classmethod
    def _analyze_python(cls, code: str) -> Dict[str, Any]:
        lines = code.splitlines()
        functions = []
        classes = []
        variables = []
        imports = []
        calls = []
        conditions_count = 0
        return_count = 0

        fn_regex = re.compile(r'^\s*def\s+([A-Za-z0-9_]+)\s*\((.*?)\):')
        cls_regex = re.compile(r'^\s*class\s+([A-Za-z0-9_]+)(?:\((.*?)\))?:')
        imp_regex = re.compile(r'^\s*(?:from\s+([A-Za-z0-9_.]+)\s+import\s+(.*?)|import\s+([A-Za-z0-9_.]+))')
        call_regex = re.compile(r'\b([A-Za-z0-9_]+)\s*\(')

        for i, line in enumerate(lines, start=1):
            fn_m = fn_regex.match(line)
            if fn_m:
                params = [p.strip() for p in fn_m.group(2).split(",") if p.strip()]
                functions.append({"name": fn_m.group(1), "line": i, "params": params, "complexity": 1})
            cls_m = cls_regex.match(line)
            if cls_m:
                classes.append({"name": cls_m.group(1), "line": i, "methodsCount": 0})
            imp_m = imp_regex.match(line)
            if imp_m:
                source = imp_m.group(1) or imp_m.group(3) or ""
                specifiers = [s.strip() for s in (imp_m.group(2) or "").split(",") if s.strip()]
                imports.append({"source": source, "specifiers": specifiers, "line": i})
            if re.search(r'\b(if|elif|while|for)\b', line):
                conditions_count += 1
            if re.search(r'\breturn\b', line):
                return_count += 1
            for match in call_regex.finditer(line):
                callee = match.group(1)
                if callee not in ("if", "while", "for", "def", "class", "print"):
                    calls.append({"callee": callee, "line": i})

        return {
            "language": "Python",
            "functions": functions,
            "classes": classes,
            "variables": variables,
            "imports": imports,
            "calls": calls[:25],
            "conditionsCount": conditions_count,
            "returnStatementsCount": return_count,
            "estimatedComplexity": round(1.0 + conditions_count + len(functions) * 0.5, 1),
            "syntaxErrors": [],
            "rawTreeSummary": f"Python AST: {len(classes)} classes, {len(functions)} functions, {len(imports)} imports, {conditions_count} branches",
        }
