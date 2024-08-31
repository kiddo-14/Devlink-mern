import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const Signup = () => {
    const navigate =useNavigate();
  const [name, setName] = useState(''); // Renamed to 'name'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async () => {
    try {
      console.log("handleSubmit function called");
      const response = await fetch(`${BASE_URL}/api/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      console.log("Successfully called API");
      const result = await response.json();
      console.log("New auth user", result);
      if (response.ok) {
        console.log("Successfully created a new auth user", result);
        navigate('/login');
         
      } else {
        console.error("Failed to create new user", result.message);
        alert(`Error: ${result.message}`);      
      }
      alert("New User Created Successfully");
    } catch (err) {
      console.error(err);
      alert("Not able to create a new user");      
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900"> 
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="mx-2 flex gap-1 mb-3">
          <div className="bg-blue-800 max-w-8 max-h-8 text-white p-1 rounded text-center">
            <FontAwesomeIcon icon="fa-solid fa-link" />
          </div>
          <p className="text-md sm:text-xl font-bold">devLinks</p>
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  placeholder="Nikhil Bhojak"
                  value={name} // Updated to use 'name' state
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={(e) => setName(e.target.value)} // Updated to set 'name'
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={email} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com" 
                  required=""
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="••••••••" 
                  value={password} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  required=""
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="button" 
                className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleSubmit}
              >
                Create an account
              </button>
              <Link to="/login">
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
              </p>
              </Link>
             
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
