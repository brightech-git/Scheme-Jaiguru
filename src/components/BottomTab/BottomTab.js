import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';

import { scale, colors } from '../../utils';
import { colors1 } from '../../utils/colors';

function BottomTab({ screen }) {
  const navigation = useNavigation();

  const getIconColor = (currentScreen) => {
    return screen === currentScreen ? colors1.primaryText : colors.darkGrayText;
  };

  const getTextStyle = (currentScreen) => {
    return screen === currentScreen ? styles.activeText : styles.inactiveText;
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MainLanding')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="home"
          size={scale(20)}
          color={getIconColor('HOME')}
        />
        <Text style={getTextStyle('HOME')}>Home</Text>
      </TouchableOpacity>

      {/* Schemes */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MyScheme')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="badge-account"
          size={scale(20)}
          color={getIconColor('SCHEMES')}
        />
        <Text style={getTextStyle('SCHEMES')}>Schemes</Text>
      </TouchableOpacity>

      {/* Gold Plans */}
      <TouchableOpacity
        onPress={() => navigation.navigate('GoldPlanScreen')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="star"
          size={scale(20)}
          color={getIconColor('GOLDPLANS')}
        />
        <Text style={getTextStyle('GOLDPLANS')}>Gold Plans</Text>
      </TouchableOpacity>

      {/* Support */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Support')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="headset"
          size={scale(20)}
          color={getIconColor('SUPPORT')}
        />
        <Text style={getTextStyle('SUPPORT')}>Support</Text>
      </TouchableOpacity>
    </View>
  );
}

export default BottomTab;
