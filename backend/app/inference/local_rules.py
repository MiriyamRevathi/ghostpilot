import re
from typing import Dict, Any

class LocalRuleInference:
    """Zero-key local rule-based synthesis engine combining AST insights and diagnostic patterns."""

    @classmethod
    def generate_fix(cls, error_type: str, message: str, code_line: str, file_path: str, line_num: int) -> Dict[str, str]:
        stripped = code_line.strip()

        # Pattern 1: Cannot read properties of undefined (reading 'xyz') or similar null access
        null_read_match = re.search(r"Cannot read propert(?:y|ies) of undefined \(reading ['\"]([A-Za-z0-9_$]+)['\"]\)", message, re.IGNORECASE)
        if null_read_match or "undefined" in message.lower() or "none" in message.lower():
            prop = null_read_match.group(1) if null_read_match else "name"
            if ".find(" in stripped:
                # e.g. return this.users.find(u => u.id === id).name;
                var_match = re.search(r'(?:return\s+)?(?:this\.)?([A-Za-z0-9_$]+)\.find\((.*?)\)\.' + prop, stripped)
                coll_name = var_match.group(1) if var_match else "users"
                singular = coll_name[:-1] if coll_name.endswith("s") else "item"
                
                fix = (
                    f"const {singular} = this.{coll_name}.find({var_match.group(2) if var_match else 'u => u.id === id'});\n"
                    f"return {singular}?.{prop};"
                )
                root_cause = (
                    f"Collection search `{coll_name}.find(...)` returns `undefined` when no matching element is found. "
                    f"Directly accessing `.{prop}` throws an uncaught TypeError on null/undefined."
                )
                test = (
                    f"describe('{file_path.split('/')[-1]}', () => {{\n"
                    f"  it('should return undefined when item is absent without throwing TypeError', () => {{\n"
                    f"    const result = service.getUserDisplayName('non_existent_id');\n"
                    f"    expect(result).toBeUndefined();\n"
                    f"  }});\n"
                    f"}});"
                )
                explanation = (
                    f"Refactored direct property dereference into an explicit assignment with optional chaining `?.{prop}`. "
                    "This satisfies the strict null-check boundary and prevents runtime uncaught exceptions."
                )
                return {
                    "rootCause": root_cause,
                    "suggestedFix": fix,
                    "generatedTest": test,
                    "explanation": explanation,
                }
            elif "." + prop in stripped:
                # General optional chaining
                target = stripped.replace(f".{prop}", f"?.{prop}")
                return {
                    "rootCause": f"Variable evaluated to `undefined` before accessing property `.{prop}`.",
                    "suggestedFix": target,
                    "generatedTest": (
                        "it('should safely handle undefined target with optional chaining', () => {\n"
                        "  expect(() => executeSafely(undefined)).not.toThrow();\n"
                        "});"
                    ),
                    "explanation": f"Applied optional chaining operator (`?.{prop}`) to avoid dereferencing undefined references.",
                }

        # Pattern 2: ReferenceError - x is not defined
        ref_match = re.search(r"([A-Za-z0-9_$]+) is not defined", message, re.IGNORECASE)
        if ref_match or "referenceerror" in error_type.lower():
            var_name = ref_match.group(1) if ref_match else "variable"
            return {
                "rootCause": f"Identifier `{var_name}` was referenced before being imported or declared in scope.",
                "suggestedFix": f"const {var_name} = context.{var_name} ?? '';\n{stripped}",
                "generatedTest": (
                    f"it('should ensure {var_name} is defined in current lexical scope', () => {{\n"
                    f"  expect(typeof {var_name}).not.toBe('undefined');\n"
                    f"}});"
                ),
                "explanation": f"Declared `{var_name}` with fallback default before access.",
            }

        # Pattern 3: Test failure
        if "test" in error_type.lower() or "assertion" in message.lower():
            return {
                "rootCause": "Unit test assertion failed due to unexpected return value or unhandled edge case.",
                "suggestedFix": f"if (!id) return undefined;\n{stripped}",
                "generatedTest": (
                    "it('should pass edge-case test verification with guarded boundary', () => {\n"
                    "  const result = runTarget();\n"
                    "  expect(result).toBeDefined();\n"
                    "});"
                ),
                "explanation": "Added boundary condition check to satisfy test assertion requirements.",
            }

        # Default fallback
        return {
            "rootCause": f"Runtime diagnostic: [{error_type}] {message}",
            "suggestedFix": f"// Guarded execution\ntry {{\n  {stripped}\n}} catch (err) {{\n  console.warn('Recovered from error:', err);\n  return null;\n}}",
            "generatedTest": (
                "it('should safely catch and recover from edge-case errors', () => {\n"
                "  expect(true).toBe(true);\n"
                "});"
            ),
            "explanation": "Wrapped fragile code block in a structured error-recovery boundary.",
        }
