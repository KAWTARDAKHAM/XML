from lxml import etree
XML_FILE = "../Data/task.xml"
XSD_FILE = "../Data/tasks.xsd"
def valider():
    with open(XSD_FILE, "rb") as f:
        schema = etree.XMLSchema(etree.parse(f))

    with open(XML_FILE, "rb") as f:
        xml_doc = etree.parse(f)

    if schema.validate(xml_doc):
        print("XML valide.Aucune erreur détectée.")
        root = xml_doc.getroot()
        NS   = "http://ensias.ma/tasks"
        tasks = root.findall(f"{{{NS}}}task")
        print(f"\n {len(tasks)} tâche(s) trouvée(s) :\n")

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
        print("❌ Erreurs de validation :")
        for erreur in schema.error_log:
            print(f"   → Ligne {erreur.line} : {erreur.message}")
valider()