'use strict'

const storage = localStorage.getItem('links')
  ? JSON.parse(localStorage.getItem('links'))
  : [];

const form = document.getElementById('form');
const results = document.querySelector('.results');

const render = (data, last) => {
  const result = document.createElement('div');
  result.setAttribute('class', 'result');

  result.innerHTML = `
    <div class="result__header">
      ${data.long_url}
    </div>
    <div class="result__content">
      <input 
        type="text"
        class="result__shorten" 
        value=${data.link}
        id="${data.id}"
        readonly="readonly"
      />
      <button 
        type="button"
        class="result__btn btn" 
        data-id="${data.id}"
      >
        Copy
      </button> 
    </div>
  `;

  result.querySelector('.result__btn').onclick = handleCopy;

  if (last !== null) {
    return results.insertBefore(result, last);
  }

  results.appendChild(result);
};

const addLink = (link) => {
  storage.unshift(link);
  localStorage.setItem('links', JSON.stringify(storage));

  const last = results.firstChild;
  render(link, last);
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const url = document.getElementById("url").value;

  if (url.length === 0) {
    return event.target.classList.add('form--invalid');
  }

  try {
    const urlencoded = new URLSearchParams();
    urlencoded.append("url", url);

    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer c93193d5f6cb7f96e1cd340d125a445cf8b395ef',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "long_url": url })
    });

    const link = await response.json();
    addLink(link);

    event.target.input.value = "";
    event.target.classList.remove('form--invalid');
  }

  catch (error) {
    console.error(error)
  }
};

const handleCopy = (event) => {
  const btn = event.target;
  const id = btn.dataset.id;
  const input = document.getElementById(id);

  input.select();

  document.execCommand("selectAll", true);
  document.execCommand("copy");

  btn.classList.add('result__btn--copied');
  btn.innerText = "Copied!";
};

form.addEventListener('submit', handleSubmit);

document.addEventListener('DOMContentLoaded', () => {
  storage.forEach((link) => render(link));
});