import { BlurView } from 'expo-blur'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { KeyboardAvoidingView, Platform } from "react-native";
// import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import { CreditCardInput } from "react-native-credit-card-input";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from '../slices/userSlice';
import { IP_ADDRESS } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProfileScreen = () => {
    
    const userData = useSelector(selectUserInfo)
    const [givenName, setGivenName] = useState(userData.givenName);
    const [familyName, setFamilyName] = useState(userData.familyName);
    const [email, setEmail] = useState(userData.email);
    const [creditCard, setCreditCard] = useState({ number: '** ** ** 4011', expiry: '03 / 25', cvc: '062' });
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const data = [
        {
            id: 0,
            label: 'First Name',
            userField: 'givenName',
            keyboardType: 'default',
            value: givenName,
            setValue: setGivenName
        },
        {
            id: 1,
            label: 'Last Name',
            userField: 'familyName',
            keyboardType: 'default',
            value: familyName,
            setValue: setFamilyName
        },
        {
            id: 2,
            label: 'Email',
            userField: 'email',
            keyboardType: 'email-address',
            value: email,
            setValue: setEmail
        },
        {
            id: 3,
            label: 'Credit Card',
            userField: 'creditCard',
            keyboardType: 'numeric',
            value: creditCard,
            setValue: setCreditCard
        }

    ]
    const updateUserInfo = async () => {
        const tempUser = {
            id: userData.id,
            givenName,
            familyName,
        }
        // await fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/updateUserInfo`, {
        await fetch(`http://${IP_ADDRESS}:3001/updateUserInfo`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tempUser })
        })
        alert("Profile has been updated!")
        storeAndDispatchUserData({
            id: userData.id,
            givenName: userData.givenName,
            familyName: userData.familyName,
            email: userData.email,
            photoUrl: userData.photoUrl,
        })
        navigation.goBack();
    }
    const cardInputChange = (form) => {
        return false;
    };
    const storeAndDispatchUserData = (user) => {
        dispatch(setUserInfo(user));
        AsyncStorage.setItem('Users', JSON.stringify({ user }))
            .catch(error => console.log('error', error));
    }

    return (
        <View style={tw`bg-white h-full w-full pt-2 pb-10`}>
            <TouchableOpacity style={tw`items-center`}>
                <View style={tw`shadow w-40 h-40`}>
                    <Image style={[tw`h-40 w-40 rounded-full shadow-xl`]} source={{ uri: userData.photoUrl }} />
                </View>
            </TouchableOpacity>
            <FlatList style={tw`flex mt-4 h-2/3 `} data={data} keyExtractor={(item) => item.id}
                renderItem={({ item: { value, setValue, label, keyboardType, userField } }) => (
                    userField === 'creditCard' ?
                        <TouchableOpacity onPress={() => navigation.navigate('Credit Card')} style={tw`px-5 py-3 h-48 overflow-hidden`}>
                            <Text style={tw`pl-1 pb-1 font-bold`}>{label}</Text>
                            <CreditCardInput cardFontFamily={'System'} onChange={cardInputChange} cardScale={0.8} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={tw`flex-row items-center px-5 py-3`}>
                            <View style={tw`w-full`}>
                                <Text style={tw`pl-1 pb-1 font-bold`}>{label}</Text>
                                <TextInput
                                    style={tw`bg-gray-100 p-2 w-full rounded-lg shadow`}
                                    onChangeText={setValue}
                                    placeholder={userField === "creditCard" ? '*-*-**-' + value.substr(value.length - 4) : value}
                                    keyboardType={keyboardType}
                                    value={value}
                                />
                            </View>
                        </TouchableOpacity>
                )} />
            <TouchableOpacity onPress={() => updateUserInfo()} style={tw`items-center justify-center overflow-hidden`}>
                <View style={tw`w-1/3 bg-blue-200 py-2 px-4 rounded-xl shadow-md m-3`}>
                    <Text style={tw`text-center `}>Apply Changes</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})