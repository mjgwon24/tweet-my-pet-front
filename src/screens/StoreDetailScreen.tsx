import React from "react";
import {Dimensions, StyleSheet, View, Image, Text} from "react-native";
import {MaterialIcons} from '@expo/vector-icons';

const StoreDetailScreen: React.FC = () => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const styles = StyleSheet.create({
        icon: {
            padding: 5,
            borderWidth: 2
        },
        image: {
            width: screenWidth,
            height: screenHeight / 2,
            resizeMode: 'cover'
        }
    });

    // 상단 네비게이션 렌더링
    const renderHeader = () => (
        <View className="absolute top-0 z-10">
            <View className="flex flex-row justify-between items-center px-4 py-6 w-screen">
                <MaterialIcons name="arrow-back-ios" size={24} color="white" style={styles.icon}/>

                <View className="flex flex-row items-center border">
                    <MaterialIcons name="favorite-border" size={24} color="white" style={styles.icon} />
                    <MaterialIcons name="share" size={24} color="white" style={styles.icon} />
                </View>
            </View>
        </View>
    );

    // 매장 사진 렌더링
    const renderStoreImages = () => (
        <View className="w-screen relative">
            <Image source={require("../images/thumbExample/thumb1.png")} style={styles.image} />

            <View className="absolute bottom-4 left-0 w-full flex flex-col items-center">
                <View className="bg-[#00000099] rounded-lg px-4 py-2.5">
                    <Text className="text-white text-[18px]">1 / 3</Text>
                </View>
            </View>
        </View>
    );



    return (
        <View className="flex flex-col items-center bg-white">
            {renderHeader()}
            {renderStoreImages()}
        </View>
    );
};

export default StoreDetailScreen;