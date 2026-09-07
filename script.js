const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function renderRepositories(repositories) {
  repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;
  repositoryList.replaceChildren(...repositories.map((repository) => {
    const article = document.createElement("article");
    article.className = "repository";
    article.innerHTML = `
      <div>
        <a class="repository-name" href="${repository.url}" target="_blank" rel="noreferrer">${repository.repository}</a>
        <p class="repository-description">${repository.description}</p>
        <p class="repository-meta">
          <span>${repository.language}</span>
          <span class="date">Starred ${formatDate(repository.starredOn)}</span>
        </p>
      </div>
      <span class="star-count" aria-label="${repository.stars} GitHub stars">★ ${repository.stars}</span>
    `;
    return article;
  }));
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    renderRepositories(await response.json());
  } catch (error) {
    repositoryCount.textContent = "";
    repositoryList.innerHTML = "<p class=\"status\">Repositories could not be loaded right now.</p>";
    console.error("Unable to load starred repositories:", error);
  }
}

loadRepositories();