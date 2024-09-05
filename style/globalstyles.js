import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    rowView: {
        display: 'flex',
        flexDirection: 'row'
    },
    columnView: {
        display: 'flex',
        flexDirection: 'column'
    },
    container: {
        backgroundColor: '#e6e8ed',
        padding: 10,
        marginVertical:10,
        borderWidth:0.5,
        borderColor:'#d7dcde'

    },
    boldText: { color: '#000000', fontSize: 14,fontWeight:'800', textTransform: 'capitalize' },
    blueText: { color: '#1E74AD', fontSize: 12,fontWeight:'700', },

    // card: {
    //     paddingVertical: 15,
    //     paddingHorizontal: 20,
    //     width: wp('90%'),
    //     backgroundColor: '#fff',
    //     elevation: 2,
    //     borderRadius: 10
    // },
})

export default globalStyles
