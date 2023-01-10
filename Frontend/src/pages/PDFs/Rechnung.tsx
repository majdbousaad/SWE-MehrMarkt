import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IVerkaufOne } from '../Verkauf/VerkaufSummary';



// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    margin : "8px"
  },
  table: {
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: "7px"
  },
  header: {
    borderTop: 'none',
  },
  bold: {
    width: '100%',
    fontWeight: 'bold'
  },
  // So Declarative and unDRY 👌
  row1: {
    width: '100%',
  },
  row2: {
    width: '100%',
  },
  row3: {
    width: '100%',
  },
  center: {
    textAlign: "center"
  }
  
});

  
  
  
// Create Document Component
export const Rechnung = 
(
    {
        verkauf
    }:
    {
        verkauf: IVerkaufOne
    }
) => (
    
  <Document>
    <Page size="A7" style={styles.page}>
      <View>
      <Text style={styles.center}>Warenkorb: {verkauf.id}</Text>
        <View style={styles.table}>
            <View style={styles.row}>
                <View style={styles.row1}><Text style={styles.bold}>Produkt Bezeichnung</Text></View>
                <View style={styles.row2}><Text style={styles.bold}>Preis</Text></View>
                <View style={styles.row1}><Text style={styles.bold}>Menge</Text></View>
            </View>
            {verkauf.products?.map(row => 
                <View style={styles.row}>
                    <View style={styles.row1} ><Text>{row.name}</Text></View>
                    <View style={styles.row1}><Text>{row.menge}</Text></View>
                    <View style={styles.row1}><Text>{row.price}$</Text></View>
                </View>
                )}
                <View style={styles.row}>
                <View style={styles.row1}><Text>Summe</Text></View>
                <View style={styles.row2}><Text></Text></View>
                <View style={styles.row1}><Text>{verkauf.gesamtPreis}$</Text></View>
            </View>
            <Text>Verkaufsdatum: {verkauf.Datum}</Text>
        </View>
      </View>
      
    </Page>
  </Document>
);