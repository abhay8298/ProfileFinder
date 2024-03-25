const API_URL = "https://api.github.com/search/users?q=";
const profileContainer = document.getElementById("profile-container");
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("search-input").value;
    if (searchInput.trim() === "") {
        alert("Please enter a GitHub username.");
        return;
    }
    try {
        const response = await fetch(API_URL + searchInput);
        if (!response.ok) {
            throw new Error("Failed to fetch user data.");
        }
        const data = await response.json();
        displayUserProfile(data);
    } catch (error) {
        console.error("Error:", error.message);
    }
});

function displayUserProfile(data) {
    profileContainer.innerHTML = "";
    if (data.items.length === 0) {
        profileContainer.innerHTML = "<p>No user found.</p>";
        return;
    }
    const users = data.items.slice(0, 6); // Display top 6 users
    const profileRows = createProfileRows(users);
    profileRows.forEach((row) => profileContainer.appendChild(row));
}

function createProfileRows(users) {
    const profileRows = [];
    for (let i = 0; i < 6; i += 3) { // Loop through users in steps of 3
        const rowUsers = users.slice(i, i + 3);
        const row = document.createElement("div");
        row.classList.add("profile-row");
        rowUsers.forEach((user) => {
            const card = createProfileCard(user);
            row.appendChild(card);
        });
        profileRows.push(row);
    }
    return profileRows;
}

function createProfileCard(user) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <h2>${user.login}</h2>
        <img src="${user.avatar_url}" alt="Profile Picture" width="100">
        <ul>
            <li><strong>Github Profile URL:</strong> <a href="${user.html_url}" target="_blank">${user.html_url}</a></li>
            <li><strong>LinkedIn Profile URL:</strong> <a href="${getLinkedInProfileUrl(user.login)}" target="_blank">${getLinkedInProfileUrl(user.login)}</a></li>
        </ul>
    `;
    getRepos(user.login, card);
    return card;
}

async function getRepos(username, card) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await response.json();
    const repoList = document.createElement("ul");
    repoList.innerHTML = "<strong>Repositories:</strong>";
    repos.forEach((repo) => {
        const repoItem = document.createElement("li");
        const repoLink = document.createElement("a");
        repoLink.href = repo.html_url;
        repoLink.textContent = repo.name;
        repoLink.classList.add("repo-link");
        repoLink.target = "_blank";
        repoItem.appendChild(repoLink);
        repoList.appendChild(repoItem);
    });
    card.appendChild(repoList);
}

function getLinkedInProfileUrl(username) {
    // Assuming LinkedIn URL follows a standard format
    return `https://www.linkedin.com/in/${username}`;
}
