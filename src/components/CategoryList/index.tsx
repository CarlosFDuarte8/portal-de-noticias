import React, { memo, useCallback } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Chip } from "react-native-paper";
import { categories } from "../../constants/categories";
import { stylesCategory } from "./styles";

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryList = memo(({
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) => {
  const handleCategoryPress = useCallback((categoryId: string) => {
    onSelectCategory(categoryId);
  }, [onSelectCategory]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={stylesCategory.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => handleCategoryPress(category.id)}
          style={stylesCategory.chipContainer}
        >
          <Chip
            selected={selectedCategory === category.id}
            onPress={() => handleCategoryPress(category.id)}
            style={stylesCategory.chip}
            mode={selectedCategory === category.id ? "flat" : "outlined"}
          >
            {category.label}
          </Chip>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});


