import NavBar from '../components/NavBar';
import HomeBody from '../components/HomeBody';
import Footer from '../components/Footer';

const HomePage = () => {

return (
  <div>
    <NavBar /> 
    <HomeBody />
    <div id="footerContainer">
      <Footer />
    </div>
  </div>
  );
};

export default HomePage;
