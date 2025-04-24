import React from 'react';
import Select, { StylesConfig, Props } from 'react-select';

export interface ThemedSelectProps<OptionType extends { color: string }>
  extends Props<OptionType> {
  darkMode?: boolean;
}

const isLightColor = (hex: string) => {
  const hexColor = hex.replace('#', '');
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

export function ThemedSelect<OptionType extends { color: string }>({
  darkMode = false,
  ...props
}: ThemedSelectProps<OptionType>) {
  const styles: StylesConfig<OptionType> = {
    control: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#2d3748' : 'white',
      borderColor: darkMode ? '#4a5568' : '#e2e8f0',
      boxShadow: 'none',
      ':hover': {
        borderColor: darkMode ? '#718096' : '#cbd5e0',
      },
    }),
    option: (base, { data, isDisabled, isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? `${data.color}1a`
        : darkMode
        ? '#2d3748'
        : 'white',
      color: isDisabled
        ? '#a0aec0'
        : isSelected
        ? isLightColor(data.color)
          ? 'black'
          : 'white'
        : darkMode
        ? 'white'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ':active': {
        backgroundColor: !isDisabled ? `${data.color}33` : undefined,
      },
    }),
    input: (base) => ({ ...base, ...dot() }),
    placeholder: (base) => ({ ...base, ...dot(darkMode ? '#a0aec0' : '#cbd5e0') }),
    singleValue: (base, { data }) => ({
      ...base,
      ...dot(data.color),
      color: darkMode ? 'white' : data.color,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#2d3748' : 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      svg: {
        color: darkMode ? '#a0aec0' : '#718096',
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#4a5568' : '#e2e8f0',
    }),
  };

  return (
    <Select
      styles={styles}
      isSearchable
      menuPosition="fixed"
      {...props}
    />
  );
}
