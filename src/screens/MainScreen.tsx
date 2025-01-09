import React, { useState,useMemo } from 'react';
import { Text, View, ScrollView, SafeAreaView, StatusBar, Dimensions, Modal, TouchableOpacity,FlatList } from 'react-native';
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
/**
 * 메인 화면
 * @since 2024.10.27
 * @latest 2024.10.27
 * @author 김진수
 */

const screenWidth = Dimensions.get('window').width;

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
                return <Ionicons name="map-outline" size={40} color="#242F8B" />;
            case '숙소':
                return <Ionicons name="bed-outline" size={40} color="#242F8B" />;
            case '음식점':
                return <Ionicons name="restaurant-outline" size={40} color="#242F8B" />;
            case '카페':
                return <Ionicons name="cafe-outline" size={40} color="#242F8B" />;
            case '캠핑':
                return  <MaterialIcons name="terrain" size={40} color="#242F8B" />;
            // case '미용실':
            //     return <Ionicons name="cut-outline" size={40} color="#242F8B" />;
            // case '병원':
            //     return <Ionicons name="medkit-outline" size={40} color="#242F8B" />;
            // case '반려용품':
            //     return <Ionicons name="paw-outline" size={40} color="#242F8B" />;
            default:
                return <Ionicons name="help-circle-outline" size={40} color="#242F8B" />;
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
            setData((prevData) => [...prevData, ...prevData, ...prevData]);
        }, []);  // 빈 배열로 설정해 처음 한 번만 실행
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
        
        
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            
            <View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                <SearchBar onPress={openSearchModal} />
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
                                className={`${bgColor} w-[24px] h-[4px]`}
                            >
                            </View>
                        );
                    })}
                </View>

                <View className='w-full bg-none ml-5'>
                    {/* 카테고리 아이콘 섹션 */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex flex-row mt-4 mr-10">
                        {/* {['지도', '숙소', '음식점', '카페', '캠핑', '미용실', '병원', '반려용품'].map((category) => ( */}
                        {['지도', '숙소', '음식점', '카페', '캠핑'].map((category) => (
                            <View key={category} className="w-[75px] p-[8px] mr-[4px]">
                                <View className="rounded-[10px] w-[70px] h-[70px] items-center justify-center">
                                    <TouchableOpacity
                                        onPress={category === '지도' ? navigateToMap
                                            : category === '숙소' ? navigateToAccommodation
                                            : undefined}
                                        className="items-center justify-center rounded-[10px] h-[80px]">
                                        {renderIcon(category)}
                                        <Text style={{ textAlign: 'center', color: '#4A4A4A' }}>{category}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                {/* 이달의 리뷰 Top 4 */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#4A4A4A' }}>이달의 리뷰 Top 2 모아보기 😎</Text>
                    <Text style={{ fontSize: 10, fontWeight: '500', color: '#717171' }}>전체보기</Text>
                </View>

                {/* 슬라이드 가능한 리뷰 카드 섹션 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={{ width: screenWidth * 0.6, padding: 8 }}>
                            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, height: 128 }} />
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
                        <View key={item} style={{ width: screenWidth * 0.6, padding: 8 }}>
                            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 10, height: 128 }} />
                        </View>
                    ))}
                </ScrollView>
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
