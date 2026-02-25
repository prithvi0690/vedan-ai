"""Map document_id UUIDs to metadata title/filename using content headers."""
import json

# Load chunks
chunks = json.load(open('full_backup.json', encoding='utf-8'))

# Build: document_id -> content title
id_to_title = {}
for c in chunks:
    doc_id = c['document_id']
    if doc_id not in id_to_title:
        content = c.get('content', '')
        first_line = content.split('\n')[0] if content else ''
        title = first_line.replace('Document: ', '').strip() if first_line.startswith('Document:') else 'UNKNOWN'
        id_to_title[doc_id] = title

# Load metadata
meta = json.load(open('data_archive/extracted_metadata.json', encoding='utf-8'))

print(f"Unique doc IDs in chunks: {len(id_to_title)}")
print(f"Metadata entries: {len(meta)}")
print()

# Build metadata lookup by title (lowered)
meta_by_title = {}
for m in meta:
    key = m.get('title', '').strip().lower()
    meta_by_title[key] = m

# Try to match
matched = 0
unmatched = []
for doc_id, title in sorted(id_to_title.items()):
    key = title.strip().lower()
    if key in meta_by_title:
        m = meta_by_title[key]
        print(f"  MATCH: {doc_id[:12]}... -> '{title}' -> filename='{m['original_filename']}'")
        matched += 1
    else:
        unmatched.append((doc_id, title))

print(f"\nMatched: {matched}/{len(id_to_title)}")
if unmatched:
    print(f"Unmatched ({len(unmatched)}):")
    for doc_id, title in unmatched:
        print(f"  {doc_id[:12]}... -> '{title}'")
