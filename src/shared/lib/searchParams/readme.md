### searchParams

Сервис для управления search-параметрами.

1. searchParams.get - Возвращает значения текущих search-параметров из url
2. searchParams.set - Заменяет значения search-параметров текущего url без перезагрузки страницы
3. searchParams.data - Объект с текущими параметрами, присваивание значений в этот объект обновляет url без перезагрузки страницы
4. getTypedSearchParams - метод возвращает типизированный объект `searchparmas` Пример использования:

```ts
import { searchParams, getTypedSearchParams } from 'shared';

searchParams.get<TSearchParams>(); // получить текущие параметры
searchParams.set({ data: 123 }); // заменить текущие параметры
searchParams.data; // proxy-объект с текущими параметрами
searchParams.data.myParam = 777; // задать значение полю myParam

interface IMySearchParams {
  query: string;
  pages: number[];
}

const params = getTypedSearchParams<IMySearchParams>(); // позволяет получить типизированный объект searchParams
```
