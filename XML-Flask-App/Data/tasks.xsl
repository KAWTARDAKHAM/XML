<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                               xmlns:ns="http://ensias.ma/tasks"
                               exclude-result-prefixes="ns">
  <xsl:template match="/">
    <html>
      <head>
        <title>Rapport des Tâches</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            padding: 40px;
            background: #0F0D15;
            color: #fff;
          }
          h1 {
            color: #845EF7;
            font-size: 28px;
            margin-bottom: 8px;
          }
          .subtitle {
            color: rgba(255,255,255,0.4);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            margin-bottom: 32px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: #845EF7;
            color: #fff;
            padding: 14px 16px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            font-weight: 700;
          }
          td {
            padding: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            font-size: 14px;
            color: rgba(255,255,255,0.8);
          }
          tr:hover td {
            background: rgba(255,255,255,0.02);
          }
          .task-id {
            color: #845EF7;
            font-weight: 700;
            font-family: monospace;
          }
          .priority-haute { color: #F43F5E; font-weight: 700; }
          .priority-moyenne { color: #A78BFA; font-weight: 700; }
          .priority-basse { color: #60A5FA; font-weight: 700; }
          .status-en-cours { color: #FBBF24; }
          .status-termine { color: #34D399; }
          .type-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .type-simple { background: rgba(96,165,250,0.15); color: #60A5FA; }
          .type-complexe { background: rgba(132,94,247,0.15); color: #A78BFA; }
          .subtasks {
            margin-top: 8px;
            padding: 8px 12px;
            background: rgba(255,255,255,0.02);
            border-radius: 8px;
            border-left: 3px solid #845EF7;
          }
          .subtask-item {
            font-size: 12px;
            color: rgba(255,255,255,0.5);
            margin: 4px 0;
          }
          .no-subtasks {
            color: rgba(255,255,255,0.2);
            font-style: italic;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <h1>Rapport des Tâches</h1>
        <p class="subtitle">Généré depuis la base de données • <xsl:value-of select="count(/ns:tasks/ns:task)"/> tâche(s)</p>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Type</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th>Sous-tâches</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="/ns:tasks/ns:task">
              <tr>
                <td><span class="task-id">#<xsl:value-of select="@id"/></span></td>
                <td><xsl:value-of select="ns:titre"/></td>
                <td>
                  <span class="type-badge type-{@type}">
                    <xsl:value-of select="@type"/>
                  </span>
                </td>
                <td><xsl:value-of select="ns:date_debut"/></td>
                <td><xsl:value-of select="ns:date_fin"/></td>
                <td>
                  <span class="priority-{ns:priorite}">
                    <xsl:value-of select="ns:priorite"/>
                  </span>
                </td>
                <td>
                  <span class="status-{translate(ns:statut, 'é', 'e')}">
                    <xsl:value-of select="ns:statut"/>
                  </span>
                </td>
                <td>
                  <xsl:choose>
                    <xsl:when test="ns:sous_taches">
                      <div class="subtasks">
                        <xsl:for-each select="ns:sous_taches/ns:sous_tache">
                          <div class="subtask-item">
                            • <xsl:value-of select="ns:titre"/> (<xsl:value-of select="@id"/>)
                            – <xsl:value-of select="ns:statut"/>
                          </div>
                        </xsl:for-each>
                      </div>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="no-subtasks">—</span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>

        <div style="margin-top: 40px; padding: 24px; background: rgba(132,94,247,0.05); border-radius: 20px; border: 1px solid rgba(132,94,247,0.1);">
          <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #845EF7; text-transform: uppercase; letter-spacing: 0.1em;">Résumé</h4>
          <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6;">
            <xsl:value-of select="count(/ns:tasks/ns:task)"/> tâche(s) au total,
            <xsl:value-of select="count(/ns:tasks/ns:task[ns:statut!='en cours'])"/> terminée(s),
            <xsl:value-of select="count(/ns:tasks/ns:task[ns:statut='en cours'])"/> en cours.
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
