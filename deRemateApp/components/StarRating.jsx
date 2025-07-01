import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const StarRating = ({ rating, size = 18 }) => {
  const totalStars = 5;
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <Text
        key={i}
        style={[
          styles.star,
          {
            fontSize: size,
            color: i <= rating ? "#FFD700" : "#CCCCCC", // Dorado o gris
          },
        ]}
      >
        ★
      </Text>
    );
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  star: {
    marginHorizontal: 1,
  },
});
