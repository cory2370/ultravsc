let currentUser = null;
let currentFilter = 'all';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the main app page (not login.html)
    const isLoginPage = window.location.pathname.includes('login.html');
    const isMainPage = !isLoginPage && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'));
    
    if (isMainPage) {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            // Update user name display if element exists
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name;
            }
        } else {
            // Not logged in, redirect to login
            window.location.href = 'login.html';
        }
    }
});

function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    currentUser = { name: 'Nguyễn Văn A', role: 'student' };
    // Store in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    // Redirect to main app
    window.location.href = 'index.html';
}

function handleRegister(e) {
    e.preventDefault();
    currentUser = { name: 'Người dùng mới', role: 'student' };
    // Store in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    // Redirect to main app
    window.location.href = 'index.html';
}

function handleLogout() {
    currentUser = null;
    // Clear sessionStorage
    sessionStorage.removeItem('currentUser');
    // Redirect to login page
    window.location.href = 'login.html';
}

function openCreatePostModal() {
    document.getElementById('createPostModal').classList.add('active');
}

function closeCreatePostModal() {
    document.getElementById('createPostModal').classList.remove('active');
}

function handleCreatePost(e) {
    e.preventDefault();
    alert('Bài viết đã được tạo!');
    closeCreatePostModal();
}

function filterPosts(category) {
    currentFilter = category;
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

function toggleLike(button) {
    button.classList.toggle('liked');
    const countSpan = button.querySelector('.like-count');
    let count = parseInt(countSpan.textContent);
    countSpan.textContent = button.classList.contains('liked') ? count + 1 : count - 1;
}

function toggleComments(button) {
    const post = button.closest('.post');
    const commentsSection = post.querySelector('.comments-section');
    commentsSection.classList.toggle('hidden');
}

function reportPost() {
    if (confirm('Bạn có chắc muốn báo cáo bài viết này?')) {
        alert('Báo cáo đã được gửi đến quản trị viên.');
    }
}