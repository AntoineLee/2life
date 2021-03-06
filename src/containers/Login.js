import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert
} from 'react-native'

import {
  WIDTH,
  HEIGHT,
  getResponsiveHeight,
  getResponsiveWidth
} from '../common/styles'

import Storage from '../common/storage'
import { SCENE_INDEX, SCENE_REGISTER } from '../constants/scene'
import { Actions } from 'react-native-router-flux'
import { USERS } from '../network/Urls'
import { setToken } from '../network/HttpUtils'
import HttpUtils from '../network/HttpUtils'
import store from '../redux/store'
import { fetchProfileSuccess } from '../redux/modules/user'
import { fetchPartnerSuccess } from '../redux/modules/partner'
import initApp from '../redux/modules/init'
import dismissKeyboard from 'dismissKeyboard'
import { View, Text } from 'react-native-animatable'
import TextPingFang from '../components/TextPingFang'

const URL = USERS.login

export default class Login extends Component {

  state = {user_account: '', user_password: ''}

  componentDidMount() {
    reLoginInterval = setInterval(async () => {
      const user = await Storage.get('user', {})
      if (!user.user_account || !user.user_password) {
        return
      }

      try {
        onSubmit()
      } catch (e) {
        console.log(e)
      }
    }, 3600 * 1000)
  }

  onSubmit = async () => {

    const {user_account, user_password} = this.state

    HttpUtils.post(URL, {
      user_account,
      user_password
    }).then(res => {
      if (res.code === 0) {
        Storage.set('user', {...this.state})

        const {uid, token, timestamp} = res.data
        setToken({uid, token, timestamp})

        store.dispatch(fetchProfileSuccess(res.data))
        store.dispatch(fetchPartnerSuccess(res.partner))
        store.dispatch(initApp())

        Actions[SCENE_INDEX]({user: res.data, partner: res.partner})
      } else {
        Alert.alert('小提示', '登录失败！')
      }
    })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container} animation='fadeIn'>
          <ImageBackground style={styles.bg} source={require('../../res/images/login/welcome_bg.png')}>
            <Image style={styles.logo} source={require('../../res/images/login/ilo.png')}/>
            <View style={styles.text}>
              <TextPingFang style={styles.title}>双生</TextPingFang>
              <TextPingFang style={styles.e_title}>今夕何夕 见此良人</TextPingFang>
            </View>
            <View style={styles.form} animation='zoomIn' delay={100}>
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入您的手机号'}
                placeholderTextColor={'white'}
                style={styles.text_input}
                keyboardType='numeric'
                onChangeText={(text) => {
                  this.setState({user_account: text})
                }}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入密码'}
                placeholderTextColor={'white'}
                style={styles.text_input}
                password={true}
                onChangeText={(text) => {
                  this.setState({user_password: text})
                }}
              />
              <Text style={styles.remind}>很高兴 遇见你 ：）</Text>

            </View>
            <TouchableOpacity
              style={styles.online_login}
              onPress={this.onSubmit}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  登录
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.online_register}
              onPress={() => {
                Actions[SCENE_REGISTER]({})
              }}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  注册
                </Text>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#73C0FF',
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
  },
  bg: {
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT
  },
  logo: {
    marginTop: getResponsiveHeight(60),
    height: getResponsiveHeight(68.5),
  },
  text: {
    alignItems: 'center',
  },
  title: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    height: getResponsiveHeight(33),
    marginTop: HEIGHT * 0.0419
  },
  e_title: {
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 12,
    color: 'white'
  },
  form: {
    marginTop: HEIGHT * 0.0479,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text_input: {
    height: getResponsiveHeight(44),
    width: getResponsiveWidth(240),
    color: 'white',
    backgroundColor: 'rgb(139,203,255)',
    borderRadius: getResponsiveHeight(22),
    marginBottom: getResponsiveWidth(14),
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: getResponsiveWidth(10),
    flexDirection: 'row'
  },
  remind: {
    fontSize: 10,
    color: 'white',
    marginTop: HEIGHT * 0.037,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  online_login: {
    position: 'absolute',
    bottom: HEIGHT * 0.165,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_register: {
    position: 'absolute',
    bottom: HEIGHT * 0.075,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveWidth(150),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveHeight(22)
  },
  online_font: {
    fontSize: 14
  }
})
