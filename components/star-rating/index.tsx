import { Icon, TouchableOpacity, View } from '@/components/ui';
import React, { useState } from 'react';

interface StarRatingProps {
  maxRating?: number;
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
  color?: string;
  emptyColor?: string;
  disabled?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  maxRating = 5,
  value = 0,
  onChange,
  size = 24,
  color = '#f2a536',
  emptyColor = '#E0E0E0',
  disabled = false,
  className,
}) => {
  const [currentRating, setCurrentRating] = useState(value);

  const handlePress = (selectedRating: number) => {
    if (disabled) return;
    
    setCurrentRating(selectedRating);
    onChange?.(selectedRating);
  };

  const renderStars = () => {
    return Array.from({ length: maxRating }, (_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= currentRating;
      
      return (
        <TouchableOpacity
          key={starIndex}
          onPress={() => handlePress(starIndex)}
          disabled={disabled}
          className="mr-1"
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Icon
            as="AntDesign"
            name={isFilled ? 'star' : 'staro'}
            size={size}
            color={isFilled ? color : emptyColor}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View className={`flex-row items-center ${className || ''}`}>
      {renderStars()}
    </View>
  );
};

export default StarRating;
