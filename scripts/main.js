document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector("#cart__items");

  cartItemsContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Если клик на кнопке уменьшения (decrement)
    if (
      target.classList.contains("cart__button-decrement") ||
      target.classList.contains("cart__button-increment")
    ) {
      const item = target.closest(".cart__items-item"); // Находим родительский элемент товара
      const countElement = item.querySelector(".cart__count-value"); // Элемент с количеством
      let count = parseInt(countElement.textContent, 10);

      // Уменьшаем или увеличиваем количество
      if (target.classList.contains("cart__button-decrement")) {
        count--;
        countElement.textContent = count;
      } else if (target.classList.contains("cart__button-increment")) {
        count++;
        countElement.textContent = count;
      }

      const itemID = item.getAttribute("data-id"); // Получаем itemID из data-id элемента

      // Формируем JSON с данными для отправки
      const payload = {
        itemID: itemID,
        count: count,
      };

      // Отправляем запрос только для изменённого товара
      sendUpdateToServer(payload);
    }
  });

  // Функция для отправки данных на сервер
  function sendUpdateToServer(payload) {
    fetch(cartAPI, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Преобразуем объект в JSON строку
    }).then(() => {
      refreshCart();
    });
  }

  const showDrawerButton = document.getElementById("show-drawer");
  const drawerBackground = document.getElementById("drawer-background");
  const orderButton = document.querySelector(".cart__order-button");
  const order = document.getElementById("order");
  const cart = document.getElementById("cart");

  let isDrawerShown = false;

  // Функция для скрытия корзины
  const hideDrawer = () => {
    isDrawerShown = true;
    drawerBackground.classList.remove("active"); // Скрыть фон
    cart.classList.remove("active"); // Убрать корзину
    setTimeout(() => {
      drawerBackground.style.display = "none"; // Полное скрытие после завершения анимации
    }, 300); // Задержка соответствует transition
  };

  // Открытие корзины
  showDrawerButton.addEventListener("click", () => {
    isDrawerShown = true;
    drawerBackground.style.display = "block"; // Показать фон
    setTimeout(() => {
      drawerBackground.classList.add("active"); // Запустить анимацию фона
      cart.classList.add("active"); // Запустить анимацию корзины
    }, 10); // Небольшая задержка для активации transition
  });

  // Закрытие корзины при клике на фон
  drawerBackground.addEventListener("click", (event) => {
    if (event.target === drawerBackground && isDrawerShown) {
      hideDrawer();
    }
  });

  // Закрытие корзины при нажатии клавиши Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isDrawerShown) {
      hideDrawer();
    }
  });

  const button = document.querySelector(".banner__button-button");
  const targetSection = document.getElementById("mainfood");

  button.addEventListener("click", () => {
    // Скролл к элементу с плавным переходом
    targetSection.scrollIntoView({ behavior: "smooth" });
  });

  orderButton.addEventListener("click", () => {
    isDrawerShown = false;
    order.style.display = "flex";
    cart.style.zIndex = "5";
  });

  // Закрытие окна при нажатии на Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOrder();
    }
  });

  // Закрытие окна при клике вне области #order
  order.addEventListener("click", (event) => {
    console.log(1);
    if (event.target === drawerBackground) {
      closeOrder();
    }
  });

  // Функция закрытия окна
  function closeOrder() {
    order.style.display = "none";
    cart.style.zIndex = "20";
    isDrawerShown = true;
  }
});
