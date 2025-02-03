import SettingSection from "@/components/SettingSection/SettingSextion";
import { Feather, Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";


export default function Account() {
    const AllTransactions = [
        { id: 1, name: "Username", value: "@Example", icon: "user"},
        { id: 2, name: "Phone", value: "123-456-7890", icon: "phone"},
        { id: 3, name: "Budget", value: "1/11/2025", icon: "dollar-sign" },
        { id: 4, name: "Budget Per Category", value: "3000$", icon: "grid"},
    ];
    return (
        <View style={styles.AccountContainer}>
            <View style = {styles.header}>
                <Feather name = "edit" size = {25}/>
            </View>
            <View style={styles.profilePic}>
                <Ionicons name = 'person' size={50} color={'grey'}/>
            </View>
            <Text style={{fontWeight:'bold', fontSize:20}}>Full Name</Text>
            <Text style={{fontWeight:500, fontSize:15, opacity:0.5}}>example@ucsd.edu</Text>
            <View style={styles.settingList}>
                {AllTransactions.map(
                    (
                        section: { name: any; value: any; id: any; icon:any;},
                        index: any,
                    ) => (
                        <View key={section.id}>
                        <SettingSection
                            name={section.name}
                            value={section.value}
                            icon = {section.icon}
                        />
                        {/* Put a separater between elements excpet for the last one */}
                        {index < AllTransactions.length - 1 && (
                            <View style={styles.separator} />
                        )}
                        </View>
                    ),
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  AccountContainer: {
    flex: 1,
    backgroundColor: "#bbadff",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    flexDirection: "column",
    gap: 10,
  },
  profilePic: {
    backgroundColor:'white',
    borderRadius:50,
    width:75,
    height:75,
    alignItems:'center',
    justifyContent:'center'
  },
  settingList: {
    flexDirection:'column',
    width:'100%',
    backgroundColor:'white',
    borderRadius:10,
    padding:10,
    gap:10
  },
  header:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    width:'100%'
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    opacity: 0.2,
    borderRadius: 2,
    marginTop:10
  },
});
