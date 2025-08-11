import debugIcon from '../../assets/debug.svg';
import './DebugMenu.css';

const DebugMenu = () => {
    return (
        <>
            <img
                className="debugMenuIcon"
                src={debugIcon}
                height="32"
                width="32"
                onClick={console.log}
            />
        </>
    )
}

export default DebugMenu