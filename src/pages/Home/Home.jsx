import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } else {
      return [];
    }
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask !== "") {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center my-4">
      <div className="flex gap-4">
        <button className="bg-slate-200 p-2 rounded-md" onClick={addTask}>
          Add Task
        </button>
        <form className="">
          <input
            className="border my-3 p-2"
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
              <table className="min-w-full text-left text-sm font-light">
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
                      Mark as complete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr
                      key={index}
                      className="border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{task}</td>
                      <td className="whitespace-nowrap px-6 py-4">Edit</td>
                      <td className="whitespace-nowrap px-6 py-4">Delete</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        Mark as complete
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
