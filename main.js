// const API_BASE = "/api/users";

const state = {
  screen: "login",
  user: null,
  loading: false,
  message: null,
  messageType: "info",
};

function setMessage(text, type = "info") {
  state.message = text;
  state.messageType = type;
  render();
}

function setLoading(value) {
  state.loading = value;
  render();
}

function renderNotice() {
  if (!state.message) return "";
  return `<div class="notice ${state.messageType}">${state.message}</div>`;
}

function renderLogin() {
  return `
    <section class="panel fade-in">
      <h1>Login</h1>
      <p>Sign in to access your account.</p>
      ${renderNotice()}
      <form id="login-form" class="form">
        <div class="field">
          <label for="login-username">Username</label>
          <input id="login-username" name="username" placeholder="bagadbilla" required />
        </div>
        <div class="field">
          <label for="login-password">Password</label>
          <input id="login-password" type="password" name="password" placeholder="test@123" required />
        </div>
        <div class="actions">
          <button class="btn" type="submit" ${state.loading ? "disabled" : ""}>
            ${state.loading ? "Signing in..." : "Login"}
          </button>
          <button class="btn secondary" type="button" id="go-register">Create account</button>
        </div>
      </form>
    </section>
  `;
}

function renderRegister() {
  return `
    <section class="panel fade-in">
      <h1>Register</h1>
      <p>Create an account to get started.</p>
      ${renderNotice()}
      <form id="register-form" class="form">
        <div class="field">
          <label for="register-email">Email</label>
          <input id="register-email" name="email" type="email" placeholder="user.email@domain.com" required />
        </div>
        <div class="field">
          <label for="register-username">Username</label>
          <input id="register-username" name="username" placeholder="doejohn" required />
        </div>
        <div class="field">
          <label for="register-role">Role</label>
          <select id="register-role" name="role" required>
          <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div class="field">
          <label for="register-password">Password</label>
          <input id="register-password" name="password" type="password" placeholder="test@123" required />
        </div>
        <div class="actions">
          <button class="btn" type="submit" ${state.loading ? "disabled" : ""}>
            ${state.loading ? "Creating..." : "Register"}
          </button>
          <button class="btn secondary" type="button" id="go-login">Back to login</button>
        </div>
      </form>
    </section>
  `;
}

function renderDashboard() {
  const user = state.user || {};
  return `
    <section class="panel fade-in">
      <h1>Dashboard</h1>
      <p>Session is active. Pulling current user from the API.</p>
      ${renderNotice()}
      <div class="profile">
        <div class="profile-row"><span>Username</span><strong>${user.username || "-"}</strong></div>
        <div class="profile-row"><span>Email</span><strong>${user.email || "-"}</strong></div>
        <div class="profile-row"><span>Role</span><strong>${user.role || "-"}</strong></div>
        <div class="profile-row"><span>Status</span><strong>${user.isEmailVerified ? "Verified" : "Unverified"}</strong></div>
      </div>
      <div class="divider"></div>
      <div class="actions">
        <button class="btn" id="logout" ${state.loading ? "disabled" : ""}>
          ${state.loading ? "Signing out..." : "Logout"}
        </button>
      </div>
    </section>
  `;
}

function render() {
  const app = document.getElementById("app");
  const mainPanel = state.screen === "register" ? renderRegister() : state.screen === "dashboard" ? renderDashboard() : renderLogin();

  app.innerHTML = `
    <div class="shell">
      ${mainPanel}
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  const goRegister = document.getElementById("go-register");
  if (goRegister) {
    goRegister.addEventListener("click", () => navigate("register"));
  }

  const goLogin = document.getElementById("go-login");
  if (goLogin) {
    goLogin.addEventListener("click", () => navigate("login"));
  }

  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
}

function navigate(screen) {
  state.screen = screen;
  state.message = null;
  render();
}

async function handleRegister(event) {
  event.preventDefault();
  if (state.loading) return;

  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const url = "https://api.freeapi.app/api/v1/users/register";
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    setLoading(true);
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok || data?.success === false) {
      const message = data?.message || "Registration failed";
      throw new Error(message);
    }
    setMessage("Account created. Please login.", "success");
    state.screen = "login";
  } catch (error) {
    setMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  if (state.loading) return;

  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  const url = "https://api.freeapi.app/api/v1/users/login";
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok || data?.success === false) {
      const message = data?.message || "Login failed";
      throw new Error(message);
    }

    const user = data?.data?.user || null;
    const accessToken = data?.data?.accessToken;
    const refreshToken = data?.data?.refreshToken;

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    state.user = user;
    state.screen = "dashboard";
    // setMessage("Login successful!", "success");
  } catch (error) {
    setMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function handleLogout() {
  if (state.loading) return;

  const token = localStorage.getItem("accessToken");
  if (!token) {
    state.user = null;
    state.screen = "login";
    setMessage("You have been logged out.", "success");
    return;
  }
  const url = "https://api.freeapi.app/api/v1/users/logout";
  const options = { method: "POST", headers: { accept: "application/json", authorization: `Bearer ${token}` } };

  try {
    setLoading(true);

    const response = await fetch(url, options);
    const data = await response.json();

    state.user = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    state.screen = "login";
    setMessage("You have been logged out.", "success");
  } catch (error) {
    setMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function getCurrentUser(token) {
  const url = "https://api.freeapi.app/api/v1/users/current-user";
  const options = { method: "GET", headers: { accept: "application/json", authorization: `Bearer ${token}` } };

  try {
    setLoading(true);

    const response = await fetch(url, options);
    const data = await response.json();

    const user = {
      username: data?.data?.username || data?.user?.username,
      email: data?.data?.email || data?.user?.email,
      role: data?.data?.role || data?.user?.role,
      isEmailVerified: data?.data?.isEmailVerified || data?.user?.isEmailVerified,
    };
    state.user = user;

    if (!response.ok || data?.success === false) {
      const message = data?.message || "Failed to fetch user";
      state.user = null;
      throw new Error(message);
    }
  } catch (error) {
    state.user = null;
    if (showMessage) {
      setMessage(error.message, "error");
    }
  } finally {
    setLoading(false);
  }
}

async function bootstrap() {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      await getCurrentUser(token);
    }

    if (state.user) {
      state.screen = "dashboard";
    }
  } catch (error) {
    state.user = null;
  } finally {
    render();
  }
}

bootstrap();
