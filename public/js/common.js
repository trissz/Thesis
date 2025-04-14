document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => loadLogs(), 5000);
    loadLogs();
});

async function loadLogs()
{
    const logs = await getLogs();
    const logMessages = document.getElementById('log_messages');
    logMessages.innerHTML = logs;
}