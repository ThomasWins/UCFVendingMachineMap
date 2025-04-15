import IMAGE from '../assets/thegoat.png';

const TheGoatPage = () =>
{

    return(
      <div>
        <img
        src={IMAGE}
        alt="Login Visual"
        style={{ width: '100%', margin: '20px auto', display: 'block' }}
        />
      </div>
    );
};

export default TheGoatPage;
