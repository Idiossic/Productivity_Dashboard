function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") return;

    let li = document.createElement("li");
    li.textContent = taskInput.value;

    let removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = function() {
        li.remove();
        saveTasks(); // Update storage after removal
    };

    li.appendChild(removeBtn);
    taskList.appendChild(li);

    saveTasks(); // Save tasks after adding

    taskInput.value = "";
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push(li.textContent.replace("❌", "").trim());
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.onload = function() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.textContent = task;

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.onclick = function() {
            li.remove();
            saveTasks();
        };

        li.appendChild(removeBtn);
        document.getElementById("taskList").appendChild(li);
    });

    document.getElementById("dailyWin").value = localStorage.getItem("dailyWin") || "";
};

