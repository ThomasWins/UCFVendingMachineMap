import navbar from '../components/navbar';
import homeBody from '../components/homeBody';
import showcaseMap from '../components/showcaseMap';

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
