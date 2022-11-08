const searchInput = document.querySelector("input");
const menu = document.querySelector(".menu-container");
const pickedRepository = document.querySelector(".picked-repositories");

async function getApiRepositories() {
  const url = new URL("https://api.github.com/search/repositories");
  let inputData = searchInput.value;
  if (inputData === "") {
    removeReceivedRepositories();
    return;
  }

  url.searchParams.append("q", inputData);
  try {
    let response = await fetch(url);
    if (response.ok) {
      let receivedRepositories = await response.json();
      showReceivedRepositories(receivedRepositories);
    } else return null;
  } catch (error) {
    return null;
  }
}

function removeReceivedRepositories() {
  menu.innerHTML = "";
}

function showReceivedRepositories(receivedRepositories) {
  removeReceivedRepositories();

  for (let i = 0; i < 5; i++) {
    let name = receivedRepositories.items[i].name;
    let owner = receivedRepositories.items[i].owner.login;
    let stars = receivedRepositories.items[i].stargazers_count;

    let menuBar = `<div class="menu-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
    menu.innerHTML += menuBar;
  }
}

function pickRepository(menuBar) {
  let name = menuBar.textContent;
  let owner = menuBar.dataset.owner;
  let stars = menuBar.dataset.stars;
  pickedRepository.innerHTML += `<div class="picked-repository">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="button-close"></button></div>`;
}

menu.addEventListener("click", function (event) {
  let menuBar = event.target;

  if (!menuBar.classList.contains("menu-content")) {
    return;
  }
  pickRepository(menuBar);
  searchInput.value = "";
  removeReceivedRepositories();
});

pickedRepository.addEventListener("click", function (event) {
  let buttonClose = event.target;
  if (!buttonClose.classList.contains("button-close")) return;

  buttonClose.parentElement.remove();
});

function debounce(fn, timeout) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), timeout);
    });
  };
}

const getApiRepositoriesDebounce = debounce(getApiRepositories, 200);
searchInput.addEventListener("input", getApiRepositoriesDebounce);
