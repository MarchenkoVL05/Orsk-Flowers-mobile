// Импорт реакта и реакт натив
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet, Pressable, Alert } from 'react-native';
import { ScrollView } from 'react-native';

// Импорт библиотеки
import email from 'react-native-email';

// Импорт функции useAuthentication и контекста корзины
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { CartContext } from '../CartContext';

// Создание и экспорт страницы Оформления заказа
export default function Payments() {
  // Создаём состояния
  const [name, onChangeName] = React.useState('');
  const [phone, onChangePhone] = React.useState('');
  const [adress, onChangeAdress] = React.useState('');
  const [time, onChangeTime] = React.useState('');
  const [comment, onChangeComment] = React.useState('');

  const [nameReceiver, onChangeNameReceiver] = React.useState('');
  const [phoneReceiver, onChangePhoneReceiver] = React.useState('');

  const [checked, setChecked] = React.useState(true);
  const [transfer, setTransfer] = React.useState(false);
  const [pickup, setPickup] = React.useState(false);
  const [anon, setAnon] = React.useState(false);


  // Создаём фунции изменения состояния
  function changingRadio() {
    setChecked(prevState => !prevState);
  }

  function changingRadioPickup() {
    setPickup(prevState => !prevState);
  }

  function changingRadioAnon() {
    setAnon(prevState => !prevState);
  }

  function changingTransfer() {
    setTransfer(prevState => !prevState);
  }

  // Подписываемся на изменение галчек (Наличными курьеру или оплата картой)
  React.useEffect(() => {
    if (transfer) {
      setChecked(false);
    }
  }, [transfer]);

  React.useEffect(() => {
    if (checked) {
      setTransfer(false);
    }
  }, [checked]);

  // Вытаскиваем данные пользователя
  const { user } = useAuthentication();

  // Достаём из контекста необходимые нам функции 
  const {getProductsInCart, getItemsCount, getTotalPrice} = useContext(CartContext);

  // Проверить поля формы
  function checkForm() {
    let sender = false;
    if (anon || name.length > 3) {
      sender = true;
    }

    let adressFilled = false;
    if (pickup || adress.length > 3) {
      adressFilled = true;
    }

    if (phone.length < 3 ||phone == 'underfiend' ||
        time.length < 3 || time == 'underfiend' ||
        comment.length < 3 ||comment == 'underfiend' ||
        nameReceiver.length < 3 || nameReceiver == 'underfiend' ||
        phoneReceiver.length < 3 || phoneReceiver == 'underfiend' || sender == false ||
        adressFilled == false 
        ) {
          Alert.alert('Пожалуйста, заполните все поля');
          return;
    }

    callDelivery();
  }

  // Функция по отправке письма ( с использование библиотеки react-native-email )
  function callDelivery() {
    const to = ['Korotaevm97@gmail.com']
    email(to, {
      // Optional additional arguments
      body: `Новый заказ!\r\nТовар: ${getProductsInCart()}\r\n
      Количество букетов: ${getItemsCount()}\r\n
      Сумма: ${getTotalPrice()}\r\n
      ${anon ? "Анонимно\r\n" : `Имя заказчика: ${name}`}
      Почта заказчика: ${user.email}
      Номер заказчика: ${phone}
      ${pickup ? "Самовывоз" : `Aдрес доставки: ${adress}`}\r\n
      Удобное время: ${time}
      Комментарий: ${comment}\r\n
      Имя получателя: ${nameReceiver}
      Телефон получатея: ${phoneReceiver}\r\n
      Оплата: ${checked ? "Наличными курьеру" : "Оплачено переводом"}
      `
    }).catch(console.error)
  }
  
  // Рендер страницы оформления заказа 
  return (
    <ScrollView style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.clientText}>Заказчик</Text>
        <View style={[styles.radioContainer, {marginRight: 180, marginTop: 10}]}>
          <Pressable style={anon ? styles.radioTwo : styles.radio} onPress={changingRadioAnon}></Pressable>
          <Text style={[styles.radioText, {marginTop: 10}]}>Анонимно</Text>
        </View>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(newValue) => onChangeName(newValue)}
          placeholder={anon ? '' : "Имя"}
          editable={anon ? false : true}
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={(newValue) => onChangePhone(newValue)}
          placeholder="Телефон"
          keyboardType="phone-pad"
        />
        <View style={[styles.radioContainer, {marginRight: 165}]}>
          <Pressable style={pickup ? styles.radioTwo : styles.radio} onPress={changingRadioPickup}></Pressable>
          <Text style={[styles.radioText, {marginTop: 10}]}>Самовывоз</Text>
        </View>

        <TextInput
          style={styles.input}
          value={adress}
          onChangeText={(newValue) => onChangeAdress(newValue)}
          placeholder={pickup ? '' : 'Адрес'}
          editable={pickup ? false : true}
        />

        <TextInput
          style={styles.input}
          value={time}
          onChangeText={(newValue) => onChangeTime(newValue)}
          placeholder="Удобное время"
        />

        <TextInput
          style={[styles.input, {height: 100}]}
          value={comment}
          onChangeText={(newValue) => onChangeComment(newValue)}
          placeholder="Комментарий"
        />

        <Text style={styles.receiverText}>Получатель</Text>
        <TextInput
          style={styles.input}
          value={nameReceiver}
          onChangeText={(newValue) => onChangeNameReceiver(newValue)}
          placeholder="Имя Получателя"
        />
        <TextInput
          style={styles.input}
          value={phoneReceiver}
          onChangeText={(newValue) => onChangePhoneReceiver(newValue)}
          placeholder="Телефон получателя"
          keyboardType="phone-pad"
        />


        <Text style={styles.payText}>Способ оплаты</Text>
        <View style={[styles.radioContainer, {marginRight: 70, marginTop: 10}]}>
          <Pressable style={checked ? styles.radioTwo : styles.radio} onPress={changingRadio}></Pressable>
          <Text style={[styles.radioText, {marginTop: 10}]}>Наличными курьеру</Text>
        </View>

        <View style={[styles.radioContainer, {marginRight: 95, marginTop: 10}]}>
          <Pressable style={transfer ? styles.radioTwo : styles.radio} onPress={changingTransfer}></Pressable>
          <Text style={[styles.radioText, {marginTop: 10}]}>Перевод на карту</Text>
        </View>
        <Text style={[{fontSize: 18}]}>Visa: 4242 XXXX XXXX XX42</Text>

        <Pressable style={styles.buyPress} onPress={checkForm}>
                <Text style={styles.buyText}>Вызвать курьера</Text>
        </Pressable>
      </SafeAreaView>
    </ScrollView>
  )
}


// Стили
const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    width: 320,
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    margin: 10,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#c6c6c6',
    borderRadius: 10,
  },

  payText: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 20,
  },

  radio: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    marginBottom: 7,
    marginTop: 20,
    borderColor: 'black',
    borderWidth: 2,
  },

  radioTwo: {
    width: 20,
    height: 20,
    backgroundColor: '#9dd558',
    marginTop: 20,
    marginBottom: 7,
    borderColor: 'black',
    borderWidth: 2,
  },

  radioText: {
    fontSize: 20,
    color: 'black',
    marginLeft: 15
  },

  cardText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 30,
    width: 300,
  },

  buyPress: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c156ff',
    textAlign: 'center',
    height: 50,
    width: 300,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 20
  },

  buyText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },

  receiverText: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },

  clientText: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },

  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});



