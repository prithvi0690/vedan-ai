import json

data = json.load(open('full_backup.json', encoding='utf-8'))

# Show first few content headers
for i in [0, 50, 100, 500, 1000, 2000]:
    if i < len(data):
        content = data[i].get('content', '')
        lines = content.split('\n')
        doc_line = lines[0] if lines else ''
        notif_line = lines[1] if len(lines) > 1 else ''
        print(f"[{i}] doc_id={data[i].get('document_id','')[:20]}...")
        print(f"     Line 0: {doc_line[:80]}")
        print(f"     Line 1: {notif_line[:80]}")
        print(f"     section: {data[i].get('section_number','')}")
        print(f"     pages: {data[i].get('page_numbers','')}")
        print()
