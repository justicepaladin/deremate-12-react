import React from "react";
import { Image, StyleSheet, View } from "react-native";

const HeaderLogo = () => (
  <View style={styles.container}>
    <Image
      source={require("../assets/images/deremate-logo.png")}
      style={styles.logo}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
});

export default HeaderLogo;
