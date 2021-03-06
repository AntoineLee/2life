import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import { HEIGHT, getResponsiveHeight } from '../common/styles'

export default class Notification extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Notification</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'rgb(242,246,250)',
    alignItems: 'center',
    height: HEIGHT
  }
})
