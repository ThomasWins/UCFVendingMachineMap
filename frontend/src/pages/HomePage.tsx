import NavBar from '../components/NavBar';
import HomeBody from '../components/HomeBody';
import Footer from '../components/Footer';
import LoggedInName from '../components/LoggedInName';

const HomePage = () => {

return (
  <div>
    <NavBar /> 
    <LoggedInName />
    <HomeBody />
    <div id="footerContainer">
          <Footer />
    </div>
  </div>
  );
};

export default HomePage;
