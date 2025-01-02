export const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
};

export const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return `${interval} năm trước`;
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return `${interval} tháng trước`;
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return `${interval} ngày trước`;
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return `${interval} giờ trước`;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return `${interval} phút trước`;
    }

    return "Vừa xong";
};