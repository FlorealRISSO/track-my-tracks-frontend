import { useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const TabView = ({ tabs, initialIndex = 0 }) => {
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    const handleTabPress = (index) => {
        setActiveIndex(index);
    };
    const theme = useTheme();

    const component = tabs[activeIndex].content;
    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {tabs.map((tab: any, index: number) => (
                    <Pressable
                        key={index}
                        style={[
                            styles.tab,
                            activeIndex === index
                                ? { backgroundColor: theme.colors.onBackground }
                                : null,
                        ]}
                        onPress={() => handleTabPress(index)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeIndex === index
                                    ? { color: theme.colors.background }
                                    : { color: theme.colors.onBackground },
                            ]}
                        >
                            {tab.title}
                        </Text>
                    </Pressable>
                ))}
            </View>
            {component}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
    },
    tabContent: {
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0,
    },
    activeContent: {
        position: 'relative',
        opacity: 1,
        transform: [{ translateX: 0 }],
    },
});


export default TabView;