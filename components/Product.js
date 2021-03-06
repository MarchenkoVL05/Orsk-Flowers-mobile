//Импорт React + React Native
import React from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';

//Объявление и экспорт компонента карточки товара
export function Product({name, price, image, onPress}) {
  //Рендер компонента
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        style={styles.thumb}
        source={image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>₽ {price}</Text>
      </View>
    </TouchableOpacity>
  );
}

//Стили 
const styles = StyleSheet.create({
  card: {
    width: 170,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 20,
  },
  thumb: {
    height: 170,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
});