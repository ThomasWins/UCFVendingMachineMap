import IMAGE from './assets/imagetrial2.png';

const colors = {
  primary: '#060606',
  background: '#f5f5f5',
  disabled: '#d9d9d9',
}

const Login = () => {
  return (
    <div className = "flex w-full h-screen">
      <div className = 'w-1/2 h-full'>
      <img src = {IMAGE} className = "w-full h-full object-cover"/>
     </div>
     <div className = 'w-1/2 h-full bg-white flex flex-col p-20 justify-between'>
     <h1 className = 'text-base text-[#060606]'>GerbertheGoat</h1>

          <div className="w-full flex flex-col mb-6">
            <h3 className="text-2xl font-semibold mb-4">Login</h3>
            <input
              type="text"
              placeholder="Username"
              className="w-full text-black py-4 border-b border-black outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full text-black py-4 border-b border-black outline-none mt-6"
            />
          </div>
        </div>

        <div className="w-full">
          <button className="w-full bg-[#060606] text-white py-4 rounded-md hover:bg-[#333] transition">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
