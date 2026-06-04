import sqlite3
from pathlib import Path
import xml.etree.ElementTree as ET


XML_FILE = Path("../Data/tasks.xml")
DB_FILE = Path("../Data/tasks.db")
NS = {"t": "http://ensias.ma/tasks"}

def create_db():
    conn = sqlite3.connect(DB_FILE)
    cursor=conn.cursor()

    cursor.execute("""
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
    #even when declared as date it is going to be stored as text for sqlite 
    
    conn.commit()
    conn.close()

#Insert data from xml to db
def import_xml_to_sqlite():
    conn=sqlite3.connect(DB_FILE)
    cursor=conn.cursor()

    tree=ET.parse(XML_FILE)
    root=tree.getroot()

    for task in root.findall("t:task",NS):
        task_id=task.get("id")
        task_type=task.get("type")
        title=task.fain("t:titre",NS).text
        date_debut=task.find("t:date_debut",NS).text
        date_fin=task.find("t:date_fin",NS).text
        priorite=task.find("t:priorite",NS).text
        statut=task.find("t:statut",NS).text

    cursor.execute("""
       INSERT INTO tasks Values(?,?,?,?,?,?,?)
    """,
    (task_id,task_type,title,date_debut,date_fin,priorite,statut))

    conn.commit()
    conn.close()

    print("XML imported into SQLite successfully.")

#add a task to the database
def add_task_db(task):
    conn=sqlite3.connect(DB_FILE)
    cursor=conn.cursor()
    
    try:
        cursor.execute("""
        INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?)
        """, task)

        conn.commit()
        print("Task added successfully")

    except Exception as e:
        conn.rollback()
        print("Error adding task:", e)

    finally:
        conn.close()

#displaying tasks from the database

def show_all_tasks():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

    conn.close()