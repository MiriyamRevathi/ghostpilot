from app.analyzer.ast_parser import CodeASTAnalyzer

def test_ast_analysis_typescript():
    ts_code = """
    import { User } from './models';
    export class UserService {
        public getUser(id: string): User {
            if (!id) {
                return null;
            }
            return this.users.find(u => u.id === id);
        }
    }
    """
    res = CodeASTAnalyzer.analyze(ts_code, "TypeScript")
    assert len(res["classes"]) == 1
    assert res["classes"][0]["name"] == "UserService"
    assert len(res["functions"]) >= 1
    assert res["conditionsCount"] >= 1
    assert res["estimatedComplexity"] > 1

def test_ast_analysis_python():
    py_code = """
    import os
    def fetch_user(user_id):
        if not user_id:
            return None
        return {"id": user_id}
    """
    res = CodeASTAnalyzer.analyze(py_code, "Python")
    assert len(res["functions"]) == 1
    assert res["functions"][0]["name"] == "fetch_user"
    assert res["conditionsCount"] >= 1
