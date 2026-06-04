import xml.etree.ElementTree as ET

XML_FILE = "../Data/task.xml"
NS = {
    "t": "http://ensias.ma/tasks"
}

def afficher_taches():

    tree = ET.parse(XML_FILE)
    root = tree.getroot()

    for task in root.findall("t:task", NS):

        print("\n------------------------")

        print("ID :", task.get("id"))
        print("Type :", task.get("type"))

        print(
            "Titre :",
            task.find("t:titre", NS).text
        )

        print(
            "Date début :",
            task.find("t:date_debut", NS).text
        )

        print(
            "Date fin :",
            task.find("t:date_fin", NS).text
        )

        print(
            "Priorité :",
            task.find("t:priorite", NS).text
        )

        print(
            "Statut :",
            task.find("t:statut", NS).text
        )

        sous_taches = task.find("t:sous_taches", NS)

        if sous_taches is not None:

            print("\nSous-tâches :")

            for st in sous_taches.findall("t:sous_tache", NS):

                print(
                    "-",
                    st.find("t:titre", NS).text,
                    "|",st.find("t:date_debut",NS).text,"|",
                    st.find("t:statut", NS).text
                )

#Add a task to XML file : 

def ajouter_tache_xml(xml_file, id, titre_txt, debut, fin, priorite_txt):

    XML_FILE="../Data/"+xml_file

    tree = ET.parse(XML_FILE)
    root = tree.getroot()

    #we whether use task as SubElement of tasks(root) here or use root.append() at the end
    #task = ET.SubElement(root,f"{{{NS}}}task")
    task=ET.Element(f"{{{NS}}}task")
    task.set("id", id)
    task.set("type", "simple")

    titre = ET.SubElement(task, f"{{{NS}}}titre")
    titre.text = titre_txt

    date_debut = ET.SubElement(task, f"{{{NS}}}date_debut")
    date_debut.text = debut

    date_fin = ET.SubElement(task, f"{{{NS}}}date_fin")
    date_fin.text = fin

    priorite = ET.SubElement(task, f"{{{NS}}}priorite")
    priorite.text = priorite_txt

    statut = ET.SubElement(task, f"{{{NS}}}statut")
    statut.text = "en cours"

    root.append(task) 

    tree.write(XML_FILE, encoding="utf-8", xml_declaration=True)