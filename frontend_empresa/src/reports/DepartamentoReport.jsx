import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, textAlign: "center", marginBottom: 10 },
  table: { display: "table", width: "100%", borderStyle: "solid", borderWidth: 1, marginTop: 10 },
  row: { flexDirection: "row", borderBottomWidth: 1, padding: 5 },
  header: { backgroundColor: "#eeeeee", fontWeight: "bold" },
  cell: { flex: 1, textAlign: "center", fontSize: 10, padding: 3 },
});

const DepartamentoReport = ({ departamentos }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Listado de Departamentos</Text>
      <View style={styles.table}>
        {/* Encabezado */}
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>ID</Text>
          <Text style={styles.cell}>Nombre</Text>
          <Text style={styles.cell}>Ubicación</Text>
          <Text style={styles.cell}>Presupuesto</Text>
          <Text style={styles.cell}>Fecha de Creación</Text>
        </View>
        {/* Filas de la tabla */}
        {departamentos.map((dep) => (
          <View key={dep.id_departamento} style={styles.row}>
            <Text style={styles.cell}>{dep.id_departamento}</Text>
            <Text style={styles.cell}>{dep.nombre}</Text>
            <Text style={styles.cell}>{dep.ubicacion}</Text>
            <Text style={styles.cell}>{dep.presupuesto} €</Text>
            <Text style={styles.cell}>{new Date(dep.fecha_creacion).toLocaleDateString("es-ES")}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default DepartamentoReport;
