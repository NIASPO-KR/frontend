const historyAPI = "http://95.163.230.107/api/users/orders";

function getAllOrders() {
  fetch(historyAPI, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((orders) => {
      const historyContainer = document.querySelector("#history");

      orders.forEach((order) => {
        const orderElement = document.createElement("div");
        orderElement.className = "order";

        const compositionHtml = `
            <div class="order__composition">
              <span class="order__composition-title">Состав:</span>
              <ul class="order__items">
                ${order.items
                  .map(
                    (item) =>
                      `<li class="order__item">${item.name} - ${item.price} руб. x ${item.count}</li>`
                  )
                  .join("")}
              </ul>
            </div>
          `;

        let detailsHtml = `
            <div class="order__details" data-id="${order.id}">
              <span class="order__price">Цена: ${order.priceTotal} руб</span>
              <span class="order__status">Статус: ${order.status}</span>
              <span class="order__address">Адрес: ${order.postomat.address}</span>
              <span class="order__payment">Способ: ${order.payment.name}</span>
          `;

        if (order.status !== "Получен") {
          detailsHtml += `<button class="order__button">Отметить как полученное</button>`;
        }

        detailsHtml += `</div>`;

        orderElement.innerHTML = compositionHtml + detailsHtml;
        historyContainer.appendChild(orderElement);
      });
    })
    .catch((error) => {
      console.error("Произошла ошибка:", error);
    });
}

getAllOrders();

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("order__button")) {
    const orderDetails = event.target.closest(".order__details");

    if (!orderDetails) return;

    const id = parseInt(orderDetails.getAttribute("data-id"), 10);

    if (isNaN(id)) {
      console.error("Неверный формат ID");
      return;
    }

    const payload = {
      id: id,
      status: "Получен",
    };

    fetch(historyAPI, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        const statusElement = orderDetails.querySelector(".order__status");
        if (statusElement) {
          statusElement.textContent = "Статус: Получен";
        }

        const buttonElement = orderDetails.querySelector(".order__button");
        if (buttonElement) {
          buttonElement.remove();
        }
      })
      .catch((error) => {
        console.error("Произошла ошибка при обновлении статуса:", error);
      });
  }
});
