import infoIcon from '../../../assets/info.svg';
import './InfoMenu.css';

const InfoMenu = () => {
    const closeMenu = () => {
        const overlay = document.getElementById("overlay");
        const menu = document.getElementById("menu");

        if (overlay) overlay.style.display = "none";
        if (menu) menu.style.display = "none";
    }

    const openInfoMenu = () => {
        let overlay = document.getElementById("overlay");
        let menu = document.getElementById("menu");

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "overlay";
            document.body.appendChild(overlay);
            overlay.addEventListener("click", closeMenu);
        }

        if (!menu) {
            menu = document.createElement("div");
            menu.id = "menu";
            menu.innerHTML = `
                <h2>Information</h2>
                <p>Visit the <a href="https://github.com/Suchti18/dj_controller" target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>
                <p>Version: X.X.X</p>
                <p>Made with &#x2764;&#xFE0F; by Nils in <img src="https://flagcdn.com/24x18/de.png" alt="Flag of Germany"></p>`;

            const closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.innerHTML = "&times;";
            closeBtn.classList.add("close-btn");
            closeBtn.addEventListener("click", closeMenu);

            menu.appendChild(closeBtn);
            document.body.appendChild(menu);
        }

        overlay.style.display = "block";
        menu.style.display = "block";
    }

    return (
        <>
            <img
                className="infoMenuIcon"
                src={infoIcon}
                alt="infoMenuIcon"
                height="32"
                width="32"
                onClick={openInfoMenu}
            />
        </>
    )
}

export default InfoMenu