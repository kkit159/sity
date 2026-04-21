
### Utils

Набор утилитарных функций-хелперов:

1. `getTimeInMs` - Возвращает заданное время в миллисекундах
2. `getRandomNumberInRange` - Возвращает случайное число от min до max
3. `withJitter` - Возвращает случайное число в диапазоне от value - jitter до value + jitter, где jitter - процент от value

---

### getTimeInMs

Возвращает заданное время в миллисекундах:

* options - объект с опциями
  * hours: number - часы (default: 0)
  * minutes: number - минуты (default: 0)
  * seconds: number - секунды (default: 0)

Пример использования:

```ts
const CONST_TIME_1 = getTimeInMs({ hours: 1, minutes: 2, seconds: 3 }); // 3_723_000
const CONST_TIME_2 = getTimeInMs({ seconds: 10 }); // 10_000
const CONST_TIME_3 = getTimeInMs({ minutes: 10 }); // 600_000
const CONST_TIME_4 = getTimeInMs({ hours: 1 }); // 3_600_000
const CONST_TIME_5 = getTimeInMs({ hours: 1, minutes: 30 }); // 5_400_000
const CONST_TIME_6 = getTimeInMs({ hours: 24 }); // 86_400_000
```

### getRandomNumberInRange

Возвращает случайное число от min до max

* min - минимальное значение
* max - максимальное значение
* options
  * isInteger - вернуть целочисленное значение, default: false
  * step - шаг случайного значения, только при `isInteger: true`

Пример использования:

```ts
getRandomNumberInRange(0, 1); // дробные числа от 0 до 1
getRandomNumberInRange(20, 100, { isInteger: true }); // целые числа от 20 до 100
getRandomNumberInRange(-1000, 1000, { isInteger: true, step: 10 }); // целые числа от -1000 до 1000 с шагом в 10 (-1000, -990, -980...980, 990, 1000)
```

### withJitter

Добавляет к базовому значению value случайное отклонение в пределах jitter процентов. При withNegative=true отклонение может быть отрицательным (диапазон: -jitter% до +jitter%), иначе только положительным (0% до jitter%)

* value - базовое значение
* jitter - количество процентов "дрожания"
* options
  * withNegative - включить режим -jitter...jitter, по умолчанию 0...jitter

Пример использования:

```ts
withJitter(100, 20) // случайное значение от 100 до 120
withJitter(1000, 30, { withNegative: true }) // случайное значение от 700 до 1300
```
