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
            ${data.url}
        </div>
        <div class="result__content">
            <input 
                type="text"
                class="result__shorten" 
                value="https://rel.ink/${data.hashid}"
                id="${data.hashid}"
                readonly="readonly"
            />
            <button 
                type="button"
                class="result__btn btn" 
                data-id="${data.hashid}"
            >
                Copy
            </button> 
        </div>
    `;

    result.querySelector('.result__btn').onclick = handleCopy;

    if (last) {
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

    const url = event.target.input.value.trim();

    if (url.length === 0) {
        return event.target.classList.add('form--invalid');
    }

    try {
        const response = await fetch(`https://rel.ink/api/links/`, {
            method: 'POST',
            body: new URLSearchParams({ url })
        });

        if (response.status === 400) {
            return event.target.classList.add('form--invalid');
        }

        const data = await response.json();
        addLink(data);

        event.target.input.value = "";
        event.target.classList.remove('form--invalid');
    }

    catch (error) {
        console.log(error)
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