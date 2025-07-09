export function getSessionToken() {
    return JSON.parse(sessionStorage.getItem("token") || "{}");
}

export function setSessionToken({ access_token, refresh_token }) {
    const full = { access_token, refresh_token };
    sessionStorage.setItem("token", JSON.stringify(full));
    return full;
}