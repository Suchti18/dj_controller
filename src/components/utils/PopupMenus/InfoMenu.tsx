import infoIcon from '../../../assets/info.svg';
import './InfoMenu.css';

const InfoMenu = () => {
    return (
        <>
            <img
                className="infoMenuIcon"
                src={infoIcon}
                alt="infoMenuIcon"
                height="32"
                width="32"
                onClick={console.log}
            />
        </>
    )
}

export default InfoMenu