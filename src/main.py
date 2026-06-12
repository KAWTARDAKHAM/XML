from db_manager import create_db, import_xml_to_sqlite, show_all_tasks
from xml_generator import generate_xml_from_db, valider_xml


def main():
    print("=== Step 1: Create database tables ===")
    create_db()

    print("\n=== Step 2: Import XML data into SQLite ===")
    import_xml_to_sqlite()

    print("\n=== Step 3: Display all tasks from DB ===")
    show_all_tasks()

    print("\n=== Step 4: Generate fresh XML from DB ===")
    generate_xml_from_db()

    print("\n=== Step 5: Validate generated XML against XSD ===")
    valider_xml()  

if __name__ == "__main__":
    main()