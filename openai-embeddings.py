#!/usr/bin/env python3
"""
OpenAI Embeddings for Memory Search
Uses text-embedding-3-small (cheap & fast)
"""

import os
import requests
import json

API_KEY_FILE = "/root/.openclaw/workspace/.keys/openai.key"
EMBEDDING_MODEL = "text-embedding-3-small"

def get_api_key():
    with open(API_KEY_FILE, 'r') as f:
        return f.read().strip()

def get_embedding(text):
    """Get embedding for a single text"""
    key = get_api_key()
    
    response = requests.post(
        "https://api.openai.com/v1/embeddings",
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        },
        json={
            "input": text,
            "model": EMBEDDING_MODEL
        }
    )
    
    if response.status_code == 200:
        return response.json()["data"][0]["embedding"]
    else:
        raise Exception(f"OpenAI API error: {response.status_code} {response.text}")

def get_embeddings(texts):
    """Get embeddings for multiple texts"""
    key = get_api_key()
    
    response = requests.post(
        "https://api.openai.com/v1/embeddings",
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        },
        json={
            "input": texts,
            "model": EMBEDDING_MODEL
        }
    )
    
    if response.status_code == 200:
        return [d["embedding"] for d in response.json()["data"]]
    else:
        raise Exception(f"OpenAI API error: {response.status_code} {response.text}")

def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors"""
    dot = sum(x * y for x, y in zip(a, b))
    mag1 = sum(x * x for x in a) ** 0.5
    mag2 = sum(x * x for x in b) ** 0.5
    return dot / (mag1 * mag2) if mag1 and mag2 else 0

def search_memories(query, top_k=5):
    """Search memory files using embeddings"""
    # Get query embedding
    query_emb = get_embedding(query)
    
    # Load and embed all memory files
    memory_dir = "/root/.openclaw/workspace/memory"
    results = []
    
    for filename in os.listdir(memory_dir):
        if not filename.endswith(('.md', '.txt')):
            continue
            
        filepath = os.path.join(memory_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Get embedding for content (truncate if too long)
        content_trunc = content[:8000]
        try:
            content_emb = get_embedding(content_trunc)
            score = cosine_similarity(query_emb, content_emb)
            results.append({
                'file': filename,
                'score': score,
                'preview': content[:200]
            })
        except Exception as e:
            print(f"Error embedding {filename}: {e}")
            continue
    
    # Sort by score and return top k
    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:top_k]

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 openai-embeddings.py search \"query\"")
        print("       python3 openai-embeddings.py test")
        sys.exit(1)
    
    if sys.argv[1] == "test":
        # Test the API
        try:
            emb = get_embedding("Hello world")
            print(f"✅ Embedding working! Vector size: {len(emb)}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    elif sys.argv[1] == "search":
        query = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else "test"
        print(f"🔍 Searching for: {query}")
        results = search_memories(query)
        for r in results:
            print(f"\n{r['file']} (score: {r['score']:.3f})")
            print(f"   {r['preview'][:100]}...")
