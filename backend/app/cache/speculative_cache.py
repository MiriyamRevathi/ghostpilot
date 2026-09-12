import time
import hashlib
from typing import Optional, Dict, Any, List

class SpeculativeCache:
    def __init__(self, ttl_seconds: int = 300):
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._stats = {"hits": 0, "misses": 0, "evictions": 0}

    @staticmethod
    def compute_context_hash(file_path: str, line: int, code_snippet: str, diagnostic_id: str) -> str:
        payload = f"{file_path}:{line}:{code_snippet.strip()}:{diagnostic_id}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

    def get(self, context_hash: str) -> Optional[Dict[str, Any]]:
        self._clean_expired()
        entry = self._cache.get(context_hash)
        if entry:
            self._stats["hits"] += 1
            prepared_ago_ms = int((time.time() - entry["created_at"]) * 1000)
            entry_copy = dict(entry)
            entry_copy["prepared_ago_ms"] = prepared_ago_ms
            return entry_copy
        self._stats["misses"] += 1
        return None

    def put(self, context_hash: str, data: Dict[str, Any]) -> None:
        self._clean_expired()
        now = time.time()
        data["created_at"] = now
        data["context_hash"] = context_hash
        self._cache[context_hash] = data

    def get_all(self) -> List[Dict[str, Any]]:
        self._clean_expired()
        now = time.time()
        results = []
        for entry in self._cache.values():
            e = dict(entry)
            e["prepared_ago_ms"] = int((now - e["created_at"]) * 1000)
            results.append(e)
        return results

    def clear(self) -> int:
        count = len(self._cache)
        self._cache.clear()
        return count

    def get_stats(self) -> Dict[str, Any]:
        return {
            **self._stats,
            "entry_count": len(self._cache),
            "ttl_seconds": self.ttl_seconds,
        }

    def _clean_expired(self):
        now = time.time()
        expired = [k for k, v in self._cache.items() if now - v.get("created_at", 0) > self.ttl_seconds]
        for k in expired:
            del self._cache[k]
            self._stats["evictions"] += 1
