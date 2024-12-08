# Используем базовый образ с nginx
FROM nginx:alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/share/nginx/html

# Удаляем стандартные файлы из nginx
RUN rm -rf ./*

# Копируем все файлы из текущей директории проекта в контейнер
COPY . .
COPY default.conf /etc/nginx/conf.d/

# Указываем порт для работы приложения
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]