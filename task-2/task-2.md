# ШРИ: Асинхронность (2023)

Тестовое задание

макс. 100 балл.

Дедлайн: 16 июн. 23:30

# Условие

Напишите функцию, которая принимает объект со свойствами: minPrice (число, минимальная цена), maxPrice (число, максимальная цена) и catalog (иерархическая структура данных, состоящая из категорий и товаров) и возвращает массив активных товаров, принадлежащих активным категориям и попадающим в ценовой диапазон от minPrice до maxPrice. В массиве должны находится объекты со свойствами name (имя товара) и price (цена). Также он должен быть отсортирован по цене в порядке возрастания, а при равной цене - по имени товара в лексикографическом порядке (используйте localeCompare).

Получение данных из категорий осуществляется через специальные асинхронные методы, которые на вход принимают функцию обратного вызова. Эти методы выполняются со случайной задержкой и с вероятностью 0.2 возвращают ошибку. В случае ошибки необходимо повторно вызывать метод, пока он не выполнится успешно (возможны ошибки несколько раз подряд).

```ts
type Callback = (error: Error, result: any) => void;
```

Категории содержат имя, статус и массив дочерних категорий и товаров.

```ts
interface Category {
  constructor(
    name: string,
    isActive: boolean,
    children?: (Product | Category)[]
  );

  getName(callback: Callback);

  checkIsActive(callback: Callback);

  getChildren(callback: Callback);
}
```

Товары содержат имя, статус и цену.

```ts
interface Product {
  constructor(name: string, isActive: boolean, price: number);

  getName(callback: Callback);

  checkIsActive(callback: Callback);

  getPrice(callback: Callback);
}
```

Важно, что методы экземпляров Category и Product асинхронные и занимают какое-то время, поэтому надо придумать что-то более оптимальное, чем последовательно вызывать эти методы и последовательно обрабатывать каждый элемент в массиве children.

## Формат ввода

```js
{  
    minPrice: 300,  
    maxPrice: 1500,  
    catalog: new Category("Catalog", true, [  
        new Category("Electronics", true, [  
            new Category("Smartphones", true, [  
                new Product("Smartphone 1", true, 1000),  
                new Product("Smartphone 2", true, 900),  
                new Product("Smartphone 3", false, 900),  
                new Product("Smartphone 4", true, 900),  
                new Product("Smartphone 5", true, 900)  
            ]),  
            new Category("Laptops", true, [  
                new Product("Laptop 1", false, 1200),  
                new Product("Laptop 2", true, 900),  
                new Product("Laptop 3", true, 1500),  
                new Product("Laptop 4", true, 1600)  
            ]),  
        ]),  
        new Category("Books", true, [  
            new Category("Fiction", false, [  
                new Product("Fiction book 1", true, 350),  
                new Product("Fiction book 2", false, 400)  
            ]),  
            new Category("Non-Fiction", true, [  
                new Product("Non-Fiction book 1", true, 250),  
                new Product("Non-Fiction book 2", true, 300),  
                new Product("Non-Fiction book 3", true, 400)  
            ]),  
        ]),  
    ])  
}
```

## Формат вывода

```js
[
  { name: 'Non-Fiction book 2', price: 300 },
  { name: 'Non-Fiction book 3', price: 400 },
  { name: 'Laptop 2', price: 900 },
  { name: 'Smartphone 2', price: 900 },
  { name: 'Smartphone 4', price: 900 },
  { name: 'Smartphone 5', price: 900 },
  { name: 'Smartphone 1', price: 1000 },
  { name: 'Laptop 3', price: 1500 }
];
```

## Примечания

Песочницу для решения можно загрузить по [ссылке](https://disk.yandex.ru/d/U0ga_1Khl3cgHA)

Решение должно работать на ES 2019 (Node 12) и его требуется оформить по шаблону:

```js
module.exports = async function ({ minPrice, maxPrice, catalog }) {
  // основная функция

  return answer;
};

// вспомогательные функции
```
