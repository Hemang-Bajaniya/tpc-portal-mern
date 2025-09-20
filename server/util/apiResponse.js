// Utility for consistent API responses
export function apiResponse({ success = true, message = '', data = null, error = null, status = 200 }) {
    return {
        success,
        message,
        data,
        error,
        status
    };
}
