#!/usr/bin/env python3
"""
Memory Search - Search through all memories and discussions
Indexes MEMORY.md and memory/*.md files for quick search
"""
import os
import re
import json
from datetime import datetime
import glob

MEMORY_DIR = "/root/.openclaw/workspace/memory"
MAIN_MEMORY = "/root/.openclaw/workspace/MEMORY.md"
INDEX_FILE = "/root/.openclaw/workspace/memory_index.json"

def index_memories():
    """Index all memory files"""
    index = {
        "created": datetime.now().isoformat(),
        "entries": []
    }
    
    # Read main MEMORY.md
    if os.path.exists(MAIN_MEMORY):
        with open(MAIN_MEMORY, 'r') as f:
            content = f.read()
            entries = parse_memory_content(content, "MEMORY.md")
            index["entries"].extend(entries)
    
    # Read daily memory files
    if os.path.exists(MEMORY_DIR):
        for memory_file in glob.glob(f"{MEMORY_DIR}/*.md"):
            filename = os.path.basename(memory_file)
            with open(memory_file, 'r') as f:
                content = f.read()
                entries = parse_memory_content(content, filename)
                index["entries"].extend(entries)
    
    # Save index
    with open(INDEX_FILE, 'w') as f:
        json.dump(index, f, indent=2)
    
    print(f"✅ Indexed {len(index['entries'])} memory entries")
    return index

def parse_memory_content(content, source_file):
    """Parse memory content into searchable entries"""
    entries = []
    
    # Split by headers/sections
    sections = re.split(r'\n##+ ', content)
    
    for section in sections:
        if not section.strip():
            continue
        
        # Extract title (first line)
        lines = section.strip().split('\n')
        title = lines[0].strip().replace('#', '').strip()
        
        # Get content
        body = '\n'.join(lines[1:]).strip()
        
        # Extract date from filename or content
        date = extract_date(source_file, body)
        
        # Extract tags/topics
        tags = extract_tags(body)
        
        entries.append({
            "title": title,
            "body": body[:500],  # Limit body length
            "source": source_file,
            "date": date,
            "tags": tags
        })
    
    return entries

def extract_date(source_file, content):
    """Extract date from filename or content"""
    # Try filename first (YYYY-MM-DD.md)
    match = re.search(r'(\d{4}-\d{2}-\d{2})', source_file)
    if match:
        return match.group(1)
    
    # Try content
    match = re.search(r'(\d{4}-\d{2}-\d{2})', content)
    if match:
        return match.group(1)
    
    return "Unknown"

def extract_tags(content):
    """Extract tags/topics from content"""
    tags = []
    
    # Look for emoji tags
    emoji_tags = re.findall(r'([🏢📊🎯✅🔥💰🎨📝⚙️🔍])\s*([^\n]+)', content)
    for emoji, tag in emoji_tags[:5]:
        tags.append(f"{emoji} {tag.strip()}")
    
    # Look for hashtags
    hashtags = re.findall(r'#(\w+)', content)
    tags.extend([f"#{tag}" for tag in hashtags[:5]])
    
    return tags

def search_memories(query, index=None):
    """Search through indexed memories"""
    if index is None:
        if os.path.exists(INDEX_FILE):
            with open(INDEX_FILE, 'r') as f:
                index = json.load(f)
        else:
            index = index_memories()
    
    query_lower = query.lower()
    results = []
    
    for entry in index["entries"]:
        score = 0
        
        # Title match (highest weight)
        if query_lower in entry["title"].lower():
            score += 10
        
        # Body match
        if query_lower in entry["body"].lower():
            score += 5
        
        # Tag match
        for tag in entry["tags"]:
            if query_lower in tag.lower():
                score += 3
        
        if score > 0:
            results.append({
                **entry,
                "score": score
            })
    
    # Sort by score
    results.sort(key=lambda x: x["score"], reverse=True)
    
    return results

def format_results(results, query):
    """Format search results for display"""
    if not results:
        return f"No memories found for '{query}'"
    
    output = [f"🔍 Found {len(results)} memory entries for '{query}':\n"]
    
    for i, result in enumerate(results[:10], 1):  # Show top 10
        output.append(f"{i}. **{result['title']}**")
        output.append(f"   📅 {result['date']} | 📄 {result['source']}")
        
        # Show preview with context
        body = result['body']
        # Find query in body and show context
        query_lower = query.lower()
        idx = body.lower().find(query_lower)
        if idx != -1:
            start = max(0, idx - 50)
            end = min(len(body), idx + len(query) + 50)
            preview = body[start:end]
            if start > 0:
                preview = "..." + preview
            if end < len(body):
                preview = preview + "..."
            output.append(f"   💭 {preview}")
        
        if result['tags']:
            output.append(f"   🏷️ {', '.join(result['tags'][:3])}")
        
        output.append("")
    
    return "\n".join(output)

def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 memory_search.py 'search query'")
        print("       python3 memory_search.py --index  (rebuild index)")
        sys.exit(1)
    
    if sys.argv[1] == '--index':
        index_memories()
        sys.exit(0)
    
    query = sys.argv[1]
    
    # Check if index exists and is recent (< 1 day old)
    if os.path.exists(INDEX_FILE):
        with open(INDEX_FILE, 'r') as f:
            index = json.load(f)
        index_date = datetime.fromisoformat(index["created"])
        age = (datetime.now() - index_date).total_seconds()
        
        if age > 86400:  # Older than 1 day
            print("🔄 Index is old, rebuilding...")
            index = index_memories()
    else:
        print("🔄 Creating memory index...")
        index = index_memories()
    
    # Search
    print(f"🔍 Searching memories for: '{query}'\n")
    results = search_memories(query, index)
    print(format_results(results, query))

if __name__ == "__main__":
    main()
