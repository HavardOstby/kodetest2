const API_URL = "https://jsonplaceholder.typicode.com/posts";

const postsList = document.getElementById("posts-list");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("search");
const userFilter = document.getElementById("user-filter");

let allPosts = [];

// Show skeleton loading cards
function showSkeletons(count = 8) {
  postsList.innerHTML = Array.from(
    { length: count },
    () => `<li class="skeleton" aria-hidden="true"></li>`
  ).join("");
}

// Populate the user filter dropdown with unique user IDs
function populateUserFilter(posts) {
  const userIds = [...new Set(posts.map((p) => p.userId))].sort(
    (a, b) => a - b
  );
  userIds.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User ${id}`;
    userFilter.appendChild(option);
  });
}

// Render a filtered subset of posts
function renderPosts(posts) {
  postsList.innerHTML = "";

  if (posts.length === 0) {
    postsList.innerHTML =
      '<li class="empty-state">No posts match your search.</li>';
    statusEl.textContent = "";
    return;
  }

  statusEl.textContent = `Showing ${posts.length} post${posts.length !== 1 ? "s" : ""}`;

  const fragment = document.createDocumentFragment();
  posts.forEach((post) => {
    const li = document.createElement("li");
    li.className = "post-card";
    li.innerHTML = `
      <span class="post-id">#${post.id}</span>
      <h2>${escapeHtml(post.title)}</h2>
      <p>${escapeHtml(post.body)}</p>
      <span class="user-badge">User ${post.userId}</span>
    `;
    fragment.appendChild(li);
  });
  postsList.appendChild(fragment);
}

// Apply current search + filter and re-render
function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedUser = userFilter.value;

  const filtered = allPosts.filter((post) => {
    const matchesUser = selectedUser === "" || post.userId === Number(selectedUser);
    const matchesQuery =
      query === "" ||
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query);
    return matchesUser && matchesQuery;
  });

  renderPosts(filtered);
}

// Simple HTML escape to prevent XSS
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Fetch posts from API and bootstrap the page
async function fetchPosts() {
  showSkeletons();
  statusEl.textContent = "Loading posts…";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    allPosts = await response.json();

    populateUserFilter(allPosts);
    renderPosts(allPosts);
  } catch (error) {
    postsList.innerHTML =
      '<li class="empty-state">Failed to load posts. Please try refreshing the page.</li>';
    statusEl.textContent = "";
    console.error("Error fetching posts:", error);
  }
}

// Wire up event listeners
searchInput.addEventListener("input", applyFilters);
userFilter.addEventListener("change", applyFilters);

// Kick off
fetchPosts();
