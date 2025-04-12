import IMAGE from './assets/imagetrial2.png';

function PageTitle()
{
   return(
     <div className="w-1/2 h-full">
        <img
          src={IMAGE}
          alt="Login visual"
          className="w-full h-full object-cover"
        />
      </div>
     <h1 id="title">GERBER THE GOAT</h1>
   );
};

export default PageTitle;
