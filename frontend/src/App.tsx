import IMAGE from './assets/reflectionpond.jpg';

const colors = {
  primary: '#060606',
  background: '#f5f5f5',
  disabled: '#d9d9d9',
}

const Login = () => {
  return (
    <div className = "w-full min-h-screen flex items-start">
      <div className = 'relative w-1/2 h-screen'>
      <img src = {IMAGE} className = "w-full h-full object-cover"/>
     </div>
     <div className = 'w-1/2 h-screen bg-white flex flex-col p-20 justify-between'>
     <h1 className = 'text-base text-[#060606]'>GerbertheGoat</h1></div>

     <div className = 'w-full flex flex-col'>
      <h3 className = 'text-2xl font-semibold mb-4'>Login</h3>
     </div>
    </div>
  )
}
export default Login;