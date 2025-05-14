const nameInput = document.getElementById('nameInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const birthdayList = document.getElementById('birthdayList');
const quoteBtn = document.getElementById('quoteBtn');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const quoteDisplay = document.getElementById('quoteDisplay');


dateInput.valueAsDate = new Date();


let birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];

addBtn.addEventListener('click', addBirthday);
quoteBtn.addEventListener('click', fetchQuote);

renderBirthdayList();

function addBirthday() {
    const name = nameInput.value.trim();
    const date = dateInput.value;
    
    if (name && date) {
        const newBirthday = {
            id: Date.now(),
            name,
            date
        };
        
        birthdays.push(newBirthday);
        saveBirthdays();
        renderBirthdayList();
        
        nameInput.value = '';
        dateInput.valueAsDate = new Date();
    } else {
        alert('Please enter both name and date!');
    }
}

function renderBirthdayList() {
    birthdayList.innerHTML = '';
    
    if (birthdays.length === 0) {
        birthdayList.innerHTML = '<li>No birthdays added yet</li>';
        return;
    }
    
    const sortedBirthdays = sortBirthdaysByUpcoming();
    
    sortedBirthdays.forEach(birthday => {
        const li = document.createElement('li');
        
        const dateObj = new Date(birthday.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
        
        li.innerHTML = `
            <span>${birthday.name} - ${formattedDate}</span>
            <button class="delete-btn" onclick="deleteBirthday(${birthday.id})">Delete</button>
        `;
        
        birthdayList.appendChild(li);
    });
}

function deleteBirthday(id) {
    birthdays = birthdays.filter(birthday => birthday.id !== id);
    saveBirthdays();
    renderBirthdayList();
}

function sortBirthdaysByUpcoming() {
    const today = new Date();
    
    return [...birthdays].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        dateA.setFullYear(today.getFullYear());
        dateB.setFullYear(today.getFullYear());
        
        if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
        if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);
        
        return dateA - dateB;
    });
}

function saveBirthdays() {
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
}

const fallbackQuotes = [
    { content: "Count your life by smiles, not tears. Count your age by friends, not years.", author: "John Lennon" },
    { content: "Today you are you! That is truer than true! There is no one alive who is you-er than you!", author: "Dr. Seuss" },
    { content: "The more you praise and celebrate your life, the more there is in life to celebrate.", author: "Oprah Winfrey" },
    { content: "The greatest gift that you can give to others is the gift of unconditional love and acceptance.", author: "Brian Tracy" },
    { content: "With mirth and laughter let old wrinkles come.", author: "William Shakespeare" }
];

async function fetchQuote() {
    quoteBtn.disabled = true;
    quoteBtn.textContent = 'Loading...';
    quoteDisplay.classList.remove('fade-in');
    
    try {
        const apiUrl = 'https://api.quotable.io/random';
        const corsProxyUrl = 'https://corsproxy.io/?';
        
        const response = await fetch(corsProxyUrl + encodeURIComponent(apiUrl), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        displayQuote(data.content, data.author);
        
    } catch (error) {
        console.warn('Error fetching quote from API:', error);
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        displayQuote(randomQuote.content, randomQuote.author);
    }
}

function displayQuote(content, author) {
    setTimeout(() => {
        quoteText.textContent = content;
        quoteAuthor.textContent = author ? `— ${author}` : '';
        quoteDisplay.classList.add('fade-in');
        quoteBtn.disabled = false;
        quoteBtn.textContent = 'Get Birthday Quote';
    }, 300);
}
