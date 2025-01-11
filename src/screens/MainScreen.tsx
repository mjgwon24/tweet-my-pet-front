import React, { useState,useMemo } from 'react';
import { Text, View, ScrollView, SafeAreaView, StatusBar, Dimensions, Modal, TouchableOpacity,FlatList,Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import SearchBar from '../components/SearchBar';
import SearchScreen from '../screens/SearchScreen';
import { Ionicons } from '@expo/vector-icons';
import {MaterialIcons} from "@expo/vector-icons";
import {useEffect, useRef} from 'react';
import { Animated, StyleSheet, Button } from 'react-native'
import styles from './App.module.css';
import clsx from "clsx";
import Svg, { G, Rect, Path } from 'react-native-svg';

/**
 * 메인 화면
 * @since 2024.10.27
 * @latest 2024.10.27
 * @author 김진수
 */

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const MainScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isModalVisible, setModalVisible] = useState(false);
    const [animatedValue, setAnimatedValue] = useState(0);

    const openSearchModal = () => setModalVisible(true);
    const closeSearchModal = () => setModalVisible(false);

    const navigateToMap = () => {
        navigation.navigate('Map');
    };

    

    const navigateToAccommodation = () => {
        navigation.navigate('Accommodation');
    };
    const renderIcon = (category) => {
        switch (category) {
            case '지도':
                return <Ionicons name="map-outline" size={20} color="#EBEDFF" style={{transform: 'scaleY(-1)'}} />;
            case '숙소':
                return <Ionicons name="bed-outline" size={20} color="#EBEDFF" />;
            case '음식점':
                return <Ionicons name="restaurant-outline" size={20} color="#EBEDFF" />;
            case '카페':
                return <Ionicons name="cafe-outline" size={20} color="#EBEDFF" />;
            case '캠핑':
                return  <MaterialIcons name="terrain" size={20} color="#EBEDFF" />;
            // case '미용실':
            //     return <Ionicons name="cut-outline" size={20} color="#EBEDFF" />;
            // case '병원':
            //     return <Ionicons name="medkit-outline" size={20} color="#EBEDFF" />;
            // case '반려용품':
            //     return <Ionicons name="paw-outline" size={20} color="#EBEDFF" />;
            default:
                return <Ionicons name="help-circle-outline" size={20} color="#EBEDFF" />;
        }
    };
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animation, setAnimation] = useState(false);
    const [animationReverse, setAnimationReverse] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const OriginData = [
        {
            title:
              '주요 공지 사항, 이벤트 안내1',
            index: 0
          },
          {
            title:
              '주요 공지 사항, 이벤트 안내2',
            index: 1
          },{
            title:
              '주요 공지 사항, 이벤트 안내3',
            index: 2
          },
    ];
    const [data,setData] = useState(
        OriginData
        );
        useEffect(() => {
            setData((prevData) => {
                if (prevData.length > 100) return prevData; // 데이터 크기 제한
                return [...prevData, ...OriginData];
            });
        }, []);
        const [projectCount, setProjectCount] = useState(3); // 표시할 프로젝트 개수
        const [nextData, setNextData] = useState(1);
        const [prevData, setPrevData] = useState(2);
        const [isOnScroll,setIsOnScroll] = useState(false);
        const [offsetX,setOffsetX] = useState(0);
        const [isHandOn,setIsHandOn] = useState(false);
        const [visibleItems, setVisibleItems] = useState([]);
  
        const viewabilityConfig = {
            itemVisiblePercentThreshold: 90,
        };

        const onViewableItemsChanged = useRef(({ viewableItems }) => {
            setVisibleItems(viewableItems.map(item => item.item));
            if(viewableItems!=[]&&viewableItems[0]&&viewableItems[0].item&&viewableItems[0].item.index){
                setCurrentIndex((viewableItems[0].item.index)%projectCount)
            }
        });
        const offset = 362;
        const snapToOffsets = useMemo(() => Array.from(Array(data.length)).map((_, index) => index * offset), [data]);
        const onHandOut = (event)=>{
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const nowIndex = (Math.round(contentOffsetX / screenWidth))%projectCount;
            setTimeout(() => {
                setIsOnScroll(false);
                flatListRef.current?.scrollToOffset({
                  offset: (offset*projectCount)+((nowIndex)%projectCount+1)*offset,
                  animated: false,
                });
                if(contentOffsetX>currentIndex*offset)
                {
                    setCurrentIndex((currentIndex+1)%projectCount);
                }
                else if(contentOffsetX<currentIndex*offset)
                {
                    setCurrentIndex((currentIndex+projectCount-1)%projectCount);
                }
            }, 1000);
            setIsHandOn(false);
        }
        const onHandOn = (event)=>{
            setIsHandOn(true);
        }

  
    const handleScroll = (event) => {
        setIsHandOn(false);
      };
    const onScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        setOffsetX(contentOffsetX);
        setIsOnScroll(true);
    }
    const X = useRef(new Animated.Value(0)).current
    useEffect(() => {
        setTimeout(()=>{flatListRef.current?.scrollToOffset({
            offset: offset*projectCount,  // 5번째 아이템으로 이동
            
            animated: true,
          });},100)
      }, [flatListRef,offset,projectCount]);
    useEffect(() => {
        const listener = X.addListener(({ value }) => {
            setAnimatedValue(value);
        });

        return () => {
            X.removeListener(listener);
        };
    }, []);
    useEffect(() => {
        if (animation&&!isHandOn) {
            setCurrentIndex((currentIndex+1) % projectCount);
            setTimeout(()=>{
                setData((prevData) => {
                    const first = prevData[0];
                    const rest = prevData.slice(1);
                    return [...rest,first];
            });
            
            setNextData((currentIndex+1)% projectCount);
            setPrevData(((currentIndex) % projectCount+projectCount)% projectCount);
                },750)
          
          const ani = Animated.timing(X, {
            toValue: animation?-(offset-15):0,
            duration: 800,
            useNativeDriver: true,
          });
          
          ani.start(() => {
            setAnimation(false);
            ani.reset();
          });
          
        }
        else{
            return;
        }
      }, [animation,isHandOn]);


    useEffect(() => {
        const interval = setInterval(() => {
            if(!isHandOn)
                setAnimation(true);
        }, 3000);
    
        return () => {
          clearInterval(interval);
        };
      }, [data,currentIndex]);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3D47AA',paddingBottom:screenHeight*0.1}}>
            <View>
                <ScrollView>
                <View className="px-7">
                    <View className="flex flex-row justify-between pt-[30px]">
                        <View className="">
                        <Image className="w-[35px] h-[24px] mb-[-7px] z-10"
                                    source={require("../images/common/tweetmypet-logo-temp.png")}/>
                        </View>
                        <View className="flex flex-row gap-3">
                            
                            <Svg
                                width="24"
                                height="24"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <Path d="M7.23706 14.0581C10.6817 14.0581 13.4741 11.2657 13.4741 7.82105C13.4741 4.37641 10.6817 1.58398 7.23706 1.58398C3.79243 1.58398 1 4.37641 1 7.82105C1 11.2657 3.79243 14.0581 7.23706 14.0581Z" stroke="#EBEDFF" stroke-width="1.584" stroke-linecap="round" stroke-linejoin="round"/>
                                <Path d="M11.6475 12.2314L15.256 15.8401" stroke="#EBEDFF" stroke-width="1.584" stroke-linecap="round" stroke-linejoin="round"/>
                            </Svg>
                            <Svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M13.8101 21.0801C13.6343 21.3832 13.3819 21.6347 13.0783 21.8096C12.7747 21.9845 12.4305 22.0765 12.0801 22.0765C11.7297 22.0765 11.3855 21.9845 11.0819 21.8096C10.7782 21.6347 10.5259 21.3832 10.3501 21.0801M18.0801 8.08008C18.0801 6.48878 17.4479 4.96266 16.3227 3.83744C15.1975 2.71222 13.6714 2.08008 12.0801 2.08008C10.4888 2.08008 8.96266 2.71222 7.83744 3.83744C6.71222 4.96266 6.08008 6.48878 6.08008 8.08008C6.08008 15.0801 3.08008 17.0801 3.08008 17.0801H21.0801C21.0801 17.0801 18.0801 15.0801 18.0801 8.08008Z" stroke={"#EBEDFF"} stroke-width={"2.08696"} stroke-linecap="round" stroke-linejoin="round"/>
                            </Svg>
                        </View>
                    </View>
                </View>
                    <View className='w-full bg-none ml-5 pb-[21.9px]'>
                        {/* 카테고리 아이콘 섹션 */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex flex-row mt-4 mr-10">
                            {/* {['지도', '숙소', '음식점', '카페', '캠핑', '미용실', '병원', '반려용품'].map((category) => ( */}
                            {['지도', '숙소', '음식점', '카페', '캠핑'].map((category) => (
                                <View key={category} className="w-[70px] p-[8px] mr-[18px]">
                                    <View className="rounded-[10px] w-[70px] h-[60px] items-center justify-center bg-[#242F9B]">
                                        <TouchableOpacity
                                            onPress={category === '지도' ? navigateToMap
                                                : category === '숙소' ? navigateToAccommodation
                                                : undefined}
                                            className="items-center justify-center rounded-[10px] h-[80px]">
                                            {renderIcon(category)}
                                            <Text className='text-[8.379px] text-center text-[#EBEDFF] font-bold'>{category}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <View className='bg-[#FFF] px-[16px] rounded-t-[22px] py-[32px]' style={{boxShadow:"0px 0px 15px #0C156C"}}>
                        <View className='overflow-hidden ml-[2px]'>
                            <Animated.View
                                style={[
                                {
                                    width: '100%',
                                    transform: [{ translateX: X }],
                                },
                                ]}>
                                <View className='flex flex-row items-center justify-center gap-[30px] w-[300%] left-[-100%]'>
                                    <TouchableOpacity key={999}>
                                        <View className='bg-[#E0E0E0] h-[160px] w-[312px] rounded-[10px] p-[24px] mt-[16px] justify-center'>
                                            <Text className='text-[18px] text-center text-[#4A4A4A]'>{OriginData[((currentIndex)%projectCount)%projectCount].title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <FlatList
                                        data={data}
                                        horizontal
                                        contentContainerStyle={{display:'flex',flexDirection:'row',paddingHorizontal: 20,alignItems:'center',justifyContent:'center',gap:50}}
                                        renderItem={({item,index}) => (
                                            <TouchableOpacity key={index}>
                                                <View className='bg-[#E0E0E0] h-[160px] w-[312px] rounded-[10px] p-[24px] mt-[16px] justify-center'>
                                                    <Text className='text-[18px] text-center text-[#4A4A4A]'>{item.title}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        onScroll={onScroll}
                                        onMomentumScrollEnd={handleScroll}
                                        onScrollBeginDrag={onHandOn}
                                        onScrollEndDrag={onHandOut}
                                        snapToOffsets={snapToOffsets}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(_, index) => String(index)}
                                        ref={flatListRef}
                                        scrollEnabled={animation==false?true:false}
                                        decelerationRate={0.01}
                                        onViewableItemsChanged={onViewableItemsChanged.current}
                                        viewabilityConfig={viewabilityConfig}
                                    />
                                    <TouchableOpacity key={9999}>
                                        <View className='bg-[#E0E0E0] h-[160px] w-[312px] rounded-[10px] p-[24px] mt-[16px] justify-center'>
                                            <Text className='text-[18px] text-center text-[#4A4A4A]'>
                                                {OriginData[(currentIndex)%projectCount].title}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                            
                        </View>
                        <View className='justify-center items-center flex-row gap-2 pt-3'>
                            {data.slice(0, projectCount).map((_, index) => {
                                let bgColor = "bg-[#EFEFEF]";  // 기본 배경색
                                let blue = "bg-[#3D47AA]"
                                if(index==currentIndex)
                                    bgColor = blue;
                                return (
                                    <View
                                        key={index}
                                        className={`${bgColor} w-[24px] h-[2px]`}
                                    >
                                    </View>
                                );
                            })}
                        </View>
                        
                        {/* 이달의 리뷰 Top 4 */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#4A4A4A' }}>이달의 리뷰 Top 4 모아보기 😎</Text>
                            <Text style={{ fontSize: 10, fontWeight: '500', color: '#717171' }}>전체보기</Text>
                        </View>

                        {/* 슬라이드 가능한 리뷰 카드 섹션 */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                            {[1, 2, 3, 4].map((item) => (
                                <View key={item} style={{padding: 8 }}>
                                    <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, height: screenWidth/3.7, width:screenWidth/3.7 }} />
                                </View>
                            ))}
                        </ScrollView>
                        {/* 이달의 리뷰 Top 4 */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#4A4A4A' }}>이달의 리뷰 Top 4 모아보기 😎</Text>
                            <Text style={{ fontSize: 10, fontWeight: '500', color: '#717171' }}>전체보기</Text>
                        </View>

                        {/* 슬라이드 가능한 리뷰 카드 섹션 */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                            {[1, 2, 3, 4].map((item) => (
                                <View key={item} style={{padding: 8 }}>
                                    <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, height: screenWidth/3.7, width:screenWidth/3.7 }} />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
                
            </View>
            
            <Modal visible={isModalVisible} animationType="slide" transparent={false}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16}}>
                        <TouchableOpacity onPress={closeSearchModal}>
                            <Ionicons name="arrow-back" size={24} color="black"/>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, marginLeft: 10 }}>검색</Text>
                    </View>
                    <SearchScreen />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
        
    );
};

export default MainScreen;
