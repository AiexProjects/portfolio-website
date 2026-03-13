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