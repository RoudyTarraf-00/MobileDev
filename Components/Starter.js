import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'

import pig from '../assets/pig-removebg-preview.png'
import phone from '../assets/phone-removebg-preview.png'
import visa from '../assets/visa-removebg-preview.png'

const Starter = ({ navigation }) => {

    const slides = [
        {
            image: pig,
            title: "Welcome to RCB Transfer App",
            subtitle: "Manage your money easily and securely."
        },
        {
            image: phone,
            title: "Use the App Anywhere",
            subtitle: "Access your account anytime, anywhere."
        },
        {
            image: visa,
            title: "Request Your Card",
            subtitle: "Get your physical card delivered quickly."
        },
    ]

    const [index, setIndex] = useState(0)
    const current = slides[index]

    const handleNext = () => {
        if (index === slides.length - 1) {
            navigation.replace("Login")
            return
        }
        setIndex(index + 1)
    }

    return (
        <View style={styles.container}>

            {/* IMAGE */}
            <Image source={current.image} style={styles.image} />

            {/* TEXT */}
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.subtitle}>{current.subtitle}</Text>

            

            {/* BUTTON */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>
                    {index === slides.length - 1 ? "Get Started" : "Next"}
                </Text>
            </TouchableOpacity>

            {/* SKIP */}
            {index < slides.length - 1 && (
                <Text style={styles.skip} onPress={() => navigation.replace("Login")}>
                    Skip
                </Text>
            )}

        </View>
    )
}

export default Starter;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E5F0FF",    // same as HomePage
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },

    image: {
        width: 260,
        height: 230,
        resizeMode: "contain",
        marginBottom: 10
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827", // dark text like HomePage
        textAlign: "center",
        marginTop: 10
    },

    subtitle: {
        fontSize: 15,
        color: "#6B7280", // gray text like transactions
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
        paddingHorizontal: 10
    },

    dotsRow: {
        flexDirection: "row",
        marginTop: 18,
        marginBottom: 25
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#CBD5E1",
        marginHorizontal: 4
    },

    dotActive: {
        width: 18,
        backgroundColor: "#2563EB", // HomePage blue
    },

    button: {
        marginTop:20,
        backgroundColor: "#2563EB", // HomePage primary blue
        width: "80%",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#1D4ED8",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 4
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16
    },

    skip: {
        marginTop: 15,
        fontSize: 14,
        color: "#6B7280",
        textDecorationLine: "underline"
    },
});
