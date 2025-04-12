import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
import IMAGE from './assets/imagetrial2.png';

const LoginPage = () =>
{

    return(
      <div>
        <img
        src={IMAGE}
        alt="Login Visual"
        style={{ width: '200px', margin: '20px auto', display: 'block' }}
        />
        <PageTitle />
        <Login />
      </div>
    );
};

export default LoginPage;
