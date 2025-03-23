document.addEventListener("DOMContentLoaded", () => {
    // First, ensure the SVG for the progress ring exists in the DOM
    setupProgressRing();
    
    // Then load tasks and daily win
    loadTasks();
    loadDailyWin();
    updateProgress();
});

/* ---------------- TASK MANAGEMENT ---------------- */
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
   
    if (taskText === "") return;
    const taskList = document.getElementById("taskList");
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div>
            <button class="complete-btn" onclick="toggleComplete(this)">✔</button>
            <button class="remove-btn" onclick="removeTask(this)">✖</button>
        </div>
    `;
    taskList.appendChild(li);
    taskInput.value = "";
   
    saveTasks();
    updateProgress();
}

function removeTask(button) {
    button.parentElement.parentElement.remove();
    saveTasks();
    updateProgress();
}

function toggleComplete(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.classList.toggle("completed");
    saveTasks();
    updateProgress();
}

/* ---------------- PROGRESS CHART ---------------- */
function setupProgressRing() {
    // Check if the progress container already exists
    if (!document.querySelector('.progress-container')) {
        // Create the progress ring container and SVG elements if they don't exist
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        // Create SVG element
        progressContainer.innerHTML = `
            <svg class="progress-ring" width="120" height="120">
                <circle class="progress-ring__background" cx="60" cy="60" r="50" stroke="#e6e6e6" stroke-width="10" fill="transparent"></circle>
                <circle class="progress-ring__progress" cx="60" cy="60" r="50" stroke="#4CAF50" stroke-width="10" fill="transparent" 
                        stroke-dasharray="314.16" stroke-dashoffset="314.16" transform="rotate(-90, 60, 60)"></circle>
            </svg>
            <div id="progressText" class="progress-text">0%</div>
        `;

        // Insert the progress container into the DOM - adjust selector as needed for your layout
        const taskContainer = document.querySelector('.task-container') || document.body;
        taskContainer.insertBefore(progressContainer, taskContainer.firstChild);
    }
}

function updateProgress() {
    const tasks = document.querySelectorAll("#taskList li");
    const completedTasks = document.querySelectorAll("#taskList li.completed");
   
    const total = tasks.length;
    const completed = completedTasks.length;
   
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
   
    // Get the progress circle
    const circle = document.querySelector(".progress-ring__progress");
    if (!circle) {
        console.error("Progress ring circle element not found!");
        return;
    }
    
    // Calculate the circle properties
    const radius = parseInt(circle.getAttribute('r'));
    const circumference = 2 * Math.PI * radius;
    
    // Set the stroke-dasharray if not already set
    if (!circle.style.strokeDasharray) {
        circle.style.strokeDasharray = `${circumference}`;
    }
    
    // Calculate the dash offset based on the percentage
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
   
    // Update the text display
    const progressText = document.getElementById("progressText");
    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
}

/* ---------------- LOCAL STORAGE ---------------- */
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(task => {
        tasks.push({
            text: task.querySelector(".task-text").textContent,
            completed: task.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("taskList");
    
    // Clear existing tasks to avoid duplicates on reload
    taskList.innerHTML = '';
    
    savedTasks.forEach(taskData => {
        const li = document.createElement("li");
        if (taskData.completed) {
            li.classList.add("completed");
        }
        li.innerHTML = `
            <span class="task-text">${taskData.text}</span>
            <div>
                <button class="complete-btn" onclick="toggleComplete(this)">✔</button>
                <button class="remove-btn" onclick="removeTask(this)">✖</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    updateProgress();
}

/* ---------------- DAILY WIN MANAGEMENT ---------------- */
function saveWin() {
    const dailyWinText = document.getElementById("dailyWin").value;
    localStorage.setItem("dailyWin", dailyWinText);
}

function loadDailyWin() {
    document.getElementById("dailyWin").value = localStorage.getItem("dailyWin") || "";
}