import { Task } from './types';

export const generateTaskXML = (tasks: Task[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<tasks xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="tasks.xsd">';
  const taskItems = tasks.map(t => `
  <task id="${t.id}">
    <name>${escapeXml(t.name)}</name>
    <description>${escapeXml(t.description)}</description>
    <schedule>
      <start>${t.startDate}</start>
      <end>${t.endDate}</end>
    </schedule>
    <status>${t.status}</status>
    <priority>${t.priority}</priority>
    <progress>${t.progress}</progress>
    <effort hours="${t.estimatedEffortHours}" />
  </task>`).join('');
  
  return `${xmlHeader}${taskItems}\n</tasks>`;
};

export const defaultXSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <body style="font-family: sans-serif; padding: 20px; background: #0F0D15; color: white;">
        <h2>Task Report</h2>
        <table border="1" style="width:100%; border-collapse: collapse;">
          <tr style="background: #845EF7;">
            <th>Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Progress</th>
          </tr>
          <xsl:for-each select="tasks/task">
            <tr>
              <td><xsl:value-of select="name"/></td>
              <td><xsl:value-of select="status"/></td>
              <td><xsl:value-of select="priority"/></td>
              <td><xsl:value-of select="progress"/>%</td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

export const defaultXSD = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="tasks">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="task" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="name" type="xs:string"/>
              <xs:element name="description" type="xs:string"/>
              <xs:element name="schedule">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="start" type="xs:date"/>
                    <xs:element name="end" type="xs:date"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="status" type="xs:string"/>
              <xs:element name="priority" type="xs:string"/>
              <xs:element name="progress" type="xs:integer"/>
              <xs:element name="effort">
                <xs:complexType>
                  <xs:attribute name="hours" type="xs:decimal"/>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}
