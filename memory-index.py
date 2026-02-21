#!/usr/bin/env python3
"""
Memory Index - Quick lookup for memory files
Usage: python3 memory-index.py [search "topic"|list]
"""

import os
import sys
import json

MEMORY_DIR = "/root/.openclaw/workspace/memory"
INDEX_FILE = "/root/.openclaw/workspace/memory-index.md"

def search_memories(query):
    """Search all memory files for query"""
    query = query.lower()
    results = []
    
    if not os.path.exists(MEMORY_DIR):
        print("No memory directory found")
        return
    
    for filename in sorted(os.listdir(MEMORY_DIR)):
        if not filename.endswith('.md') and not filename.endswith('.txt'):
            continue
        
        filepath = os.path.join(MEMORY_DIR, filename)
        try:
            with open(filepath, 'r') as f:
                content = f.read()
                if query in content.lower():
                    # Find matching lines
                    lines = content.split('\n')
                    matches = [line.strip() for line in lines if query in line.lower()]
                    if matches:
                        results.append({
                            'file': filename,
                            'matches': matches[:3]  # First 3 matches
                        })
        except Exception as e:
            pass
    
    if results:
        print(f"🔍 Found '{query}' in:")
        for r in results:
            print(f"\n📄 {r['file']}")
            for m in r['matches']:
                print(f"   → {m[:100]}")
        print(f"\n💾 Full file: {MEMORY_DIR}/{r['file']}")
    else:
        print(f"❌ No matches for '{query}'")
        print(f"\n💡 Try: model, vercel, template, kimi, minimax, swarm")

def list_memories():
    """List all memory files"""
    if not os.path.exists(MEMORY_DIR):
        print("No memory directory found")
        return
    
    files = sorted(os.listdir(MEMORY_DIR))
    print(f"📚 Memory Files ({len(files)} total)")
    print("=" * 40)
    
    for f in files:
        filepath = os.path.join(MEMORY_DIR, f)
        size = os.path.getsize(filepath)
        print(f"  {f:40} {size:>6} bytes")
    
    print(f"\n💡 Usage: python3 memory-index.py search \"topic\"")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        list_memories()
    elif sys.argv[1] == "search" and len(sys.argv) > 2:
        search_memories(" ".join(sys.argv[2:]))
    elif sys.argv[1] == "list":
        list_memories()
    else:
        print("Usage:")
        print("  python3 memory-index.py search \"topic\"")
        print("  python3 memory-index.py list")
