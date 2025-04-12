import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import CardUI from '../components/CardUI';

const CardPage = () =>
{
    return(
        <div>
            <navbar /> // Top Navigation bar
            <homeBody /> // Whatever we want the page to look like
            <showcaseMap /> // showcase map img or gif?
        </div>
    );
}

export default CardPage;
