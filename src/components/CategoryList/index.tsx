import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper';
import { categories } from '../../constants/categories';

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryList = ({ selectedCategory, onSelectCategory }: CategoryListProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          style={styles.chipContainer}
        >
          <Chip
          
            selected={selectedCategory === category.id}
            onPress={() => onSelectCategory(category.id)}
            style={styles.chip}
            mode={selectedCategory === category.id ? 'flat' : 'outlined'}
          >
            {category.label}
          </Chip>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipContainer: {
    marginRight: 8,
  },
  chip: {
    height: 32,
  },
});
