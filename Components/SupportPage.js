import { Text, View } from "react-native";

const SupportPage=(props)=>{

    const user = props.route.params.user;

    return(
            <View>
                <Text>{user.name}</Text>
                <Text>{user.phone}</Text>
            </View>
    )
}


export default SupportPage;