export const getCookie = (name: string): string => {
    let cookieValue = '';
    
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        
        for (const c of cookies) {
            const cookie = c.trim();
            
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    
    return cookieValue;
};