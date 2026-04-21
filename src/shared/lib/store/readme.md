### store

Набор функций-хелперов для работы со стором:

1. `useShallowPicker` - Типизированный shallow-пикер для полей стора, аргументы – ключи этого стора

---
### useShallowPicker
Типизированный shallow-пикер для полей стора, аргументы – ключи этого стора:

Пример использования:
```ts
export const SomeComponent = () => {
  const { pad, presetSettings, schedule } = useAppStore(
    useShallowPicker('pad', 'presetSettings', 'schedule'),
  );

  ...
  
  return <div>Component</div>;
};
```
