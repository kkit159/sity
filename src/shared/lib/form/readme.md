### form

Набор функций-хелперов для работы с react-hook-form

1. getDirtyValues - Возвращает объект содержащий только измененные поля формы
2. useResolver - Хук, позволяющий удобно писать собственные [резолверы](https://react-hook-form.com/ts#Resolver)
3. addRequiredFieldsValidation - Метод для добавления валидации с типом required на поля формы. Используется в контексте хука useResolver.


---
### useResolver
Хук, позволяющий удобно писать собственные [резолверы](https://react-hook-form.com/ts#Resolver), принимает 2 аргумента:
* resolver: `(values, setError) => void`, где values - текущее значение формы для валидации, а setError - хелпер для удобной проставки ошибок
* mapper - опциональный аргумент - позволяет смапить провалидированное значение которое можно будет получить с помощью resolver.getData()

Пример использования:
```
const resolver = useResolver<IFormState, IFormPayload>((values, setError) => {
  if (!values.someData) {
    setError('someData', 'Это поле обязательно для заполнения!')
  }
}, (values) => ({ someData: someData.item! }));

const form = useForm({ resolver })
const onSubmit = form.handleSubmit(() => {
  const data = resolver.getData();
  
  return api.sendForm(data);
});
```
