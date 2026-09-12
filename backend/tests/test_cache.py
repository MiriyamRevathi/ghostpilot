from app.cache.speculative_cache import SpeculativeCache

def test_cache_put_and_get():
    cache = SpeculativeCache(ttl_seconds=60)
    chash = cache.compute_context_hash("UserService.ts", 16, "return users.find().name", "diag_1")
    assert len(chash) > 0

    cache.put(chash, {"suggestion": "const u = users.find(); return u?.name;", "confidence": 0.92})
    retrieved = cache.get(chash)
    assert retrieved is not None
    assert "confidence" in retrieved
    assert retrieved["confidence"] == 0.92
    assert "prepared_ago_ms" in retrieved

def test_cache_stats_and_clear():
    cache = SpeculativeCache(ttl_seconds=60)
    chash = cache.compute_context_hash("File.ts", 1, "code", "d1")
    cache.put(chash, {"val": 123})
    assert len(cache.get_all()) == 1
    cleared = cache.clear()
    assert cleared == 1
    assert len(cache.get_all()) == 0
