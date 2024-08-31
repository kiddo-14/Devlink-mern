import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Cookies  from 'js-cookie'
const BASE_URL = import.meta.env.VITE_BASE_URL;
const Login=()=> {
    const navigate =useNavigate();
    const[cookie,setCookie]=useState('');
    const [email,setemail]=useState();
    const [password,setPassword]=useState();

    const handleLogin=async()=>{
         try{
            console.log("entering in handlelogin function");
                const response =await fetch(`${BASE_URL}/api/v1/login`,
                   { method: 'POST',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({ email, password })
                  });
                  
                  console.log("Successfully called API");
                  const result = await response.json();
                  console.log("New auth user", result);
                  if (response.ok) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('authuserid', result.existUser._id);
                    console.log("setting the tokenin localst")
                      console.log("Successfully Login", result);
                      navigate("/");
                    } else {
                    console.error("Failed to create new user", result.message);
                    // alert(`Error: ${result.message}`);      
                  }
                    
                  console.log("cookies",document.cookie);
                  // setCookie(document.cookie);
                  // console.log("cookie in hook",cookie);

                  // Cookies.set("COOKIE",cookie);
                  //  const token =Cookies.get(document.cookie);
                  //  localStorage.setItem("token",token);

                  alert("Successfully Login");

                   
         }
         catch(err){
            console.error(err);
            console.log(err);
            alert("Not able to Login!!Try again...")
         }
    }
  return (
    <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  <div className="mx-2 flex gap-1 mb-3" >
              <div className="bg-blue-800 max-w-8 max-h-8 text-white p-1 rounded text-center  ">
              <FontAwesomeIcon icon="fa-solid fa-link" />
              </div>
             <p className="text-md sm:text-xl font-bold ">devLinks</p>
         </div>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Login...
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">

                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""
                      onChange={(e)=>setemail(e.target.value)}/>
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""
                      onChange={(e)=>setPassword(e.target.value)}/>
                  </div>
                
            
                  <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={()=>handleLogin()}>Login</button>
                <Link to="/signup">
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Want to ceate a new Account? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up here</a>
                  </p>
                </Link>    
              </form>
          </div>
      </div>
  </div>
</section>
  )
}

export default Login