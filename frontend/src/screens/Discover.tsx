import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { Card, Header, FilterBar } from "components";
import createTheme, { colors } from "theme";
import appcontext from "appcontext";
import LottieView from "lottie-react-native";
import { ScreenProps } from "types";

const data = [
  {
    name: "restaurant",
    categories: [
      {
        name: "West Indian",
        subcategories: ["Jamaica", "Cuba", "Aruba", "Saint Lucia", "Grenada"],
      },
      {
        name: "American",
        subcategories: ["Southern", "Soul Food"],
      },
    ],
  },
  {
    name: "grocery",
    categories: [],
  },
  {
    name: "bakery",
    categories: [],
  },
  {
    name: "home",
    categories: [
      {
        name: "Filters",
        subcategories: [
          "Contractors",
          "Electricians",
          "Landscapers",
          "Cleaners",
          "Locksmiths",
          "Movers",
          "Painters",
          "Plumbers",
        ],
      },
    ],
  },
  {
    name: "cosmetic",
    categories: [],
  },
  {
    name: "wellness",
    categories: [],
  },
];

const refreshHeight = 100;

const HeartsAnimation = ({
  progress,
  refreshing,
}: {
  progress: number;
  refreshing: boolean;
}) => {
  const lottie = useRef(null);

  useEffect(() => {
    if (refreshing) {
      lottie.current.play();
    }
  }, [refreshing]);

  return (
    <Animated.View
      style={{
        height: refreshHeight,
        position: "absolute",
        marginTop: 50,
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <LottieView
        ref={lottie}
        style={{
          flex: 1,
        }}
        source={require("../../assets/animation/hearts-loader.json")}
        progress={refreshing ? undefined : progress / 2}
      />
    </Animated.View>
  );
};

export default function Discover({
  navigation: { navigate },
}: ScreenProps<"Home">) {
  const ctx = useContext(appcontext);
  const theme = createTheme(ctx?.darkmode);
  const [query, updateQuery] = useState("");
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [refreshing, isRefreshing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [extraPaddingTop] = useState(new Animated.Value(0));

  useEffect(() => {
    if (offsetY <= 0) {
      setProgress(-offsetY / refreshHeight);
    }
  }, [offsetY]);

  useEffect(() => {
    if (!refreshing) {
      Animated.timing(extraPaddingTop, {
        toValue: 0,
        duration: 600,
        easing: Easing.elastic(1.3),
      }).start();
    }
  }, [refreshing]);

  function onScroll(event) {
    const {
      nativeEvent: {
        contentOffset: { y },
      },
    } = event;

    setOffsetY(y);
  }

  function onRelease() {
    if (offsetY <= -refreshHeight / 2) {
      isRefreshing(true);

      Animated.timing(extraPaddingTop, {
        toValue: refreshHeight / 2,
        duration: 200,
      }).start();

      setTimeout(() => {
        isRefreshing(false);
        setLoaderVisible(false);
      }, 4000);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background(ctx?.darkmode),
      }}
    >
      {loaderVisible && <HeartsAnimation {...{ progress, refreshing }} />}

      <Animated.View style={{ paddingTop: extraPaddingTop }} />

      <ScrollView
        style={styles.container}
        {...{ onScroll }}
        onScrollBeginDrag={() => {
          setLoaderVisible(true);
        }}
        onScrollEndDrag={onRelease}
        scrollEventThrottle={1}
      >
        <Header
          {...{
            query,
            onType: updateQuery,
          }}
        />

        <View style={styles.intro}>
          <Text style={[theme.typography.title]}>BYBLK</Text>
          <Text style={[theme.typography.subtitle]}>
            Discover Black-Owned Businesses
          </Text>
        </View>

        <View style={styles.listingSection}>
          <View style={styles.sectionHeader}>
            <Text style={[theme.typography.subtitle]}>INDUSTRIES</Text>
          </View>

          <FilterBar
            onSelectFilter={(filter) =>
              navigate("Results", {
                data,
              })
            }
          />
        </View>

        <View style={styles.listingSection}>
          <View style={styles.sectionHeader}>
            <Text style={[theme.typography.subtitle]}>NEARBY</Text>
            <TouchableOpacity
              onPress={() =>
                navigate("Results", {
                  data,
                })
              }
            >
              <Text
                style={[
                  theme.typography.subtitle,
                  theme.typography.fontS,
                  styles.link,
                ]}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            style={styles.sectionScrollView}
            showsHorizontalScrollIndicator={false}
          >
            {data.map((data, index) => (
              <Card onPress={() => navigate("Business")} key={index} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.listingSection}>
          <View style={styles.sectionHeader}>
            <Text style={[theme.typography.subtitle]}>FEATURED</Text>

            <TouchableOpacity
              onPress={() =>
                navigate("Results", {
                  data,
                })
              }
            >
              <Text
                style={[
                  theme.typography.subtitle,
                  theme.typography.fontS,
                  styles.link,
                ]}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            style={styles.sectionScrollView}
            showsHorizontalScrollIndicator={false}
          >
            {data.map((data, index) => (
              <Card onPress={() => navigate("Business")} key={index} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  intro: {
    marginBottom: 10,
    padding: 15,
  },
  listingSection: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 15,
  },
  sectionScrollView: {
    paddingBottom: 10,
  },
  headerText: {
    padding: 15,
  },
  link: {
    color: colors.emerald,
  },
});
