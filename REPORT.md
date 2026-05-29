# Звіт з лабораторних робіт

## 1. Тема та мета роботи

### Тема 1. Реалізація зміни кольорової гами додатку в React Native

**Мета:** навчитися будувати інтерфейси, які автоматично адаптуються до світлої або темної теми, закріпити навички повторного використання компонентів і кастомізації інтерфейсу.

### Тема 2. Робота з формами введення даних у React Native

**Мета:** набути умінь і навичок реалізації взаємодії з користувачем з використанням механізму форм у React Native.

### Тема 3. Взаємодія мобільного застосунку з бекендом

**Мета:** ознайомитися з підключенням мобільного застосунку до backend-сервісу Appwrite, реалізувати роботу з даними через CRUD-операції та використати навігацію на основі вкладок.

## 2. Завдання до роботи

1. Створити підтримку світлої та темної теми у застосунку.
2. Реалізувати тематичні компоненти `ThemedView` та `ThemedText`.
3. Додати перемикач теми `System / Light / Dark`.
4. Зберігати вибрану тему у cookie.
5. Створити форму введення даних з використанням `TextInput`, `useState`, кнопок та валідації.
6. Реалізувати обробку події відправлення форми через `Alert.alert()` та `console.log()`.
7. Додати взаємодію з backend Appwrite.
8. Реалізувати контекст `AppwriteContext` та хук `useAppwrite`.
9. Реалізувати список записів, створення, редагування, оновлення та видалення записів.
10. Додати вкладки `Weather`, `Setup`, `Backend`.

## 3. Результати виконання роботи

У застосунку реалізовано три основні вкладки:

- `Weather` - головний екран з погодою, пошуком міста, прогнозом та перемикачем теми.
- `Setup` - екран з інформацією про налаштування, формою введення погодного спостереження та посиланнями на API.
- `Backend` - екран взаємодії з Appwrite: список книг, кнопка `Add record`, форма створення/редагування, кнопки `Edit`, `Delete`, `Refresh`.

### Скріншоти екранів

> У цьому середовищі Expo web-сервер не відкрив порт для автоматичного створення скріншотів, тому нижче залишені місця для вставки зображень після запуску застосунку локально.

#### Екран Weather

![Weather screen](./screenshots/weather-screen.png)

#### Екран Setup з формою введення даних

![Setup screen](./screenshots/setup-screen.png)

#### Екран Backend з Appwrite CRUD

![Backend screen](./screenshots/backend-screen.png)

#### Перемикання теми

![Theme switcher](./screenshots/theme-switcher.png)

## 4. Структура файлів проєкту

```text
mobile-app/
├── README.md
├── app.json
├── package.json
├── tsconfig.json
├── eslint.config.js
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   └── backend.tsx
│   ├── components/
│   │   ├── app-tabs.tsx
│   │   ├── app-tabs.web.tsx
│   │   ├── external-link.tsx
│   │   ├── forecast-chart.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── themed-text.tsx
│   │   └── themed-view.tsx
│   ├── constants/
│   │   ├── theme.ts
│   │   └── ukraine-cities.ts
│   ├── contexts/
│   │   └── appwrite-context.tsx
│   ├── features/
│   │   └── weather/
│   │       ├── components/
│   │       │   ├── city-search-card.tsx
│   │       │   ├── weather-details-card.tsx
│   │       │   ├── weather-error-card.tsx
│   │       │   ├── weather-hero.tsx
│   │       │   ├── weather-metrics-grid.tsx
│   │       │   ├── weather-observation-form.tsx
│   │       │   ├── weather-refresh-card.tsx
│   │       │   └── weather-warning-card.tsx
│   │       ├── types.ts
│   │       ├── use-weather-screen.ts
│   │       ├── utils.ts
│   │       ├── weather-screen.styles.ts
│   │       └── weather-service.ts
│   ├── hooks/
│   │   ├── use-appwrite.ts
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme.ts
│   ├── lib/
│   │   └── weatherbit.ts
│   ├── utils/
│   │   └── appwrite.ts
│   └── global.css
└── assets/
```

## 5. Код файлу App.js

У цьому проєкті використовується Expo Router, тому окремого файлу `App.js` немає. Точкою входу є `expo-router/entry`, а головний макет застосунку знаходиться у файлі `src/app/_layout.tsx`.

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';

import AppTabs from '@/components/app-tabs';
import { AppwriteProvider } from '@/contexts/appwrite-context';
import { AppThemeProvider, useTheme, useThemeName } from '@/hooks/use-theme';

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <AppwriteProvider>
        <ThemedTabLayout />
      </AppwriteProvider>
    </AppThemeProvider>
  );
}

