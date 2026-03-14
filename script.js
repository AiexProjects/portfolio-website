function updateClock() {
    const now = new Date(); 
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0'); 
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    const timeString = `${dayName} ${date} ${monthName} ${hours}:${minutes} ${ampm}`;
    
    document.getElementById('clock').textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);


const dock = document.getElementById('dock');
const dockIcons = document.querySelectorAll('#dock span');
const baseSize = 48;
const maxSize = 68;
const maxDistance = 150;

dock.addEventListener('mousemove', (e) => {
    dockIcons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + (rect.width / 2);
        const distance = Math.abs(e.clientX - iconCenterX);

        if (distance < maxDistance) {
            const scale = 1 - (distance / maxDistance);
            const newSize = baseSize + ((maxSize - baseSize) * scale);
            
            icon.style.width = `${newSize}px`;
            icon.style.height = `${newSize}px`;
            icon.style.marginBottom = `${(newSize - baseSize) / 4}px`;
        } else {
            icon.style.width = `${baseSize}px`;
            icon.style.height = `${baseSize}px`;
            icon.style.marginBottom = '0px';
        }
    });
});

dock.addEventListener('mouseleave', () => {
    dockIcons.forEach(icon => {
        icon.style.width = `${baseSize}px`;
        icon.style.height = `${baseSize}px`;
        icon.style.marginBottom = '0px';
    });
});

let highestZIndex = 100;
const allDesktopIcons = document.querySelectorAll('.desktop_icon');
const allWindows = document.querySelectorAll('.mac_window'); 



allDesktopIcons.forEach(icon => {
    icon.addEventListener('dblclick', () => {
        const targetWindowId = icon.getAttribute('data_window');
        
        if (targetWindowId) {
            const windowToOpen = document.getElementById(targetWindowId);
            if (windowToOpen) {
                windowToOpen.style.display = 'flex';
                
                if (!windowToOpen.getAttribute('data_initialized')) {
                    
                    const centerX = (window.innerWidth - windowToOpen.offsetWidth) / 2;
                    const centerY = (window.innerHeight - windowToOpen.offsetHeight) / 2;
                    
                    const randomOffsetX = Math.floor(Math.random() * 120) - 60;
                    const randomOffsetY = Math.floor(Math.random() * 120) - 60;
                    
                    windowToOpen.style.left = `${centerX + randomOffsetX}px`;
                    windowToOpen.style.top = `${centerY + randomOffsetY}px`;
                    
                    windowToOpen.setAttribute('data_initialized', 'true');
                }
                
                highestZIndex++;
                windowToOpen.style.zIndex = highestZIndex;
            }
        }
    });
});

allWindows.forEach(macWindow => {
    const closeBtn = macWindow.querySelector('.close_btn');
    const minBtn = macWindow.querySelector('.min_btn');

    if (closeBtn) closeBtn.addEventListener('click', () => macWindow.style.display = 'none');
    if (minBtn) minBtn.addEventListener('click', () => macWindow.style.display = 'none');
});

let activeWindow = null; 
let isDraggingWindow = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.addEventListener('mousedown', (e) => {
    
    const clickedWindow = e.target.closest('.mac_window');
    
    if (clickedWindow) {
        highestZIndex++;
        clickedWindow.style.zIndex = highestZIndex;
    }

    if (e.target.closest('.window_top_bar')) {
        activeWindow = clickedWindow;
        isDraggingWindow = true;
        
        document.body.style.userSelect = 'none';
        
        const rect = activeWindow.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
    }
});

document.addEventListener('mousemove', (e) => {
    if (!isDraggingWindow || !activeWindow) return; 
    
    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;
    
    const maxRight = window.innerWidth - activeWindow.offsetWidth;
    const maxBottom = window.innerHeight - activeWindow.offsetHeight;
    
    if (newX < 0) newX = 0;                  
    if (newY < 0) newY = 0;                  
    if (newX > maxRight) newX = maxRight;    
    if (newY > maxBottom) newY = maxBottom;  

    activeWindow.style.left = `${newX}px`;
    activeWindow.style.top = `${newY}px`;
});

document.addEventListener('mouseup', () => {
    isDraggingWindow = false;
    activeWindow = null;
    document.body.style.userSelect = ''; 
});