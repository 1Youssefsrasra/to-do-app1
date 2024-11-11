'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete assignments", completed: true },
    { id: 2, text: "Cook dinner", completed: false },
    { id: 3, text: "Buy groceries", completed: false },
    { id: 4, text: "Prepare recipe", completed: false },
    { id: 5, text: "Lunch at Marina Mall", completed: false },
    { id: 6, text: "Meet Kelly", completed: false },
  ]);

  const [currentDate, setCurrentDate] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState(false); // Initialize fadeClass state here

  // Array of background images
  const backgroundImages = [
    "/images/image1.jpg",
    "/images/image2.jpg",
  ];

  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Calculate completion percentage
  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    setCompletionPercentage((completedTasks / totalTasks) * 100);
  }, [tasks]);

  // Function to format date as "Day, DD Month YYYY"
  const formatDate = () => {
    const date = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Set the current date on component mount
  useEffect(() => {
    setCurrentDate(formatDate());
  }, []);

  // Update the background image index every 20 seconds with fade effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeClass(true); // Start fading out the current background image

      // Wait for the fade effect to finish before changing the background image
      setTimeout(() => {
        // Change background image index after fade-out is complete
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setFadeClass(false); // Fade in the new background image
      }, 1000); // Duration matches CSS transition for crossfade
    }, 60000); // 20 seconds interval
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 overflow-hidden">
      {/* Background layer */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${fadeClass ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url(${backgroundImages[backgroundIndex]})`,
          zIndex: 1, // Current background image
        }}
      ></div>

      {/* Next background layer */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${fadeClass ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${backgroundImages[(backgroundIndex + 1) % backgroundImages.length]})`,
          zIndex: 0, // Next background image, behind the current one
        }}
      ></div>


      {/* Main Content */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md backdrop-blur-sm z-10">
        <div className="text-center mb-4">
          <h1 className="text-purple-500 font-bold">{currentDate}</h1>
          <h1 className="text-xl font-bold mt-2 text-purple-500">To Do List</h1>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-500 h-2.5 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-1">
            {Math.round(completionPercentage)}% completed
          </p>
        </div>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center space-x-2 ${task.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded border-gray-300"
              />
              <span>{task.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const newTaskText = prompt("Enter new task:");
              if (newTaskText) {
                setTasks((prevTasks) => [
                  ...prevTasks,
                  { id: Date.now(), text: newTaskText, completed: false },
                ]);
              }
            }}
            className="text-gray-500 text-sm hover:text-gray-800"
          >
            add task ...
          </button>
        </div>
      </div>
    </div>
  );
}