function ThemedTabLayout() {
  const colorScheme = useThemeName();
  const theme = useTheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: theme.background,
          border: theme.border,
          card: theme.backgroundElement,
          notification: theme.warningBadge,
          primary: theme.primary,
          text: theme.text,
        },
      }}>
      <AppTabs />
    </ThemeProvider>
  );
}
```

## 6. Висновки та відповіді на контрольні питання

У ході роботи було створено мобільний застосунок на React Native з використанням Expo Router. Реалізовано адаптивну світлу та темну тему, перемикач теми зі збереженням вибору у cookie, форму введення даних із валідацією та окрему вкладку для взаємодії з backend Appwrite через CRUD-операції.

### Контрольне питання 1. Що таке React Native і для чого він використовується?

React Native - це фреймворк для створення мобільних застосунків за допомогою JavaScript або TypeScript та React. Він дозволяє описувати інтерфейс декларативно, як у React, але замість HTML-компонентів використовує нативні компоненти мобільних платформ. React Native застосовується для розробки застосунків для iOS, Android та web через Expo/React Native Web.

### Контрольне питання 2. Які основні відмінності React Native від React для веба?

React для веба використовує HTML-елементи (`div`, `span`, `button`) та CSS. React Native використовує компоненти `View`, `Text`, `TextInput`, `Pressable`, `ScrollView` тощо. Стилі задаються через JavaScript-об'єкти або `StyleSheet`, а не через звичайний CSS. Також React Native має доступ до мобільних API, наприклад геолокації, камери, push-повідомлень та системної теми.

### Контрольне питання 3. Для чого використовується компонент View?

`View` - це базовий контейнер у React Native. Він використовується для групування інших компонентів, побудови макета, задання відступів, фону, рамок, flexbox-розташування та інших стилів. У веб-розробці найближчим аналогом `View` є `div`, але у React Native не використовуються HTML-теги напряму.

### Контрольне питання 4. Як відображається текст у React Native?

Текст у React Native відображається за допомогою компонента `Text`. На відміну від веба, текст не можна просто розмістити всередині `View` як звичайний рядок без компонента `Text`. Для стилізації тексту використовуються властивості `fontSize`, `fontWeight`, `lineHeight`, `color`, `textAlign` та інші.

### Контрольне питання 5. Як можна підключати зображення у застосунку?

Зображення у React Native підключаються через компонент `Image`. Локальні зображення можна імпортувати через `require`, наприклад `source={require('./assets/icon.png')}`. Віддалені зображення підключаються через URI: `source={{ uri: 'https://example.com/image.png' }}`. У проєктах Expo також часто використовують assets з папки `assets`.

### Контрольне питання 6. Які є способи задання стилів у React Native?

Стилі можна задавати inline-об'єктами безпосередньо у prop `style`, через `StyleSheet.create()`, через масив стилів або через сторонні бібліотеки стилізації. У цьому проєкті використано `StyleSheet.create()` та масиви стилів, наприклад `[styles.card, { backgroundColor: theme.backgroundElement }]`.

### Контрольне питання 7. Чим StyleSheet відрізняється від звичайних CSS-стилів?

`StyleSheet` описує стилі як JavaScript-об'єкти, а не як CSS-файли. У React Native не використовуються CSS-селектори, каскадність, псевдокласи та багато браузерних CSS-властивостей. Назви властивостей пишуться у camelCase, наприклад `backgroundColor`, `borderRadius`, `fontWeight`. Також стилі застосовуються безпосередньо до компонентів через prop `style`.

### Контрольне питання 8. Що таке JSX?

JSX - це синтаксичне розширення JavaScript, яке дозволяє описувати інтерфейс у вигляді, схожому на HTML/XML. У React Native JSX використовується для опису дерева компонентів, наприклад `<View>`, `<Text>`, `<TextInput>`. Після компіляції JSX перетворюється на звичайні виклики JavaScript-функцій React.

### Контрольне питання 9. Які є обмеження використання HTML-тегів у React Native?

У React Native не можна використовувати звичайні HTML-теги на кшталт `div`, `span`, `p`, `input`, `button`. Замість них використовуються нативні компоненти: `View`, `Text`, `TextInput`, `Pressable`, `ScrollView`, `Image`. Це пов'язано з тим, що React Native рендерить інтерфейс у нативні елементи платформи, а не в DOM.

### Контрольне питання 10. Як відрізняється структура проєкту React Native від веб-застосунку на React?

У React Native проєкт має файли конфігурації мобільного застосунку, наприклад `app.json`, assets для іконок та splash screen, а також маршрути або екрани застосунку. У Expo Router маршрути зберігаються у папці `app` або `src/app`. У веб-застосунку React зазвичай є `index.html`, DOM-точка монтування та CSS-файли. У React Native замість DOM використовується набір нативних компонентів і мобільні API.

## 7. Архів або посилання на репозиторій

Для здачі роботи потрібно додати архів проєкту без папки `node_modules` або посилання на GitHub-репозиторій.

Приклад команди для створення архіву:

```bash
zip -r mobile-app.zip . -x "node_modules/*" ".expo/*" ".git/*"
```

Посилання на GitHub-репозиторій:

```text
TODO: додати посилання на репозиторій після публікації
```
