import IMAGE from './assets/reflectionpond.jpg';

const colors = {
  primary: '#060606',
  background: '#f5f5f5',
  disbled: '#d9d9d9',
}

const Login = () => {
  return (
    <div className = "w-full min-h-screen flex items-start">
      <div className = 'relative w-1/2 h-full flex flex-col'>
      <img src = {IMAGE} className = "w-full h-full object-cover"/>
     </div>
    </div>
  )
}
export default Login;