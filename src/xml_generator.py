import sqlite3
import xml.etree.ElementTree as ET
from lxml import etree
from pathlib import Path

#Paths (relative to src/) 
DB_FILE  = Path("../Data/tasks.db")
XML_FILE = Path("../Data/tasks.xml")
XSD_FILE = Path("../Data/tasks.xsd")

NS = "http://ensias.ma/tasks"


#Étape 5 : Generate XML from DB 
def generate_xml_from_db():
    """
    Reads all tasks and sous_taches from SQLite DB
    and generates a valid tasks.xml file.
    """
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    ET.register_namespace("", NS)

    root = ET.Element(f"{{{NS}}}tasks")
    root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    root.set("xsi:schemaLocation", f"{NS} ../Data/tasks.xsd")

    cursor.execute("""
        SELECT id, type, titre, date_debut, date_fin, priorite, statut
        FROM tasks
    """)
    tasks = cursor.fetchall()

    for (tid, ttype, titre, date_debut, date_fin, priorite, statut) in tasks:

        task_el = ET.SubElement(root, f"{{{NS}}}task")
        task_el.set("id", tid)
        task_el.set("type", ttype)

        ET.SubElement(task_el, f"{{{NS}}}titre").text      = titre
        ET.SubElement(task_el, f"{{{NS}}}date_debut").text = date_debut
        ET.SubElement(task_el, f"{{{NS}}}date_fin").text   = date_fin
        ET.SubElement(task_el, f"{{{NS}}}priorite").text   = priorite
        ET.SubElement(task_el, f"{{{NS}}}statut").text     = statut

        if ttype == "complexe":
            cursor.execute("""
                SELECT id, titre, date_debut, date_fin, priorite, statut
                FROM sous_taches
                WHERE task_id = ?
            """, (tid,))
            sous_taches = cursor.fetchall()

            if sous_taches:
                sous_taches_el = ET.SubElement(task_el, f"{{{NS}}}sous_taches")
                for (st_id, st_titre, st_debut, st_fin, st_priorite, st_statut) in sous_taches:
                    st_el = ET.SubElement(sous_taches_el, f"{{{NS}}}sous_tache")
                    st_el.set("id", st_id)
                    ET.SubElement(st_el, f"{{{NS}}}titre").text      = st_titre
                    ET.SubElement(st_el, f"{{{NS}}}date_debut").text = st_debut
                    ET.SubElement(st_el, f"{{{NS}}}date_fin").text   = st_fin
                    ET.SubElement(st_el, f"{{{NS}}}priorite").text   = st_priorite
                    ET.SubElement(st_el, f"{{{NS}}}statut").text     = st_statut

    conn.close()

    tree = ET.ElementTree(root)
    ET.indent(tree, space="  ")
    tree.write(XML_FILE, encoding="utf-8", xml_declaration=True)
    print(f"[Étape 5] XML generated successfully → {XML_FILE}")
    return XML_FILE


# Étape 6 : Validate XML against XSD 

def valider_xml(xml_file=XML_FILE, xsd_file=XSD_FILE):
    """
    Validates the generated XML file against the XSD schema.
    Prints a summary if valid, or detailed errors if not.
    """
    print("\n[Étape 6] Validating XML against XSD...")

    try:
        with open(xsd_file, "rb") as f:
            schema = etree.XMLSchema(etree.parse(f))

        with open(xml_file, "rb") as f:
            xml_doc = etree.parse(f)

        if schema.validate(xml_doc):
            print("XML is valid. No errors detected.\n")

            root = xml_doc.getroot()
            tasks = root.findall(f"{{{NS}}}task")
            print(f"  {len(tasks)} task(s) found:\n")

            for task in tasks:
                tid    = task.get("id")
                ttype  = task.get("type")
                titre  = task.find(f"{{{NS}}}titre").text
                statut = task.find(f"{{{NS}}}statut").text
                print(f"  [{tid}] ({ttype}) {titre} → {statut}")

                sous_taches = task.find(f"{{{NS}}}sous_taches")
                if sous_taches is not None:
                    for st in sous_taches.findall(f"{{{NS}}}sous_tache"):
                        st_titre  = st.find(f"{{{NS}}}titre").text
                        st_statut = st.find(f"{{{NS}}}statut").text
                        print(f"       ↳ {st_titre} — {st_statut}")

        else:
            print("Validation errors found:")
            for err in schema.error_log:
                print(f"   → Line {err.line}: {err.message}")

    except FileNotFoundError as e:
        print(f"File not found: {e}")
    except etree.XMLSyntaxError as e:
        print(f"XML syntax error: {e}")


#Entry point
if __name__ == "__main__":
    generate_xml_from_db()   # Étape 5
    valider_xml()            # Étape 6