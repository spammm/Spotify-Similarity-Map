# Spotify Similarity Map

"**Spotify Similarity Map**" — интерактивное веб-приложение. Оно визуализирует схожесть между треками Spotify на основе различных метрик сервиса [Most Streamed Spotify Songs 2024" с Kaggle](https://www.kaggle.com/datasets/nelgiriyewithana/most-streamed-spotify-songs-2024). Приложение использует метрику на основе косинусоидального сходства для создания динамической карты, где пользователи могут исследовать взаимосвязи между песнями.
Визуализация — подобие звездной карты. Треки представляют собой звезды. Чем популярнее трек, тем больше размер звезды. Схожесть песен определяется толщиной линий их соединяющих.
Кликнув на трек, его можно прослушать, если доступно превью. Здесь же можно прочитать информацию о песне или же перейти к ней на [spotify.com](https://open.spotify.com/) по предоставленной ссылке.

## Содержание

- [Основные технологии](#Основные-технологии)
- [Постановка задачи](#Постановка-задачи)
- [Инсталяция](#Инсталяция)

  - [Клонирование репозитория](#Клонирование-репозитория)
  - [Установка зависимостей](#Установка-зависимостей)
  - [Создание файла окружения](#Создание-файла-окружения)
  - [Запуск проекта в режиме разработки](#Запуск-проекта-в-режиме-разработки)
  - [Сборка проекта](#Сборка-проекта)

-[Демо проекта](#Демо-проекта)

## Основные технологии

- React
- TypeScript
- Vite
- Fabric.js: Библиотека JavaScript для работы с canvas HTML5.
- ml-kmeans: Библиотека машинного обучения, используемая для кластеризации песен на основе их характеристик.
- PapaParse: Библиотека для парсинга CSV-файлов.
- Архитектура FSD

## Постановка задачи

Разработать инструмент для анализа и визуализации сходства между наиболее популярными песнями на Spotify, используя датасет [Most Streamed Spotify Songs 2024" с Kaggle](https://www.kaggle.com/datasets/nelgiriyewithana/most-streamed-spotify-songs-2024).

## Инсталяция

Должна быть установлена [NodeJs 20](https://nodejs.org/en)
В терминале выполните следующие команды

### Клонирование репозитория

```
git clone https://github.com/your-repo/spotify-similarity-map.git
cd spotify-similarity-map
```

### Установка зависимостей

```
npm install
```

### Создание файла окружения

Проект использует API Spotify для получения данных о песнях. Для работы с API необходимо создать файл .env в корне проекта и добавить в него ваши учетные данные Spotify API.
Создайте файл .env и добавьте в него следующие переменные окружения:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

Замените your_spotify_client_id и your_spotify_client_secret на ваши актуальные данные, которые можно получить, зарегистрировав приложение на [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

### Запуск проекта в режиме разработки

```
npm run dev
```

Откройте браузер и перейдите по адресу, указанному в консоли (обычно это http://localhost:5173/).

### Сборка проекта

```
npm run build
```

Собранный проект будет находиться в папке dist, и его можно будет развернуть на любом статическом сервере.

## Демо проекта

[song.nickdev.ru](https://song.nickdev.ru/)
