export const getAccessToken = () => {
    const STORAGE_KEY = 'ACCESS_TOKEN'

    let accessToken = localStorage.getItem(STORAGE_KEY) || '';

    if (accessToken.length < 10) {
        const accessTokenEntered = prompt('Add access token');
        localStorage.setItem(STORAGE_KEY, accessTokenEntered);
        accessToken = accessTokenEntered;
    }

    return accessToken;
}