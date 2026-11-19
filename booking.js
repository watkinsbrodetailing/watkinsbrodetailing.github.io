const form = document.querySelector("#booking");
const service = form.elements.namedItem("service");
const vehicle = form.elements.namedItem("vehicle");
const date = form.elements.namedItem("date");
const estimate = document.querySelector("#estimate");

const today = new Date();
date.min = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

function updateEstimate() {
  const selected = service.selectedOptions[0];
  if (!selected.value || !vehicle.value) {
    estimate.textContent = "Choose a service and vehicle type to see pricing.";
    return;
  }

  estimate.textContent = vehicle.value === "car"
    ? "Starts at $" + selected.dataset.price + " · Estimated time: " + selected.dataset.duration
    : "Request a quote for this vehicle type.";
}

for (const link of document.querySelectorAll("[data-package]")) {
  link.addEventListener("click", () => {
    service.value = link.dataset.package;
    updateEstimate();
  });
}

service.addEventListener("change", updateEstimate);
vehicle.addEventListener("change", updateEstimate);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const details = new FormData(form);
  const name = details.get("customer").trim();
  if (!name) {
    form.elements.namedItem("customer").focus();
    return;
  }

  const message = [
    "Hi Watkins Bros, I'd like to request a mobile detailing appointment.",
    "Name: " + name,
    "Service: " + service.selectedOptions[0].textContent,
    "Vehicle: " + vehicle.selectedOptions[0].textContent,
    "Preferred date: " + details.get("date") + " (" + details.get("time") + ")",
    "Service ZIP: " + details.get("zip"),
  ].join("\n");

  document.querySelector("#request-text").value = message;
  document.querySelector("#message-fallback").hidden = false;
  const separator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "&" : "?";
  window.location.href = "sms:+12403020159" + separator + "body=" + encodeURIComponent(message);
});

updateEstimate();
form.hidden = false;
