import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomRadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedColor?: string;
  unselectedColor?: string;
  labelColor?: string;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  label,
  selected,
  onPress,
  selectedColor = '#4CAF50',
  unselectedColor = '#B5B5B5',
  labelColor = '#333',
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.radioContainer}>
      <View
        style={[
          styles.radioOuterCircle,
          { borderColor: selected ? selectedColor : unselectedColor },
        ]}
      >
        {selected && <View style={[styles.radioInnerCircle, { backgroundColor: selectedColor }]} />}
      </View>
      <Text style={[styles.radioLabel, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioOuterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default CustomRadioButton;
