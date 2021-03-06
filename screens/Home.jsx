// Импорт реакта и библиотек
import { useEffect, useState} from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { signOut, getAuth } from 'firebase/auth';

// Импорт компонентов
import { Product } from '../components/Product.js';
import { getProducts } from '../services/ProductsService';

import { LinearGradient } from 'expo-linear-gradient';

// Функция автторизации из firebase API
const auth = getAuth();

// Создание и экспорт Домашней страницы 
export default function HomeScreen({ navigation }) {
  // Вытаскиваем данные пользователя
  const { user } = useAuthentication();

  // Создаём состояние продукта (карточи товара)
  const [products, setProducts] = useState([]);

  // Рендер списка карточек
  function renderProduct({item: product}) {
    return (
      <Product 
        {...product} 
        onPress={() => {
          navigation.navigate('ProductDetails', {
            productId: product.id,
          });
        }}
      />
    );
  }

  // Подписываемся на обновление списка товаров
  useEffect(() => {
    setProducts(getProducts());
  });

  // Рендер Домашней страницы
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Welcomee {user?.email}!</Text>
      </View>

      <View style={styles.btnInner}>
        <Pressable style={styles.button} onPress={() => signOut(auth)}>
            <Text style={styles.textOut}>Выйти</Text>
        </Pressable>
      </View>
    
      <View style={styles.mainContainer}>
        <FlatList
        style={styles.productsList}
        contentContainerStyle={styles.productsListContainer}
        keyExtractor={(item) => item.id.toString()}
        data={products}
        renderItem={renderProduct}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        numColumns={2}
        key={'key'}
        />
      </View>
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffe8ef',
    flex: 1
  },

  headerContainer: {
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    padding: 10
  },

  btnInner: {
    alignItems: 'flex-end',
    margin: 10,
  },

  button: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9dd558',
    borderRadius: 5,
  },

  text: {
    fontSize: 16,
    marginBottom: 10
  },

  textOut: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 16,
  },

  productsList: {
    backgroundColor: '#ffe8ef',
  },

  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
});