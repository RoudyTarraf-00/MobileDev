import { View } from "react-native";
import { Text } from "react-native";

const ProfilePage=(props)=>{

    const phone = props.route.params.user.phone;
    return(
        <View>
            <Text>{phone}</Text>
        </View>
    )
}

export default ProfilePage;