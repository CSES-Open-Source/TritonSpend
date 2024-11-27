import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type FooterProps = {
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, setCurrentPage }) => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentPage('Home')}>

          <Text style={[styles.tabText, currentPage === 'Home' && styles.activeText]}>Home</Text>

        </TouchableOpacity>
  
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentPage('Transactions')}>

          <Text style={[styles.tabText, currentPage === 'Transactions' && styles.activeText]}>Transactions</Text>

        </TouchableOpacity>
  
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentPage('Analysis')}>
          
          <Text style={[styles.tabText, currentPage === 'Analysis' && styles.activeText]}>Analysis</Text>

        </TouchableOpacity>
  
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentPage('Advisor')}>

          <Text style={[styles.tabText, currentPage === 'Advisor' && styles.activeText]}>Advisor</Text>

        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#FFF',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    tab: {
      alignItems: 'center',
    },
    tabText: {
      fontSize: 12,
      color: 'gray',
    },
    activeText: {
      color: '#4B0082',
      fontWeight: 'bold',
    },
  });
  
  export default Footer;