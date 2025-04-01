export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: "false",
    });
}

export function formatBlogDate(date) {
    const options = {
        weekday: "long", 
        day: "numeric", 
        month: "long", 
        year: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: true, 
    };

    const formattedDate = new Date(date).toLocaleString("en-GB", options)

    return formattedDate
}