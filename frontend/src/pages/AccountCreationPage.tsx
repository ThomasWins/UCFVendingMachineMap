import PageTitle from '../components/PageTitle.tsx';
import IMAGE from '../assets/vendingmachinetrial.jpg';
import CreateAccount from '../components/CreateAccount.tsx';
import '../components/CSS/LoginPage.css';
import '../components/CSS/PageTitle.css';
import '../components/CSS/Login.css';
import '../components/CSS/CreateAccount.css';
import '../components/CSS/createPage.css';
import NavBar from '../components/NavBar.tsx';
import Footer from '../components/Footer.tsx';

const LoginPage = () => {

  return (
    <div id="LoginBody">
      <NavBar />
  <div className="container">
    <div className="left">
      <img src={IMAGE} alt="Login visual" />
    </div>
    <div id="loginForm">
      <PageTitle />
      <CreateAccount />
    </div>
  </div>
  <Footer />
</div>
  );
  }
export default LoginPage;
