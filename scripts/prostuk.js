const itemsAPI = "http://95.163.230.107/api/static/items";
const pickupAPI = "http://95.163.230.107/api/static/pickupPoints";
const paymentsAPI = "http://95.163.230.107/api/static/payments";
const cartAPI = "http://95.163.230.107/api/users/cart";
const historyAPI = "http://95.163.230.107/api/users/orders";

const showDrawerButton = document.getElementById("show-drawer");
const drawerBackground = document.getElementById("drawer-background");
const orderButton = document.querySelector(".cart__order-button");
const order = document.getElementById("order");
const cart = document.getElementById("cart");

function closeOrder() {
  order.style.display = "none";
  cart.style.zIndex = "20";
}

const hideDrawer = () => {
  isDrawerShown = true;
  drawerBackground.classList.remove("active"); // Скрыть фон
  cart.classList.remove("active"); // Убрать корзину
  setTimeout(() => {
    drawerBackground.style.display = "none"; // Полное скрытие после завершения анимации
  }, 300); // Задержка соответствует transition
};

fetch(itemsAPI, {
  method: "GET",
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }
    return response.json(); // Парсим JSON-ответ
  })
  .then((data) => {
    if (data.length !== 15) {
      throw new Error("Ожидается массив длиной 15 элементов");
    }

    // Разбиваем массив на 3 части по 5 элементов
    const [mainFood, secondaryFood, drinks] = [
      data.slice(0, 5),
      data.slice(5, 10),
      data.slice(10, 15),
    ];
    // Функция для создания HTML карточки
    const createCard = (item) => {
      return `
        <div class="catalog__item-card" data-id="${item.id}">
          <img
            class="catalog__item-card-img"
            src="files/logo.png"
            alt="Карточка товара"
          />
          <span class="catalog__item-card-title">${item.name}</span>
          <div class="catalog__item-card-props">
            <div class="catalog__item-card-props-price">
              <span class="catalog__item-prop-title">ЦЕНА:</span>
              <span class="catalog__item-prop-price">${item.price} руб.</span>
            </div>
            <button class="catalog__item-card-props-add">+</button>
          </div>
        </div>
      `;
    };
    // Добавляем карточки в соответствующие секции
    document.querySelector("#mainfood .catalog__item-foods").innerHTML =
      mainFood.map(createCard).join("");

    document.querySelector("#secondaryfood .catalog__item-foods").innerHTML =
      secondaryFood.map(createCard).join("");

    document.querySelector("#drinks .catalog__item-foods").innerHTML = drinks
      .map(createCard)
      .join("");
  })
  .catch((error) => {
    console.error("Произошла ошибка:", error);
  });

fetch(pickupAPI, {
  method: "GET",
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }
    return response.json(); // Парсим JSON-ответ
  })
  .then((data) => {
    const selectElement = document.getElementById("delivery-place");

    // Очищаем текущие опции (если это нужно)
    selectElement.innerHTML = "";

    // Добавляем новые опции
    data.forEach((pickupPoint) => {
      const option = document.createElement("option");
      option.value = pickupPoint.id; // Устанавливаем значение option
      option.textContent = pickupPoint.address; // Устанавливаем текст option
      selectElement.appendChild(option); // Добавляем option в select
    });
  })
  .catch((error) => {
    console.error("Произошла ошибка:", error);
  });

fetch(paymentsAPI, {
  method: "GET",
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }
    return response.json(); // Парсим JSON-ответ
  })
  .then((data) => {
    const selectElement = document.getElementById("payment-method");

    // Очищаем текущие опции (если это нужно)
    selectElement.innerHTML = "";

    // Добавляем новые опции
    data.forEach((pickupPoint) => {
      const option = document.createElement("option");
      option.value = pickupPoint.id; // Устанавливаем значение option
      option.textContent = pickupPoint.name; // Устанавливаем текст option
      selectElement.appendChild(option); // Добавляем option в select
    });
  })
  .catch((error) => {
    console.error("Произошла ошибка:", error);
  });

function refreshCart() {
  fetch(cartAPI, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      return response.json(); // Парсим JSON-ответ
    })
    .then((data) => {
      // Вставляем общую сумму в cart__item-sum-value
      const totalPriceElement = document.querySelector(".cart__item-sum-value");
      const totalPriceOrder = document.querySelector("#order_sum");

      totalPriceElement.textContent = `${data.priceTotal} руб.`;
      totalPriceOrder.textContent = `${data.priceTotal} руб.`;
      // Очищаем контейнер для итемов, если это необходимо
      const itemsContainer = document.querySelector("#cart__items");
      itemsContainer.innerHTML = "";

      // Создаем карточки для каждого элемента корзины
      data.items.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart__items-item";
        itemElement.setAttribute("data-id", item.id);

        itemElement.innerHTML = `
        <span class="cart__items-item-title">
          ${item.name}
        </span>
        <div class="cart__items-props">
          <span class="cart__items-props-price">Цена: ${item.price} руб.</span>
          <div class="cart__items-props-count">
            <button class="cart__button cart__button-decrement">-</button>
            <span class="cart__count-value">${item.count}</span>
            <button class="cart__button cart__button-increment">+</button>
          </div>
        </div>
      `;

        // Добавляем карточку в контейнер
        itemsContainer.appendChild(itemElement);
      });
    })
    .catch((error) => {
      console.error("Произошла ошибка:", error);
    });
}

refreshCart();

document.addEventListener("click", (event) => {
  // Проверяем, кликнули ли по кнопке с нужным классом
  if (event.target.classList.contains("catalog__item-card-props-add")) {
    // Находим родительский элемент с классом "catalog__item-card"
    const catalogItem = event.target.closest(".catalog__item-card");

    if (catalogItem) {
      // Получаем значение атрибута data-id
      const itemId = catalogItem.dataset.id;

      // Формируем JSON
      const payload = {
        itemID: itemId,
        count: 1,
      };

      fetch(cartAPI, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Указываем тип содержимого
        },
        body: JSON.stringify(payload), // Преобразуем JSON в строку
      }).then(refreshCart());
    }
  }
});

document.querySelector(".order-button").addEventListener("click", () => {
  // Получаем данные из select
  const postomatID = document.querySelector("#delivery-place").value;
  const paymentID = document.querySelector("#payment-method").value;

  // Получаем все элементы корзины
  const cartItems = document.querySelectorAll(".cart__items-item");

  // Массив для хранения элементов корзины
  const items = [];

  // Перебираем все элементы корзины
  cartItems.forEach((item) => {
    const id = item.getAttribute("data-id"); // id из data-id
    const count = parseInt(
      item.querySelector(".cart__count-value").textContent,
      10
    ); // Количество из .cart__count-value

    // Добавляем item в массив
    items.push({
      itemID: id,
      count: count,
    });
  });

  // Формируем объект для отправки
  const orderData = {
    items: items,
    postomatID: postomatID,
    paymentID: paymentID,
  };

  // Отправка на бэк (пример с fetch)
  fetch(historyAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  }).then(closeOrder(), hideDrawer());
});
