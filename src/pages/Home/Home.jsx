import React, { useState, useEffect } from "react";
import { useRef } from "react";

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedStatus = localStorage.getItem("status");

    if (savedTasks && savedStatus) {
      const parsedTasks = JSON.parse(savedTasks);
      const parsedStatus = JSON.parse(savedStatus);

      return parsedTasks.map((task, index) => ({
        name: task,
        isEditing: false,
        isCompleted: parsedStatus[index],
      }));
    } else {
      return [];
    }
  });

  const [newTask, setNewTask] = useState("");

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Add a ref for the input field
  const taskInputRefs = useRef([]);

  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks.map((task) => task.name))
    );

    const total = tasks.length;
    const completed = tasks.filter((task) => task.isCompleted).length;

    setTotalTasks(total);
    setCompletedTasks(completed);
  }, [tasks]);

  const addTask = () => {
    if (newTask !== "") {
      setTasks([...tasks, { name: newTask, isEditing: false }]);
      setNewTask("");
    }
  };

  const edit = (index) => {
    const newTasks = [...tasks];
    newTasks[index].isEditing = true;
    setTasks(newTasks);
    // Focus on the input field when editing
    if (taskInputRefs.current[index]) {
      taskInputRefs.current[index].focus();
    }
  };

  const updateTask = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], name: value };
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const toggleCompletion = (index) => {
    const newTasks = [...tasks];
    newTasks[index].isCompleted = !newTasks[index].isCompleted;
    setTasks(newTasks);

    const updatedStatus = newTasks.map((task) => task.isCompleted);
    localStorage.setItem("status", JSON.stringify(updatedStatus));
  };

  const handlePriorityChange = (index, priority) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], priority };
    setTasks(newTasks);

    // Save the priority color in localStorage
    localStorage.setItem(`priorityColor-${index}`, getPriorityColor(priority));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-sky-500";
      case "low":
        return "bg-green-500";
      default:
        return "";
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center ">
        <div className="flex justify-center gap-4">
          <button className="bg-slate-200 p-2 rounded-md" onClick={addTask}>
            Add Task
          </button>
          <form className="flex-grow">
            <input
              className="w-full border my-3"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </form>
        </div>
        <div className="overflow-x-auto max-w-full">
          <div className="">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="">
                <table className="overflow-auto text-left text-sm font-light">
                  <thead className="border-b bg-white font-medium dark:border-neutral-500 dark:bg-neutral-600">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Task
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Edit
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Delete
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <tr
                        key={index}
                        className="border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700"
                      >
                        <td className="whitespace-normal px-6 py-4 font-medium">
                          {index + 1}
                        </td>
                        <td className="whitespace-normal px-6 py-4">
                          {task.isEditing ? (
                            <input
                              type="text"
                              value={task.name}
                              onChange={(e) =>
                                updateTask(index, e.target.value)
                              }
                              className="bg-neutral-100"
                              ref={(el) => (taskInputRefs.current[index] = el)}
                            />
                          ) : (
                            task.name
                          )}
                        </td>
                        <td className="whitespace-normal px-6 py-4">
                          <select
                            value={task.priority || "low"}
                            onChange={(e) =>
                              handlePriorityChange(index, e.target.value)
                            }
                            className={`border border-gray-300 rounded-md p-1 ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            <option value="high" className="bg-red-500">
                              High
                            </option>
                            <option value="medium" className="bg-sky-500">
                              Medium
                            </option>
                            <option value="low" className="bg-green-500">
                              Low
                            </option>
                          </select>
                        </td>

                        <td className="whitespace-normal px-6 py-4">
                          <button
                            onClick={() => edit(index)}
                            className="focus:outline-none"
                          >
                            Edit
                          </button>
                        </td>
                        <td className="whitespace-normal px-6 py-4">
                          <button
                            onClick={() => deleteTask(index)}
                            className="text-red-500"
                          >
                            Delete
                          </button>
                        </td>
                        <td className="whitespace-normal px-6 py-4">
                          {task.isCompleted ? "Completed" : "Not Completed"}
                          <button
                            onClick={() => toggleCompletion(index)}
                            className="ml-2 text-blue-500"
                          >
                            {task.isCompleted
                              ? "Mark as Incomplete"
                              : "Mark as complete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p>Total Tasks: {totalTasks}</p>
            <p>Completed Tasks: {completedTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
