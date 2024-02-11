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

  return (
    <div className="flex flex-col justify-center items-center h-auto m-3">
      <div className="flex gap-4">
        <button className="bg-slate-200 p-2 rounded-md" onClick={addTask}>
          Add Task
        </button>
        <form className="">
          <input
            className="border my-3"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </form>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full max-w-full text-left text-sm font-light">
                <thead className="border-b bg-white font-medium dark:border-neutral-500 dark:bg-neutral-600">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      #
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Task
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
                            onChange={(e) => updateTask(index, e.target.value)}
                            className="bg-neutral-100"
                            ref={(el) => (taskInputRefs.current[index] = el)}
                          />
                        ) : (
                          task.name
                        )}
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
  );
};

export default Home;
