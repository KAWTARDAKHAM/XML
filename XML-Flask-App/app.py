from flask import Flask, render_template, request, jsonify, send_file
import sqlite3
import xml.etree.ElementTree as ET
from lxml import etree
from datetime import datetime
import os

app = Flask(__name__)
app.config['DATABASE'] = os.path.join('Data', 'tasks.db')
app.config['XML_FILE'] = os.path.join('Data', 'tasks.xml')
app.config['XSD_FILE'] = os.path.join('Data', 'tasks.xsd')
app.config['DTD_FILE'] = os.path.join('Data', 'tasks.dtd')
app.config['XSL_FILE'] = os.path.join('Data', 'tasks.xsl')

NS = "http://ensias.ma/tasks"


def get_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks(
            id TEXT PRIMARY KEY,
            type TEXT,
            titre TEXT,
            date_debut DATE,
            date_fin DATE,
            priorite TEXT,
            statut TEXT
        )
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS sous_taches (
            id TEXT PRIMARY KEY,
            task_id TEXT NOT NULL,
            titre TEXT,
            date_debut DATE,
            date_fin DATE,
            priorite TEXT,
            statut TEXT,
            FOREIGN KEY (task_id) REFERENCES tasks(id)
        )
        """)
        conn.commit()


def import_xml_to_db():
    with get_db() as conn:
        tree = ET.parse(app.config['XML_FILE'])
        root = tree.getroot()
        ns = {"t": NS}
        
        conn.execute("DELETE FROM sous_taches")
        conn.execute("DELETE FROM tasks")
        
        for task in root.findall("t:task", ns):
            task_id = task.get("id")
            task_type = task.get("type")
            titre = task.find("t:titre", ns).text
            date_debut = task.find("t:date_debut", ns).text
            date_fin = task.find("t:date_fin", ns).text
            priorite = task.find("t:priorite", ns).text
            statut = task.find("t:statut", ns).text
            conn.execute(
                "INSERT INTO tasks VALUES (?,?,?,?,?,?,?)",
                (task_id, task_type, titre, date_debut, date_fin, priorite, statut)
            )
            sous_taches = task.find("t:sous_taches", ns)
            if sous_taches is not None:
                for st in sous_taches.findall("t:sous_tache", ns):
                    st_id = st.get("id")
                    st_titre = st.find("t:titre", ns).text
                    st_debut = st.find("t:date_debut", ns).text
                    st_fin = st.find("t:date_fin", ns).text
                    st_prior = st.find("t:priorite", ns).text
                    st_statut = st.find("t:statut", ns).text
                    conn.execute(
                        "INSERT INTO sous_taches VALUES (?,?,?,?,?,?,?)",
                        (st_id, task_id, st_titre, st_debut, st_fin, st_prior, st_statut)
                    )
        conn.commit()


def generate_xml_from_db():
    ET.register_namespace("", NS)
    root = ET.Element(f"{{{NS}}}tasks")
    root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    root.set("xsi:schemaLocation", f"{NS} Data/tasks.xsd")
    root.set("xmlns:xi", "http://www.w3.org/2001/XInclude")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, type, titre, date_debut, date_fin, priorite, statut FROM tasks")
        tasks = cursor.fetchall()
        
        for (tid, ttype, titre, date_debut, date_fin, priorite, statut) in tasks:
            task_el = ET.SubElement(root, f"{{{NS}}}task")
            task_el.set("id", tid)
            task_el.set("type", ttype)
            ET.SubElement(task_el, f"{{{NS}}}titre").text = titre
            ET.SubElement(task_el, f"{{{NS}}}date_debut").text = date_debut
            ET.SubElement(task_el, f"{{{NS}}}date_fin").text = date_fin
            ET.SubElement(task_el, f"{{{NS}}}priorite").text = priorite
            ET.SubElement(task_el, f"{{{NS}}}statut").text = statut
            
            if ttype == "complexe":
                cursor.execute(
                    "SELECT id, titre, date_debut, date_fin, priorite, statut FROM sous_taches WHERE task_id = ?",
                    (tid,)
                )
                sous_taches = cursor.fetchall()
                if sous_taches:
                    sous_taches_el = ET.SubElement(task_el, f"{{{NS}}}sous_taches")
                    for (st_id, st_titre, st_debut, st_fin, st_prior, st_statut) in sous_taches:
                        st_el = ET.SubElement(sous_taches_el, f"{{{NS}}}sous_tache")
                        st_el.set("id", st_id)
                        ET.SubElement(st_el, f"{{{NS}}}titre").text = st_titre
                        ET.SubElement(st_el, f"{{{NS}}}date_debut").text = st_debut
                        ET.SubElement(st_el, f"{{{NS}}}date_fin").text = st_fin
                        ET.SubElement(st_el, f"{{{NS}}}priorite").text = st_prior
                        ET.SubElement(st_el, f"{{{NS}}}statut").text = st_statut
    
    tree = ET.ElementTree(root)
    ET.indent(tree, space="  ", level=0)
    tree.write(app.config['XML_FILE'], encoding="utf-8", xml_declaration=True)
    return app.config['XML_FILE']


def validate_xml(xml_file=None, xsd_file=None):
    xml_file = xml_file or app.config['XML_FILE']
    xsd_file = xsd_file or app.config['XSD_FILE']
    try:
        with open(xsd_file, "rb") as f:
            schema = etree.XMLSchema(etree.parse(f))
        with open(xml_file, "rb") as f:
            xml_doc = etree.parse(f)
        if schema.validate(xml_doc):
            return {"valid": True, "message": "XML is valid"}
        else:
            errors = [f"Line {e.line}: {e.message}" for e in schema.error_log]
            return {"valid": False, "errors": errors}
    except Exception as e:
        return {"valid": False, "errors": [str(e)]}


# Routes

@app.route('/')
def index():
    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/dashboard/xml-tools')
def xml_tools():
    return render_template('dashboard.html')


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks ORDER BY date_debut")
        tasks = cursor.fetchall()
        result = []
        for t in tasks:
            task = dict(t)
            cursor.execute(
                "SELECT id, titre, date_debut, date_fin, priorite, statut FROM sous_taches WHERE task_id = ?",
                (task['id'],)
            )
            task['sous_taches'] = [dict(st) for st in cursor.fetchall()]
            result.append(task)
        return jsonify(result)


@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    with get_db() as conn:
        conn.execute(
            "INSERT INTO tasks (id, type, titre, date_debut, date_fin, priorite, statut) VALUES (?,?,?,?,?,?,?)",
            (data['id'], data.get('type', 'simple'), data['titre'], data['date_debut'],
             data['date_fin'], data['priorite'], data.get('statut', 'en cours'))
        )
        conn.commit()
    generate_xml_from_db()
    return jsonify({"status": "ok"})


@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    with get_db() as conn:
        conn.execute(
            "UPDATE tasks SET titre=?, date_debut=?, date_fin=?, priorite=?, statut=? WHERE id=?",
            (data['titre'], data['date_debut'], data['date_fin'], data['priorite'], data['statut'], task_id)
        )
        conn.commit()
    generate_xml_from_db()
    return jsonify({"status": "ok"})


@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    with get_db() as conn:
        conn.execute("DELETE FROM sous_taches WHERE task_id=?", (task_id,))
        conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
        conn.commit()
    generate_xml_from_db()
    return jsonify({"status": "ok"})


@app.route('/api/validate/xml', methods=['POST'])
def api_validate_xml():
    result = validate_xml()
    return jsonify(result)


@app.route('/api/validate/dtd', methods=['POST'])
def api_validate_dtd():
    try:
        with open(app.config['DTD_FILE'], 'rb') as f:
            dtd = etree.DTD(f)
        with open(app.config['XML_FILE'], 'rb') as f:
            xml_doc = etree.parse(f)
        if dtd.validate(xml_doc):
            return jsonify({"valid": True, "message": "XML is valid against DTD"})
        else:
            errors = [f"Line {e.line}: {e.message}" for e in dtd.error_log]
            return jsonify({"valid": False, "errors": errors})
    except Exception as e:
        return jsonify({"valid": False, "errors": [str(e)]})


@app.route('/api/xml/download')
def download_xml():
    generate_xml_from_db()
    return send_file(app.config['XML_FILE'], as_attachment=True, download_name='tasks.xml')


@app.route('/api/xml/transform')
def transform_xml():
    try:
        with open(app.config['XML_FILE'], 'rb') as f:
            xml_doc = etree.parse(f)
        with open(app.config['XSL_FILE'], 'rb') as f:
            xslt = etree.parse(f)
            transform = etree.XSLT(xslt)
        result = transform(xml_doc)
        return str(result)
    except Exception as e:
        return f"<html><body><h2>Transformation Error: {e}</h2></body></html>"


@app.route('/api/xml/content')
def get_xml_content():
    with open(app.config['XML_FILE'], 'r', encoding='utf-8') as f:
        return f.read()


@app.route('/api/xsd/content')
def get_xsd_content():
    with open(app.config['XSD_FILE'], 'r', encoding='utf-8') as f:
        return f.read()


@app.route('/api/dtd/content')
def get_dtd_content():
    with open(app.config['DTD_FILE'], 'r', encoding='utf-8') as f:
        return f.read()


if __name__ == '__main__':
    init_db()
    if os.path.exists(app.config['XML_FILE']):
        import_xml_to_db()
    app.run(debug=True, port=5000)
